// Small client helper for admin API calls (password lives in sessionStorage).
export function adminPass(): string {
  try { return sessionStorage.getItem("adminPassword") || ""; } catch { return ""; }
}

export async function adminFetch(url: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) };
  headers["x-admin-password"] = adminPass();
  if (opts.body && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  return fetch(url, { ...opts, headers });
}

export const LOW_STOCK_THRESHOLD = 5;
