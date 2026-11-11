import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_novel_secret_jwt_key_2026_safe_dev',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password, penName, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        message: userExists.email === email ? 'อีเมลนี้ถูกใช้งานแล้ว' : 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว',
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      penName: penName || username,
      role: role === 'writer' || role === 'reader' ? role : 'writer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        penName: user.penName,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { credential, password } = req.body; // credential can be email or username

    if (!credential || !password) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลเข้าสู่ระบบและรหัสผ่าน' });
    }

    const user = await User.findOne({
      $or: [{ email: credential.toLowerCase() }, { username: credential }],
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        penName: user.penName,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      select: 'title synopsis coverImage contentType category author views likes chaptersCount',
      populate: { path: 'author', select: 'username penName avatar' },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    user.penName = req.body.penName ?? user.penName;
    user.bio = req.body.bio ?? user.bio;
    user.avatar = req.body.avatar ?? user.avatar;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      }
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      success: true,
      message: 'อัปเดตข้อมูลโปรไฟล์สำเร็จ',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        penName: user.penName,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of an author
// @route   GET /api/auth/authors/:id
// @access  Public
export const getAuthorProfile = async (req, res, next) => {
  try {
    const author = await User.findById(req.params.id).select('username penName bio avatar role createdAt');
    if (!author) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลนักเขียน' });
    }

    const posts = await Post.find({ author: author._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      author,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
