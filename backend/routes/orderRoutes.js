import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import AdminMiddleware from '../middleware/adminMiddleware.js';

import { cancelOrder, createOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controller/orderController.js';


const router = express.Router();

// User routes
router.post('/',authMiddleware, createOrder);
router.get('/userOrder', authMiddleware, getUserOrders);

//Admin routes
router.get('/admin', AdminMiddleware, getAllOrders);
router.put('admin/:orderId', authMiddleware, updateOrderStatus);
router.patch('/cancel/:orderId', authMiddleware, cancelOrder);

export default router;