import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Feather,
  BookOpen,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Flame,
  Star,
} from 'lucide-react';
import { postService } from '../services/postService';
import { NovelCard } from '../components/novel/NovelCard';
import { ForumCard } from '../components/forum/ForumCard';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { categoryLabels } from '../components/common/Badge';

export const Home = () => {
  const [featuredNovels, setFeaturedNovels] = useState([]);
  const [shortStories, setShortStories] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [novelsRes, storiesRes, forumRes] = await Promise.all([
          postService.getPosts({ type: 'novel', limit: 6, sort: 'popular' }),
          postService.getPosts({ type: 'short_story', limit: 4, sort: 'latest' }),
          postService.getPosts({ type: 'forum', limit: 4, sort: 'latest' }),
        ]);

        setFeaturedNovels(novelsRes.posts || []);
        setShortStories(storiesRes.posts || []);
        setForumPosts(forumRes.posts || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = Object.entries(categoryLabels).slice(0, 7);

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>พื้นที่สร้างสรรค์ของนักเขียนและนักอ่านนิยาย</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            แบ่งปันจินตนาการ <br />
            <span className="bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent">
              รังสรรค์เรื่องราวไร้ขีดจำกัด
            </span>
          </h1>

          <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            StoryCraft เป็นชุมชนออนไลน์สำหรับนักเขียนนิยาย เรื่องสั้น และกระดานสนทนา
            ที่ให้คุณแต่งนิยาย เผยแพร่ผลงาน และแลกเปลี่ยนเคล็ดลับการเขียนได้อย่างอิสระ
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/explore">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-lg">
                <BookOpen className="h-5 w-5 mr-2" />
                สำรวจนิยายทั้งหมด
              </Button>
            </Link>
            <Link to="/create-post">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 font-bold">
                <Feather className="h-5 w-5 mr-2" />
                เริ่มเขียนเรื่องของคุณ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
            หมวดหมู่ยอดนิยม
          </h2>
          <Link to="/explore" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            ดูทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(([key, item]) => (
            <Link
              key={key}
              to={`/explore?category=${key}`}
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shrink-0 cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Novels Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Flame className="h-5 w-5 text-rose-500 mr-2" />
              นิยายยอดนิยม & มาแรง
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">ผลงานที่มีผู้อ่านและติดตามมากที่สุด</p>
          </div>
          <Link to="/explore?type=novel" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            ดูนิยายทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="กำลังโหลดนิยายแนะนำ..." />
        ) : featuredNovels.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">ยังไม่มีนิยายในระบบ มาร่วมเป็นคนแรกที่สร้างสรรค์เรื่องราว!</p>
            <Link to="/create-post" className="inline-block mt-3">
              <Button size="sm">เริ่มแต่งนิยายเลย</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNovels.map((novel) => (
              <NovelCard key={novel._id} post={novel} />
            ))}
          </div>
        )}
      </section>

      {/* Short Stories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              เรื่องสั้นตอนเดียวจบ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">อ่านจบไว เข้าถึงอารมณ์ได้ทันที</p>
          </div>
          <Link to="/explore?type=short_story" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            ดูเรื่องสั้นทั้งหมด <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="กำลังโหลดเรื่องสั้น..." />
        ) : shortStories.length === 0 ? (
          <p className="text-center py-6 text-sm text-slate-400">ยังไม่มีเรื่องสั้นในขณะนี้</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {shortStories.map((story) => (
              <NovelCard key={story._id} post={story} />
            ))}
          </div>
        )}
      </section>

      {/* Writer's Forum Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />
              กระทู้พูดคุย & สาระนักเขียน
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">แชร์ไอเดีย ถกประเด็นพล็อต และหาเพื่อนร่วมทาง</p>
          </div>
          <Link to="/forum" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            เข้าสู่เว็บบอร์ด <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="กำลังโหลดกระทู้..." />
        ) : forumPosts.length === 0 ? (
          <p className="text-center py-6 text-sm text-slate-400">ยังไม่มีกระทู้สนทนา</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {forumPosts.map((post) => (
              <ForumCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
