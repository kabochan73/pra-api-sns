import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl font-semibold uppercase tracking-widest text-zinc-400">
            Welcome to
          </span>
          <h1 className="text-8xl font-black tracking-tighter text-zinc-900">SNS App</h1>
          <p className="mt-8 text-4xl text-zinc-500">つながりを、もっと近くに。</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-zinc-300 px-7 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            新規登録
          </Link>
        </div>
      </div>
    </div>
  );
}
