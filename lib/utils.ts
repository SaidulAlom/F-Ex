import clsx, { type ClassValue } from 'clsx';
import { siteConfig } from '@/lib/config';
import type { Product } from '@/lib/types';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function absoluteUrl(path = '/'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  try {
    return new URL(cleanPath, siteConfig.url).toString();
  } catch {
    return `${siteConfig.url}${cleanPath}`;
  }
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return 'Call for price';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function priceLabel(product: Pick<Product, 'price' | 'callForPrice'>): string {
  return product.callForPrice || product.price == null
    ? 'Call for price'
    : formatCurrency(product.price);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function telHref(phone: string | undefined | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 ? `tel:+${digits}` : null;
}

export function isRealPhone(phone: string | undefined | null): boolean {
  return Boolean(telHref(phone));
}

export function displayPhone(phone: string | undefined | null): string {
  return isRealPhone(phone) ? String(phone) : 'Phone number coming soon';
}

export function whatsappNumberForBranch(branch?: string): string {
  const found = siteConfig.branches.find((item) => item.slug === branch);
  return (found?.whatsappNumber || siteConfig.whatsapp.defaultNumber).replace(/\D/g, '');
}

export function whatsappLink(message: string, branch?: string): string {
  const number = whatsappNumberForBranch(branch);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productUrl(slug: string, origin?: string): string {
  const base = origin || siteConfig.url;
  try {
    return new URL(`/product/${slug}`, base).toString();
  } catch {
    return `${base}/product/${slug}`;
  }
}

export function buildProductWhatsAppMessage(
  product: Pick<Product, 'title' | 'price' | 'callForPrice' | 'slug' | 'status'>,
  origin?: string,
): string {
  const price = priceLabel(product);
  return [
    `Hi F-Ex Store, I’m interested in ${product.title}.`,
    `Listed price: ${price}. Status: ${product.status}.`,
    `Product page: ${productUrl(product.slug, origin)}`,
    'Is it available at my preferred branch?',
  ].join(' ');
}

export function formatDate(value: string | Date | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function formatDateTime(value: string | Date | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function toDateTimeLocalValue(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function truncate(value: string, max = 160): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

/** datetime-local inputs from the admin are interpreted in IST and stored as ISO UTC. */
export function istDateTimeLocalToIso(value: string): string {
  try {
    if (/(Z|[+-]\d{2}:?\d{2})$/i.test(value)) return new Date(value).toISOString();
    const withSeconds = value.length === 16 ? `${value}:00` : value;
    return new Date(`${withSeconds}+05:30`).toISOString();
  } catch {
    return new Date(value).toISOString();
  }
}
