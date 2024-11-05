import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import AdminMiddleware from '../middleware/adminMiddleware.js';

import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controller/orderController.js';


const router = express.Router();

// User routes
router.post('/',authMiddleware, createOrder);
router.get('/userOrder', authMiddleware, getUserOrders);

//Admin routes
router.get('/admin', AdminMiddleware, getAllOrders);
router.put('admin/:orderId', authMiddleware, updateOrderStatus)

export default router;