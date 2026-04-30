import { Router } from 'express';
import {
  cancelOrder,
  createOrder,
  getOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus,
  verifyPayment,
} from '../controllers/order.controller.js';
import { authenticate, requireVendor } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  authenticate,
  validate({
    body: {
      address_id: { required: true, type: 'string' },
      items: { required: true },
    },
  }),
  createOrder,
);
router.get('/', authenticate, getUserOrders);
router.get('/vendor', authenticate, requireVendor, getVendorOrders);
router.get('/:id', authenticate, getOrder);
router.post(
  '/:id/verify-payment',
  authenticate,
  validate({
    body: {
      razorpay_order_id: { required: true, type: 'string' },
      razorpay_payment_id: { required: true, type: 'string' },
      razorpay_signature: { required: true, type: 'string' },
    },
  }),
  verifyPayment,
);
router.post('/:id/cancel', authenticate, cancelOrder);
router.patch(
  '/:id/status',
  authenticate,
  requireVendor,
  validate({
    body: {
      status: {
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      },
    },
  }),
  updateOrderStatus,
);

export default router;
