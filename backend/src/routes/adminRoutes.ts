
import { Router } from 'express';
import { 
    getAllAdmins, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin 
} from '../controllers/adminController';
import { protect, superadmin } from '../middleware/authMiddleware';

const router = Router();

// All routes in this file are protected and require superadmin role
router.use(protect, superadmin);

router.route('/')
    .get(getAllAdmins)
    .post(createAdmin);

router.route('/:id')
    .put(updateAdmin)
    .delete(deleteAdmin);

export default router;
