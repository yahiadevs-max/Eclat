
import { Router } from 'express';
import { 
    getAllProducts, 
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
    .get(getAllProducts)
    .post(protect, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

export default router;
