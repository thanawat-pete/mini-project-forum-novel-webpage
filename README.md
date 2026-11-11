# StoryCraft - Web Forum & Novel Platform 📖✨

> เว็บไซต์คอมมูนิตี้สำหรับนักเขียนและนักอ่านนิยาย เรื่องสั้น และกระดานสนทนาแลกเปลี่ยนเทคนิคการเขียน รองรับทั้งระบบหน้าบ้าน (Frontend) และระบบหลังบ้าน (Backend) พร้อมฐานข้อมูล MongoDB

---

## 🚀 จุดเด่น & ฟีเจอร์ของระบบ (Key Features)

### 1. ระบบเนื้อหา & การจัดการผลงาน (Content Management)
- **นิยายขนาดยาว (Novel)**: มีระบบแบ่งตอน (Chapters) สารบัญตอน ยอดเข้าชมแต่ละตอน และสถานะผลงาน (กำลังแต่ง / จบแล้ว / พักเรื่อง)
- **เรื่องสั้น (Short Story)**: ผลงานตอนเดียวจบ พร้อมคำโปรยและเนื้อเรื่องฉบับเต็ม
- **กระดานสนทนานักเขียน (Writer's Forum)**: พื้นที่ตั้งกระทู้พูดคุย แลกเปลี่ยนไอเดียพล็อต หรือถาม-ตอบข้อสงสัย
- **ระบบหมวดหมู่ & แท็ก (Categories & Tags)**: แฟนตาซี, โรแมนติก, สืบสวน, ไซไฟ, สยองขวัญ, แอ็กชัน, สาระนักเขียน ฯลฯ

### 2. ประสบการณ์สำหรับผู้อ่าน (Reader Experience)
- **โหมดการอ่านแบบไร้สิ่งรบกวน (Reading Mode)**:
  - ปรับขนาดตัวอักษรได้ 4 ระดับ (เล็ก, ปกติ, ใหญ่, ใหญ่พิเศษ)
  - สลับธีมการอ่านได้ 3 รูปแบบ: สว่าง (Light), ถนอมสายตา (Sepia) และโหมดกลางคืน (Dark)
  - แถบนำทางข้ามตอนย่อย (ตอนก่อนหน้า / สารบัญ / ตอนต่อไป) อย่างสะดวก
- **ระบบปฏิสัมพันธ์ (Engagement)**:
  - กดถูกใจ (Like) นิยาย ตอนย่อย และกระทู้
  - บันทึกเข้าคลังผลงาน (Bookmark) สำหรับเก็บไว้อ่านภายหลัง

### 3. ระบบสมาชิก & โปรไฟล์ (Auth & Profile)
- สมัครสมาชิกและเข้าสู่ระบบด้วย JWT Authentication (รหัสผ่านเข้ารหัสด้วย bcryptjs)
- กำหนดนามปากกา (Pen Name), คำแนะนำตัว (Bio) และรูปโปรไฟล์
- หน้าโปรไฟล์ผู้เขียน รวบรวมผลงานที่เคยแต่งทั้งหมด และคลังนิยายที่บันทึกไว้

### 4. ระบบความคิดเห็น (Discussion & Comments)
- แสดงความคิดเห็นท้ายเรื่อง ท้ายตอนย่อย และในกระทู้
- ป้ายกำกับพิเศษ "ผู้แต่ง" เมื่อนักเขียนเข้ามาตอบความคิดเห็น
- กดถูกใจคอมเมนต์ และลบความคิดเห็นของตนเองได้

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JSON Web Token (JWT) + bcryptjs
- **Environment & Logging**: dotenv, cors, morgan

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
mini-project-webforum/
├── client/                     # Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # คอมโพเนนต์ที่ใช้ซ้ำ
│   │   │   ├── common/         # Button, Input, Badge, LoadingSpinner, EmptyState
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── novel/          # NovelCard, ChapterList, ReaderToolbar
│   │   │   └── forum/          # ForumCard, CommentSection
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # หน้าเว็บหลัก
│   │   │   ├── Home.jsx            # หน้าแรก
│   │   │   ├── Explore.jsx         # ค้นหาและสำรวจผลงาน
│   │   │   ├── NovelDetail.jsx     # หน้ารายละเอียด & สารบัญตอน
│   │   │   ├── ReadChapter.jsx     # หน้าอ่านเนื้อหาของตอน
│   │   │   ├── CreateEditPost.jsx  # ฟอร์มสร้าง/แก้ไขเรื่อง
│   │   │   ├── AddEditChapter.jsx  # ฟอร์มเพิ่ม/แก้ไขตอนย่อย
│   │   │   ├── Forum.jsx           # หน้าเว็บบอร์ดกระทู้
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Profile.jsx         # หน้าโปรไฟล์ผู้ใช้
│   │   │   └── AuthorProfile.jsx   # หน้าโปรไฟล์นักเขียนสาธารณะ
│   │   ├── services/           # API services (api, auth, post, chapter, comment)
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API
│   ├── src/
│   │   ├── config/             # เชื่อมต่อ Database (db.js)
│   │   ├── controllers/        # auth, post, chapter, comment controllers
│   │   ├── middleware/         # authMiddleware, errorHandler
│   │   ├── models/             # Mongoose Schemas (User, Post, Chapter, Comment)
│   │   ├── routes/             # Express Routers
│   │   ├── utils/              # Seed data script
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. ติดตั้ง Backend (Server)
```bash
cd server
npm install
```
สร้างไฟล์ `.env` (คัดลอกจาก `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forum_novel_db
JWT_SECRET=super_novel_secret_jwt_key_2026_safe_dev
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(ตัวเลือกเสริม)* ใส่ข้อมูลตัวอย่าง (Seed Data):
```bash
npm run seed
```

เริ่มรัน Server:
```bash
npm run dev
# Server จะทำงานที่ http://localhost:5000
```

---

### 2. ติดตั้ง Frontend (Client)
```bash
cd client
npm install
npm run dev
# Frontend จะทำงานที่ http://localhost:5173
```

---

## 🌿 กลยุทธ์การแตก Branch และ Commit (Git Workflow)

- `main` : บรันช์สำหรับ Production ที่ผ่านการทดสอบสมบูรณ์
- `develop` : บรันช์หลักสำหรับการรวบรวมฟีเจอร์ในระหว่างพัฒนา
- `feature/*` : บรันช์ฟีเจอร์เฉพาะส่วน เช่น:
  - `feature/project-setup` : การตั้งค่าโครงสร้างโปรเจกต์ client/server
  - `feature/backend-api` : สร้างโมเดล, คอนโทรลเลอร์ และ API endpoints
  - `feature/frontend-ui` : พัฒนาหน้าเว็บ คอมโพเนนต์ และเชื่อมต่อ API

รูปแบบการ Commit ยึดตาม **Conventional Commits**:
- `feat:` เพิ่มฟีเจอร์ใหม่
- `fix:` แก้ไขบั๊ก
- `docs:` อัปเดตเอกสารประกอบ
- `style:` ปรับแต่ง UI / สไตล์โค้ด
- `refactor:` ปรับปรุงโครงสร้างโค้ด

---

## 👤 ผู้พัฒนา
- **Thanawat Pete** ([GitHub: thanawat-pete](https://github.com/thanawat-pete))
- License: MIT
