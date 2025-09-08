import express from 'express';
import {
  createOrUpdateInstitutionProfile,
  getMyInstitutionProfile,
  createConnectionRequest,
  getMyConnectionRequests,
} from '../controllers/institutionController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';

const router = express.Router();

router
  .route('/profile')
  .post(protect, authorize('institution'), createOrUpdateInstitutionProfile);

router
  .route('/profile/me')
  .get(protect, authorize('institution'), getMyInstitutionProfile);

router
  .route('/connect')
  .post(protect, authorize('institution'), createConnectionRequest);

router
    .route('/requests')
    .get(protect, authorize('institution'), getMyConnectionRequests);

export default router;