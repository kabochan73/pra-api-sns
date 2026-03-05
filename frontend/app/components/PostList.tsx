type Post = { id: number; content: string; created_at: string; user: { id: number; name: string } };

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return <p className="text-center text-sm text-zinc-400">まだ投稿がありません</p>;
  }

  return (
    <div className="flex flex-col gap-3">
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
  );
}
