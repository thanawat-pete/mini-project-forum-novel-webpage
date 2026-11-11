import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Save, ArrowLeft } from 'lucide-react';
import { chapterService } from '../services/chapterService';
import { postService } from '../services/postService';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AddEditChapter = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(chapterId);

  const [novel, setNovel] = useState(null);
  const [formData, setFormData] = useState({
    chapterNumber: '',
    title: '',
    content: '',
    authorNote: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (isEditing) {
          const res = await chapterService.getChapterById(chapterId);
          setFormData({
            chapterNumber: res.chapter.chapterNumber || '',
            title: res.chapter.title || '',
            content: res.chapter.content || '',
            authorNote: res.chapter.authorNote || '',
          });
          setNovel(res.chapter.post);
        } else if (novelId) {
          const res = await postService.getPostById(novelId);
          setNovel(res.post);
          setFormData((prev) => ({
            ...prev,
            chapterNumber: (res.chapters?.length || 0) + 1,
          }));
        }
      } catch (err) {
        setError('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [novelId, chapterId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('กรุณาระบุชื่อตอน');
      return;
    }

    if (!formData.content.trim()) {
      setError('กรุณาพิมพ์เนื้อหาของตอน');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await chapterService.updateChapter(chapterId, formData);
        navigate(`/read/${chapterId}`);
      } else {
        const res = await chapterService.addChapter({
          postId: novelId,
          ...formData,
        });
        navigate(`/novels/${novelId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'บันทึกตอนไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="กำลังโหลด..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          ย้อนกลับ
        </button>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          {isEditing ? 'แก้ไขตอน' : `เพิ่มตอนใหม่: ${novel?.title || ''}`}
        </h1>
        <p className="text-xs text-slate-500">
          เนื้อหาจะถูกจัดรูปแบบให้อ่านง่ายสำหรับผู้ติดตาม
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm border border-rose-200 dark:border-rose-900/40">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-1">
            <Input
              label="ลำดับตอนที่"
              id="chapterNumber"
              name="chapterNumber"
              type="number"
              value={formData.chapterNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              label="ชื่อตอน"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น จุดเริ่มต้นของการเดินทาง..."
              required
            />
          </div>
        </div>

        {/* Content */}
        <Textarea
          label="เนื้อหาของตอนนี้"
          id="content"
          name="content"
          rows={16}
          value={formData.content}
          onChange={handleChange}
          placeholder="พิมพ์หรือวางเนื้อหานิยายที่นี่..."
          required
        />

        {/* Author Note */}
        <Textarea
          label="ข้อความจากนักเขียน (คุยท้ายตอน - ไม่บังคับ)"
          id="authorNote"
          name="authorNote"
          rows={3}
          value={formData.authorNote}
          onChange={handleChange}
          placeholder="ทักทายผู้อ่าน ขอความคิดเห็น หรือแจ้งกำหนดการลงตอนถัดไป..."
        />

        {/* Submit */}
        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ยกเลิก
          </Button>
          <Button type="submit" loading={saving} icon={Save}>
            {isEditing ? 'บันทึกการแก้ไข' : 'เผยแพร่ตอนนี้'}
          </Button>
        </div>
      </form>
    </div>
  );
};
