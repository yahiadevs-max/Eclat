
import { Router } from 'express';
import { getAllReturnRequests, updateReturnRequestStatus } from '../controllers/returnController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
    .get(getAllReturnRequests);

router.route('/:requestId/status')
    .put(updateReturnRequestStatus);

export default router;
