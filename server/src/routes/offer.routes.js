import { Router } from 'express';
import {
  createOffer,
  deleteOffer,
  listOffers,
  updateOffer,
  validateCode,
} from '../controllers/offer.controller.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listOffers);
router.get('/validate', validateCode);
router.post('/', authenticate, requireAdmin, createOffer);
router.put('/:id', authenticate, requireAdmin, updateOffer);
router.delete('/:id', authenticate, requireAdmin, deleteOffer);

export default router;
