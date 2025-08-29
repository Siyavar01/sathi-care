import express from 'express';
import {
  getAllUsers,
  getUnverifiedProfessionals,
  verifyProfessional,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/users')
  .get(protect, authorize('admin'), getAllUsers);

router
  .route('/unverified-professionals')
  .get(protect, authorize('admin'), getUnverifiedProfessionals);

router
  .route('/verify-professional/:id')
  .put(protect, authorize('admin'), verifyProfessional);

export default router;