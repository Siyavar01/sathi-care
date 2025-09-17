import express from 'express';
import {
  getQuestions,
  submitAnswers,
} from '../controllers/questionnaireController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getQuestions);
router.route('/submit').post(protect, submitAnswers);

export default router;