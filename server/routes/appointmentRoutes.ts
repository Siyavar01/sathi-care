import express from 'express';
import {
  createAppointment,
  getMyAppointments,
} from '../controllers/appointmentController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/').post(protect, createAppointment);
router.route('/my').get(protect, getMyAppointments);

export default router;