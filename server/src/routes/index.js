import { Router } from 'express';
import addressRoutes from './address.routes.js';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import orderRoutes from './order.routes.js';
import offerRoutes from './offer.routes.js';
import productRoutes from './product.routes.js';
import vendorRoutes from './vendor.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/addresses', addressRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes);
router.use('/offers', offerRoutes);

export default router;
