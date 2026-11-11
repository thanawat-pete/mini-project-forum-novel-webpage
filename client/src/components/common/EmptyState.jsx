import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'ไม่พบข้อมูล',
  description = 'ยังไม่มีเนื้อหาในหมวดหมู่นี้ หรือลองค้นหาด้วยคำอื่น',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs my-6">
      <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
      {(actionText && (actionLink || onAction)) && (
        <div className="mt-6">
          {actionLink ? (
            <Link to={actionLink}>
              <Button>{actionText}</Button>
            </Link>
          ) : (
            <Button onClick={onAction}>{actionText}</Button>
          )}
        </div>
      )}
    </div>
  );
};
