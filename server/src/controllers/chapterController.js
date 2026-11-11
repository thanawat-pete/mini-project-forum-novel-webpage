import { Chapter } from '../models/Chapter.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

// @desc    Add a new chapter to a novel
// @route   POST /api/chapters
// @access  Private
export const addChapter = async (req, res, next) => {
  try {
    const { postId, chapterNumber, title, content, authorNote } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'ไม่พบหนังสือนิยายที่ระบุ' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เพิ่มตอนในนิยายเรื่องนี้' });
    }

    // Auto calculate chapter number if not provided
    let num = chapterNumber;
    if (!num) {
      const lastChapter = await Chapter.findOne({ post: postId }).sort({ chapterNumber: -1 });
      num = lastChapter ? lastChapter.chapterNumber + 1 : 1;
    }

    const chapter = await Chapter.create({
      post: postId,
      chapterNumber: num,
      title,
      content,
      authorNote: authorNote || '',
    });

    // Update novel chapters count
    post.chaptersCount = await Chapter.countDocuments({ post: postId });
    await post.save();

    res.status(201).json({
      success: true,
      message: `เพิ่มตอนที่ ${num} สำเร็จ`,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chapters for a novel
// @route   GET /api/chapters/novel/:postId
// @access  Public
export const getChaptersByPost = async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ post: req.params.postId })
      .select('chapterNumber title views likes createdAt')
      .sort({ chapterNumber: 1 });

    res.json({
      success: true,
      count: chapters.length,
      chapters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chapter by ID with next & prev navigation
// @route   GET /api/chapters/:id
// @access  Public
export const getChapterById = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate({
      path: 'post',
      select: 'title author status contentType category',
      populate: { path: 'author', select: 'username penName avatar' },
    });

    if (!chapter) {
      return res.status(404).json({ message: 'ไม่พบเนื้อหาของตอนนี้' });
    }

    // Increment chapter and post views
    chapter.views += 1;
    await chapter.save();
    await Post.findByIdAndUpdate(chapter.post._id, { $inc: { views: 1 } });

    // Find previous and next chapters
    const prevChapter = await Chapter.findOne({
      post: chapter.post._id,
      chapterNumber: { $lt: chapter.chapterNumber },
    })
      .sort({ chapterNumber: -1 })
      .select('_id chapterNumber title');

    const nextChapter = await Chapter.findOne({
      post: chapter.post._id,
      chapterNumber: { $gt: chapter.chapterNumber },
    })
      .sort({ chapterNumber: 1 })
      .select('_id chapterNumber title');

    res.json({
      success: true,
      chapter,
      navigation: {
        prev: prevChapter,
        next: nextChapter,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a chapter
// @route   PUT /api/chapters/:id
// @access  Private
export const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('post', 'author');

    if (!chapter) {
      return res.status(404).json({ message: 'ไม่พบตอนที่ต้องการแก้ไข' });
    }

    if (chapter.post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขตอนนี้' });
    }

    const { title, content, authorNote, chapterNumber } = req.body;

    chapter.title = title ?? chapter.title;
    chapter.content = content ?? chapter.content;
    chapter.authorNote = authorNote ?? chapter.authorNote;
    if (chapterNumber !== undefined) {
      chapter.chapterNumber = chapterNumber;
    }

    await chapter.save();

    res.json({
      success: true,
      message: 'บันทึกการแก้ไขตอนสำเร็จ',
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a chapter
// @route   DELETE /api/chapters/:id
// @access  Private
export const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('post', 'author');

    if (!chapter) {
      return res.status(404).json({ message: 'ไม่พบตอนที่ต้องการลบ' });
    }

    if (chapter.post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบตอนนี้' });
    }

    const postId = chapter.post._id;

    // Delete associated comments
    await Comment.deleteMany({ chapter: chapter._id });
    await Chapter.findByIdAndDelete(chapter._id);

    // Update novel chapters count
    const remainingCount = await Chapter.countDocuments({ post: postId });
    await Post.findByIdAndUpdate(postId, { chaptersCount: remainingCount });

    res.json({
      success: true,
      message: 'ลบตอนเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a chapter
// @route   POST /api/chapters/:id/like
// @access  Private
export const toggleLikeChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({ message: 'ไม่พบตอนนี้' });
    }

    const userId = req.user._id;
    const isLiked = chapter.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      chapter.likes = chapter.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      chapter.likes.push(userId);
    }

    await chapter.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: chapter.likes.length,
    });
  } catch (error) {
    next(error);
  }
};
