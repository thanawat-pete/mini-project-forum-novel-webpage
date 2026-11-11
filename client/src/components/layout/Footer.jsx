import React from 'react';
import { Feather, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Feather className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">StoryCraft</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              คอมมูนิตี้สำหรับนักเขียนและนักอ่านนิยาย เรื่องสั้น และแลกเปลี่ยนความรู้เรื่องการเขียน เพื่อสร้างสรรค์ผลงานคุณภาพไปด้วยกัน
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">เมนูลัด</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">หน้าแรก</Link>
              </li>
              <li>
                <Link to="/explore?type=novel" className="hover:text-indigo-600 dark:hover:text-indigo-400">นิยายทั้งหมด</Link>
              </li>
              <li>
                <Link to="/explore?type=short_story" className="hover:text-indigo-600 dark:hover:text-indigo-400">เรื่องสั้น</Link>
              </li>
              <li>
                <Link to="/forum" className="hover:text-indigo-600 dark:hover:text-indigo-400">กระทู้สนทนา</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">หมวดหมู่ยอดฮิต</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/explore?category=fantasy" className="hover:text-indigo-600 dark:hover:text-indigo-400">แฟนตาซี</Link>
              </li>
              <li>
                <Link to="/explore?category=romance" className="hover:text-indigo-600 dark:hover:text-indigo-400">โรแมนติก</Link>
              </li>
              <li>
                <Link to="/explore?category=mystery" className="hover:text-indigo-600 dark:hover:text-indigo-400">สืบสวนสอบสวน</Link>
              </li>
              <li>
                <Link to="/explore?category=writer_talk" className="hover:text-indigo-600 dark:hover:text-indigo-400">แลกเปลี่ยนเทคนิค</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} StoryCraft. สงวนลิขสิทธิ์ทั้งหมด</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 mx-1 fill-rose-500" /> for passionate writers
          </p>
        </div>
      </div>
    </footer>
  );
};
