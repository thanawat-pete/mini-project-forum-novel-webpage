import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, BookOpen, Layers } from 'lucide-react';
import { CategoryBadge, ContentTypeBadge, StatusBadge } from '../common/Badge';

export const NovelCard = ({ post }) => {
  const authorName = post.author?.penName || post.author?.username || 'นิรนาม';
  const cover = post.coverImage || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80`;

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Cover Image Container */}
      <Link to={`/novels/${post._id}`} className="relative block aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={cover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <ContentTypeBadge type={post.contentType} />
          <CategoryBadge category={post.category} />
        </div>
        {post.contentType === 'novel' && (
          <div className="absolute bottom-3 right-3">
            <StatusBadge status={post.status} />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Link to={`/novels/${post._id}`}>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.synopsis}
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            to={`/author/${post.author?._id}`}
            className="flex items-center space-x-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-[120px]"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center font-bold text-3xs shrink-0">
              {authorName[0]?.toUpperCase()}
            </div>
            <span className="truncate">{authorName}</span>
          </Link>

          <div className="flex items-center space-x-3 shrink-0">
            {post.contentType === 'novel' && (
              <span className="flex items-center" title="จำนวนตอน">
                <Layers className="h-3.5 w-3.5 mr-1 text-slate-400" />
                {post.chaptersCount || 0}
              </span>
            )}
            <span className="flex items-center" title="ยอดเข้าชม">
              <Eye className="h-3.5 w-3.5 mr-1 text-slate-400" />
              {post.views || 0}
            </span>
            <span className="flex items-center" title="ยอดถูกใจ">
              <Heart className="h-3.5 w-3.5 mr-1 text-rose-500 fill-rose-500" />
              {post.likes?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
