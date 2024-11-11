import express from 'express';
import { createOrUpdateProfile, getUserProfileById, login, logout, signup, updatePassword, } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// Route to create or update profile
router.post('/profile',authMiddleware, createOrUpdateProfile);
// Route to get profile
router.get('/profile', authMiddleware, getUserProfileById);
router.put('/updatePassword', authMiddleware, updatePassword);
router.post('/logout', logout);

export default router;