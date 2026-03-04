import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-900">SNS App</h1>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
