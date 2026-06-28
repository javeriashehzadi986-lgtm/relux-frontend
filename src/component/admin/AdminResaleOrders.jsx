import React, { useMemo, useState } from "react";
import {
  ADMIN_RESALE_ORDERS,
  ADMIN_RESALE_ORDERS_TOTAL,
  ADMIN_RESALE_ORDER_STATS,
} from "@/data/adminResaleOrdersData";
import "./adminResaleOrders.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAURk_bun2HOkUySQS4zop9iVJL40MAu1viYY4ZLdAO4wuRnkZJUKf2XtI4sOKaE0qfCEKiLXqGL91LPXRNJr7RVS5GXk5RvS2huL9JS-A4GJX0Vw5tleaN9oADaohoyP72PI6bfIrYoV-BNI0z-JYwxy9zOn9H48GpTMbNtd9B7O2NseZuKmNz4chzxWrbhQN4Pmp3c1EZQSYBgTHwK1pFpl5slb4Y68y_MOx9t_IqLAIXQmzSuS4EUJv5pLU5O_rPZ8nzA4lGcNk";

const STATUS_LABELS = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
};

const DELIVERY_LABELS = {
  shipped: "Shipped",
  delivered: "Delivered",
  processing: "Processing",
};

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AdminResaleOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(ADMIN_RESALE_ORDERS[0]?.id ?? null);
  const [panelOpen, setPanelOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ADMIN_RESALE_ORDERS.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query) ||
        order.buyer.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [paymentFilter, searchQuery, statusFilter]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedId) ?? null;

  const openOrder = (orderId) => {
    setSelectedId(orderId);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  return (
    <div className="admin-resale-page">
      <header className="admin-resale-header">
        <div className="admin-resale-header-left">
          <button type="button" className="admin-resale-menu-btn" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-resale-header-titles">
            <h1>Resale Orders</h1>
            <p>View and manage all completed resale orders on Relux Hub.</p>
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
          <div className="admin-resale-avatar">
            <img src={ADMIN_AVATAR} alt="Admin profile" />
          </div>
        </div>
      </header>

      <div className="admin-resale-body">
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
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">Total Resale Revenue</p>
              <p className="admin-resale-stat-value">{ADMIN_RESALE_ORDER_STATS.totalRevenue}</p>
              <div className="admin-resale-stat-meta">
                {ADMIN_RESALE_ORDER_STATS.revenueTrend}
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  trending_up
                </span>
              </div>
            </div>
          </article>
          <article className="admin-resale-stat-card">
            <div className="admin-resale-stat-icon">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">Active Deliveries</p>
              <p className="admin-resale-stat-value">{ADMIN_RESALE_ORDER_STATS.activeDeliveries}</p>
              <div className="admin-resale-stat-meta admin-resale-stat-meta--muted">
                Current Hubs
              </div>
            </div>
          </article>
          <article className="admin-resale-stat-card">
            <div className="admin-resale-stat-icon">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
            <div>
              <p className="admin-resale-stat-label">Pending Orders</p>
              <p className="admin-resale-stat-value">{ADMIN_RESALE_ORDER_STATS.pendingOrders}</p>
              <div className="admin-resale-stat-meta admin-resale-stat-meta--error">
                Needs Review
              </div>
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
              <option value="pending">Pending</option>
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
              <option value="refunded">Refunded</option>
            </select>
          </label>
          <p className="admin-resale-filter-count">
            Showing 1-{filteredOrders.length} of {ADMIN_RESALE_ORDERS_TOTAL.toLocaleString()} orders
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
                  <th>Winning Bid</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={selectedId === order.id ? "admin-resale-row--selected" : undefined}
                    onClick={() => openOrder(order.id)}
                  >
                    <td className="admin-resale-order-id">#{order.id}</td>
                    <td>
                      <div className="admin-resale-product-cell">
                        <div className="admin-resale-thumb">
                          <img src={order.image} alt="" />
                        </div>
                        <p className="admin-resale-product-title">{order.title}</p>
                      </div>
                    </td>
                    <td>
                      <div className="admin-resale-person">
                        <span
                          className={`admin-resale-person-avatar admin-resale-person-avatar--${order.buyerAvatarClass}`}
                          aria-hidden="true"
                        />
                        <span>{order.buyer}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-resale-person">
                        <span
                          className={`admin-resale-person-avatar admin-resale-person-avatar--${order.sellerAvatarClass}`}
                          aria-hidden="true"
                        />
                        <span>{order.seller}</span>
                      </div>
                    </td>
                    <td className="admin-resale-winning-bid">{order.winningBid}</td>
                    <td className="admin-resale-date">{formatDate(order.date)}</td>
                    <td>
                      <span
                        className={`admin-resale-status-badge admin-resale-status-badge--${order.status}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <p>#{selectedOrder.id}</p>
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
                <img src={selectedOrder.detailImage} alt={selectedOrder.title} />
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
                      className={`admin-resale-person-avatar admin-resale-person-avatar--${selectedOrder.buyerAvatarClass}`}
                      aria-hidden="true"
                    />
                    <strong>{selectedOrder.buyer}</strong>
                  </div>
                  <button type="button">View Profile</button>
                </div>
                <div className="admin-resale-entity-card">
                  <p>Seller</p>
                  <div className="admin-resale-person">
                    <span
                      className={`admin-resale-person-avatar admin-resale-person-avatar--${selectedOrder.sellerAvatarClass}`}
                      aria-hidden="true"
                    />
                    <strong>{selectedOrder.seller}</strong>
                  </div>
                  <button type="button">View Profile</button>
                </div>
              </div>

              <div className="admin-resale-detail-rows">
                <div className="admin-resale-detail-row">
                  <span>Winning Bid Amount</span>
                  <strong>{selectedOrder.winningBid}</strong>
                </div>
                <div className="admin-resale-detail-row">
                  <span>Delivery Status</span>
                  <span
                    className={`admin-resale-mini-badge admin-resale-mini-badge--${selectedOrder.deliveryStatus}`}
                  >
                    {DELIVERY_LABELS[selectedOrder.deliveryStatus]}
                  </span>
                </div>
                <div className="admin-resale-detail-row">
                  <span>Payment Status</span>
                  <span className="admin-resale-mini-badge admin-resale-mini-badge--paid">Paid</span>
                </div>
              </div>

              <div className="admin-resale-timeline">
                <h4>Logistics Log</h4>
                <div className="admin-resale-timeline-list">
                  {selectedOrder.logistics.map((entry) => (
                    <div key={entry.label} className="admin-resale-timeline-item">
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

            <div className="admin-resale-panel-actions">
              <button type="button" className="admin-resale-btn-complete">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  check_circle
                </span>
                Mark as Completed
              </button>
              <button type="button" className="admin-resale-btn-cancel">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  cancel
                </span>
                Cancel Order
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminResaleOrders;
