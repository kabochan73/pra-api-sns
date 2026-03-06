const API_BASE = 'http://localhost:8000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data?.message ||
      Object.values(data?.errors ?? {}).flat().join('\n') ||
      'エラーが発生しました';
    throw new Error(message as string);
  }

  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string; password_confirmation: string }) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>('/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: { id: number; name: string; email: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  logout: () =>
    request<{ message: string }>('/logout', { method: 'POST' }),

  me: () =>
    request<{ id: number; name: string; email: string }>('/me'),

  getPosts: (page = 1) =>
    request<{
      data: { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } }[];
      current_page: number;
      last_page: number;
    }>(`/posts?page=${page}`),

  createPost: (body: { content: string }) =>
    request<{ id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } }>('/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updatePost: (id: number, body: { content: string }) =>
    request<{ id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } }>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deletePost: (id: number) =>
    request<{ message: string }>(`/posts/${id}`, { method: 'DELETE' }),

  toggleLike: (postId: number) =>
    request<{ likes_count: number; liked_by_me: boolean }>(`/posts/${postId}/like`, { method: 'POST' }),

  search: (q: string) =>
    request<{
      posts: { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } }[];
      users: { id: number; name: string }[];
    }>(`/search?q=${encodeURIComponent(q)}`),

  getProfile: (userId: number) =>
    request<{
      user: { id: number; name: string };
      posts: { id: number; content: string; created_at: string; likes_count: number; liked_by_me: number; user: { id: number; name: string } }[];
    }>(`/users/${userId}`),
};
