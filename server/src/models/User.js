import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'กรุณากรอกชื่อผู้ใช้ (Username)'],
      unique: true,
      trim: true,
      minlength: [3, 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร'],
      maxlength: [30, 'ชื่อผู้ใช้ต้องไม่เกิน 30 ตัวอักษร'],
    },
    email: {
      type: String,
      required: [true, 'กรุณากรอกอีเมล'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'รูปแบบอีเมลไม่ถูกต้อง'],
    },
    password: {
      type: String,
      required: [true, 'กรุณากรอกรหัสผ่าน'],
      minlength: [6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'],
      select: false,
    },
    penName: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      default: 'นักเดินทางแห่งโลกตัวอักษร',
      maxlength: [300, 'ประวัติย่อต้องไม่เกิน 300 ตัวอักษร'],
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['reader', 'writer', 'admin'],
      default: 'writer',
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
