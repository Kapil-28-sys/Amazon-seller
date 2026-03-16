const BASE_URL = "https://amazon-node-api-a4i2.onrender.com";

export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    ...options,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Response is not valid JSON");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return data;
}