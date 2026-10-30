export async function adminFetch<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => ({}))) as T & {
    ok?: boolean;
    message?: string;
    details?: string[];
  };
  if (!response.ok || data.ok === false) {
    const detail = data.details?.length ? ` ${data.details.join(' ')}` : '';
    throw new Error(`${data.message || 'The request failed.'}${detail}`);
  }
  return data;
}
