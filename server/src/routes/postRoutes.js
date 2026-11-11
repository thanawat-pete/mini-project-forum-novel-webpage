import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleBookmark,
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
