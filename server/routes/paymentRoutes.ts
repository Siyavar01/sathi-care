import express from 'express';
import {
  createOrder,
  verifyPayment,
} from '../controllers/paymentController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/orders').post(protect, createOrder);
router.route('/verify').post(protect, verifyPayment);

export default router;