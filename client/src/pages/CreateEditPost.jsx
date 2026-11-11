import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Feather, Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { postService } from '../services/postService';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { categoryLabels } from '../components/common/Badge';

export const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    synopsis: '',
    coverImage: '',
    contentType: 'novel',
    category: 'fantasy',
    tags: '',
    content: '',
    status: 'ongoing',
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const res = await postService.getPostById(id);
          const p = res.post;
          setFormData({
            title: p.title || '',
            synopsis: p.synopsis || '',
            coverImage: p.coverImage || '',
            contentType: p.contentType || 'novel',
            category: p.category || 'fantasy',
            tags: (p.tags || []).join(', '),
            content: p.content || '',
            status: p.status || 'ongoing',
          });
        } catch (err) {
          setError('โหลดข้อมูลไม่สำเร็จ');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('กรุณาระบุชื่อเรื่อง');
      return;
    }

    if (!formData.synopsis.trim()) {
      setError('กรุณาระบุคำโปรยหรือเรื่องย่อ');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await postService.updatePost(id, payload);
        navigate(`/novels/${id}`);
      } else {
        const res = await postService.createPost(payload);
        navigate(`/novels/${res.post._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            ย้อนกลับ
          </button>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <Feather className="h-6 w-6 text-indigo-600 mr-2" />
            {isEditing ? 'แก้ไขผลงาน' : 'สร้างสรรค์ผลงานใหม่'}
          </h1>
          <p className="text-xs text-slate-500">
            {formData.contentType === 'novel'
              ? 'นิยายหลายตอน: เริ่มจากสร้างหน้านิยาย จากนั้นเพิ่มตอนย่อยได้ไม่จำกัด'
              : formData.contentType === 'short_story'
              ? 'เรื่องสั้น: อ่านจบในหน้าเดียว พร้อมบทสรุป'
              : 'กระทู้: สนทนา ถาม-ตอบ หรือแลกเปลี่ยนสาระนักเขียน'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-sm border border-rose-200 dark:border-rose-900/40">
            {error}
          </div>
        )}

        {/* Content Type Picker (Disabled if editing) */}
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ประเภทผลงาน <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'novel', title: 'นิยายขนาดยาว', desc: 'มีสารบัญแบ่งตอน' },
                { key: 'short_story', title: 'เรื่องสั้น', desc: 'จบในหน้าเดียว' },
                { key: 'forum', title: 'กระทู้สนทนา', desc: 'เปิดประเด็นพูดคุย' },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, contentType: t.key }))}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    formData.contentType === t.key
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-bold">{t.title}</p>
                  <p className="text-2xs opacity-75 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title */}
        <Input
          label={formData.contentType === 'forum' ? 'หัวข้อกระทู้' : 'ชื่อเรื่อง'}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="เช่น มหาศึกราชันย์แดนเหมันต์ หรือ เคล็ดลับการวางพล็อตนิยาย..."
          required
        />

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              หมวดหมู่ <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm focus:ring-indigo-500"
            >
              {Object.entries(categoryLabels).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {formData.contentType === 'novel' && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                สถานะผลงาน
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-sm focus:ring-indigo-500"
              >
                <option value="ongoing">กำลังแต่ง (Ongoing)</option>
                <option value="completed">จบแล้ว (Completed)</option>
                <option value="hiatus">พักเรื่อง (Hiatus)</option>
              </select>
            </div>
          )}
        </div>

        {/* Cover Image URL */}
        <div>
          <Input
            label="URL ภาพปก (ไม่บังคับ - จะมีภาพปกตั้งต้นให้)"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg"
            icon={ImageIcon}
          />
          {formData.coverImage && (
            <div className="mt-2 w-32 aspect-3/4 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
              <img
                src={formData.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Synopsis */}
        <Textarea
          label={formData.contentType === 'forum' ? 'รายละเอียดเกริ่นนำ' : 'คำโปรย / เรื่องย่อ'}
          id="synopsis"
          name="synopsis"
          rows={4}
          value={formData.synopsis}
          onChange={handleChange}
          placeholder="แนะนำเนื้อเรื่องย่อๆ ดึงดูดความสนใจผู้อ่าน..."
          required
        />

        {/* Full content if short story or forum */}
        {(formData.contentType === 'short_story' || formData.contentType === 'forum') && (
          <Textarea
            label={formData.contentType === 'short_story' ? 'เนื้อเรื่องฉบับเต็ม' : 'เนื้อหาการสนทนา'}
            id="content"
            name="content"
            rows={10}
            value={formData.content}
            onChange={handleChange}
            placeholder="พิมพ์เนื้อหาทั้งหมดที่นี่..."
            required
          />
        )}

        {/* Tags */}
        <Input
          label="แท็ก (คั่นด้วยเครื่องหมายจุลภาค ,)"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="แฟนตาซี, เวทมนตร์, ระบบ, พระเอกเก่ง"
        />

        {/* Submit Button */}
        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ยกเลิก
          </Button>
          <Button type="submit" loading={saving} icon={Save}>
            {isEditing ? 'บันทึกการแก้ไข' : 'เผยแพร่ผลงาน'}
          </Button>
        </div>
      </form>
    </div>
  );
};
