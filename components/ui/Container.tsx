import { cn } from '@/lib/utils';

export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'header' | 'footer';
}) {
  return <Tag className={cn('container-content', className)}>{children}</Tag>;
}
