import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  Bookmark,
  Eye,
  Calendar,
  Layers,
  Edit,
  Trash2,
  PlusCircle,
  Share2,
  User,
} from 'lucide-react';
import { postService } from '../services/postService';
import { chapterService } from '../services/chapterService';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { CategoryBadge, ContentTypeBadge, StatusBadge } from '../components/common/Badge';
import { ChapterList } from '../components/novel/ChapterList';
import { CommentSection } from '../components/forum/CommentSection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const NovelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfileState } = useAuth();

  const [post, setPost] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const res = await postService.getPostById(id);
        setPost(res.post);
        setChapters(res.chapters || []);
        setLikesCount(res.post.likes?.length || 0);

        if (user) {
          setIsLiked(res.post.likes?.some((uId) => uId === user.id || uId === user._id));
          setIsBookmarked(user.bookmarks?.some((b) => (b._id || b) === id));
        }
      } catch (err) {
        console.error('Error fetching novel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id, user]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await postService.toggleLike(id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await postService.toggleBookmark(id);
      setIsBookmarked(res.isBookmarked);
      if (res.isBookmarked) {
        updateProfileState({ bookmarks: [...(user.bookmarks || []), id] });
      } else {
        updateProfileState({
          bookmarks: (user.bookmarks || []).filter((b) => (b._id || b) !== id),
        });
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('คุณต้องการลบผลงานนี้และข้อมูลตอน/ความคิดเห็นทั้งหมดใช่หรือไม่? ไม่สามารถกู้คืนได้')) {
      return;
    }
    try {
      await postService.deletePost(id);
      alert('ลบผลงานเรียบร้อยแล้ว');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'ลบผลงานไม่สำเร็จ');
    }
  };

  const handleDeleteChapter = async (chapterId, title) => {
    if (!window.confirm(`ต้องการลบตอน "${title}" ใช่หรือไม่?`)) return;
    try {
      await chapterService.deleteChapter(chapterId);
      setChapters(chapters.filter((c) => c._id !== chapterId));
      setPost((prev) => ({ ...prev, chaptersCount: Math.max(0, (prev.chaptersCount || 1) - 1) }));
    } catch (err) {
      alert(err.response?.data?.message || 'ลบตอนไม่สำเร็จ');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="กำลังโหลดเนื้อหา..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">ไม่พบผลงานนี้</h2>
        <p className="text-sm text-slate-500 mt-2">ผลงานอาจถูกลบหรือลิงก์ไม่ถูกต้อง</p>
        <Link to="/" className="inline-block mt-4">
          <Button>กลับหน้าแรก</Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.id === post.author?._id || user._id === post.author?._id || user.role === 'admin');
  const cover = post.coverImage || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80`;
  const authorName = post.author?.penName || post.author?.username || 'นิรนาม';
  const firstChapterId = chapters[0]?._id;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Novel Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Cover Image */}
          <div className="sm:w-56 shrink-0">
            <div className="aspect-3/4 rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800">
              <img src={cover} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <ContentTypeBadge type={post.contentType} />
                <CategoryBadge category={post.category} />
                {post.contentType === 'novel' && <StatusBadge status={post.status} />}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {post.title}
              </h1>

              {/* Author */}
              <div className="flex items-center space-x-2 mt-3 text-sm">
                <span className="text-slate-400">ผู้แต่ง:</span>
                <Link
                  to={`/author/${post.author?._id}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 text-3xs font-bold flex items-center justify-center">
                    {authorName[0]?.toUpperCase()}
                  </div>
                  <span>{authorName}</span>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                {post.contentType === 'novel' && (
                  <span className="flex items-center">
                    <Layers className="h-4 w-4 mr-1.5 text-indigo-500" />
                    {chapters.length} ตอน
                  </span>
                )}
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1.5 text-slate-400" />
                  {post.views} ยอดเข้าชม
                </span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1.5 text-rose-500 fill-rose-500" />
                  {likesCount} ถูกใจ
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
                  {new Date(post.createdAt).toLocaleDateString('th-TH')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {post.contentType === 'novel' ? (
                firstChapterId ? (
                  <Link to={`/read/${firstChapterId}`}>
                    <Button size="md" icon={BookOpen}>
                      เริ่มอ่านตอนแรก
                    </Button>
                  </Link>
                ) : (
                  <Button size="md" disabled icon={BookOpen}>
                    ยังไม่มีตอนให้อ่าน
                  </Button>
                )
              ) : null}

              {/* Like Button */}
              <Button
                variant={isLiked ? 'danger' : 'outline'}
                size="md"
                onClick={handleToggleLike}
                icon={Heart}
              >
                {isLiked ? 'ถูกใจแล้ว' : 'กดถูกใจ'} ({likesCount})
              </Button>

              {/* Bookmark Button */}
              <Button
                variant={isBookmarked ? 'secondary' : 'outline'}
                size="md"
                onClick={handleToggleBookmark}
                icon={Bookmark}
              >
                {isBookmarked ? 'บันทึกแล้ว' : 'เพิ่มเข้าคลัง'}
              </Button>

              {/* Author Actions */}
              {isAuthor && (
                <div className="flex items-center space-x-2 ml-auto">
                  <Link to={`/edit-post/${post._id}`}>
                    <Button variant="outline" size="md" icon={Edit}>
                      แก้ไข
                    </Button>
                  </Link>
                  <Button variant="ghost" size="md" onClick={handleDeletePost} className="text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">
          {post.contentType === 'forum' ? 'รายละเอียดกระทู้' : 'คำโปรย / เรื่องย่อ'}
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {post.synopsis}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* If Short Story or Forum: Render Content Directly */}
      {(post.contentType === 'short_story' || post.contentType === 'forum') && post.content && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-2xs">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            {post.contentType === 'short_story' ? 'เนื้อเรื่องฉบับเต็ม' : 'เนื้อหาการสนทนา'}
          </h3>
          <div className="prose dark:prose-invert max-w-none text-base text-slate-800 dark:text-slate-200 leading-loose whitespace-pre-line">
            {post.content}
          </div>
        </div>
      )}

      {/* If Novel: Render Chapters List */}
      {post.contentType === 'novel' && (
        <ChapterList
          novelId={post._id}
          chapters={chapters}
          isAuthor={isAuthor}
          onAddChapter={() => navigate(`/novels/${post._id}/add-chapter`)}
          onDeleteChapter={handleDeleteChapter}
        />
      )}

      {/* Comments Section */}
      <CommentSection postId={post._id} postAuthorId={post.author?._id} />
    </div>
  );
};
