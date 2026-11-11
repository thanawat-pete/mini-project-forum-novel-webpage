import { Post } from '../models/Post.js';
import { Chapter } from '../models/Chapter.js';
import { Comment } from '../models/Comment.js';
import { User } from '../models/User.js';

// @desc    Create a new novel / short story / forum post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const {
      title,
      synopsis,
      coverImage,
      contentType,
      category,
      tags,
      content,
      status,
    } = req.body;

    const post = await Post.create({
      title,
      synopsis,
      coverImage: coverImage || '',
      contentType: contentType || 'novel',
      category: category || 'fantasy',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
      content: content || '',
      status: status || 'ongoing',
      author: req.user._id,
    });

    await post.populate('author', 'username penName avatar');

    res.status(201).json({
      success: true,
      message: 'สร้างผลงานสำเร็จ',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts with filters & pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const {
      type,       // novel, short_story, forum
      category,   // fantasy, romance, etc.
      search,     // search in title, synopsis, tags
      author,     // author user id
      sort = 'latest', // latest, popular, views
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (type) {
      query.contentType = type;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (author) {
      query.author = author;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { 'likes.length': -1, views: -1, createdAt: -1 };
    } else if (sort === 'views') {
      sortOption = { views: -1, createdAt: -1 };
    }

    const currentPage = parseInt(page, 10);
    const limitPerPage = parseInt(limit, 10);
    const skip = (currentPage - 1) * limitPerPage;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'username penName avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitPerPage);

    res.json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitPerPage),
      currentPage,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username penName bio avatar');

    if (!post) {
      return res.status(404).json({ message: 'ไม่พบเรื่องหรือกระทู้ที่ระบุ' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    // Fetch chapters if it's a novel
    let chapters = [];
    if (post.contentType === 'novel') {
      chapters = await Chapter.find({ post: post._id })
        .select('chapterNumber title views createdAt likes')
        .sort({ chapterNumber: 1 });
    }

    res.json({
      success: true,
      post,
      chapters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'ไม่พบเรื่องที่ต้องการแก้ไข' });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์แก้ไขผลงานนี้' });
    }

    const {
      title,
      synopsis,
      coverImage,
      category,
      tags,
      content,
      status,
    } = req.body;

    post.title = title ?? post.title;
    post.synopsis = synopsis ?? post.synopsis;
    post.coverImage = coverImage ?? post.coverImage;
    post.category = category ?? post.category;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [];
    }
    post.content = content ?? post.content;
    post.status = status ?? post.status;

    await post.save();
    await post.populate('author', 'username penName avatar');

    res.json({
      success: true,
      message: 'บันทึกการแก้ไขสำเร็จ',
      post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post & cascade delete chapters & comments
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'ไม่พบเรื่องที่ต้องการลบ' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์ลบผลงานนี้' });
    }

    // Delete associated chapters and comments
    await Chapter.deleteMany({ post: post._id });
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);

    res.json({
      success: true,
      message: 'ลบผลงานและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'ไม่พบเรื่องนี้' });
    }

    const userId = req.user._id;
    const isLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark for user
// @route   POST /api/posts/:id/bookmark
// @access  Private
export const toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;

    const isBookmarked = user.bookmarks.some((id) => id.toString() === postId.toString());

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId.toString());
    } else {
      user.bookmarks.push(postId);
    }

    await user.save();

    res.json({
      success: true,
      isBookmarked: !isBookmarked,
      bookmarksCount: user.bookmarks.length,
    });
  } catch (error) {
    next(error);
  }
};
