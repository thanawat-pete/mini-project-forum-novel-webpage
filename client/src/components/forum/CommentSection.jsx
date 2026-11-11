import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Trash2, Send, CornerDownRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';

export const CommentSection = ({ postId, chapterId = null, postAuthorId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentService.getComments(postId, chapterId);
      setComments(res.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, chapterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      const res = await commentService.addComment({
        postId,
        chapterId,
        content: newComment.trim(),
      });
      setComments([res.comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'ส่งความคิดเห็นไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!isAuthenticated) return;
    try {
      const res = await commentService.toggleLikeComment(commentId);
      setComments(
        comments.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              likes: res.isLiked
                ? [...c.likes, user.id]
                : c.likes.filter((id) => id !== user.id),
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?')) return;
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'ลบความคิดเห็นไม่สำเร็จ');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs">
      <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
        <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          ความคิดเห็น ({comments.length})
        </h3>
      </div>

      {/* Input Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center shrink-0">
              {(user?.penName || user?.username || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="แสดงความคิดเห็น หรือให้กำลังใจนักเขียน..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors"
                required
              />
              {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
              <div className="mt-2 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  loading={submitting}
                  icon={Send}
                  disabled={!newComment.trim()}
                >
                  ส่งความคิดเห็น
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center text-sm mb-6 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-slate-600 dark:text-slate-300 mb-2">
            เข้าสู่ระบบเพื่อร่วมแสดงความคิดเห็นและให้กำลังใจนักเขียน
          </p>
          <Link to="/login">
            <Button size="sm" variant="primary">
              เข้าสู่ระบบ
            </Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <LoadingSpinner text="กำลังโหลดความคิดเห็น..." size="sm" />
      ) : comments.length === 0 ? (
        <p className="text-center py-6 text-sm text-slate-400">
          ยังไม่มีความคิดเห็น เป็นคนแรกที่เริ่มพูดคุยกันเลย!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const author = c.author || {};
            const isAuthor = author._id === postAuthorId;
            const isOwner = user && (user.id === author._id || user._id === author._id || user.role === 'admin');
            const isLiked = user && c.likes?.includes(user.id || user._id);

            return (
              <div
                key={c._id}
                className={`p-4 rounded-xl border transition-colors ${
                  isAuthor
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {(author.penName || author.username || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                          {author.penName || author.username || 'สมาชิก'}
                        </span>
                        {isAuthor && (
                          <span className="px-1.5 py-0.5 rounded text-3xs font-bold bg-indigo-600 text-white">
                            ผู้แต่ง
                          </span>
                        )}
                      </div>
                      <span className="text-3xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                      title="ลบความคิดเห็น"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {c.content}
                </p>

                <div className="mt-2.5 flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => handleToggleLike(c._id)}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      isLiked
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                        : 'text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{c.likes?.length || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
