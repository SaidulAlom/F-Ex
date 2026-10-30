import { PackageSearch } from 'lucide-react';

export function EmptyState({
  title = 'Nothing here yet',
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <PackageSearch className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-ink">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
