import React from 'react';

export const LoadingSpinner = ({ text = 'กำลังโหลดข้อมูล...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className={`animate-spin rounded-full border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
};
