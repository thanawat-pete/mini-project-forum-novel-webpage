import express from 'express';
import {
  addChapter,
  getChaptersByPost,
  getChapterById,
  updateChapter,
  deleteChapter,
  toggleLikeChapter,
} from '../controllers/chapterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addChapter);
router.get('/novel/:postId', getChaptersByPost);
router.route('/:id')
  .get(getChapterById)
  .put(protect, updateChapter)
  .delete(protect, deleteChapter);

router.post('/:id/like', protect, toggleLikeChapter);

export default router;
