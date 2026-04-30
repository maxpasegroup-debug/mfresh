import * as userModel from '../models/user.model.js';
import * as vendorModel from '../models/vendor.model.js';
import * as productModel from '../models/product.model.js';
import * as cloudinaryService from '../services/cloudinary.service.js';
import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function requireOwnVendorOrAdmin(req, vendor) {
  if (req.user.role === 'admin') return;
  const ownVendor = await vendorModel.findByUserId(req.user.userId);
  if (!ownVendor || ownVendor.id !== vendor.id) {
    throw httpError(403, 'Cannot modify another vendor profile');
  }
}

export const listVendors = asyncHandler(async (_req, res) => {
  const vendors = await vendorModel.listActive();
  res.json({ vendors });
});

export const getVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findById(req.params.id);
  if (!vendor) throw httpError(404, 'Vendor not found');

  const products = (await productModel.listByVendor(vendor.id))
    .filter((product) => product.is_active)
    .slice(0, 8);

  res.json({ vendor, products });
});

export const createVendor = asyncHandler(async (req, res) => {
  const existing = await vendorModel.findByUserId(req.user.userId);
  if (existing) throw httpError(409, 'Vendor profile already exists');

  const required = ['shop_name', 'address', 'city', 'pincode'];
  const missing = required.filter((field) => !req.body[field]);
  if (missing.length > 0) throw httpError(400, `Missing required fields: ${missing.join(', ')}`);

  const data = {
    user_id: req.user.userId,
    shop_name: req.body.shop_name.trim(),
    description: req.body.description,
    address: req.body.address,
    city: req.body.city,
    pincode: req.body.pincode,
    gst_number: req.body.gst_number,
    bank_account_name: req.body.bank_account_name,
    bank_account_number: req.body.bank_account_number,
    bank_ifsc: req.body.bank_ifsc,
    is_approved: false,
  };

  if (req.file) {
    const logo = await cloudinaryService.uploadImage(req.file.buffer, 'vendors');
    data.logo_url = logo.url;
  }

  const vendor = await vendorModel.create(data);
  await userModel.updateProfile(req.user.userId, { role: 'vendor' });

  res.status(201).json({
    vendor,
    message: 'Application submitted, pending approval',
  });
});

export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findById(req.params.id);
  if (!vendor) throw httpError(404, 'Vendor not found');

  await requireOwnVendorOrAdmin(req, vendor);

  const fields = [
    'shop_name',
    'description',
    'address',
    'city',
    'pincode',
    'gst_number',
    'bank_account_name',
    'bank_account_number',
    'bank_ifsc',
  ];
  const data = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  if (req.file) {
    const logo = await cloudinaryService.uploadImage(req.file.buffer, 'vendors');
    data.logo_url = logo.url;
  }

  const updated = await vendorModel.update(vendor.id, data);
  res.json({ vendor: updated });
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.update(req.params.id, {
    is_approved: true,
    is_active: true,
  });
  if (!vendor) throw httpError(404, 'Vendor not found');
  const user = vendor.user_id ? await userModel.findById(vendor.user_id) : null;
  if (user?.mobile) {
    notificationService
      .sendVendorApproval(user.mobile, vendor.shop_name)
      .catch((error) => console.error('Vendor approval SMS failed:', error.message));
  }
  res.json({ vendor });
});

export const suspendVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.update(req.params.id, { is_active: false });
  if (!vendor) throw httpError(404, 'Vendor not found');
  res.json({ vendor, reason: req.body.reason });
});

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.userId);
  if (!vendor) throw httpError(404, 'Vendor profile not found');

  const stats = await vendorModel.dashboardStats(vendor.id);
  res.json({
    today: { orders: stats.today_orders, revenue: Number(stats.today_revenue) },
    week: { orders: stats.week_orders, revenue: Number(stats.week_revenue) },
    month: { orders: stats.month_orders, revenue: Number(stats.month_revenue) },
    pending_orders: stats.pending_orders,
    total_products: stats.total_products,
    rating: vendor.rating,
  });
});

export const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorModel.findByUserId(req.user.userId);
  if (!vendor) throw httpError(404, 'Vendor profile not found');
  res.json({ vendor });
});
