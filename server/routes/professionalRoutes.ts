import express from 'express';
import {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
} from '../controllers/professionalController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/profile')
  .post(protect, createOrUpdateProfessionalProfile);

router.route('/profile/me').get(protect, getMyProfessionalProfile);

router.route('/').get(getAllProfessionals);

export default router;