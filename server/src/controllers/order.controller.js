import * as orderModel from '../models/order.model.js';
import * as productModel from '../models/product.model.js';
import * as offerModel from '../models/offer.model.js';
import * as userModel from '../models/user.model.js';
import * as vendorModel from '../models/vendor.model.js';
import * as razorpayService from '../services/razorpay.service.js';
import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function pageParams(req) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  return { page, limit, offset: (page - 1) * limit };
}

function calculateDiscount(offer, subtotal) {
  if (!offer) return 0;
  const pctDiscount = offer.discount_pct ? (subtotal * Number(offer.discount_pct)) / 100 : 0;
  const flatDiscount = offer.discount_flat ? Number(offer.discount_flat) : 0;
  const rawDiscount = Math.max(pctDiscount, flatDiscount);
  return offer.max_discount ? Math.min(rawDiscount, Number(offer.max_discount)) : rawDiscount;
}

function validateOffer(offer, subtotal) {
  if (!offer) throw httpError(400, 'Invalid offer code');
  const now = new Date();
  if (offer.valid_from && new Date(offer.valid_from) > now) throw httpError(400, 'Offer not active');
  if (offer.valid_to && new Date(offer.valid_to) < now) throw httpError(400, 'Offer expired');
  if (offer.usage_limit && offer.usage_count >= offer.usage_limit) {
    throw httpError(400, 'Offer usage limit reached');
  }
  if (subtotal < Number(offer.min_order_value || 0)) {
    throw httpError(400, 'Minimum order value not met');
  }
}

export const createOrder = asyncHandler(async (req, res) => {
  const { address_id, items, offer_code } = req.body;
  if (!address_id) throw httpError(400, 'address_id is required');
  if (!Array.isArray(items) || items.length === 0) throw httpError(400, 'items are required');

  const productIds = items.map((item) => item.product_id);
  const products = await productModel.findManyByIds(productIds);
  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.product_id);
    const quantity = Number(item.quantity);
    if (!product || !product.is_active) throw httpError(400, 'Product unavailable');
    if (!Number.isInteger(quantity) || quantity < 1) throw httpError(400, 'Invalid quantity');
    if (product.stock < quantity) throw httpError(400, `${product.name} is out of stock`);

    const itemSubtotal = Number(product.price) * quantity;
    subtotal += itemSubtotal;
    return {
      product_id: product.id,
      vendor_id: product.vendor_id,
      name: product.name,
      price: product.price,
      quantity,
      subtotal: itemSubtotal,
    };
  });

  const delivery_fee = subtotal >= 199 ? 0 : 30;
  let offer = null;
  let discount_amount = 0;

  if (offer_code) {
    offer = await offerModel.findActiveByCode(offer_code);
    validateOffer(offer, subtotal);
    discount_amount = calculateDiscount(offer, subtotal);
  }

  const total = Math.max(subtotal + delivery_fee - discount_amount, 0);
  const razorpayOrder = await razorpayService.createOrder({
    amount: Math.round(total * 100),
    receipt: `MB${Date.now()}`,
  });

  const order = await orderModel.create(
    {
      user_id: req.user.userId,
      address_id,
      status: 'pending',
      subtotal,
      delivery_fee,
      discount_amount,
      total,
      offer_id: offer?.id,
      razorpay_order_id: razorpayOrder.id,
      payment_status: 'pending',
    },
    orderItems,
  );

  await Promise.all(items.map((item) => productModel.adjustStock(item.product_id, -Number(item.quantity))));

  const user = await userModel.findById(req.user.userId);
  res.status(201).json({
    order: { id: order.id, order_number: order.order_number, total: order.total },
    razorpay: {
      key_id: process.env.RAZORPAY_KEY_ID,
      order_id: order.razorpay_order_id,
      amount: Math.round(total * 100),
      currency: 'INR',
      name: 'Malabarii',
      description: order.order_number,
      prefill: { contact: user?.mobile },
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');
  if (order.user_id !== req.user.userId && req.user.role !== 'admin') throw httpError(403, 'Forbidden');

  const isValid = razorpayService.verifyPayment(req.body);
  if (!isValid) {
    await orderModel.update(order.id, { payment_status: 'failed' });
    throw httpError(400, 'Invalid payment signature');
  }

  const updated = await orderModel.update(order.id, {
    payment_status: 'paid',
    status: 'confirmed',
    razorpay_payment_id: req.body.razorpay_payment_id,
  });

  if (order.offer_id) await offerModel.incrementUsage(order.offer_id);
  const user = await userModel.findById(order.user_id);
  if (user?.mobile) {
    notificationService
      .sendOrderConfirmation(user.mobile, updated.order_number, updated.total)
      .catch((error) => console.error('Order confirmation SMS failed:', error.message));
  }
  const vendorIds = [...new Set((order.items || []).map((item) => item.vendor_id).filter(Boolean))];
  await Promise.all(
    vendorIds.map(async (vendorId) => {
      const vendor = await vendorModel.findById(vendorId);
      const vendorUser = vendor?.user_id ? await userModel.findById(vendor.user_id) : null;
      if (vendorUser?.mobile) {
        return notificationService.sendVendorNewOrder(vendorUser.mobile, updated.order_number, updated.total);
      }
      return null;
    }),
  ).catch((error) => console.error('Vendor new order SMS failed:', error.message));

  res.json({ success: true, order: updated });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { page, limit, offset } = pageParams(req);
  const result = await orderModel.findByUserPaged(req.user.userId, {
    status: req.query.status,
    limit,
    offset,
  });
  res.json({ orders: result.orders, total: result.total, page });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');
  if (order.user_id !== req.user.userId && req.user.role !== 'admin') throw httpError(403, 'Forbidden');
  res.json({ order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');
  if (order.user_id !== req.user.userId && req.user.role !== 'admin') throw httpError(403, 'Forbidden');
  if (!['pending', 'confirmed'].includes(order.status)) throw httpError(400, 'Order cannot be cancelled');

  const update = { status: 'cancelled' };
  if (order.payment_status === 'paid') {
    await razorpayService.initiateRefund(order.razorpay_payment_id, Math.round(Number(order.total) * 100), {
      order_id: order.id,
    });
    update.payment_status = 'refunded';
  }

  await Promise.all(
    order.items.map((item) => productModel.adjustStock(item.product_id, Number(item.quantity))),
  );

  const updated = await orderModel.update(order.id, update);
  res.json({ order: updated });
});

export const getVendorOrders = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.userId);
  if (!vendor) throw httpError(404, 'Vendor profile not found');
  const { limit, offset } = pageParams(req);
  const orders = await orderModel.findByVendorPaged(vendor.id, {
    status: req.query.status,
    limit,
    offset,
  });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw httpError(400, 'status is required');

  const order = await orderModel.findById(req.params.id);
  if (!order) throw httpError(404, 'Order not found');

  if (req.user.role !== 'admin') {
    const vendor = await vendorModel.findByUserId(req.user.userId);
    if (!vendor || !order.items.some((item) => item.vendor_id === vendor.id)) {
      throw httpError(403, 'Forbidden');
    }

    const allowedMoves = {
      confirmed: 'processing',
      processing: 'out_for_delivery',
    };
    if (allowedMoves[order.status] !== status) {
      throw httpError(400, 'Invalid status transition');
    }
  }

  const updated = await orderModel.updateStatus(order.id, status);
  const user = await userModel.findById(order.user_id);
  if (user?.mobile) {
    notificationService
      .sendOrderStatusUpdate(user.mobile, order.order_number, status)
      .catch((error) => console.error('Order status SMS failed:', error.message));
  }
  res.json({ order: updated });
});
