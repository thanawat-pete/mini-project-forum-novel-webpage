import express from 'express';
import {
  addComment,
  getComments,
  deleteComment,
  toggleLikeComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getComments)
  .post(protect, addComment);

router.route('/:id')
  .delete(protect, deleteComment);

router.post('/:id/like', protect, toggleLikeComment);

export default router;
