export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading admin panel">
      <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />)}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}
