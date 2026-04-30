import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getFeaturedProducts,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { authenticate, requireVendor } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', listProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, requireVendor, uploadLimiter, uploadMultiple, createProduct);
router.put('/:id', authenticate, requireVendor, uploadLimiter, uploadMultiple, updateProduct);
router.delete('/:id', authenticate, requireVendor, deleteProduct);
router.delete('/:id/images', authenticate, requireVendor, deleteProductImage);

export default router;
