
import { Router } from 'express';
import { getAllDeliveries, updateDeliveryStatus } from '../controllers/deliveryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .get(getAllDeliveries);

router.route('/:orderId/status')
    .put(updateDeliveryStatus);

export default router;
