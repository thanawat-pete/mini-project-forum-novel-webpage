import React from 'react';

export const categoryLabels = {
  fantasy: { label: 'แฟนตาซี', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' },
  romance: { label: 'โรแมนติก', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
  mystery: { label: 'สืบสวน', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  scifi: { label: 'ไซไฟ', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' },
  horror: { label: 'สยองขวัญ', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
  action: { label: 'แอ็กชัน', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' },
  slice_of_life: { label: 'ชีวิตประจำวัน', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  writer_talk: { label: 'สาระนักเขียน', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  general: { label: 'สัพเพเหระ', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

export const contentTypeLabels = {
  novel: { label: 'นิยาย', color: 'bg-blue-500 text-white' },
  short_story: { label: 'เรื่องสั้น', color: 'bg-emerald-500 text-white' },
  forum: { label: 'กระทู้', color: 'bg-purple-500 text-white' },
};

export const statusLabels = {
  ongoing: { label: 'ยังไม่จบ', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  completed: { label: 'จบแล้ว', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  hiatus: { label: 'พักเรื่อง', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
};

export const CategoryBadge = ({ category, className = '' }) => {
  const item = categoryLabels[category] || { label: category, color: 'bg-slate-100 text-slate-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color} ${className}`}>
      {item.label}
    </span>
  );
};

export const ContentTypeBadge = ({ type, className = '' }) => {
  const item = contentTypeLabels[type] || { label: type, color: 'bg-slate-500 text-white' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold shadow-xs ${item.color} ${className}`}>
      {item.label}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const item = statusLabels[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.color} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {item.label}
    </span>
  );
};
