import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import { NovelCard } from '../components/novel/NovelCard';
import { ForumCard } from '../components/forum/ForumCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AuthorProfile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const res = await authService.getAuthorProfile(id);
        setAuthor(res.author);
        setPosts(res.posts || []);
      } catch (err) {
        console.error('Error fetching author profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="กำลังโหลดข้อมูลนักเขียน..." />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">ไม่พบข้อมูลนักเขียนท่านนี้</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <Link
        to="/"
        className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        กลับหน้าแรก
      </Link>

      {/* Author Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-extrabold text-3xl shadow-md overflow-hidden shrink-0">
            {author.avatar ? (
              <img src={author.avatar} alt={author.penName} className="w-full h-full object-cover" />
            ) : (
              (author.penName || author.username || 'A')[0].toUpperCase()
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {author.penName || author.username}
            </h1>
            <p className="text-xs text-slate-400 font-mono">@{author.username}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {author.bio || 'นักเดินทางแห่งโลกตัวอักษร'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-500">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-indigo-500" />
                ผลงานทั้งหมด {posts.length} เรื่อง
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                สมาชิกตั้งแต่ {new Date(author.createdAt).toLocaleDateString('th-TH')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Works */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          ผลงานของ {author.penName || author.username}
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">นักเขียนท่านนี้ยังไม่มีผลงานที่เผยแพร่</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) =>
              post.contentType === 'forum' ? (
                <ForumCard key={post._id} post={post} />
              ) : (
                <NovelCard key={post._id} post={post} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
