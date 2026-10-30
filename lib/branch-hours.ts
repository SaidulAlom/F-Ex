import { siteConfig } from '@/lib/config';
import type { Branch, BranchHour } from '@/lib/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function minutes(value: string): number {
  const [hour = 0, minute = 0] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function istParts(date: Date): { weekday: number; hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: siteConfig.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  return {
    weekday: WEEKDAYS.indexOf(parts.weekday ?? 'Sun'),
    hour: Number(parts.hour ?? 0),
    minute: Number(parts.minute ?? 0),
  };
}

function activeHour(hours: BranchHour[], weekday: number): BranchHour | undefined {
  return hours.find((slot) => slot.days.includes(weekday));
}

export interface BranchOpenStatus {
  open: boolean;
  label: string;
  detail: string;
  color: 'green' | 'red' | 'amber';
}

/** All calculations are deliberately in Asia/Kolkata / IST, not the visitor TZ. */
export function getBranchOpenStatus(
  branch: Pick<Branch, 'hours'>,
  now = new Date(),
): BranchOpenStatus {
  const { weekday, hour, minute } = istParts(now);
  const current = hour * 60 + minute;
  const today = activeHour(branch.hours, weekday);
  if (!today) {
    return { open: false, label: 'Closed', detail: 'Closed today', color: 'red' };
  }

  const open = minutes(today.open);
  const close = minutes(today.close);
  const isOpen = current >= open && current < close;
  const tomorrow = branch.hours.find((slot) => slot.days.includes((weekday + 1) % 7));
  const nextDetail = tomorrow
    ? `Opens tomorrow ${formatTime(tomorrow.open)} IST`
    : 'See branch hours';

  return {
    open: isOpen,
    label: isOpen ? 'Open now' : 'Closed',
    detail: isOpen
      ? `Closes ${formatTime(today.close)} IST`
      : current < open
        ? `Opens today ${formatTime(today.open)} IST`
        : nextDetail,
    color: isOpen ? 'green' : 'red',
  };
}

export function formatTime(value: string): string {
  const [rawHour = 10, rawMinute = 0] = value.split(':').map(Number);
  const suffix = rawHour >= 12 ? 'PM' : 'AM';
  const hour = rawHour % 12 || 12;
  return `${hour}${rawMinute ? `:${String(rawMinute).padStart(2, '0')}` : ''} ${suffix}`;
}

export function hoursSummary(branch: Pick<Branch, 'hours'>): string {
  const first = branch.hours[0];
  return first
    ? `${first.label}: ${formatTime(first.open)} – ${formatTime(first.close)}`
    : 'Hours to be confirmed';
}
