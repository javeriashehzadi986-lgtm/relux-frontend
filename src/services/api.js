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

    const error = new Error(message);
    if (data.code) {
      error.code = data.code;
    }
    throw error;
  }

  return data;
}

async function uploadRequest(path, file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  const formData = new FormData();
  formData.append("file", file);

  const headers = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch {
    throw new Error(
      "Cannot reach the backend server. Open relux-backend folder and run: npm start",
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
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

  verifyEmail: ({ token }) =>
    request(`/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (body) =>
    request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  googleAuth: (body) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  forgotPassword: (body) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resetPassword: (body) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: () => request("/auth/me"),

  updateProfile: (body) =>
    request("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  updateEmail: (body) =>
    request("/auth/me/email", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  changePassword: (body) =>
    request("/auth/me/password", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deactivateAccount: (body) =>
    request("/auth/me/deactivate", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Seller Verification (logged-in buyers upgrade to seller)
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

  uploadListingImage: (file) => uploadRequest("/upload/listing", file),
  uploadVerificationImage: (file) => uploadRequest("/upload/verification", file),
  uploadSupportImage: (file) => uploadRequest("/upload/support", file),

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

  requestSellerMoreInfo: (id, body = {}) =>
    request(`/admin/seller-verifications/${id}/request-info`, {
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

  deleteListing: (id) =>
    request(`/seller/listings/${id}`, {
      method: "DELETE",
    }),

  updateListingAvailability: (id, isAvailable) =>
    request(`/seller/listings/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    }),

  getMyListings: () =>
    request("/seller/listings/me"),

  getMyListing: (id) =>
    request(`/seller/listings/${id}`),

  // Public Listings
  getPublicListings: (categoryOrOptions) => {
    const options =
      typeof categoryOrOptions === "string"
        ? { category: categoryOrOptions }
        : categoryOrOptions ?? {};
    const query = new URLSearchParams();

    if (options.category) {
      query.set("category", options.category);
    }

    if (options.type) {
      query.set("type", options.type);
    }

    if (options.limit) {
      query.set("limit", String(options.limit));
    }

    const qs = query.toString();

    return request(qs ? `/catalog/listings?${qs}` : "/catalog/listings");
  },

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

  getUnreadMessageCount: () =>
    request("/messages/unread-count"),

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

  getBuyerOrder: (id) => request(`/buyer/orders/${id}`),

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

  confirmBuyerOrderReceived: (id) =>
    request(`/buyer/orders/${id}/confirm-received`, {
      method: "PATCH",
    }),

  markBuyerOrderReturned: (id) =>
    request(`/buyer/orders/${id}/mark-returned`, {
      method: "PATCH",
    }),

  // Payments (Stripe)
  createSaleCheckout: (body) =>
    request("/payments/checkout/sale", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getSaleCheckoutListing: (productId) =>
    request(`/payments/checkout/sale-listing/${encodeURIComponent(productId)}`),

  createRentalCheckout: (body) =>
    request("/payments/checkout/rental", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getPaymentSession: (sessionId) =>
    request(`/payments/session/${encodeURIComponent(sessionId)}`),

  createSellerStripeConnect: (body = {}) =>
    request("/seller/stripe/connect", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  openSellerStripeDashboard: () =>
    request("/seller/stripe/dashboard-link", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getSellerStripeStatus: () => request("/seller/stripe/status"),

  getSellerStripePayouts: () => request("/seller/stripe/payouts"),

  retrySellerStripePayouts: () =>
    request("/seller/stripe/payouts/retry", {
      method: "POST",
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

  shipSellerOrder: (id) =>
    request(`/seller/orders/${id}/ship`, {
      method: "PATCH",
    }),

  confirmSellerOrderReturn: (id) =>
    request(`/seller/orders/${id}/confirm-return`, {
      method: "PATCH",
    }),

  proposeSellerSettlement: (id, body) =>
    request(`/seller/orders/${id}/settlement/propose`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  disputeSellerRentalReturn: (id, body) =>
    request(`/seller/orders/${id}/return/dispute`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getOrderSettlement: (id) => request(`/buyer/orders/${id}/settlement`),

  acceptOrderSettlement: (id) =>
    request(`/buyer/orders/${id}/settlement/accept`, {
      method: "POST",
    }),

  disputeOrderSettlement: (id, body) =>
    request(`/buyer/orders/${id}/settlement/dispute`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  disputeSaleDelivery: (id, body) =>
    request(`/buyer/orders/${id}/sale-escrow/dispute`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  disputeRentalDelivery: (id, body) =>
    request(`/buyer/orders/${id}/rental-delivery/dispute`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAdminOrderSettlement: (id) => request(`/admin/orders/${id}/settlement`),

  resolveAdminOrderSettlement: (id, body) =>
    request(`/admin/orders/${id}/settlement/resolve`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  resolveAdminSaleEscrow: (id, body) =>
    request(`/admin/orders/${id}/sale-escrow/resolve`, {
      method: "POST",
      body: JSON.stringify(body),
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

  submitBuyerDisputeResponse: (id, body) =>
    request(`/reports/${id}/buyer-response`, {
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

  // Admin Users
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.role) query.set("role", params.role);
    if (params.status) query.set("status", params.status);
    if (params.q) query.set("q", params.q);
    const qs = query.toString();
    return request(qs ? `/admin/users?${qs}` : "/admin/users");
  },
  suspendAdminUser: (id) =>
    request(`/admin/users/${id}/suspend`, { method: "PATCH" }),
  reactivateAdminUser: (id) =>
    request(`/admin/users/${id}/reactivate`, { method: "PATCH" }),
  approveAdminUser: (id) =>
    request(`/admin/users/${id}/approve`, { method: "PATCH" }),

  // Admin Orders
  getAdminRentalOrders: () => request("/admin/orders/rental"),
  getAdminResaleOrders: () => request("/admin/orders/resale"),
  getAdminPayments: () => request("/admin/payments"),
  updateAdminOrderStatus: (id, body) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // Contact
  submitContactMessage: (body) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAdminContactMessages: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    const qs = query.toString();
    return request(qs ? `/admin/contact?${qs}` : "/admin/contact");
  },
  updateAdminContactMessage: (id, body) =>
    request(`/admin/contact/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  replyAdminContactMessage: (id, body) =>
    request(`/admin/contact/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Admin Reviews
  getAdminReviews: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.rating) query.set("rating", params.rating);
    if (params.status) query.set("status", params.status);
    const qs = query.toString();
    return request(qs ? `/admin/reviews?${qs}` : "/admin/reviews");
  },
  updateAdminReviewStatus: (id, body) =>
    request(`/admin/reviews/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteAdminReview: (id) =>
    request(`/admin/reviews/${id}`, { method: "DELETE" }),

  // Notifications
  getMyNotifications: (filter = "all") =>
    request(
      filter && filter !== "all"
        ? `/notifications/me?filter=${encodeURIComponent(filter)}`
        : "/notifications/me",
    ),

  getNotification: (id) => request(`/notifications/${id}`),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllNotificationsRead: () =>
    request("/notifications/read-all", { method: "PATCH" }),

  getUnreadNotificationCount: () =>
    request("/notifications/unread-count"),

  getAdminBroadcasts: () => request("/admin/notifications"),
  getAdminNotificationRecipients: () =>
    request("/admin/notifications/recipients"),
  sendAdminBroadcast: (body) =>
    request("/admin/notifications", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAdminCategories: () => request("/admin/categories"),
  getPublicCategories: () => request("/categories"),
  createAdminCategory: (body) =>
    request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateAdminCategory: (id, body) =>
    request(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteAdminCategory: (id) =>
    request(`/admin/categories/${id}`, {
      method: "DELETE",
    }),
};

export default api;