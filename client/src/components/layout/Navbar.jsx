import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Feather,
  MessageSquare,
  Compass,
  Sun,
  Moon,
  PlusCircle,
  User,
  LogOut,
  Bookmark,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'สำรวจผลงาน', path: '/explore' },
    { name: 'กระทู้นักเขียน', path: '/forum' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <Feather className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  StoryCraft
                </span>
                <span className="hidden sm:inline-block ml-1 text-2xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-medium">
                  Forum & Novel
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/create-post">
                  <Button variant="primary" size="sm" icon={PlusCircle}>
                    เขียนเรื่องใหม่
                  </Button>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.penName || user.username} className="w-full h-full object-cover" />
                      ) : (
                        (user?.penName || user?.username || 'U')[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {user?.penName || user?.username}
                    </span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400">เข้าสู่ระบบด้วยชื่อ</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {user?.penName || user?.username}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="h-4 w-4 mr-2.5 text-slate-400" />
                        โปรไฟล์ของฉัน
                      </Link>

                      <Link
                        to="/profile?tab=bookmarks"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Bookmark className="h-4 w-4 mr-2.5 text-slate-400" />
                        คลังที่บันทึกไว้
                      </Link>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2.5" />
                        ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/create-post"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <Button variant="primary" className="w-full" icon={PlusCircle}>
                    เขียนเรื่องใหม่
                  </Button>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 font-medium"
                >
                  โปรไฟล์ ({user?.penName || user?.username})
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 font-medium"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
