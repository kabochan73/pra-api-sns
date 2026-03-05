'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, removeToken } from '../lib/api';

type User = { id: number; name: string; email: string };
type Post = { id: number; content: string; created_at: string; user: { id: number; name: string } };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.me(), api.getPosts()])
      .then(([me, posts]) => {
        setUser(me);
        setPosts(posts);
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

  const handlePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setPosting(true);
    try {
      const newPost = await api.createPost({ content });
      setPosts([newPost, ...posts]);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setPosting(false);
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
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">{user?.name} さん</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            ログアウト
          </button>
        </div>

        {/* 投稿フォーム */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <form onSubmit={handlePost}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="いまどうしてる？"
              maxLength={280}
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-zinc-400"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-400">{content.length}/280</span>
              <button
                type="submit"
                disabled={posting || !content.trim()}
                className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                {posting ? '投稿中...' : '投稿する'}
              </button>
            </div>
          </form>
        </div>

        {/* 投稿一覧 */}
        <div className="flex flex-col gap-3">
          {posts.length === 0 && (
            <p className="text-center text-sm text-zinc-400">まだ投稿がありません</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm font-medium text-zinc-900">{post.user.name}</p>
              <p className="mt-1 text-sm text-zinc-700">{post.content}</p>
              <p className="mt-2 text-xs text-zinc-400">
                {new Date(post.created_at).toLocaleString('ja-JP')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
