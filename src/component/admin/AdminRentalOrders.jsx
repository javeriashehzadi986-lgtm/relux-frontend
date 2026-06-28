import React, { useMemo, useState } from "react";
import {
  ADMIN_RENTAL_ORDERS,
  ADMIN_RENTAL_ORDERS_TOTAL,
  ADMIN_RENTAL_ORDER_STATS,
} from "@/data/adminRentalOrdersData";
import "./adminRentalOrders.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB318p0ASk7p2tO95wsx8Jq0kaTgr3MOqb-ncub0SBhW1z4zMezEl2iqzlSDl1uPBuRWmHuLJdKS-l9PzeXhdMoZQSXiE3LrnD1VXmSveP9246LG8c7dAtd0IHfhfnNyoUdKCFZEOB-44LwwYKFarIHtdYFkHzMEqzkNOLwDVsx_oycj8gcYVv7zrZ9yYECLZwgWj7s8DCPXVuCQfrbLRP3BpapO4VjS2m977VU4TsSUKb-YAsMshc-lrMpAapx3k_nq2FO-FGV9-4";

const STATUS_LABELS = {
  ongoing: "Ongoing",
  returned: "Returned",
  overdue: "Overdue",
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AdminRentalOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rentalTypeFilter, setRentalTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(ADMIN_RENTAL_ORDERS[0]?.id ?? null);
  const [panelOpen, setPanelOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ADMIN_RENTAL_ORDERS.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query) ||
        order.buyer.toLowerCase().includes(query) ||
        order.seller.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && order.status === "ongoing") ||
        (statusFilter === "completed" && order.status === "returned") ||
        (statusFilter === "cancelled" && false) ||
        order.status === statusFilter;

      const matchesRentalType =
        rentalTypeFilter === "all" ||
        (rentalTypeFilter === "ongoing" && order.status === "ongoing") ||
        (rentalTypeFilter === "returned" && order.status === "returned") ||
        (rentalTypeFilter === "overdue" && order.status === "overdue");

      return matchesSearch && matchesStatus && matchesRentalType;
    });
  }, [rentalTypeFilter, searchQuery, statusFilter]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedId) ??
    ADMIN_RENTAL_ORDERS.find((order) => order.id === selectedId) ??
    null;

  const openOrder = (orderId) => {
    setSelectedId(orderId);
    setPanelOpen(true);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setRentalTypeFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="admin-rental-page">
      <header className="admin-rental-header">
        <div className="admin-rental-header-search">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="admin-rental-header-actions">
          <button type="button" className="admin-rental-icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="admin-rental-notify-dot" aria-hidden="true" />
          </button>
          <button type="button" className="admin-rental-icon-btn" aria-label="Help">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="admin-rental-header-divider" aria-hidden="true" />
          <div className="admin-rental-admin-profile">
            <div className="admin-rental-admin-meta">
              <p>Alex Rivera</p>
              <span>Admin</span>
            </div>
            <img src={ADMIN_AVATAR} alt="Alex Rivera" />
          </div>
        </div>
      </header>

      <div className="admin-rental-body">
        <div className="admin-rental-intro">
          <h2>Rental Orders</h2>
          <p>View and manage all clothing rental bookings on Relux Hub.</p>
        </div>

        <div className="admin-rental-stats">
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Total Active</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value">{ADMIN_RENTAL_ORDER_STATS.totalActive}</p>
              <div className="admin-rental-stat-trend">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  trending_up
                </span>
                {ADMIN_RENTAL_ORDER_STATS.activeTrend}
              </div>
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Ongoing Rentals</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--secondary">
                {ADMIN_RENTAL_ORDER_STATS.ongoingRentals}
              </p>
              <div className="admin-rental-stat-icon-wrap">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  sync
                </span>
              </div>
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Overdue Items</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--error">
                {ADMIN_RENTAL_ORDER_STATS.overdueItems}
              </p>
              <span className="admin-rental-stat-badge">Action Required</span>
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Total Revenue</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--muted">
                {ADMIN_RENTAL_ORDER_STATS.totalRevenue}
              </p>
              <span className="material-symbols-outlined" style={{ color: "#98c9a3" }}>
                payments
              </span>
            </div>
          </article>
        </div>

        <div className="admin-rental-filters">
          <div className="admin-rental-filter-group">
            <label className="admin-rental-filter-field">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                filter_alt
              </span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="admin-rental-filter-field">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                calendar_today
              </span>
              <select
                value={rentalTypeFilter}
                onChange={(event) => setRentalTypeFilter(event.target.value)}
              >
                <option value="all">Rental Type</option>
                <option value="ongoing">Ongoing</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
            </label>
          </div>
          <div className="admin-rental-filter-actions">
            <button type="button" className="admin-rental-btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
            <button type="button" className="admin-rental-btn-export">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        <div className="admin-rental-table-card">
          <div className="admin-rental-table-scroll">
            <table className="admin-rental-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Clothing</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Rental Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} onClick={() => openOrder(order.id)}>
                    <td className="admin-rental-order-id">#{order.id}</td>
                    <td>
                      <div className="admin-rental-product-cell">
                        <div className="admin-rental-thumb">
                          <img src={order.image} alt="" />
                        </div>
                        <p className="admin-rental-product-title">{order.title}</p>
                      </div>
                    </td>
                    <td>{order.buyer}</td>
                    <td>{order.seller}</td>
                    <td>
                      <p
                        className={`admin-rental-dates-primary ${
                          order.overdue ? "admin-rental-dates-primary--error" : ""
                        }`.trim()}
                      >
                        {order.rentalDates}
                      </p>
                      <p
                        className={`admin-rental-dates-sub ${
                          order.overdue ? "admin-rental-dates-sub--error" : ""
                        }`.trim()}
                      >
                        {order.rentalDays}
                      </p>
                    </td>
                    <td className="admin-rental-amount">{order.amount}</td>
                    <td>
                      <span
                        className={`admin-rental-status-badge admin-rental-status-badge--${order.status}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-rental-table-footer">
            <p>
              Showing {filteredOrders.length} of {ADMIN_RENTAL_ORDERS_TOTAL} rentals
            </p>
            <div className="admin-rental-pagination">
              <button type="button" className="admin-rental-page-btn" disabled aria-label="Previous page">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="admin-rental-page-btn admin-rental-page-btn--active">
                1
              </button>
              <button type="button" className="admin-rental-page-btn">
                2
              </button>
              <button type="button" className="admin-rental-page-btn">
                3
              </button>
              <button type="button" className="admin-rental-page-btn" aria-label="Next page">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {panelOpen && selectedOrder && (
        <>
          <button
            type="button"
            className="admin-rental-panel-overlay"
            aria-label="Close rental details"
            onClick={() => setPanelOpen(false)}
          />
          <aside className="admin-rental-panel" aria-labelledby="admin-rental-panel-title">
            <div className="admin-rental-panel-inner">
              <div className="admin-rental-panel-header">
                <h3 id="admin-rental-panel-title">Rental Details</h3>
                <button
                  type="button"
                  className="admin-rental-panel-close"
                  aria-label="Close panel"
                  onClick={() => setPanelOpen(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="admin-rental-panel-image">
                <img src={selectedOrder.detailImage} alt={selectedOrder.title} />
              </div>
              <h4 className="admin-rental-panel-title">{selectedOrder.title}</h4>
              <p className="admin-rental-panel-order-id">Order ID: #{selectedOrder.id}</p>

              <div className="admin-rental-participant">
                <div className="admin-rental-participant-main">
                  <div className="admin-rental-participant-avatar">
                    {selectedOrder.buyerAvatar ? (
                      <img src={selectedOrder.buyerAvatar} alt="" />
                    ) : (
                      getInitials(selectedOrder.buyer)
                    )}
                  </div>
                  <div>
                    <p className="admin-rental-participant-name">{selectedOrder.buyer}</p>
                    <p className="admin-rental-participant-role">{selectedOrder.buyerLabel}</p>
                  </div>
                </div>
                <button type="button" className="admin-rental-chat-btn" aria-label="Message buyer">
                  <span className="material-symbols-outlined">chat_bubble_outline</span>
                </button>
              </div>

              <div className="admin-rental-participant">
                <div className="admin-rental-participant-main">
                  <div className="admin-rental-participant-avatar admin-rental-participant-avatar--seller">
                    {selectedOrder.sellerAvatar ? (
                      <img src={selectedOrder.sellerAvatar} alt="" />
                    ) : (
                      getInitials(selectedOrder.seller)
                    )}
                  </div>
                  <div>
                    <p className="admin-rental-participant-name">{selectedOrder.seller}</p>
                    <p className="admin-rental-participant-role">{selectedOrder.sellerLabel}</p>
                  </div>
                </div>
                <button type="button" className="admin-rental-chat-btn" aria-label="Message seller">
                  <span className="material-symbols-outlined">chat_bubble_outline</span>
                </button>
              </div>

              <div className="admin-rental-meta-grid">
                <div className="admin-rental-meta-item">
                  <span>Rental Period</span>
                  <strong>{selectedOrder.rentalPeriod}</strong>
                </div>
                <div className="admin-rental-meta-item">
                  <span>Rental Cost</span>
                  <strong>{selectedOrder.rentalCost}</strong>
                </div>
                <div className="admin-rental-meta-item">
                  <span>Item Value</span>
                  <strong>{selectedOrder.itemValue}</strong>
                </div>
                <div className="admin-rental-meta-item">
                  <span>Rental Type</span>
                  <strong>{selectedOrder.rentalType}</strong>
                </div>
              </div>

              <div className="admin-rental-status-rows">
                <div className="admin-rental-status-row">
                  <span>Payment Status</span>
                  <span className="admin-rental-paid">
                    <span className="material-symbols-outlined">check_circle</span>
                    Paid
                  </span>
                </div>
                <div className="admin-rental-status-row">
                  <span>Return Status</span>
                  <span className="admin-rental-return-badge">{selectedOrder.returnStatus}</span>
                </div>
              </div>

              <div className="admin-rental-panel-actions">
                <button type="button" className="admin-rental-btn-primary">
                  Mark as Completed
                </button>
                <button type="button" className="admin-rental-btn-outline">
                  View Full Transaction History
                </button>
                <button type="button" className="admin-rental-btn-danger">
                  Cancel Order
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminRentalOrders;
