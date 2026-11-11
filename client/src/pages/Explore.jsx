import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { postService } from '../services/postService';
import { NovelCard } from '../components/novel/NovelCard';
import { ForumCard } from '../components/forum/ForumCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { categoryLabels } from '../components/common/Badge';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const currentType = searchParams.get('type') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentSearch = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = {
          type: currentType || undefined,
          category: currentCategory !== 'all' ? currentCategory : undefined,
          search: currentSearch || undefined,
          sort: currentSort,
          page: currentPage,
          limit: 12,
        };
        const res = await postService.getPosts(params);
        setPosts(res.posts || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error('Error fetching explore posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentType, currentCategory, currentSort, currentSearch, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const types = [
    { key: '', label: 'ทั้งหมด' },
    { key: 'novel', label: 'นิยายขนาดยาว' },
    { key: 'short_story', label: 'เรื่องสั้น' },
    { key: 'forum', label: 'กระทู้สนทนา' },
  ];

  const sortOptions = [
    { key: 'latest', label: 'ผลงานล่าสุด' },
    { key: 'popular', label: 'ยอดนิยมสูงสุด' },
    { key: 'views', label: 'ยอดเข้าชมมากที่สุด' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          สำรวจคลังผลงาน & คอมมูนิตี้
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          ค้นพบนิยาย เรื่องสั้น และกระทู้คุณภาพจากเหล่านักเขียน (ทั้งหมด {totalCount} รายการ)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ค้นหาชื่อเรื่อง, คำโปรย, แท็ก หรือชื่อนักเขียน..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            ค้นหา
          </button>
        </form>

        {/* Content Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => updateParam('type', t.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentType === t.key
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Categories & Sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">หมวดหมู่:</span>
            <select
              value={currentCategory}
              onChange={(e) => updateParam('category', e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-1.5 px-3 text-xs focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">ทุกหมวดหมู่</option>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">เรียงตาม:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-1.5 px-3 text-xs focus:ring-indigo-500 cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <LoadingSpinner text="กำลังโหลดผลงาน..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="ไม่พบผลงานที่ตรงกับเงื่อนไข"
          description="ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นพบผลงานใหม่ๆ"
          actionText="ล้างตัวกรองทั้งหมด"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) =>
              post.contentType === 'forum' ? (
                <ForumCard key={post._id} post={post} />
              ) : (
                <NovelCard key={post._id} post={post} />
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-12">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam('page', String(currentPage - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ก่อนหน้า
              </button>
              <span className="text-xs text-slate-500 px-3">
                หน้า {currentPage} จาก {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam('page', String(currentPage + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
