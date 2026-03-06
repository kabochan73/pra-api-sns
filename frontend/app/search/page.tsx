'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, removeToken } from '../lib/api';
import { usePosts } from '../hooks/usePosts';
import Header from '../components/Header';
import PostList from '../components/PostList';
import Footer from '../components/Footer';

type User = { id: number; name: string; email: string };
type SearchUser = { id: number; name: string };

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';

  const [user, setUser] = useState<User | null>(null);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { posts, setPosts, deletePost, updatePost, toggleLike } = usePosts();

  useEffect(() => {
    api.me().catch(() => {
      router.push('/login');
    });
  }, [router]);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    Promise.all([api.me(), api.search(q)])
      .then(([me, result]) => {
        setUser(me);
        setPosts(result.posts);
        setSearchUsers(result.users);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [q, router, setPosts]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      removeToken();
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header username={user?.name ?? ''} userId={user?.id ?? 0} onLogout={handleLogout} defaultQuery={q} />
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <button
            onClick={() => router.back()}
            className="text-sm text-zinc-400 hover:text-zinc-700 mb-4"
          >
            ← 戻る
          </button>
        <h2 className="mb-4 text-sm font-semibold text-zinc-500">
          「{q}」の検索結果
        </h2>

        {loading ? (
          <div className="text-sm text-zinc-400">検索中...</div>
        ) : (
          <>
            {searchUsers.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">ユーザー</h3>
                <div className="flex flex-col gap-2">
                  {searchUsers.map((u) => (
                    <Link
                      key={u.id}
                      href={`/profile/${u.id}`}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm hover:bg-zinc-50"
                    >
                      <span className="text-sm font-medium text-zinc-800">{u.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-400">投稿</h3>
              {posts.length === 0 ? (
                <p className="text-sm text-zinc-400">投稿が見つかりませんでした。</p>
              ) : (
                <PostList
                  posts={posts}
                  currentUserId={user?.id ?? 0}
                  onDelete={deletePost}
                  onUpdate={updatePost}
                  onLike={toggleLike}
                />
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
