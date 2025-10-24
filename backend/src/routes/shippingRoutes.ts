
import { Router } from 'express';
import { getShippingCosts, updateShippingCosts } from '../controllers/shippingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .get(protect, getShippingCosts)
    .put(protect, updateShippingCosts);

export default router;
