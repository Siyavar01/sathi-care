import express from 'express';
import { chatWithAI } from '../controllers/aiController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.route('/chat').post(protect, chatWithAI);

export default router;