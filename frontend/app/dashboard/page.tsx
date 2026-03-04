'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, removeToken } from '../lib/api';

type User = { id: number; name: string; email: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      removeToken();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">ダッシュボード</h1>
        {user && (
          <div className="mb-6 mt-4 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
            <p><span className="font-medium">名前：</span>{user.name}</p>
            <p className="mt-1"><span className="font-medium">メール：</span>{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
