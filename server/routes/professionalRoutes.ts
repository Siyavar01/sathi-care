import express from 'express';
import {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
  matchProfessionals,
} from '../controllers/professionalController.ts';
import { uploadCredential } from '../controllers/uploadController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/profile')
  .post(protect, createOrUpdateProfessionalProfile);

router.route('/profile/me').get(protect, getMyProfessionalProfile);

router.route('/').get(getAllProfessionals);

router.route('/match').post(protect, matchProfessionals);

router
  .route('/credentials/upload')
  .post(protect, upload.single('credential'), uploadCredential);

export default router;