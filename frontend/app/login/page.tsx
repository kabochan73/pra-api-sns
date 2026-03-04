'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(form);
      setToken(res.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">ログイン</h1>
        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">メールアドレス</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">パスワード</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          アカウントをお持ちでないですか？{' '}
          <Link href="/register" className="font-medium text-zinc-900 hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
