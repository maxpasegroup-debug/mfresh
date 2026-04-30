import { Router } from 'express';
import {
  adminOnboardVendor,
  createAdmin,
  getAllOrders,
  getSettings,
  getStats,
  getVendors,
  updateSettings,
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/orders', authenticate, requireAdmin, getAllOrders);
router.get('/vendors', authenticate, requireAdmin, getVendors);
router.post('/vendors/onboard', authenticate, requireAdmin, adminOnboardVendor);
router.get('/settings', authenticate, requireAdmin, getSettings);
router.post('/settings', authenticate, requireAdmin, updateSettings);
router.post('/create-admin', authenticate, requireAdmin, createAdmin);

export default router;
