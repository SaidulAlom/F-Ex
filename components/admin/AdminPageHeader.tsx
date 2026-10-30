import { Badge } from '@/components/ui/Badge';

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow ? <Badge tone="blue" className="mb-2">{eyebrow}</Badge> : null}
        <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
