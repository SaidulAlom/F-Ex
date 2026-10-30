import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { ok: false, message, ...(details ? { details } : {}) },
    { status },
  );
}

export function apiOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function zodDetails(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });
}
