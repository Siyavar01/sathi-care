import express from 'express';
import {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
  getProfessionalById,
  matchProfessionals,
  getIncomingConnectionRequests,
  updateConnectionRequestStatus,
} from '../controllers/professionalController.js';
import {
  uploadCredential,
  uploadProfilePicture,
} from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route('/profile')
  .post(protect, authorize('professional'), createOrUpdateProfessionalProfile);

router
  .route('/profile/me')
  .get(protect, authorize('professional'), getMyProfessionalProfile);

router
  .route('/profile/upload-picture')
  .post(
    protect,
    authorize('professional'),
    upload.single('profilePicture'),
    uploadProfilePicture
  );

router.route('/').get(getAllProfessionals);

router.route('/match').post(protect, matchProfessionals);

router
  .route('/credentials/upload')
  .post(
    protect,
    authorize('professional'),
    upload.single('credential'),
    uploadCredential
  );

router
  .route('/requests/incoming')
  .get(protect, authorize('professional'), getIncomingConnectionRequests);
router
  .route('/requests/:id')
  .put(protect, authorize('professional'), updateConnectionRequestStatus);

router.route('/:id').get(getProfessionalById);

export default router;