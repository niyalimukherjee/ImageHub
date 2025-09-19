// src/lib/apiClient.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(res) {
  const text = await res.text();
  // Try JSON first, fallback to text
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function throwIfNotOk(res, parsed) {
  if (res.ok) return parsed;
  // parsed may be object or string
  let message = `Request failed: ${res.status} ${res.statusText}`;
  if (parsed) {
    if (typeof parsed === "string") message = `${message} - ${parsed}`;
    else if (parsed.error) message = parsed.error;
    else if (parsed.message) message = parsed.message;
  }
  const err = new Error(message);
  err.status = res.status;
  err.payload = parsed;
  throw err;
}

/* -----------------------
   AUTH
   ----------------------- */

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const parsed = await parseResponse(res);
  return throwIfNotOk(res, parsed);
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const parsed = await parseResponse(res);
  const result = throwIfNotOk(res, parsed);

  // If login returned { token }, persist it
  if (result && result.token) {
    localStorage.setItem("token", result.token);
  }
  return result;
}

export function logout() {
  localStorage.removeItem("token");
}

// export async function getCurrentUser() {
//   const res = await fetch(`${API_BASE}/auth/me`, {
//     method: "GET",
//     headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
//   });

//   const parsed = await parseResponse(res);
//   return throwIfNotOk(res, parsed);
// }

/* -----------------------
   IMAGES
   ----------------------- */

export async function fetchPublicImages() {
  const res = await fetch(`${API_BASE}/images/public`, { method: "GET" });
  const parsed = await parseResponse(res);
  return throwIfNotOk(res, parsed);
}

// export async function fetchMyImages() {
//   const res = await fetch(`${API_BASE}/images/my`, {
//     method: "GET",
//     headers: getAuthHeaders(),
//   });
//   const parsed = await parseResponse(res);
//   return throwIfNotOk(res, parsed);
// }

/**
 * Upload an image using FormData.
 * formData: instance of FormData with keys:
 *   - image (File)
 *   - title
 *   - description
 *   - categories (comma-separated string)
 *   - isPublic ("true" or "false")
 *
 * NOTE: Do NOT set Content-Type header for FormData.
 */
export async function uploadImage(formData) {
  const res = await fetch(`${API_BASE}/images/upload`, {
    method: "POST",
    headers: getAuthHeaders(), // do not set Content-Type here
    body: formData,
  });

  const parsed = await parseResponse(res);
  return throwIfNotOk(res, parsed);
}



// get current user (calls GET /auth/me)
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  });
  const parsed = await parseResponse(res);
  return throwIfNotOk(res, parsed);
}

// fetch user's images (calls GET /images/my)
export async function fetchMyImages() {
  const res = await fetch(`${API_BASE}/images/my`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const parsed = await parseResponse(res);
  return throwIfNotOk(res, parsed);
}


/* -----------------------
   Utilities
   ----------------------- */

export default {
  registerUser,
  loginUser,
  logout,
  getCurrentUser,
  fetchPublicImages,
  fetchMyImages,
  uploadImage,
  

};
