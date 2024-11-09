import express from 'express';
import AdminMiddleware from '../middleware/adminMiddleware.js';
import { 
    addProduct, 
    addReview, 
    deleteProduct, 
    deleteReview, 
    getAllProducts,
    getProductById, 
    getProductReviews, 
    updateProduct, 
    updateReview} from '../controller/productController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/addProduct', AdminMiddleware, upload.single('image'), addProduct );
router.put('/updateProduct/:id',AdminMiddleware, updateProduct);
router.delete('/deleteProduct/:id', AdminMiddleware, deleteProduct);
router.get('/', getAllProducts)

router.get('/getProduct', AdminMiddleware, getAllProducts);
router.get('/:id', AdminMiddleware, getProductById)

// Reviews
router.post('/:productId/review', authMiddleware, addReview);
router.put('/:productId/review', authMiddleware, updateReview);
router.delete('/:productId/review', authMiddleware, deleteReview);
router.get('/:productId/review', authMiddleware,getProductReviews)

export default router; 