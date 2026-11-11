import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, Calendar, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';

export const ChapterList = ({
  novelId,
  chapters = [],
  isAuthor = false,
  onAddChapter,
  onDeleteChapter,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            สารบัญตอน ({chapters.length} ตอน)
          </h3>
          <p className="text-xs text-slate-500">เลือกตอนเพื่อเริ่มอ่านเนื้อหา</p>
        </div>
        {isAuthor && (
          <Button
            size="sm"
            icon={PlusCircle}
            onClick={onAddChapter}
          >
            เพิ่มตอนใหม่
          </Button>
        )}
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">ยังไม่มีตอนที่เผยแพร่</p>
          {isAuthor && (
            <p className="text-xs text-indigo-500 mt-1 cursor-pointer" onClick={onAddChapter}>
              คลิกที่นี่เพื่อเริ่มเขียนตอนแรก
            </p>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {chapters.map((ch) => (
            <div
              key={ch._id}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-3 rounded-lg transition-colors group"
            >
              <Link
                to={`/read/${ch._id}`}
                className="flex items-center space-x-3 flex-1 min-w-0"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center">
                  #{ch.chapterNumber}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                    {ch.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-2xs text-slate-400 mt-0.5">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {ch.views || 0}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(ch.createdAt).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              </Link>

              {isAuthor && (
                <div className="flex items-center space-x-1 pl-2">
                  <Link to={`/edit-chapter/${ch._id}`}>
                    <button
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="แก้ไขตอนนี้"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => onDeleteChapter && onDeleteChapter(ch._id, ch.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="ลบตอนนี้"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
