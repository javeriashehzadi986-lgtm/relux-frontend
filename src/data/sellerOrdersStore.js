const STORAGE_PREFIX = "relux-seller-orders:";

let ordersRevision = 0;

function getSellerId(sellerId) {
  if (!sellerId) return null;
  return String(sellerId);
}

function getStorageKey(sellerId) {
  const id = getSellerId(sellerId);
  return id ? `${STORAGE_PREFIX}${id}` : null;
}

function formatDateLabel(rentStart, rentEnd) {
  if (!rentStart || !rentEnd) return "Dates TBD";
  const format = (iso) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  return `${format(rentStart)} - ${format(rentEnd)}`;
}

function getInitialsAvatar(name) {
  const initials = String(name || "B")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
    <rect width="80" height="80" fill="#e8ede9"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#3b6848">${initials || "B"}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function loadSellerOrders(sellerId) {
  const key = getStorageKey(sellerId);
  if (!key) return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(sellerId, orders) {
  const key = getStorageKey(sellerId);
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(orders));
  ordersRevision += 1;
  window.dispatchEvent(new Event("relux-seller-orders-updated"));
}

export function getSellerOrdersRevision() {
  return ordersRevision;
}

export function subscribeSellerOrdersRevision(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener("relux-seller-orders-updated", handler);
  return () => window.removeEventListener("relux-seller-orders-updated", handler);
}

/**
 * Notify seller when a buyer places/updates a rental request.
 * Uses the same order id as the buyer order for syncing.
 */
export function upsertSellerRentalRequest({
  sellerId,
  orderId,
  dressId,
  buyerId,
  customerName,
  size,
  rentStart,
  rentEnd,
  rentalDays,
}) {
  const sid = getSellerId(sellerId);
  if (!sid || !orderId) return null;

  const orders = loadSellerOrders(sid);
  const existing = orders.find((order) => order.id === orderId);
  const nextOrder = {
    id: orderId,
    buyerId: buyerId ? String(buyerId) : null,
    dressId,
    customerName: customerName || "Buyer",
    customerAvatar: getInitialsAvatar(customerName || "Buyer"),
    orderType: "Rental Request",
    orderCategory: "rental",
    status: existing?.status === "Approved" ? "Approved" : "Pending",
    statusVariant: existing?.status === "Approved" ? "approved" : "pending",
    dateLabel: formatDateLabel(rentStart, rentEnd),
    dateIcon: existing?.status === "Approved" ? "calendar-check" : "calendar",
    actions: existing?.status === "Approved" ? "complete" : "approve-reject",
    size: size || "",
    rentalDays: rentalDays || 0,
    rentStart: rentStart || "",
    rentEnd: rentEnd || "",
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
    dimmed: false,
  };

  // If buyer re-submits a cancelled request, reset to pending
  if (existing?.status === "Rejected" || existing?.status === "Cancelled") {
    nextOrder.status = "Pending";
    nextOrder.statusVariant = "pending";
    nextOrder.dateIcon = "calendar";
    nextOrder.actions = "approve-reject";
  }

  const nextOrders = [nextOrder, ...orders.filter((order) => order.id !== orderId)];
  persist(sid, nextOrders);
  return nextOrder;
}

export function updateSellerOrderStatus(sellerId, orderId, status) {
  const sid = getSellerId(sellerId);
  if (!sid) return;

  const orders = loadSellerOrders(sid).map((order) => {
    if (order.id !== orderId) return order;

    if (status === "Approved") {
      return {
        ...order,
        status: "Approved",
        statusVariant: "approved",
        actions: "complete",
        dateIcon: "calendar-check",
        dimmed: false,
        updatedAt: Date.now(),
      };
    }

    if (status === "Completed") {
      return {
        ...order,
        status: "Completed",
        statusVariant: "completed",
        actions: "view",
        dateIcon: "check",
        dimmed: true,
        updatedAt: Date.now(),
      };
    }

    if (status === "Rejected" || status === "Cancelled") {
      return {
        ...order,
        status,
        statusVariant: status === "Rejected" ? "pending" : "completed",
        actions: "view",
        dateIcon: "calendar",
        dimmed: true,
        updatedAt: Date.now(),
      };
    }

    return order;
  });

  persist(sid, orders);
}

export function removeSellerOrder(sellerId, orderId) {
  const sid = getSellerId(sellerId);
  if (!sid) return;
  persist(
    sid,
    loadSellerOrders(sid).filter((order) => order.id !== orderId),
  );
}

/** Find which seller owns an order id (used when syncing buyer cancel). */
export function findSellerIdForOrder(orderId) {
  if (!orderId || typeof localStorage === "undefined") return null;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(STORAGE_PREFIX)) continue;
    try {
      const orders = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(orders) && orders.some((order) => order.id === orderId)) {
        return key.slice(STORAGE_PREFIX.length);
      }
    } catch {
      // ignore bad keys
    }
  }
  return null;
}
