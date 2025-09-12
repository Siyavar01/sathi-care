import express from 'express';
import {
  createMoodEntry,
  getMyMoodEntries,
} from '../controllers/moodController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createMoodEntry);
router.get('/my', protect, getMyMoodEntries);

export default router;