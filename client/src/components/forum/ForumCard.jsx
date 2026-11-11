import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Heart, Pin, Clock } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';

export const ForumCard = ({ post }) => {
  const authorName = post.author?.penName || post.author?.username || 'นิรนาม';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1.5 flex-wrap">
            {post.isPinned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                <Pin className="h-3 w-3 mr-1" />
                ปักหมุด
              </span>
            )}
            <CategoryBadge category={post.category} />
            <span className="text-xs text-slate-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(post.createdAt).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
              })}
            </span>
          </div>

          <Link to={`/novels/${post._id}`}>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.synopsis}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <Link
          to={`/author/${post.author?._id}`}
          className="flex items-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center font-bold text-3xs">
            {authorName[0]?.toUpperCase()}
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">{authorName}</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="flex items-center" title="ยอดเข้าชม">
            <Eye className="h-3.5 w-3.5 mr-1 text-slate-400" />
            {post.views || 0}
          </span>
          <span className="flex items-center" title="ถูกใจ">
            <Heart className="h-3.5 w-3.5 mr-1 text-rose-500 fill-rose-500" />
            {post.likes?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};
