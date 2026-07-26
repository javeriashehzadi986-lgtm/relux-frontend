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
          : response.status === 401
            ? "Session expired. Please log out and sign in again."
            : response.status === 403
              ? "You do not have access. Use the correct account (seller for seller dashboard, admin for admin panel)."
              : "Request failed");

    throw new Error(message);
  }

  return data;
}

export const api = {
  // Authentication
  getToken,

  setToken,

  getStoredUser,

  setStoredUser,

  register: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: () => request("/auth/me"),

  updateProfile: (body) =>
    request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Seller Verification
  applyAsSeller: (body) =>
    request("/seller/verification/apply", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  submitSellerVerification: (body) =>
    request("/seller/verification", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSellerDocuments: (body) =>
    request("/seller/verification/documents", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getSellerVerification: () =>
    request("/seller/verification/me"),

  getAdminSellerApplications: () =>
    request("/admin/seller-verifications"),

  approveSellerApplication: (id) =>
    request(`/admin/seller-verifications/${id}/approve`, {
      method: "PATCH",
    }),

  rejectSellerApplication: (id, body = {}) =>
    request(`/admin/seller-verifications/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Seller Listings
  createListing: (body) =>
    request("/seller/listings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateListing: (id, body) =>
    request(`/seller/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getMyListings: () =>
    request("/seller/listings/me"),

  getMyListing: (id) =>
    request(`/seller/listings/${id}`),

  // Public Listings
  getPublicListings: (category) =>
    request(
      category
        ? `/catalog/listings?category=${category}`
        : "/catalog/listings",
    ),

  getPublicListing: (id) =>
    request(`/catalog/listings/${id}`),

  // Admin Listings
  getAdminListings: (status) =>
    request(
      status
        ? `/admin/listings?status=${status}`
        : "/admin/listings",
    ),

  approveListing: (id) =>
    request(`/admin/listings/${id}/approve`, {
      method: "PATCH",
    }),

  rejectListing: (id, body = {}) =>
    request(`/admin/listings/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Wishlist
  getWishlist: () =>
    request("/wishlist/me"),

  addWishlistItem: (body) =>
    request("/wishlist", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  removeWishlistItem: (itemId) =>
    request(`/wishlist/${encodeURIComponent(itemId)}`, {
      method: "DELETE",
    }),

  toggleWishlistItem: (body) =>
    request("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Messages
  getConversations: () =>
    request("/messages/conversations"),

  openConversation: (body) =>
    request("/messages/conversations/open", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getConversation: (id) =>
    request(`/messages/conversations/${id}`),

  sendMessage: (id, body) =>
    request(`/messages/conversations/${id}/messages`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  markConversationRead: (id) =>
    request(`/messages/conversations/${id}/read`, {
      method: "PATCH",
    }),

  markAllConversationsRead: () =>
    request("/messages/conversations/read-all", {
      method: "PATCH",
    }),

  toggleConversationMute: (id) =>
    request(`/messages/conversations/${id}/mute`, {
      method: "PATCH",
    }),

  clearConversationMessages: (id) =>
    request(`/messages/conversations/${id}/messages`, {
      method: "DELETE",
    }),

  blockConversation: (id) =>
    request(`/messages/conversations/${id}/block`, {
      method: "PATCH",
    }),

  // Bids
  getProductBids: (productId) =>
    request(`/bids/product/${productId}`),

  placeBid: (body) =>
    request("/bids", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMyBids: () =>
    request("/bids/me"),

  // Reviews
  getSellerReviews: (sellerId) =>
    request(`/reviews/seller/${sellerId}`),

  createSellerReview: (body) =>
    request("/reviews", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Buyer Orders
  getMyBuyerOrders: () =>
    request("/buyer/orders/me"),

  createRentalRequest: (body) =>
    request("/buyer/orders/rental", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  cancelBuyerOrder: (id) =>
    request(`/buyer/orders/${id}/cancel`, {
      method: "PATCH",
    }),

  removeBuyerOrder: (id) =>
    request(`/buyer/orders/${id}`, {
      method: "DELETE",
    }),

  // Seller Orders
  getMySellerOrders: () =>
    request("/seller/orders/me"),

  approveSellerOrder: (id) =>
    request(`/seller/orders/${id}/approve`, {
      method: "PATCH",
    }),

  rejectSellerOrder: (id) =>
    request(`/seller/orders/${id}/reject`, {
      method: "PATCH",
    }),

  completeSellerOrder: (id) =>
    request(`/seller/orders/${id}/complete`, {
      method: "PATCH",
    }),

  // Reports
  getMyReports: () =>
    request("/reports/me"),

  createReport: (body) =>
    request("/reports", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  submitSellerDisputeResponse: (id, body) =>
    request(`/reports/${id}/seller-response`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Admin Reports
  getAdminReports: (params = {}) => {
    const query = new URLSearchParams();

    if (params.status) {
      query.set("status", params.status);
    }

    if (params.role) {
      query.set("role", params.role);
    }

    const qs = query.toString();

    return request(
      qs
        ? `/admin/reports?${qs}`
        : "/admin/reports",
    );
  },

  updateAdminReport: (id, body) =>
    request(`/admin/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

export default api;