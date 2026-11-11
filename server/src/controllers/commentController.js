import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';

// @desc    Add a comment to a post or chapter
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { postId, chapterId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'กรุณากรอกข้อความแสดงความคิดเห็น' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'ไม่พบเรื่องที่ต้องการแสดงความคิดเห็น' });
    }

    // Check if commenter is the author of the post
    const isAuthorReply = post.author.toString() === req.user._id.toString();

    const comment = await Comment.create({
      post: postId,
      chapter: chapterId || null,
      author: req.user._id,
      content: content.trim(),
      isAuthorReply,
    });

    await comment.populate('author', 'username penName avatar role');

    res.status(201).json({
      success: true,
      message: 'ส่งความคิดเห็นเรียบร้อยแล้ว',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post or chapter
// @route   GET /api/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const { postId, chapterId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: 'กรุณาระบุ postId' });
    }

    const query = { post: postId };
    if (chapterId) {
      query.chapter = chapterId;
    } else {
      query.chapter = null; // Comments on the main novel/story/forum page
    }

    const comments = await Comment.find(query)
      .populate('author', 'username penName avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'ไม่พบความคิดเห็น' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบความคิดเห็นนี้' });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.json({
      success: true,
      message: 'ลบความคิดเห็นเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleLikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'ไม่พบความคิดเห็น' });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    next(error);
  }
};
