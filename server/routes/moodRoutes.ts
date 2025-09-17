import express from 'express';
import {
  createMoodEntry,
  getMyMoodEntries,
} from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createMoodEntry);
router.get('/my', protect, getMyMoodEntries);

export default router;