import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Chapter } from '../models/Chapter.js';
import { Comment } from '../models/Comment.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forum_novel_db';
    console.log(`🌱 Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Chapter.deleteMany({});
    await Comment.deleteMany({});

    console.log('👤 Creating demo users...');
    const user1 = await User.create({
      username: 'thanawat',
      email: 'thanawat@example.com',
      password: 'password123',
      penName: 'พีท ธนวัฒน์',
      bio: 'นักเขียนผู้หลงใหลในจินตนาการ แฟนตาซี และโลกเทคโนโลยี',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      role: 'writer',
    });

    const user2 = await User.create({
      username: 'jane_novelist',
      email: 'jane@example.com',
      password: 'password123',
      penName: 'ใบไม้สายลม',
      bio: 'ชอบแต่งเรื่องสั้นและนิยายรักอบอุ่นหัวใจ ดื่มด่ำกับกาแฟและตัวอักษร',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      role: 'writer',
    });

    console.log('📚 Creating sample novel...');
    const novel1 = await Post.create({
      title: 'มหาศึกจอมเวทแห่งแดนอัสดง',
      synopsis: 'ในยุคที่พลังเวทมนตร์โบราณกำลังเลือนหาย เด็กหนุ่มกำพร้าจากหมู่บ้านชายขอบได้ค้นพบคัมภีร์ที่ถูกปิดผนึก การเดินทางสู่มหาศึกที่ชี้ชะตาทวีปจึงเริ่มต้นขึ้น!',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      contentType: 'novel',
      category: 'fantasy',
      tags: ['แฟนตาซี', 'เวทมนตร์', 'ผจญภัย', 'มหาศึก'],
      author: user1._id,
      status: 'ongoing',
      views: 128,
      likes: [user1._id, user2._id],
    });

    console.log('📖 Adding chapters to novel...');
    const ch1 = await Chapter.create({
      post: novel1._id,
      chapterNumber: 1,
      title: 'ประกายไฟในความมืด',
      content: `สายลมหนาวพัดกรูผ่านช่องหน้าต่างไม้เก่าของบ้านพักริมเชิงผา เสียงใบไม้แห้งเสียดสีกันฟังดูราวกับเสียงกระซิบจากอดีตกาล

ลูคัสนั่งอยู่หน้าโต๊ะไม้ที่เต็มไปด้วยเศษกระดาษข่อยสีหม่น ในมือของเขาคือจี้หินสีครามที่ตกทอดมาจากบิดาผู้หายสาบสูญ หินก้อนนี้ไม่เคยเปล่งแสงใดๆ ตลอดสิบหกปีที่ผ่านมา แต่ในค่ำคืนนี้... มันกลับส่องแสงสีฟ้าเรืองรองจนสว่างวาบไปทั่วห้อง

"ในที่สุดเวลาก็มาถึงแล้วสินะ..." เสียงทุ้มต่ำที่ไม่คุ้นเคยดังขึ้นจากเงามืดหลังตู้หนังสือ

ลูคัสสะดุ้งสุดตัว เขาคว้ามีดสั้นเล่มเก่าขึ้นมาถือไว้มั่น หัวใจเต้นระทึกเหมือนกลองศึก ทว่าสิ่งที่ก้าวออกมาจากเงามืดกลับไม่ใช่สัตว์อสูร แต่เป็นชายชราในชุดคลุมสีเทาหม่น ดวงตาสีทองคู่นั้นสะท้อนภาพของเปลวไฟที่ไม่มีวันดับมอด`,
      authorNote: 'ฝากติดตามตอนแรกด้วยนะครับ ติชมและแนะนำได้ตลอดเลยครับ!',
      views: 75,
      likes: [user2._id],
    });

    const ch2 = await Chapter.create({
      post: novel1._id,
      chapterNumber: 2,
      title: 'คำสัญญาของผู้พิทักษ์',
      content: `"เธอไม่จำเป็นต้องกลัว ข้าไม่ใช่ศัตรู" ชายชราเอ่ยขึ้นอย่างแผ่วเบา รอยยิ้มจางๆ ปรากฏบนใบหน้าที่เต็มไปด้วยริ้วรอยแห่งกาลเวลา

ลูคัสยังไม่ลดมีดลง เขาสบตากับผู้มาเยือนด้วยความระแวดระวัง "ท่านเป็นใคร แล้วเข้ามาในบ้านข้าได้อย่างไร?"

"ข้าคือเมอร์ลิน อดีตผู้พิทักษ์หอคอยดวงดาว และข้ามาที่นี่เพื่อทำตามสัญญาที่เคยให้ไว้กับพ่อของเจ้าเมื่อสิบหกปีก่อน" ชายชราผายมือออก ในฝ่ามือปรากฏตราสัญลักษณ์รูปมังกรคู่ที่ลูคัสจำได้ดี มันคือตราเดียวกับที่สลักไว้บนหลังจี้หินคราม!`,
      authorNote: 'ตอนที่สองมาแล้วครับ ขอบคุณทุกกำลังใจที่คอมเมนต์ในตอนแรกนะครับ',
      views: 53,
      likes: [user1._id],
    });

    novel1.chaptersCount = 2;
    await novel1.save();

    console.log('✨ Creating sample short story...');
    const story1 = await Post.create({
      title: 'บันทึกของร้านกาแฟใต้เงาจันทร์',
      synopsis: 'ร้านกาแฟเล็กๆ ที่เปิดเฉพาะคืนพระจันทร์เต็มดวง เสิร์ฟเครื่องดื่มที่ปรุงจากความทรงจำอันหอมหวานและขมขื่นของลูกค้าทุกคน',
      coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      contentType: 'short_story',
      category: 'slice_of_life',
      tags: ['เรื่องสั้น', 'อบอุ่นหัวใจ', 'ร้านกาแฟ', 'ความทรงจำ'],
      content: `กลิ่นหอมกรุ่นของเมล็ดกาแฟคั่วบดลอยอบอวลไปทั่วตรอกแคบๆ ที่เงียบสงัด ป้ายไฟนีออนสลัวๆ รูปถ้วยกาแฟและพระจันทร์เสี้ยวสว่างขึ้นในเวลาเที่ยงคืนตรง

คุณลุงบาริสต้าเจ้าของร้านผู้สวมผ้ากันเปื้อนสีน้ำตาลเข้มบรรจงเทน้ำร้อนลงบนดริปเปอร์อย่างชำนาญ สายน้ำไหลผ่านผงกาแฟสีเข้มส่งไอควันอุ่นๆ ขึ้นสู่เบื้องบน

"ยินดีต้อนรับครับ วันนี้อยากรับกาแฟรสชาติของความทรงจำช่วงไหนดีครับ?"

หญิงสาวผู้มีแววตาอ่อนล้าหยุดยืนหน้าเคาน์เตอร์ เธอลังเลอยู่ครู่หนึ่งก่อนจะตอบเบาๆ "ขอเป็นรสชาติของวันที่ฉันยังกล้าฝัน... ได้ไหมคะ?"

คุณลุงยิ้มอย่างอ่อนโยน "ได้แน่นอนครับ เมนูนี้เราจะเติมกลิ่นวนิลาและคาราเมลอ่อนๆ เพื่อเตือนใจว่าความฝันของคุณ ไม่เคยสูญหายไปไหน เพียงแค่รอให้คุณกลับมาหยิบมันขึ้นมาอีกครั้ง"`,
      author: user2._id,
      status: 'completed',
      views: 92,
      likes: [user1._id],
    });

    console.log('💬 Creating sample forum post...');
    const forum1 = await Post.create({
      title: 'นักเขียนมือใหม่เริ่มต้นวางโครงสร้างพล็อต (3-Act Structure) อย่างไรไม่ให้ตันกลางเรื่อง?',
      synopsis: 'ชวนเพื่อนๆ นักเขียนมาแชร์เทคนิคการวาง Outline และสร้างจุดพลิกผัน (Plot Twist) ให้ดำเนินเรื่องได้ลื่นไหล ไม่ตันช่วงองก์ 2',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      contentType: 'forum',
      category: 'writer_talk',
      tags: ['เทคนิคการเขียน', 'พล็อตนิยาย', 'สาระนักเขียน', 'แชร์ไอเดีย'],
      content: `สวัสดีเพื่อนๆ นักเขียนทุกคนครับ!

หลายคนน่าจะเคยเจอปัญหาเวลาเริ่มเรื่องอย่างมีไฟ (Act 1 สนุกมาก) แต่พอเข้าสู่กลางเรื่อง (Act 2) กลับเริ่มตัน ไม่รู้จะพาตัวละครไปทิศทางไหนต่อ

สำหรับผม เทคนิคที่ช่วยได้มากคือ:
1. กำหนด Midpoint ให้ชัดเจน ว่าตัวละครจะต้องเจอกับจุดเปลี่ยนสำคัญอะไรที่ทำให้ไม่สามารถย้อนกลับไปใช้ชีวิตเดิมได้อีก
2. วางเป้าหมายรอง (Sub-plot) ควบคู่กับความสัมพันธ์ของตัวละคร
3. ถามตัวเองเสมอว่า "สิ่งที่เลวร้ายที่สุดที่จะเกิดขึ้นกับตัวเอกในฉากนี้คืออะไร?"

เพื่อนๆ มีวิธีแก้ปัญหาพล็อตตัน หรือมีเคล็ดลับการวางโครงเรื่องอย่างไรบ้าง มาร่วมแชร์กันได้เลยครับ!`,
      author: user1._id,
      isPinned: true,
      views: 210,
      likes: [user1._id, user2._id],
    });

    console.log('💬 Adding sample comments...');
    await Comment.create({
      post: forum1._id,
      author: user2._id,
      content: 'เห็นด้วยมากๆ เลยค่ะ เทคนิค Midpoint ช่วยชีวิตได้จริงๆ อีกอย่างที่ชอบใช้คือการสร้าง "นาฬิกานับถอยหลัง" (Time Ticking) ให้ตัวละครต้องรีบตัดสินใจ จะช่วยเพิ่มความตื่นเต้นได้ดีมากค่ะ!',
      likes: [user1._id],
    });

    await Comment.create({
      post: novel1._id,
      chapter: ch1._id,
      author: user2._id,
      content: 'เปิดเรื่องได้น่าติดตามมาก บรรยากาศแฟนตาซีโบราณเข้มข้น รอลุ้นความลับของจี้หินครามในตอนต่อไปนะคะ!',
      likes: [user1._id],
    });

    // Add bookmark for user1
    user1.bookmarks = [story1._id];
    await user1.save();

    console.log('✅ Database seeded successfully!');
    console.log('--------------------------------------------------');
    console.log('Demo Account 1: thanawat / password123');
    console.log('Demo Account 2: jane_novelist / password123');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
