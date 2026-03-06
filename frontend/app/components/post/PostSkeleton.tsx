export default function PostSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-zinc-200" />
        <div className="h-3 w-16 rounded bg-zinc-100" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-zinc-100" />
        <div className="h-3 w-4/5 rounded bg-zinc-100" />
      </div>
      <div className="mt-3 flex items-center gap-1">
        <div className="h-4 w-4 rounded bg-zinc-100" />
        <div className="h-3 w-4 rounded bg-zinc-100" />
        <div className="ml-auto h-3 w-28 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
