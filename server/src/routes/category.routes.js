import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '../controllers/category.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', listCategories);
router.get('/:id', getCategory);
router.post('/', authenticate, requireAdmin, uploadSingle, createCategory);
router.put('/:id', authenticate, requireAdmin, uploadSingle, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
