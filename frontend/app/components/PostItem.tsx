'use client';

import { useState } from 'react';
import Link from 'next/link';

type Post = { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } };

type Props = {
  post: Post;
  currentUserId: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
  onLike: (id: number) => void;
};

export default function PostItem({ post, currentUserId, onDelete, onUpdate, onLike }: Props) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    onUpdate(post.id, editContent);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditContent(post.content);
    setEditing(false);
  };

  const isOwner = post.user.id === currentUserId;

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <Link href={`/profile/${post.user.id}`} className="text-sm font-medium text-zinc-900 hover:underline">
          {post.user.name}
        </Link>
        {isOwner && !editing && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-zinc-400 hover:text-zinc-700"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              削除
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={280}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-200 p-2 text-sm outline-none focus:border-zinc-400"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={cancelEdit}
              className="text-xs text-zinc-400 hover:text-zinc-700"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-sm text-zinc-700">{post.content}</p>
      )}

      <div className="mt-3 flex items-center gap-1">
        <button
          onClick={() => onLike(post.id)}
          className={`text-sm transition ${post.liked_by_me ? 'text-red-500' : 'text-zinc-400 hover:text-red-400'}`}
        >
          {post.liked_by_me ? '♥' : '♡'}
        </button>
        <span className="text-xs text-zinc-400">{post.likes_count}</span>
        <p className="ml-auto text-xs text-zinc-400">
          {new Date(post.created_at).toLocaleString('ja-JP')}
        </p>
      </div>
    </div>
  );
}
