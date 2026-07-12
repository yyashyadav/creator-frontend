const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function fetchScenes(token, projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/scenes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}

export async function createScene(token, projectId) {
  const response = await fetch(`${API_BASE}/projects/${projectId}/scenes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}

export async function updateScene(token, sceneId, payload) {
  const response = await fetch(`${API_BASE}/scenes/${sceneId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}

export async function deleteScene(token, sceneId) {
  const response = await fetch(`${API_BASE}/scenes/${sceneId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}

export async function reorderScene(token, sceneId, direction) {
  const response = await fetch(`${API_BASE}/scenes/${sceneId}/reorder`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ direction }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}

export async function uploadSceneImage(token, sceneId, file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/scenes/${sceneId}/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Request failed");
  return data;
}
