// Tiny fetch wrapper for the Express API. Uses relative paths so Vite's dev
// proxy and the production same-origin deploy both work without changes.

const BASE = '/api';

async function asJson(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function fetchData() {
  const res = await fetch(`${BASE}/data`, { headers: { Accept: 'application/json' } });
  // 404 = "no data uploaded yet" — surface it as null so the UI can show empty state
  if (res.status === 404) return null;
  return asJson(res);
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: fd });
  return asJson(res);
}
