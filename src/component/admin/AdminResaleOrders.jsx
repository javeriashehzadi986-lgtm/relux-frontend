import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { toggleAdminSidebar } from "@/utils/adminSidebar";
import "./adminResaleOrders.css";

const STATUS_LABELS = {
  completed: "Completed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  returned: "Returned",
  cancelled: "Cancelled",
  pending: "Awaiting Payment",
};

const PAYMENT_LABELS = {
  paid: "Paid",
  pending: "Pending",
  unpaid: "Unpaid",
  failed: "Failed",
  refunded: "Refunded",
};

function paymentLabel(status) {
  return PAYMENT_LABELS[status] || status || "—";
}

function paymentBadgeClass(status) {
  if (status === "paid") return "paid";
  if (status === "refunded") return "refunded";
  if (status === "failed") return "failed";
  if (status === "pending") return "pending";
  return "unpaid";
}

const PAGE_SIZE = 10;

function formatDate(iso) {
  if (!iso) return "—";
  const value = iso.includes("T") ? iso : `${iso}T12:00:00`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

const AdminResaleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: "—",
    revenueTrend: "",
    activeDeliveries: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getAdminResaleOrders();
      setOrders(data.orders ?? []);
      setStats(
        data.stats ?? {
          totalRevenue: "—",
          revenueTrend: "",
          activeDeliveries: 0,
          pendingOrders: 0,
        },
      );
    } catch (error) {
      setLoadError(error.message || "Failed to load resale orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.displayId?.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query) ||
        order.buyer.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" &&
          !["completed", "cancelled"].includes(order.status)) ||
        order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, paymentFilter, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, paymentFilter]);

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;

  const openOrder = (orderId) => {
    setSelectedId(orderId);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  return (
    <div className="admin-resale-page">
      <header className="admin-resale-header">
        <div className="admin-resale-header-left">
          <button
            type="button"
            className="admin-resale-menu-btn"
            aria-label="Open menu"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-resale-header-titles">
            <h1>Resale Orders</h1>
            <p>View and manage all resale orders on Relux Hub.</p>
          </div>
        </div>
        <div className="admin-resale-header-right">
          <div className="admin-resale-header-search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              type="text"
              placeholder="Search Order ID, Buyer, or Item..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="admin-resale-body">
        {loadError && (
          <p className="admin-resale-error" role="alert">
            {loadError}
          </p>
        )}

        <div className="admin-resale-mobile-search">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search Order ID, Buyer, or Item..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="admin-resale-stats">
          <article className="admin-resale-stat-card">
            <div className="admin-resale-stat-icon">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">Total Resale Orders</p>
              <p className="admin-resale-stat-value">{orders.length}</p>
            </div>
          </article>
          <article className="admin-resale-stat-card">
            <div className="admin-resale-stat-icon">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">Active Deliveries</p>
              <p className="admin-resale-stat-value">{stats.activeDeliveries}</p>
            </div>
          </article>
          <article className="admin-resale-stat-card">
            <div className="admin-resale-stat-icon">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">In Progress</p>
              <p className="admin-resale-stat-value">{stats.pendingOrders}</p>
            </div>
          </article>
        </div>

        <div className="admin-resale-filters">
          <label className="admin-resale-filter-field">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              filter_list
            </span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">Order Status: All</option>
              <option value="pending">In Progress</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="admin-resale-filter-field">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              account_balance_wallet
            </span>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
            >
              <option value="all">Payment: All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>
          <button type="button" className="admin-resale-refresh-btn" onClick={loadOrders}>
            Refresh
          </button>
          <p className="admin-resale-filter-count">
            Showing {pagedOrders.length} of {filteredOrders.length} orders
          </p>
        </div>

        <div className="admin-resale-table-card">
          <div className="admin-resale-table-scroll">
            <table className="admin-resale-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Clothing</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Amount Paid</th>
                  <th>Date</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Product</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="admin-resale-empty">
                      Loading resale orders...
                    </td>
                  </tr>
                ) : pagedOrders.length > 0 ? (
                  pagedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={selectedId === order.id ? "admin-resale-row--selected" : undefined}
                      onClick={() => openOrder(order.id)}
                    >
                      <td className="admin-resale-order-id">
                        #{order.displayId || order.id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div className="admin-resale-product-cell">
                          <div className="admin-resale-thumb">
                            {order.image ? (
                              <img src={order.image} alt="" />
                            ) : (
                              <span>{getInitials(order.title)}</span>
                            )}
                          </div>
                          <p className="admin-resale-product-title">{order.title}</p>
                        </div>
                      </td>
                      <td>
                        <div className="admin-resale-person">
                          <span
                            className={`admin-resale-person-avatar admin-resale-person-avatar--${order.buyerAvatarClass || "primary"}`}
                            aria-hidden="true"
                          >
                            {getInitials(order.buyer)}
                          </span>
                          <span>{order.buyer}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-resale-person">
                          <span
                            className={`admin-resale-person-avatar admin-resale-person-avatar--${order.sellerAvatarClass || "secondary"}`}
                            aria-hidden="true"
                          >
                            {getInitials(order.seller)}
                          </span>
                          <span>{order.seller}</span>
                        </div>
                      </td>
                      <td className="admin-resale-winning-bid">{order.totalPaid || order.winningBid}</td>
                      <td className="admin-resale-date">{formatDate(order.date)}</td>
                      <td>
                        <span
                          className={`admin-resale-status-badge admin-resale-status-badge--${order.fulfillmentStatus || order.status}`}
                        >
                          {order.statusLabel || order.fulfillmentLabel || STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-resale-mini-badge admin-resale-mini-badge--${paymentBadgeClass(order.paymentStatus)}`}
                        >
                          {paymentLabel(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="admin-resale-product-status">{order.productStatus || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="admin-resale-empty">
                      {orders.length === 0
                        ? "No resale orders yet. Sale checkout will create them."
                        : "No orders match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredOrders.length > PAGE_SIZE && (
            <div className="admin-resale-pagination">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {panelOpen && selectedOrder && (
        <>
          <button
            type="button"
            className="admin-resale-panel-overlay"
            aria-label="Close order details"
            onClick={closePanel}
          />
          <aside className="admin-resale-panel" aria-labelledby="admin-resale-panel-title">
            <div className="admin-resale-panel-header">
              <div>
                <h3 id="admin-resale-panel-title">Order Details</h3>
                <p>#{selectedOrder.displayId || selectedOrder.id.slice(-6).toUpperCase()}</p>
              </div>
              <button
                type="button"
                className="admin-resale-panel-close"
                aria-label="Close panel"
                onClick={closePanel}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="admin-resale-panel-body">
              <div className="admin-resale-panel-image">
                {selectedOrder.detailImage ? (
                  <img src={selectedOrder.detailImage} alt={selectedOrder.title} />
                ) : null}
                <div className="admin-resale-panel-image-caption">
                  <p>{selectedOrder.title}</p>
                  <span>ID: {selectedOrder.itemId}</span>
                </div>
              </div>

              <div className="admin-resale-entities">
                <div className="admin-resale-entity-card">
                  <p>Buyer</p>
                  <div className="admin-resale-person">
                    <span
                      className={`admin-resale-person-avatar admin-resale-person-avatar--${selectedOrder.buyerAvatarClass || "primary"}`}
                      aria-hidden="true"
                    >
                      {getInitials(selectedOrder.buyer)}
                    </span>
                    <strong>{selectedOrder.buyer}</strong>
                  </div>
                </div>
                <div className="admin-resale-entity-card">
                  <p>Seller</p>
                  <div className="admin-resale-person">
                    <span
                      className={`admin-resale-person-avatar admin-resale-person-avatar--${selectedOrder.sellerAvatarClass || "secondary"}`}
                      aria-hidden="true"
                    >
                      {getInitials(selectedOrder.seller)}
                    </span>
                    <strong>{selectedOrder.seller}</strong>
                  </div>
                </div>
              </div>

              <div className="admin-resale-detail-rows">
                <div className="admin-resale-detail-row">
                  <span>Winning Bid</span>
                  <strong>{selectedOrder.winningBid}</strong>
                </div>
                {selectedOrder.deliveryCharges && selectedOrder.deliveryCharges !== "—" ? (
                  <div className="admin-resale-detail-row">
                    <span>Delivery</span>
                    <strong>{selectedOrder.deliveryCharges}</strong>
                  </div>
                ) : null}
                <div className="admin-resale-detail-row">
                  <span>Total Paid</span>
                  <strong>{selectedOrder.totalPaid || selectedOrder.winningBid}</strong>
                </div>
                <div className="admin-resale-detail-row">
                  <span>Order Status</span>
                  <span
                    className={`admin-resale-mini-badge admin-resale-mini-badge--${selectedOrder.fulfillmentStatus || selectedOrder.deliveryStatus}`}
                  >
                    {selectedOrder.statusLabel || selectedOrder.fulfillmentLabel || "—"}
                  </span>
                </div>
                <div className="admin-resale-detail-row">
                  <span>Payment Status</span>
                  <span
                    className={`admin-resale-mini-badge admin-resale-mini-badge--${paymentBadgeClass(selectedOrder.paymentStatus)}`}
                  >
                    {paymentLabel(selectedOrder.paymentStatus)}
                  </span>
                </div>
                {selectedOrder.paidAt ? (
                  <div className="admin-resale-detail-row">
                    <span>Paid At</span>
                    <strong>{formatDate(selectedOrder.paidAt)}</strong>
                  </div>
                ) : null}
                {selectedOrder.stripeSessionId ? (
                  <div className="admin-resale-detail-row">
                    <span>Stripe Session</span>
                    <strong className="admin-resale-stripe-id">
                      {selectedOrder.stripeSessionId}
                    </strong>
                  </div>
                ) : null}
                {selectedOrder.stripePaymentIntentId ? (
                  <div className="admin-resale-detail-row">
                    <span>Stripe Payment</span>
                    <strong className="admin-resale-stripe-id">
                      {selectedOrder.stripePaymentIntentId}
                    </strong>
                  </div>
                ) : null}
                <div className="admin-resale-detail-row">
                  <span>Product Status</span>
                  <strong>{selectedOrder.productStatus || "—"}</strong>
                </div>
              </div>

              <div className="admin-resale-timeline">
                <h4>Logistics Log</h4>
                <div className="admin-resale-timeline-list">
                  {(selectedOrder.logistics || []).map((entry) => (
                    <div key={`${entry.label}-${entry.date}`} className="admin-resale-timeline-item">
                      <span
                        className={`admin-resale-timeline-dot ${
                          entry.active ? "admin-resale-timeline-dot--active" : ""
                        }`.trim()}
                        aria-hidden="true"
                      />
                      <p>{entry.label}</p>
                      <span>{entry.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminResaleOrders;
