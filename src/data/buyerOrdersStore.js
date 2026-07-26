import {
  findSellerIdForOrder,
  removeSellerOrder,
  updateSellerOrderStatus,
  upsertSellerRentalRequest,
} from "./sellerOrdersStore";

const STORAGE_PREFIX = "relux-buyer-orders:";
const LEGACY_STORAGE_KEY = "relux-buyer-orders";

/** Old demo order IDs — never show these on a real buyer account. */
const DEMO_ORDER_IDS = new Set(["RLX-10294", "RLX-10452", "RLX-10501"]);

let ordersRevision = 0;
let legacyCleared = false;

function clearLegacySharedOrders() {
  if (legacyCleared || typeof localStorage === "undefined") return;
  legacyCleared = true;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function formatRentalPeriod(start, end) {
  const format = (iso) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return `Rental Period: ${format(start)} - ${format(end)}`;
}

function generateOrderId(existingIds) {
  let id = "";
  do {
    id = `RLX-${Math.floor(10000 + Math.random() * 90000)}`;
  } while (existingIds.has(id) || DEMO_ORDER_IDS.has(id));
  return id;
}

function getUserId(userId) {
  if (userId == null || userId === "") return null;
  if (typeof userId === "object") {
    if (userId.$oid) return String(userId.$oid);
    if (userId._id) return getUserId(userId._id);
    if (typeof userId.toString === "function") {
      const asString = userId.toString();
      if (asString && asString !== "[object Object]") return asString;
    }
    return null;
  }
  return String(userId);
}

function getStorageKey(userId) {
  const id = getUserId(userId);
  return id ? `${STORAGE_PREFIX}${id}` : null;
}

const CANCELLED_ORDER_ACTIONS = [
  { id: "details", label: "View Details", variant: "outline", link: true },
  { id: "remove", label: "Remove from Order List", variant: "danger" },
];

const PROCESSING_RENTAL_ACTIONS = [
  { id: "details", label: "View Details", variant: "outline", link: true },
  { id: "cancel", label: "Cancel Request", variant: "danger" },
];

function buildRentalOrderFields({ size, rentStart, rentEnd, rentalDays }) {
  return {
    size,
    rentalDays,
    rentStart,
    rentEnd,
    meta: [
      { icon: "calendar-check", text: `${rentalDays} Days Rental` },
      { icon: "clock", text: formatRentalPeriod(rentStart, rentEnd) },
    ],
    status: "processing",
    statusLabel: "Processing",
    actions: PROCESSING_RENTAL_ACTIONS,
    updatedAt: Date.now(),
  };
}

export function findReusableRentalOrderForDress(orders, dressId) {
  const rentalOrders = orders.filter(
    (order) =>
      order.type === "rental" &&
      order.dressId === dressId &&
      (order.status === "processing" || order.status === "cancelled"),
  );

  const processing = rentalOrders.find((order) => order.status === "processing");
  if (processing) return processing;

  const cancelled = rentalOrders
    .filter((order) => order.status === "cancelled")
    .sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0));

  return cancelled[0] ?? null;
}

export function getPendingRentalOrderForDress(userId, dressId) {
  return (
    loadBuyerOrders(userId).find(
      (order) =>
        order.type === "rental" &&
        order.dressId === dressId &&
        order.status === "processing",
    ) ?? null
  );
}

function stripTrackActions(actions) {
  if (!Array.isArray(actions)) return actions;
  return actions.filter((action) => action.id !== "track");
}

function normalizeBuyerOrder(order) {
  const withoutTrack = {
    ...order,
    actions: stripTrackActions(order.actions),
  };

  if (withoutTrack.status !== "cancelled") return withoutTrack;

  return {
    ...withoutTrack,
    statusLabel: "Cancelled",
    actions: CANCELLED_ORDER_ACTIONS,
  };
}

function normalizeBuyerOrders(orders) {
  return orders.map(normalizeBuyerOrder);
}

/** Each buyer has their own order list. New buyers start empty (no demo orders). */
export function loadBuyerOrders(userId) {
  clearLegacySharedOrders();

  const key = getStorageKey(userId);
  if (!key) return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    const orders = Array.isArray(parsed) ? parsed : [];
    // Strip old demo/sample orders if they were ever copied into a user key
    const withoutDemo = orders.filter((order) => !DEMO_ORDER_IDS.has(order.id));
    const normalized = normalizeBuyerOrders(withoutDemo);

    if (JSON.stringify(normalized) !== JSON.stringify(orders)) {
      localStorage.setItem(key, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return [];
  }
}

function persist(userId, orders) {
  const key = getStorageKey(userId);
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(orders));
  ordersRevision += 1;
  window.dispatchEvent(new Event("relux-buyer-orders-updated"));
}

