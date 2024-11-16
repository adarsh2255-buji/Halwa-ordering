import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import AdminMiddleware from '../middleware/adminMiddleware.js';

import { cancelOrder, createOrder, getAllOrders, getOrderById, getUserOrders, updateOrderStatus } from '../controller/orderController.js';


const router = express.Router();

// User routes
router.post('/order',authMiddleware, createOrder);
router.get('/orders', authMiddleware, getUserOrders);
router.get('/order/:id', authMiddleware, getOrderById);
router.patch('/cancel/:orderId', authMiddleware, cancelOrder);

//Admin routes
router.get('/admin', AdminMiddleware, getAllOrders);
router.put('/admin/:id/status', [authMiddleware,AdminMiddleware], updateOrderStatus);



export default router;