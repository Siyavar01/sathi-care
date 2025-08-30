import express from 'express';
import {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
  matchProfessionals,
} from '../controllers/professionalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router
  .route('/profile')
  .post(protect, createOrUpdateProfessionalProfile);

router.route('/profile/me').get(protect, getMyProfessionalProfile);

router.route('/').get(getAllProfessionals);

router.route('/match').post(protect, matchProfessionals);

export default router;