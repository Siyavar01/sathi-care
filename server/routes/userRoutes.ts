import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  registerAndSubmit,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.route('/register-and-submit').post(registerAndSubmit);

export default router;