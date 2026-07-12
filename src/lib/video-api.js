const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function startRender(token, projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/render`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data?.error?.message || "Failed to start render");
    error.code = data?.error?.code;
    error.videoId = data?.data?.videoId;
    throw error;
  }
  return data;
}

export async function getVideoStatus(token, videoId) {
  const response = await fetch(`${API_BASE}/videos/${videoId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Failed to get status");
  return data;
}

export async function getVideo(token, videoId) {
  const response = await fetch(`${API_BASE}/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Failed to get video");
  return data;
}

export async function cancelRender(token, videoId) {
  const response = await fetch(`${API_BASE}/videos/${videoId}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Failed to cancel render");
  return data;
}

export async function retryRender(token, videoId) {
  const response = await fetch(`${API_BASE}/videos/${videoId}/retry`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Failed to retry render");
  return data;
}

export async function listProjectVideos(token, projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Failed to list videos");
  return data;
}
