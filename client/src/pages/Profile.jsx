import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  PenTool,
  Bookmark,
  BookOpen,
  Edit,
  PlusCircle,
  Save,
  Layers,
  Heart,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { NovelCard } from '../components/novel/NovelCard';
import { ForumCard } from '../components/forum/ForumCard';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'works';

  const [myPosts, setMyPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    penName: user?.penName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (user) {
          const [postsRes, meRes] = await Promise.all([
            postService.getPosts({ author: user.id || user._id, limit: 50 }),
            authService.getMe(),
          ]);
          setMyPosts(postsRes.posts || []);
          setBookmarks(meRes.user?.bookmarks || []);
          setEditForm({
            penName: meRes.user?.penName || '',
            bio: meRes.user?.bio || '',
            avatar: meRes.user?.avatar || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMsg({ type: '', text: '' });
      const res = await authService.updateProfile(editForm);
      updateProfileState(res.user);
      setProfileMsg({ type: 'success', text: 'บันทึกข้อมูลโปรไฟล์สำเร็จ' });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'บันทึกไม่สำเร็จ' });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-extrabold text-3xl shadow-md overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.penName} className="w-full h-full object-cover" />
            ) : (
              (user?.penName || user?.username || 'U')[0].toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {user?.penName || user?.username}
                </h1>
                <p className="text-xs text-slate-400 font-mono">@{user?.username} • {user?.email}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => setIsEditingProfile((prev) => !prev)}
              >
                {isEditingProfile ? 'ปิดฟอร์มแก้ไข' : 'แก้ไขโปรไฟล์'}
              </Button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {user?.bio || 'ยังไม่มีคำแนะนำตัว'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-500">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1.5 text-indigo-500" />
                เผยแพร่แล้ว {myPosts.length} ผลงาน
              </span>
              <span className="flex items-center">
                <Bookmark className="h-4 w-4 mr-1.5 text-amber-500" />
                คลังที่บันทึก {bookmarks.length} เรื่อง
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Section Collapse */}
        {isEditingProfile && (
          <form
            onSubmit={handleUpdateProfile}
            className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 max-w-xl animate-in fade-in duration-200"
          >
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              แก้ไขข้อมูลส่วนตัว
            </h3>

            {profileMsg.text && (
              <p
                className={`text-xs p-2.5 rounded-lg ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {profileMsg.text}
              </p>
            )}

            <Input
              label="นามปากกา (Pen Name)"
              id="penName"
              value={editForm.penName}
              onChange={(e) => setEditForm({ ...editForm, penName: e.target.value })}
              required
            />

            <Input
              label="URL รูปโปรไฟล์ (Avatar)"
              id="avatar"
              value={editForm.avatar}
              onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />

            <Textarea
              label="ประวัติย่อ / แนะนำตัวเอง"
              id="bio"
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditingProfile(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" size="sm" loading={savingProfile} icon={Save}>
                บันทึกโปรไฟล์
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSearchParams({ tab: 'works' })}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'works'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>ผลงานของฉัน ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'bookmarks' })}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>คลังที่บันทึกไว้ ({bookmarks.length})</span>
        </button>

        <div className="ml-auto">
          <Link to="/create-post">
            <Button size="sm" icon={PlusCircle}>
              สร้างผลงานใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner text="กำลังโหลด..." />
      ) : activeTab === 'works' ? (
        myPosts.length === 0 ? (
          <EmptyState
            title="คุณยังไม่ได้สร้างผลงานใดๆ"
            description="เริ่มต้นเขียนนิยายตอนแรก เรื่องสั้น หรือตั้งกระทู้แลกเปลี่ยนไอเดียได้เลย"
            actionText="เริ่มเขียนผลงานแรก"
            actionLink="/create-post"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPosts.map((post) =>
              post.contentType === 'forum' ? (
                <ForumCard key={post._id} post={post} />
              ) : (
                <NovelCard key={post._id} post={post} />
              )
            )}
          </div>
        )
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="ยังไม่มีผลงานในคลัง"
          description="เมื่อคุณพบผลงานที่น่าสนใจ กดปุ่ม 'เพิ่มเข้าคลัง' เพื่อเก็บไว้อ่านภายหลังได้ที่นี่"
          actionText="ไปสำรวจนิยาย"
          actionLink="/explore"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((post) => (
            <NovelCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
