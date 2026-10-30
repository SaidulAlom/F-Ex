import type { ProductCategory, ProductCondition, ProductStatus } from '@/lib/types';

export const NAV_LINKS = [
  { href: '/new-phones', label: 'New Phones' },
  { href: '/second-hand-phones', label: 'Second-Hand' },
  { href: '/accessories', label: 'Accessories' },
  { href: '/repair', label: 'Repairs' },
  { href: '/emi-payments', label: 'EMI' },
  { href: '/delivery-pickup', label: 'Delivery' },
  { href: '/branches', label: 'Branches' },
  { href: '/contact', label: 'Contact' },
] as const;

export const CATEGORY_OPTIONS: {
  value: ProductCategory;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
}[] = [
  {
    value: 'new-phone',
    label: 'New Phones',
    shortLabel: 'New',
    href: '/new-phones',
    description: 'Latest Apple, Vivo, Samsung, Redmi and more.',
  },
  {
    value: 'second-hand',
    label: 'Second-Hand Phones',
    shortLabel: 'Pre-owned',
    href: '/second-hand-phones',
    description: 'Inspected devices with clear A/B/C condition grades.',
  },
  {
    value: 'accessory',
    label: 'Accessories',
    shortLabel: 'Accessories',
    href: '/accessories',
    description: 'Chargers, cases, cables, audio and everyday essentials.',
  },
  {
    value: 'gadget',
    label: 'Gadgets',
    shortLabel: 'Gadgets',
    href: '/accessories',
    description: 'Smart wearables, audio and useful tech additions.',
  },
  {
    value: 'landline',
    label: 'Landline Phones',
    shortLabel: 'Landline',
    href: '/accessories',
    description: 'Corded and cordless landline handsets for home and office.',
  },
];

export const CONDITION_OPTIONS: ProductCondition[] = [
  'New',
  'Pre-owned',
  'Refurbished',
  'Accessory',
];
export const STATUS_OPTIONS: ProductStatus[] = ['Available', 'Reserved', 'Sold'];
export const GRADE_OPTIONS = ['A', 'B', 'C'] as const;
export const BRANCH_OPTIONS = [
  { value: 'lokhra', label: 'Lokhra' },
  { value: 'basistha', label: 'Basistha' },
  { value: 'both', label: 'Both branches' },
] as const;

export const PRICE_RANGES = [
  { label: 'Any price', value: '' },
  { label: 'Under ₹10,000', value: '0-9999' },
  { label: '₹10,000 – ₹25,000', value: '10000-25000' },
  { label: '₹25,001 – ₹50,000', value: '25001-50000' },
  { label: 'Above ₹50,000', value: '50001-' },
] as const;

export const REPAIR_SERVICES = [
  {
    title: 'Screen replacement',
    description: 'Cracked glass, display lines, touch issues and dead pixels.',
    icon: 'screen',
  },
  {
    title: 'Motherboard repair',
    description: 'No power, charging faults, network and chip-level diagnosis.',
    icon: 'chip',
  },
  {
    title: 'Speaker & camera',
    description: 'Muffled audio, mic faults, blurry cameras and focusing issues.',
    icon: 'camera',
  },
  {
    title: 'Fingerprint sensor',
    description: 'Sensor calibration, flex replacement and enrolment problems.',
    icon: 'fingerprint',
  },
  {
    title: 'Battery replacement',
    description: 'Fast drain, swelling, sudden shutdown and charging health.',
    icon: 'battery',
  },
] as const;

export const REPAIR_ISSUE_TYPES = [
  'Screen / display',
  'Motherboard / power',
  'Speaker / microphone',
  'Camera',
  'Fingerprint sensor',
  'Battery / charging',
  'Software',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  { name: 'Cash', short: 'CASH', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'Paytm UPI', short: 'paytm', className: 'bg-sky-50 text-sky-800 border-sky-200' },
  { name: 'PhonePe UPI', short: 'PhonePe', className: 'bg-violet-50 text-violet-900 border-violet-200' },
  { name: 'Visa', short: 'VISA', className: 'bg-blue-50 text-blue-900 border-blue-200' },
  { name: 'Mastercard', short: 'mastercard', className: 'bg-orange-50 text-orange-900 border-orange-200' },
  { name: 'RuPay', short: 'RuPay', className: 'bg-green-50 text-green-900 border-green-200' },
  { name: 'EMI', short: 'EMI', className: 'bg-slate-50 text-slate-900 border-slate-200' },
] as const;

export const BRANDS = [
  'Apple',
  'Vivo',
  'Samsung',
  'Redmi',
  'OnePlus',
  'Nothing',
  'Realme',
  'boAt',
  'Panasonic',
  'Motorola',
  'Google',
] as const;

export const REPAIR_STEPS = [
  {
    number: '01',
    title: 'Submit',
    description: 'Tell us the model and issue online, on WhatsApp or at either branch.',
  },
  {
    number: '02',
    title: 'Diagnose',
    description: 'Our technician checks the device and shares a clear repair estimate.',
  },
  {
    number: '03',
    title: 'Repair',
    description: 'Approved work is completed with quality parts and a functionality check.',
  },
  {
    number: '04',
    title: 'Pickup',
    description: 'Collect from Lokhra or Basistha, or ask about same-day local delivery.',
  },
] as const;

export const HOME_FAQ = [
  {
    q: 'Are second-hand phones quality checked?',
    a: 'Yes. Every pre-owned device is inspected, assigned an A/B/C cosmetic grade, and listed with visible battery health and warranty information where available.',
  },
  {
    q: 'Can I reserve a phone before visiting?',
    a: 'Use Reserve on any product page. Choose the branch and pickup time; our team will confirm stock and hold it subject to availability.',
  },
  {
    q: 'Do you really stay open until 10 PM?',
    a: 'Both branches are open daily until 10 PM. Lokhra opens at 10:30 AM and Basistha opens at 10 AM. Live open/closed status is shown across the site.',
  },
  {
    q: 'Can I pay by UPI, card or EMI?',
    a: 'Yes. We accept cash, Paytm and PhonePe UPI, Visa, MasterCard, RuPay and EMI options. Approval and terms depend on the payment provider.',
  },
] as const;