export function getBuyerOrdersRevision() {
  return ordersRevision;
}

export function subscribeBuyerOrdersRevision(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener("relux-buyer-orders-updated", handler);
  return () => window.removeEventListener("relux-buyer-orders-updated", handler);
}

export function addRentalRequest(
  userId,
  { dressId, size, rentStart, rentEnd, rentalDays, sellerId, customerName },
) {
  if (!getUserId(userId)) {
    throw new Error("Please log in to place a rental request");
  }

  const orders = loadBuyerOrders(userId);
  const existing = findReusableRentalOrderForDress(orders, dressId);
  const rentalFields = buildRentalOrderFields({ size, rentStart, rentEnd, rentalDays });

  let order;

  if (existing) {
    order = {
      ...existing,
      ...rentalFields,
      dressId,
      type: "rental",
      typeLabel: "Rental",
      buyerId: getUserId(userId),
      sellerId: sellerId ? String(sellerId) : existing.sellerId ?? null,
      customerName: customerName || existing.customerName || "Buyer",
    };
    const nextOrders = [order, ...orders.filter((item) => item.id !== existing.id)];
    persist(userId, nextOrders);
  } else {
    const existingIds = new Set(orders.map((item) => item.id));
    order = {
      id: generateOrderId(existingIds),
      buyerId: getUserId(userId),
      sellerId: sellerId ? String(sellerId) : null,
      customerName: customerName || "Buyer",
      dressId,
      type: "rental",
      typeLabel: "Rental",
      ...rentalFields,
      createdAt: Date.now(),
    };
    persist(userId, [order, ...orders]);
  }

  if (order.sellerId) {
    upsertSellerRentalRequest({
      sellerId: order.sellerId,
      orderId: order.id,
      dressId: order.dressId,
      buyerId: order.buyerId,
      customerName: order.customerName,
      size: order.size,
      rentStart: order.rentStart,
      rentEnd: order.rentEnd,
      rentalDays: order.rentalDays,
    });
  }

  return order;
}

export function cancelBuyerOrder(userId, orderId) {
  const previous = loadBuyerOrders(userId).find((order) => order.id === orderId);
  const orders = loadBuyerOrders(userId).map((order) =>
    order.id === orderId
      ? normalizeBuyerOrder({
          ...order,
          status: "cancelled",
          updatedAt: Date.now(),
        })
      : order,
  );

  persist(userId, orders);

  const sellerId = previous?.sellerId || findSellerIdForOrder(orderId);
  if (sellerId) {
    updateSellerOrderStatus(sellerId, orderId, "Cancelled");
  }
}

export function removeBuyerOrder(userId, orderId) {
  const previous = loadBuyerOrders(userId).find((order) => order.id === orderId);
  const orders = loadBuyerOrders(userId).filter((order) => order.id !== orderId);
  persist(userId, orders);

  const sellerId = previous?.sellerId || findSellerIdForOrder(orderId);
  if (sellerId) {
    removeSellerOrder(sellerId, orderId);
  }
}

export function updateBuyerOrders(userId, updater) {
  const orders = updater(loadBuyerOrders(userId));
  persist(userId, orders);
}

/** Seller actions update the matching buyer order (same order id). */
export function applySellerDecisionToBuyerOrder(buyerId, orderId, decision) {
  if (!buyerId || !orderId) return;

  const orders = loadBuyerOrders(buyerId).map((order) => {
    if (order.id !== orderId) return order;

    if (decision === "approve") {
      return normalizeBuyerOrder({
        ...order,
        status: "rental-active",
        statusLabel: "Rental Active",
        meta: [
          { icon: "calendar-check", text: `${order.rentalDays || 1} Days Rental` },
          { icon: "check-circle", text: "Seller Approved", highlight: true },
        ],
        actions: [
          { id: "details", label: "View Details", variant: "outline", link: true },
          {
            id: "rent-again",
            label: "Rent Again",
            variant: "ghost",
            icon: "history",
            alignEnd: true,
            link: true,
          },
        ],
        updatedAt: Date.now(),
      });
    }

    if (decision === "reject") {
      return normalizeBuyerOrder({
        ...order,
        status: "cancelled",
        updatedAt: Date.now(),
      });
    }

    if (decision === "complete") {
      return normalizeBuyerOrder({
        ...order,
        status: "delivered",
        statusLabel: "Delivered",
        meta: [
          { icon: "check-circle", text: "Rental Completed", highlight: true },
        ],
        actions: [
          { id: "details", label: "View Details", variant: "outline", link: true },
          {
            id: "rent-again",
            label: "Rent Again",
            variant: "ghost",
            icon: "history",
            alignEnd: true,
            link: true,
          },
        ],
        updatedAt: Date.now(),
      });
    }

    return order;
  });

  persist(buyerId, orders);
}
