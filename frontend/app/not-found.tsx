import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <p className="text-6xl font-bold text-zinc-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-zinc-800">ページが見つかりません</h1>
      <p className="mt-2 text-sm text-zinc-500">URLが間違っているか、ページが削除された可能性があります。</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        ダッシュボードへ戻る
      </Link>
    </div>
  );
}
