import express from 'express';
import AdminMiddleware from '../middleware/adminMiddleware.js';
import { getAllInventory, updateStock } from '../controller/inventoryController.js';
const router = express.Router();

// Route to get all products with stock info
router.get('/', AdminMiddleware, getAllInventory);

// Route to update stock for a specific product (e.g., after restocking or adjusting quantity)
router.put('/:id', AdminMiddleware, updateStock);

export default router;