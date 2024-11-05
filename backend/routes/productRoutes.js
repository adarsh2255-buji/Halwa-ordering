import express from 'express';
import AdminMiddleware from '../middleware/adminMiddleware.js';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controller/productController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/addProduct', AdminMiddleware, upload.single('image'), addProduct );
router.put('/updateProduct/:id',AdminMiddleware, updateProduct);
router.delete('/deleteProduct/:id', AdminMiddleware, deleteProduct);
router.get('/getProduct', AdminMiddleware, getAllProducts);
router.get('/:id', AdminMiddleware, getProductById)

export default router;