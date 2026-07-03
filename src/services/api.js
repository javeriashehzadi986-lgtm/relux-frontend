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

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot reach the backend server. Open relux-backend folder and run: npm start",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.message ||
      (response.status === 413
        ? "Images are too large. Please use smaller photos."
        : response.status === 404
          ? "API not found. Make sure the backend server is running (npm start)."
          : "Request failed");
    throw new Error(message);
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
  updateProfile: (body) =>
    request("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
  applyAsSeller: (body) =>
    request("/seller/verification/apply", { method: "POST", body: JSON.stringify(body) }),
  submitSellerVerification: (body) =>
    request("/seller/verification", { method: "POST", body: JSON.stringify(body) }),
  updateSellerDocuments: (body) =>
    request("/seller/verification/documents", { method: "PUT", body: JSON.stringify(body) }),
  getSellerVerification: () => request("/seller/verification/me"),
  getAdminSellerApplications: () => request("/admin/seller-verifications"),
  approveSellerApplication: (id) =>
    request(`/admin/seller-verifications/${id}/approve`, { method: "PATCH" }),
  rejectSellerApplication: (id, body = {}) =>
    request(`/admin/seller-verifications/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  createListing: (body) =>
    request("/seller/listings", { method: "POST", body: JSON.stringify(body) }),
  updateListing: (id, body) =>
    request(`/seller/listings/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getMyListings: () => request("/seller/listings/me"),
  getMyListing: (id) => request(`/seller/listings/${id}`),
  getAdminListings: (status) =>
    request(status ? `/admin/listings?status=${status}` : "/admin/listings"),
  approveListing: (id) =>
    request(`/admin/listings/${id}/approve`, { method: "PATCH" }),
  rejectListing: (id, body = {}) =>
    request(`/admin/listings/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

export default api;
