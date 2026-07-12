import { apiRequest } from "./api.js";

export async function registerUser({ name, email, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchCurrentUser(token) {
  return apiRequest("/auth/me", { token });
}

export async function logoutUser(token) {
  return apiRequest("/auth/logout", {
    method: "POST",
    token,
  });
}
