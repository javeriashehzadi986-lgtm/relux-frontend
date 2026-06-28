import { BUYER_ORDERS } from "./buyerOrdersData";

const STORAGE_KEY = "relux-buyer-orders";

let ordersRevision = 0;

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
  } while (existingIds.has(id));
  return id;
}

function seedOrders() {
  return BUYER_ORDERS.map((order, index) => ({
    ...order,
    createdAt: Date.now() - (BUYER_ORDERS.length - index) * 86_400_000,
  }));
}

const CANCELLED_ORDER_ACTIONS = [
  { id: "details", label: "View Details", variant: "outline", link: true },
  { id: "remove", label: "Remove from Order List", variant: "danger" },
];

function normalizeBuyerOrder(order) {
  if (order.status !== "cancelled") return order;

  return {
    ...order,
    statusLabel: "Cancelled",
    actions: CANCELLED_ORDER_ACTIONS,
  };
}

function normalizeBuyerOrders(orders) {
  return orders.map(normalizeBuyerOrder);
}

export function loadBuyerOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedOrders();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    const orders = Array.isArray(parsed) ? parsed : seedOrders();
    const normalized = normalizeBuyerOrders(orders);

    if (JSON.stringify(normalized) !== JSON.stringify(orders)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return seedOrders();
  }
}

function persist(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
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

export function addRentalRequest({ dressId, size, rentStart, rentEnd, rentalDays }) {
  const orders = loadBuyerOrders();
  const existingIds = new Set(orders.map((order) => order.id));
  const order = {
    id: generateOrderId(existingIds),
    dressId,
    type: "rental",
    typeLabel: "Rental",
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
    actions: [
      { id: "details", label: "View Details", variant: "outline", link: true },
      { id: "cancel", label: "Cancel Request", variant: "danger" },
    ],
    createdAt: Date.now(),
  };

  persist([order, ...orders]);
  return order;
}

export function cancelBuyerOrder(orderId) {
  const orders = loadBuyerOrders().map((order) =>
    order.id === orderId
      ? normalizeBuyerOrder({
          ...order,
          status: "cancelled",
        })
      : order,
  );

  persist(orders);
}

export function removeBuyerOrder(orderId) {
  const orders = loadBuyerOrders().filter((order) => order.id !== orderId);
  persist(orders);
}

export function updateBuyerOrders(updater) {
  const orders = updater(loadBuyerOrders());
  persist(orders);
}
