import { Box, Star, Users } from 'lucide-react';
import type { DashboardStats } from '@/lib/types';

export function AdminStatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: 'Total products', value: stats.products, icon: Box, tone: 'bg-electric/10 text-electric' },
    { label: 'Available now', value: stats.available, icon: Box, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Reserved / Sold', value: stats.reserved + stats.sold, icon: Box, tone: 'bg-orange/10 text-orange' },
    { label: 'New leads', value: stats.newLeads, icon: Users, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Active content', value: stats.banners + stats.testimonials, icon: Star, tone: 'bg-violet-50 text-violet-700' },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${card.tone}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
            <p className="mt-4 text-2xl font-extrabold text-navy">{card.value}</p>
            <p className="text-xs font-semibold text-ink">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
