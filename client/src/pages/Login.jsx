import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Feather, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Login = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credential || !password) {
      setError('กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      await login(credential, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบข้อมูล');
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
            ยินดีต้อนรับกลับสู่ StoryCraft
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            เข้าสู่ระบบเพื่อจัดการผลงาน อ่านนิยาย และพูดคุยกับเพื่อนนักเขียน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/40">
              {error}
            </div>
          )}

          <Input
            label="ชื่อผู้ใช้ หรือ อีเมล"
            id="credential"
            type="text"
            icon={User}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="เช่น thanawat หรือ user@example.com"
            required
          />

          <Input
            label="รหัสผ่าน"
            id="password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            เข้าสู่ระบบ
          </Button>

          <p className="text-center text-xs text-slate-500 pt-2">
            ยังไม่มีบัญชีสมาชิก?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              สมัครสมาชิกฟรี
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
