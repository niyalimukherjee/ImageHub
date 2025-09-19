const API_URL = "http://localhost:5000"; // change if deployed

// Helper to include token if available
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser({ username, email, password }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem("token", data.token);
  return data;
}

export async function fetchPublicImages() {
  const res = await fetch(`${API_URL}/images/public`);
  return res.json();
}

export async function fetchMyImages() {
  const res = await fetch(`${API_URL}/images/my`, {
    headers: authHeaders(),
  });
  return res.json();
}
