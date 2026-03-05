import PostItem from './PostItem';

type Post = { id: number; content: string; created_at: string; user: { id: number; name: string } };

type Props = {
  posts: Post[];
  currentUserId: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
};

export default function PostList({ posts, currentUserId, onDelete, onUpdate }: Props) {
  if (posts.length === 0) {
    return <p className="text-center text-sm text-zinc-400">まだ投稿がありません</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
