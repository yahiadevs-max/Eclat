
import { Router } from 'express';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/auth', authRoutes);

export default router;
