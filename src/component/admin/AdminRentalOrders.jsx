import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import "./adminRentalOrders.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB318p0ASk7p2tO95wsx8Jq0kaTgr3MOqb-ncub0SBhW1z4zMezEl2iqzlSDl1uPBuRWmHuLJdKS-l9PzeXhdMoZQSXiE3LrnD1VXmSveP9246LG8c7dAtd0IHfhfnNyoUdKCFZEOB-44LwwYKFarIHtdYFkHzMEqzkNOLwDVsx_oycj8gcYVv7zrZ9yYECLZwgWj7s8DCPXVuCQfrbLRP3BpapO4VjS2m977VU4TsSUKb-YAsMshc-lrMpAapx3k_nq2FO-FGV9-4";

const STATUS_LABELS = {
  ongoing: "Ongoing",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const PAGE_SIZE = 10;

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

const AdminRentalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    activeTrend: "",
    ongoingRentals: 0,
    overdueItems: 0,
    totalRevenue: "—",
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rentalTypeFilter, setRentalTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getAdminRentalOrders();
      setOrders(data.orders ?? []);
      setStats(
        data.stats ?? {
          totalActive: 0,
          activeTrend: "",
          ongoingRentals: 0,
          overdueItems: 0,
          totalRevenue: "—",
        },
      );
    } catch (error) {
      setLoadError(error.message || "Failed to load rental orders");
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
        (statusFilter === "active" &&
          (order.status === "ongoing" || order.status === "overdue")) ||
        (statusFilter === "completed" && order.status === "returned") ||
        (statusFilter === "cancelled" && order.status === "cancelled") ||
        order.status === statusFilter;

      const matchesRentalType =
        rentalTypeFilter === "all" || order.status === rentalTypeFilter;

      return matchesSearch && matchesStatus && matchesRentalType;
    });
  }, [orders, rentalTypeFilter, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, rentalTypeFilter]);

  const selectedOrder =
    orders.find((order) => order.id === selectedId) ?? null;

  const openOrder = (orderId) => {
    setSelectedId(orderId);
    setPanelOpen(true);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setRentalTypeFilter("all");
    setSearchQuery("");
  };

  const handleComplete = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.updateAdminOrderStatus(selectedOrder.mongoId || selectedOrder.id, {
        status: "completed",
      });
      setOrders((current) =>
        current.map((order) =>
          order.id === selectedOrder.id ? data.order : order,
        ),
      );
      await loadOrders();
    } catch (error) {
      setActionError(error.message || "Failed to complete order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.updateAdminOrderStatus(selectedOrder.mongoId || selectedOrder.id, {
        status: "cancelled",
      });
      setOrders((current) =>
        current.map((order) =>
          order.id === selectedOrder.id ? data.order : order,
        ),
      );
      await loadOrders();
    } catch (error) {
      setActionError(error.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const isClosed =
    selectedOrder?.dbStatus === "completed" ||
    selectedOrder?.dbStatus === "cancelled" ||
    selectedOrder?.dbStatus === "rejected";

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
          </button>
          <div className="admin-rental-header-divider" aria-hidden="true" />
          <div className="admin-rental-admin-profile">
            <div className="admin-rental-admin-meta">
              <p>Admin</p>
              <span>Relux Hub</span>
            </div>
            <img src={ADMIN_AVATAR} alt="Admin" />
          </div>
        </div>
      </header>

      <div className="admin-rental-body">
        <div className="admin-rental-intro">
          <h2>Rental Orders</h2>
          <p>View and manage all clothing rental bookings on Relux Hub.</p>
        </div>

        {(loadError || actionError) && (
          <p className="admin-rental-error" role="alert">
            {loadError || actionError}
          </p>
        )}

        <div className="admin-rental-stats">
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Total Active</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value">{stats.totalActive}</p>
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Ongoing Rentals</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--secondary">
                {stats.ongoingRentals}
              </p>
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Overdue Items</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--error">
                {stats.overdueItems}
              </p>
              {stats.overdueItems > 0 && (
                <span className="admin-rental-stat-badge">Action Required</span>
              )}
            </div>
          </article>
          <article className="admin-rental-stat-card">
            <p className="admin-rental-stat-label">Total Rentals</p>
            <div className="admin-rental-stat-row">
              <p className="admin-rental-stat-value admin-rental-stat-value--muted">
                {orders.length}
              </p>
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
            <button type="button" className="admin-rental-btn-ghost" onClick={loadOrders}>
              Refresh
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="admin-rental-empty">
                      Loading rental orders...
                    </td>
                  </tr>
                ) : pagedOrders.length > 0 ? (
                  pagedOrders.map((order) => (
                    <tr key={order.id} onClick={() => openOrder(order.id)}>
                      <td className="admin-rental-order-id">
                        #{order.displayId || order.id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div className="admin-rental-product-cell">
                          <div className="admin-rental-thumb">
                            {order.image ? (
                              <img src={order.image} alt="" />
                            ) : (
                              <span>{getInitials(order.title)}</span>
                            )}
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
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          chevron_right
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="admin-rental-empty">
                      {orders.length === 0
                        ? "No rental orders yet."
                        : "No rentals match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="admin-rental-table-footer">
            <p>
              Showing {pagedOrders.length} of {filteredOrders.length} rentals
            </p>
            <div className="admin-rental-pagination">
              <button
                type="button"
                className="admin-rental-page-btn"
                disabled={currentPage <= 1}
                aria-label="Previous page"
                onClick={() => setPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="admin-rental-page-btn admin-rental-page-btn--active">
                {currentPage}
              </button>
              <button
                type="button"
                className="admin-rental-page-btn"
                disabled={currentPage >= totalPages}
                aria-label="Next page"
                onClick={() => setPage((p) => p + 1)}
              >
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
                {selectedOrder.detailImage ? (
                  <img src={selectedOrder.detailImage} alt={selectedOrder.title} />
                ) : (
                  <div className="admin-rental-panel-image-fallback">
                    {getInitials(selectedOrder.title)}
                  </div>
                )}
              </div>
              <h4 className="admin-rental-panel-title">{selectedOrder.title}</h4>
              <p className="admin-rental-panel-order-id">
                Order ID: #{selectedOrder.displayId || selectedOrder.id.slice(-6).toUpperCase()}
              </p>

              <div className="admin-rental-participant">
                <div className="admin-rental-participant-main">
                  <div className="admin-rental-participant-avatar">
                    {getInitials(selectedOrder.buyer)}
                  </div>
                  <div>
                    <p className="admin-rental-participant-name">{selectedOrder.buyer}</p>
                    <p className="admin-rental-participant-role">{selectedOrder.buyerLabel}</p>
                  </div>
                </div>
              </div>

              <div className="admin-rental-participant">
                <div className="admin-rental-participant-main">
                  <div className="admin-rental-participant-avatar admin-rental-participant-avatar--seller">
                    {getInitials(selectedOrder.seller)}
                  </div>
                  <div>
                    <p className="admin-rental-participant-name">{selectedOrder.seller}</p>
                    <p className="admin-rental-participant-role">{selectedOrder.sellerLabel}</p>
                  </div>
                </div>
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
                    {selectedOrder.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="admin-rental-status-row">
                  <span>Return Status</span>
                  <span className="admin-rental-return-badge">{selectedOrder.returnStatus}</span>
                </div>
              </div>

              <div className="admin-rental-panel-actions">
                <button
                  type="button"
                  className="admin-rental-btn-primary"
                  onClick={handleComplete}
                  disabled={actionLoading || isClosed}
                >
                  {actionLoading ? "Saving..." : "Mark as Completed"}
                </button>
                <button
                  type="button"
                  className="admin-rental-btn-danger"
                  onClick={handleCancel}
                  disabled={actionLoading || isClosed}
                >
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
