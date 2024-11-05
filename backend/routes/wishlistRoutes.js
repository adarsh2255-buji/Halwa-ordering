import express, { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controller/wishListController.js';

const router = express.Router();

router.post('/add', authMiddleware, addToWishlist);
router.post('/remove', authMiddleware, removeFromWishlist);
router.get('/', authMiddleware, getWishlist);

export default router;