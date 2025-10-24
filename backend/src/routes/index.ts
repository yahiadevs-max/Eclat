
import { Router } from 'express';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import shippingRoutes from './shippingRoutes';
import deliveryRoutes from './deliveryRoutes';
import paymentRoutes from './paymentRoutes';
import returnRoutes from './returnRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);
router.use('/admins', adminRoutes);
router.use('/shipping', shippingRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/payments', paymentRoutes);
router.use('/returns', returnRoutes);

export default router;
