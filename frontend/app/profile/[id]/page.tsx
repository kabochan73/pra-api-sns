'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { usePosts } from '../../hooks/usePosts';
import PostList from '../../components/PostList';
import PostSkeleton from '../../components/PostSkeleton';

type User = { id: number; name: string };

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { posts, setPosts, deletePost, updatePost, toggleLike } = usePosts();

  useEffect(() => {
    Promise.all([api.me(), api.getProfile(userId)])
      .then(([me, profile]) => {
        setCurrentUserId(me.id);
        setProfileUser(profile.user);
        setPosts(profile.posts);
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [userId, router, setPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 py-8">
        <div className="mx-auto max-w-xl px-4">
          <div className="mb-6 flex items-center gap-3 animate-pulse">
            <div className="h-4 w-10 rounded bg-zinc-200" />
            <div className="h-6 w-48 rounded bg-zinc-200" />
          </div>
          <div className="mb-6 rounded-xl bg-white p-5 shadow animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-zinc-200" />
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-zinc-200" />
                <div className="h-3 w-16 rounded bg-zinc-100" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="mx-auto max-w-xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-sm text-zinc-400 hover:text-zinc-700"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-bold text-zinc-900">{profileUser?.name} さんのプロフィール</h1>
        </div>

        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-lg font-bold text-zinc-600">
              {profileUser?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{profileUser?.name}</p>
              <p className="text-sm text-zinc-400">{posts.length} 件の投稿</p>
            </div>
          </div>
        </div>

        <PostList
          posts={posts}
          currentUserId={currentUserId}
          onDelete={deletePost}
          onUpdate={updatePost}
          onLike={toggleLike}
        />
      </div>
    </div>
  );
}
