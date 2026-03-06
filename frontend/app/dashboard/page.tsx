'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, removeToken } from '../lib/api';
import { usePosts } from '../hooks/usePosts';
import PostList from '../components/PostList';
import PostSkeleton from '../components/PostSkeleton';
import Header from '../components/Header';
import Footer from '../components/Footer';

type User = { id: number; name: string; email: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const { posts, setPosts, deletePost, updatePost, toggleLike } = usePosts();

  useEffect(() => {
    setLoading(true);
    Promise.all([api.me(), api.getPosts(page)])
      .then(([me, result]) => {
        setUser(me);
        setPosts(result.data);
        setLastPage(result.last_page);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [page, router, setPosts]);

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
      <div className="min-h-screen bg-zinc-50 py-8">
        <div className="mx-auto max-w-xl px-4">
          <div className="mb-6 flex items-center justify-between animate-pulse">
            <div className="h-6 w-32 rounded bg-zinc-200" />
            <div className="h-8 w-20 rounded-lg bg-zinc-200" />
          </div>
          <div className="mb-4 h-24 rounded-xl bg-white shadow animate-pulse" />
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header username={user?.name ?? ''} userId={user?.id ?? 0} onLogout={handleLogout} />
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <PostList
          posts={posts}
          currentUserId={user?.id ?? 0}
          onDelete={deletePost}
          onUpdate={updatePost}
          onLike={toggleLike}
        />
        {lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            <span className="text-sm text-zinc-400">{page} / {lastPage}</span>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="rounded-lg border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
