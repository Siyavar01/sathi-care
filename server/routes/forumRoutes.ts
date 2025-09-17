import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  createComment,
} from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/posts').post(protect, createPost).get(getAllPosts);
router.route('/posts/:id').get(getPostById);
router.route('/posts/:id/comments').post(protect, createComment);

export default router;