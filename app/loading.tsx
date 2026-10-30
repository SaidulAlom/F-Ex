export default function Loading() {
  return (
    <div className="container-content py-16" aria-busy="true" aria-label="Loading content">
      <div className="h-8 w-52 animate-pulse rounded-xl bg-slate-200" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-line bg-white p-4">
            <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
