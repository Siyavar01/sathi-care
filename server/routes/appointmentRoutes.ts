import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAppointmentsByProfessional,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createAppointment);
router.route('/my').get(protect, getMyAppointments);
router.route('/professional/:id').get(getAppointmentsByProfessional);

export default router;