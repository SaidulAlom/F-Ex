import { csvCell } from '@/lib/sanitize';

export function toCsv<T extends object>(
  rows: T[],
  columns: { key: keyof T & string; label: string; value?: (row: T) => unknown }[],
): string {
  const header = columns.map((column) => csvCell(column.label)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((column) => csvCell(column.value ? column.value(row) : (row as Record<string, unknown>)[column.key]))
        .join(','),
    )
    .join('\r\n');
  return `\uFEFF${header}\r\n${body}`;
}
