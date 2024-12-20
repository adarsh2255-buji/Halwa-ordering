import express from 'express';
// import { createOrUpdateProfile, getUser, getUserProfileById, login, logout, signup, updatePassword, } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { addProfileData, getUserAddress, getUserWithProfile, login, signup, updateAddressData, updateProfileData } from '../controller/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// // Route to create or update profile
// router.post('/profile',authMiddleware, createOrUpdateProfile);
// // Route to get profile
// router.get('/profile', authMiddleware, getUserProfileById);
// router.put('/updatePassword', authMiddleware, updatePassword);
// // Get user 
// router.get('/user', authMiddleware, getUser);
// router.post('/logout', logout);
router.post('/profile', authMiddleware, addProfileData);
router.get('/profile', authMiddleware, getUserWithProfile)
router.put('/profile/update', authMiddleware, updateProfileData);
router.get('/address', authMiddleware, getUserAddress)
router.put('/address/update', authMiddleware, updateAddressData)

export default router; 