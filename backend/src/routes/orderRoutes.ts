
import { Router } from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .post(createOrder) // Public route for placing an order
    .get(protect, getAllOrders); // Protected route for admins

router.route('/:id/status')
    .put(protect, updateOrderStatus); // Protected route for admins

export default router;
