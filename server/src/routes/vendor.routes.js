import { Router } from 'express';
import {
  approveVendor,
  createVendor,
  getMyVendorProfile,
  getVendor,
  getVendorDashboard,
  listVendors,
  suspendVendor,
  updateVendor,
} from '../controllers/vendor.controller.js';
import { authenticate, requireAdmin, requireVendor } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', listVendors);
router.get('/me', authenticate, requireVendor, getMyVendorProfile);
router.get('/dashboard', authenticate, requireVendor, getVendorDashboard);
router.get('/:id', getVendor);
router.post('/onboard', authenticate, uploadLimiter, uploadSingle, createVendor);
router.put('/:id', authenticate, uploadLimiter, uploadSingle, updateVendor);
router.patch('/:id/approve', authenticate, requireAdmin, approveVendor);
router.patch('/:id/suspend', authenticate, requireAdmin, suspendVendor);

export default router;
