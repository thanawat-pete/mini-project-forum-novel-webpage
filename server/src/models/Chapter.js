import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    chapterNumber: {
      type: Number,
      required: [true, 'กรุณาระบุลำดับตอน'],
    },
    title: {
      type: String,
      required: [true, 'กรุณาระบุชื่อตอน'],
      trim: true,
      maxlength: [150, 'ชื่อตอนต้องไม่เกิน 150 ตัวอักษร'],
    },
    content: {
      type: String,
      required: [true, 'กรุณาระบุเนื้อหาของตอน'],
    },
    authorNote: {
      type: String,
      default: '',
      maxlength: [500, 'คุยท้ายตอนต้องไม่เกิน 500 ตัวอักษร'],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index so a novel doesn't have duplicate chapterNumber
chapterSchema.index({ post: 1, chapterNumber: 1 }, { unique: true });

export const Chapter = mongoose.model('Chapter', chapterSchema);
