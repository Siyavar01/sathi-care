import express from 'express';
import {
  createOrder,
  verifyAndBookAppointment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/orders').post(protect, createOrder);
router.route('/verify-and-book').post(protect, verifyAndBookAppointment);

export default router;