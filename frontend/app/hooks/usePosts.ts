import { useState } from 'react';
import { api } from '../lib/api';

type Post = { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } };

export function usePosts(initialPosts: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const deletePost = async (id: number) => {
    if (!confirm('この投稿を削除しますか？')) return;
    await api.deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePost = async (id: number, content: string) => {
    const updated = await api.updatePost(id, { content });
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const toggleLike = async (id: number) => {
    const { likes_count, liked_by_me } = await api.toggleLike(id);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes_count, liked_by_me: liked_by_me ? 1 : 0 } : p))
    );
  };

  return { posts, setPosts, addPost, deletePost, updatePost, toggleLike };
}
