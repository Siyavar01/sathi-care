import express from 'express';
import {
  createResource,
  getAllResources,
} from '../controllers/resourceController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createResource)
  .get(getAllResources);

export default router;