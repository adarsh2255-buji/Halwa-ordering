import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { 
    getMostPopularProducts, 
    getProductSales, 
    getSalesByDateRange, 
    getTotalSales } from '../controller/analyticsController.js';
const router = express.Router();

router.get('/totalSales', adminMiddleware, getTotalSales);
router.get('/popularProduct',adminMiddleware,  getMostPopularProducts);
router.get('/salesByDate',adminMiddleware,  getSalesByDateRange);
router.get('/productSale', adminMiddleware, getProductSales)

export default router;