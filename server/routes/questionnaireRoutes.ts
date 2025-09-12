import express from 'express';
import {
  getQuestions,
  submitAnswers,
} from '../controllers/questionnaireController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getQuestions);
router.route('/submit').post(protect, submitAnswers);

export default router;