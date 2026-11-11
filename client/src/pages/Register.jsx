import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feather, Lock, User, Mail, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    penName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    try {
      setLoading(true);
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        penName: formData.penName.trim() || formData.username.trim(),
        role: 'writer',
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md">
            <Feather className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            สมัครสมาชิกใหม่
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            สร้างบัญชีเพื่อเริ่มต้นสร้างสรรค์ผลงานของคุณบน StoryCraft
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/40">
              {error}
            </div>
          )}

          <Input
            label="ชื่อผู้ใช้ (Username)"
            id="username"
            name="username"
            icon={User}
            value={formData.username}
            onChange={handleChange}
            placeholder="สำหรับเข้าสู่ระบบ ภาษาอังกฤษ 3 ตัวอักษรขึ้นไป"
            required
          />

          <Input
            label="นามปากกา (Pen Name)"
            id="penName"
            name="penName"
            icon={PenTool}
            value={formData.penName}
            onChange={handleChange}
            placeholder="ชื่อที่ใช้แสดงต่อผู้อ่าน (ภาษาไทยได้)"
          />

          <Input
            label="อีเมล"
            id="email"
            name="email"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />

          <Input
            label="รหัสผ่าน"
            id="password"
            name="password"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            placeholder="อย่างน้อย 6 ตัวอักษร"
            required
          />

          <Input
            label="ยืนยันรหัสผ่าน"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            required
          />

          <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
            ลงทะเบียนสร้างบัญชี
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            มีบัญชีสมาชิกอยู่แล้ว?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
