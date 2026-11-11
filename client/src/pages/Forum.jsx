import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, PlusCircle, Search } from 'lucide-react';
import { postService } from '../services/postService';
import { ForumCard } from '../components/forum/ForumCard';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { categoryLabels } from '../components/common/Badge';

export const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      const params = {
        type: 'forum',
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: search || undefined,
        limit: 20,
      };
      const res = await postService.getPosts(params);
      setPosts(res.posts || []);
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumPosts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchForumPosts();
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <MessageSquare className="h-7 w-7 text-purple-600 mr-2.5" />
            กระทู้นักเขียน & ชุมชนนักเล่าเรื่อง
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            แลกเปลี่ยนเทคนิคการเขียน ค้นหาแรงบันดาลใจ และถาม-ตอบทุกข้อสงสัย
          </p>
        </div>

        <Link to="/create-post">
          <Button size="md" icon={PlusCircle}>
            ตั้งกระทู้ใหม่
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหากระทู้..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" size="sm">
            ค้นหา
          </Button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            ทุกหัวข้อ
          </button>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                selectedCategory === k
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <LoadingSpinner text="กำลังโหลดกระทู้..." />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="ยังไม่มีกระทู้ในหมวดนี้"
          description="มาร่วมเปิดประเด็นสนทนา แลกเปลี่ยนความคิดเห็นเป็นคนแรกกันเถอะ"
          actionText="ตั้งกระทู้แรกเลย"
          actionLink="/create-post"
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <ForumCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
