'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, removeToken } from '../lib/api';
import { usePosts } from '../hooks/usePosts';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

type User = { id: number; name: string; email: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { posts, setPosts, addPost, deletePost, updatePost } = usePosts();

  useEffect(() => {
    Promise.all([api.me(), api.getPosts()])
      .then(([me, fetchedPosts]) => {
        setUser(me);
        setPosts(fetchedPosts);
      })
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
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="mx-auto max-w-xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">{user?.name} さん</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            ログアウト
          </button>
        </div>

        <PostForm onPost={addPost} />
        <PostList
          posts={posts}
          currentUserId={user?.id ?? 0}
          onDelete={deletePost}
          onUpdate={updatePost}
        />
      </div>
    </div>
  );
}
