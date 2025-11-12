export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type FetchOptions = RequestInit & { token?: string };

export async function apiFetch<T>(
  path: string,
  { token, headers, ...options }: FetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const message = await extractErrorMessage(res);
    const error = new Error(message);
    // Add status code to error for better handling
    (error as any).status = res.status;
    throw error;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const payload = await res.json();
    if (payload?.message) {
      return payload.message;
    }
  } catch {
    // ignore
  }
  return `Request failed with status ${res.status}`;
}
