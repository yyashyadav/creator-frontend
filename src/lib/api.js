const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function apiRequest(path, options = {}) {
  const { token, ...fetchOptions } = options;

  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed");
  }

  return data;
}

export async function checkHealth() {
  return apiRequest("/health");
}
