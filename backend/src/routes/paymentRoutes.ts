
import { Router } from 'express';
import { getAllPayments, updatePaymentStatus } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .get(getAllPayments);

router.route('/:transactionId/status')
    .put(updatePaymentStatus);

export default router;
