import React from 'react';
import { Type, Sun, Moon, Coffee, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReaderToolbar = ({
  novelId,
  chapterNumber,
  navigation,
  readerSettings,
  updateReaderSettings,
}) => {
  const fontSizes = [
    { key: 'sm', label: 'เล็ก' },
    { key: 'base', label: 'ปกติ' },
    { key: 'lg', label: 'ใหญ่' },
    { key: 'xl', label: 'ใหญ่มาก' },
  ];

  const themes = [
    { key: 'light', label: 'สว่าง', icon: Sun, bg: 'bg-white text-slate-900 border-slate-300' },
    { key: 'sepia', label: 'ถนอมสายตา', icon: Coffee, bg: 'bg-[#f4ecd8] text-[#5b4636] border-[#e2d5b8]' },
    { key: 'dark', label: 'มืด', icon: Moon, bg: 'bg-slate-900 text-slate-100 border-slate-700' },
  ];

  return (
    <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 shadow-xs">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Navigation jump */}
        <div className="flex items-center space-x-2">
          {navigation?.prev ? (
            <Link
              to={`/read/${navigation.prev._id}`}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`ตอนก่อนหน้า: ${navigation.prev.title}`}
            >
              <ChevronLeft className="h-4 w-4 mr-0.5" />
              ตอนก่อน
            </Link>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4 mr-0.5" />
              ตอนก่อน
            </span>
          )}

          <Link
            to={`/novels/${novelId}`}
            className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="สารบัญ"
          >
            <List className="h-4 w-4 mr-1" />
            สารบัญ
          </Link>

          {navigation?.next ? (
            <Link
              to={`/read/${navigation.next._id}`}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`ตอนถัดไป: ${navigation.next.title}`}
            >
              ตอนต่อไป
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </Link>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed">
              ตอนต่อไป
              <ChevronRight className="h-4 w-4 ml-0.5" />
            </span>
          )}
        </div>

        {/* Reader customization: Theme and Font Size */}
        <div className="flex items-center space-x-4">
          {/* Theme colors */}
          <div className="flex items-center space-x-1">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => updateReaderSettings({ readerTheme: t.key })}
                  className={`p-1.5 rounded-md border text-3xs flex items-center space-x-1 cursor-pointer transition-transform ${
                    t.bg
                  } ${readerSettings.readerTheme === t.key ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-80 hover:opacity-100'}`}
                  title={`ธีม ${t.label}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          {/* Font size */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            <span className="px-2 text-slate-400">
              <Type className="h-3.5 w-3.5" />
            </span>
            {fontSizes.map((f) => (
              <button
                key={f.key}
                onClick={() => updateReaderSettings({ fontSize: f.key })}
                className={`px-2 py-1 rounded text-2xs cursor-pointer transition-colors ${
                  readerSettings.fontSize === f.key
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
