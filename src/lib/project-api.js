import { apiRequest } from "./api.js";

export async function fetchProjects(token, { page = 1, limit = 20 } = {}) {
  return apiRequest(`/projects?page=${page}&limit=${limit}`, { token });
}

export async function createProject(token, { title, description } = {}) {
  return apiRequest("/projects", {
    method: "POST",
    token,
    body: JSON.stringify({ title, description }),
  });
}

export async function fetchProject(token, projectId) {
  return apiRequest(`/projects/${projectId}`, { token });
}

export async function updateProject(token, projectId, data) {
  return apiRequest(`/projects/${projectId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteProject(token, projectId) {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
    token,
  });
}

export async function duplicateProject(token, projectId) {
  return apiRequest(`/projects/${projectId}/duplicate`, {
    method: "POST",
    token,
  });
}
