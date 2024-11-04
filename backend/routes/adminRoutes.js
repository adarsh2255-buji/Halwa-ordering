import express from 'express';
import { adminLogin, adminLogout, createAdmin } from '../controller/adminController.js';
const router = express.Router();

router.post('/createAdmin', createAdmin);
router.post('/adminLogin', adminLogin);
router.post('/adminLogout', adminLogout)

export default router;