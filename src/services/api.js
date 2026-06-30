const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("relux-token");
}

function setToken(token) {
  if (token) {
    localStorage.setItem("relux-token", token);
  } else {
    localStorage.removeItem("relux-token");
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("relux-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  if (user) {
    localStorage.setItem("relux-user", JSON.stringify(user));
  } else {
    localStorage.removeItem("relux-user");
  }
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
};

export default api;
