import express from 'express';
import AdminMiddleware from '../middleware/adminMiddleware.js';
import { addProduct } from '../controller/productController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/addProduct', AdminMiddleware, upload.single('image'), addProduct );

export default router;