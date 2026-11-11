import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Heart, MessageSquare } from 'lucide-react';
import { chapterService } from '../services/chapterService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ReaderToolbar } from '../components/novel/ReaderToolbar';
import { CommentSection } from '../components/forum/CommentSection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';

export const ReadChapter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { readerSettings, updateReaderSettings } = useTheme();

  const [chapter, setChapter] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const res = await chapterService.getChapterById(id);
        setChapter(res.chapter);
        setNavigation(res.navigation);
        setLikesCount(res.chapter.likes?.length || 0);

        if (user) {
          setIsLiked(res.chapter.likes?.some((uId) => uId === user.id || uId === user._id));
        }
      } catch (err) {
        console.error('Error fetching chapter:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id, user]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await chapterService.toggleLikeChapter(id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error('Error toggling chapter like:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="กำลังเปิดหน้าอ่านนิยาย..." />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">ไม่พบเนื้อหาของตอนนี้</h2>
        <Link to="/" className="inline-block mt-4">
          <Button>กลับหน้าแรก</Button>
        </Link>
      </div>
    );
  }

  // Theme styling for reader container
  const themeStyles = {
    light: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#fbf7ed] text-[#433422] border-[#ecdcc3]',
    dark: 'bg-slate-900 text-slate-100 border-slate-800',
  };

  const fontSizeStyles = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-loose',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose',
  };

  const activeThemeClass = themeStyles[readerSettings.readerTheme] || themeStyles.light;
  const activeFontClass = fontSizeStyles[readerSettings.fontSize] || fontSizeStyles.lg;

  return (
    <div className="-mt-8 pb-20">
      {/* Sticky Reader Toolbar */}
      <ReaderToolbar
        novelId={chapter.post?._id}
        chapterNumber={chapter.chapterNumber}
        navigation={navigation}
        readerSettings={readerSettings}
        updateReaderSettings={updateReaderSettings}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Breadcrumb / Title Info */}
        <div className="text-center space-y-2">
          <Link
            to={`/novels/${chapter.post?._id}`}
            className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {chapter.post?.title}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            ตอนที่ {chapter.chapterNumber}: {chapter.title}
          </h1>
          <p className="text-xs text-slate-400">
            เผยแพร่เมื่อ: {new Date(chapter.createdAt).toLocaleDateString('th-TH')} • ยอดอ่าน {chapter.views} ครั้ง
          </p>
        </div>

        {/* Reader Paper / Container */}
        <div
          className={`rounded-3xl border shadow-sm p-6 sm:p-12 transition-colors duration-200 ${activeThemeClass}`}
        >
          <article
            className={`font-['Sarabun'] tracking-wide whitespace-pre-line text-justify select-text ${activeFontClass}`}
          >
            {chapter.content}
          </article>

          {/* Author Note if present */}
          {chapter.authorNote && (
            <div className="mt-12 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm">
              <span className="font-bold block mb-1 text-indigo-600 dark:text-indigo-400">
                💬 ข้อความจากนักเขียน:
              </span>
              <p className="opacity-90">{chapter.authorNote}</p>
            </div>
          )}

          {/* Chapter reaction */}
          <div className="mt-10 pt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            <Button
              variant={isLiked ? 'danger' : 'outline'}
              size="sm"
              icon={Heart}
              onClick={handleToggleLike}
            >
              {isLiked ? 'ถูกใจแล้ว' : 'ส่งกำลังใจ'} ({likesCount})
            </Button>

            <span className="text-xs opacity-70">
              นักเขียน: {chapter.post?.author?.penName || chapter.post?.author?.username}
            </span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4">
          {navigation?.prev ? (
            <Link to={`/read/${navigation.prev._id}`}>
              <Button variant="outline" size="md" icon={ChevronLeft}>
                ตอนก่อนหน้า
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          <Link to={`/novels/${chapter.post?._id}`}>
            <Button variant="secondary" size="md" icon={List}>
              สารบัญ
            </Button>
          </Link>

          {navigation?.next ? (
            <Link to={`/read/${navigation.next._id}`}>
              <Button size="md">
                ตอนต่อไป
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Chapter Comments */}
        <div className="pt-6">
          <CommentSection
            postId={chapter.post?._id}
            chapterId={chapter._id}
            postAuthorId={chapter.post?.author?._id}
          />
        </div>
      </div>
    </div>
  );
};
