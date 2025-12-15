const API_BASE = "/.netlify/functions";

async function getJson(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}

export async function listMarkets() {
  return getJson(`${API_BASE}/markets-list`);
}

export async function searchListings(filters = {}) {
  const qs = new URLSearchParams(filters).toString();
  return getJson(`${API_BASE}/listings-search?${qs}`);
}

export async function getListingDetail(id) {
  return getJson(`${API_BASE}/listing-detail?id=${encodeURIComponent(id)}`);
}
