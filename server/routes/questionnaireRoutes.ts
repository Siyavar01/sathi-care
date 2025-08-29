import express from 'express';
import {
  getQuestions,
  submitResponses,
} from '../controllers/questionnaireController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getQuestions);
router.route('/submit').post(protect, submitResponses);

export default router;