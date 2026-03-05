import { useState } from 'react';
import { api } from '../lib/api';

type Post = { id: number; content: string; created_at: string; user: { id: number; name: string } };

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

  return { posts, setPosts, addPost, deletePost, updatePost };
}
