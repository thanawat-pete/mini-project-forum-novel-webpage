import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'กรุณาระบุชื่อเรื่อง / หัวข้อ'],
      trim: true,
      maxlength: [150, 'ชื่อเรื่องต้องไม่เกิน 150 ตัวอักษร'],
    },
    synopsis: {
      type: String,
      required: [true, 'กรุณาระบุคำโปรยหรือเรื่องย่อ'],
      maxlength: [1000, 'คำโปรยต้องไม่เกิน 1000 ตัวอักษร'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    contentType: {
      type: String,
      required: true,
      enum: ['novel', 'short_story', 'forum'],
      default: 'novel',
    },
    category: {
      type: String,
      required: [true, 'กรุณาเลือกหมวดหมู่'],
      enum: [
        'fantasy',       // แฟนตาซี
        'romance',       // โรแมนติก / รักหวานแหวว
        'mystery',       // สืบสวน / ระทึกขวัญ
        'scifi',         // ไซไฟ / โลกอนาคต
        'horror',        // สยองขวัญ
        'action',        // แอ็กชัน / กำลังภายใน
        'slice_of_life', // ชีวิตประจำวัน / อบอุ่นหัวใจ
        'writer_talk',   // กระทู้คุยสาระนักเขียน
        'general',       // สัพเพเหระ
      ],
      default: 'fantasy',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'hiatus'],
      default: 'ongoing',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // For short stories and forum posts that have single-page content
    content: {
      type: String,
      default: '',
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
    chaptersCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for getting chapters list if needed
postSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'post',
});

export const Post = mongoose.model('Post', postSchema);
