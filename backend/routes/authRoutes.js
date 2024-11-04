import express from 'express';
import { getUserProfile, login, logout, signup, updatePassword, updateProfile } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/profile',authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/updatePassword', authMiddleware, updatePassword);
router.post('/logout', logout);

export default router;