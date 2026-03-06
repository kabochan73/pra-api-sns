'use client';

import { useState } from 'react';

type Post = { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } };

type Props = {
  onPost: (post: Post) => void;
};

export default function PostForm({ onPost }: Props) {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setPosting(true);
    try {
      const { api } = await import('../lib/api');
      const newPost = await api.createPost({ content });
      onPost(newPost);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl bg-white p-4 shadow">
      <form onSubmit={handleSubmit}>
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
  );
}
