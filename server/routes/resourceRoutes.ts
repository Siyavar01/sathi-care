import express from 'express';
import {
  createResource,
  getAllResources,
} from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createResource)
  .get(getAllResources);

export default router;