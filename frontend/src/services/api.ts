
export const urlBase = process.env.NEXT_PUBLIC_API_BASE;

export async function apiRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${urlBase}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  if (res.status === 204) {
    return {} as Promise<T>;
  }
  return res.json() as Promise<T>;
}