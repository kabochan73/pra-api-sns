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
  const { posts, setPosts, deletePost, updatePost, toggleLike } = usePosts();

  useEffect(() => {
    Promise.all([api.me(), api.getPosts()])
      .then(([me, fetchedPosts]) => {
        setUser(me);
        setPosts(fetchedPosts);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router, setPosts]);

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
      </div>
      <Footer />
    </div>
  );
}
