import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { toggleAdminSidebar } from "@/utils/adminSidebar";
import "./adminUserManagement.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAURk_bun2HOkUySQS4zop9iVJL40MAu1viYY4ZLdAO4wuRnkZJUKf2XtI4sOKaE0qfCEKiLXqGL91LPXRNJr7RVS5GXk5RvS2huL9JS-A4GJX0Vw5tleaN9oADaohoyP72PI6bfIrYoV-BNI0z-JYwxy9zOn9H48GpTMbNtd9B7O2NseZuKmNz4chzxWrbhQN4Pmp3c1EZQSYBgTHwK1pFpl5slb4Y68y_MOx9t_IqLAIXQmzSuS4EUJv5pLU5O_rPZ8nzA4lGcNk";

const ROLE_LABELS = {
  buyer: "Buyer",
  seller: "Seller",
};

const STATUS_LABELS = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
  rejected: "Rejected",
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

function formatDate(iso) {
  if (!iso) return "—";
  const value = iso.includes("T") ? iso : `${iso}T12:00:00`;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    buyers: 0,
    sellers: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users ?? []);
      setStats(
        data.stats ?? {
          totalUsers: 0,
          buyers: 0,
          sellers: 0,
          pendingVerification: 0,
        },
      );
    } catch (error) {
      setLoadError(error.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? null;

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const applyUpdatedUser = (updated) => {
    setUsers((current) =>
      current.map((user) => (user.id === updated.id ? updated : user)),
    );
    setSelectedUserId(updated.id);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.approveAdminUser(selectedUser.id);
      applyUpdatedUser(data.user);
      await loadUsers();
    } catch (error) {
      setActionError(error.message || "Failed to approve user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.suspendAdminUser(selectedUser.id);
      applyUpdatedUser(data.user);
      await loadUsers();
    } catch (error) {
      setActionError(error.message || "Failed to suspend user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.reactivateAdminUser(selectedUser.id);
      applyUpdatedUser(data.user);
      await loadUsers();
    } catch (error) {
      setActionError(error.message || "Failed to reactivate user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-users-page">
      <header className="admin-users-header">
        <div className="admin-users-header-left">
          <button
            type="button"
            className="admin-users-menu-btn"
            aria-label="Open menu"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-users-header-titles">
            <h1>Users Management</h1>
            <p>View and manage all buyers and sellers registered on Relux Hub.</p>
          </div>
        </div>

        <div className="admin-users-header-right">
          <div className="admin-users-header-search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="admin-users-avatar">
            <img src={ADMIN_AVATAR} alt="Admin profile" />
          </div>
        </div>
      </header>

      <div className="admin-users-body">
        {(loadError || actionError) && (
          <p className="admin-users-error" role="alert">
            {loadError || actionError}
          </p>
        )}

        <div className="admin-users-mobile-search">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="admin-users-stats">
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Total Users</p>
            <p className="admin-users-stat-value">{stats.totalUsers.toLocaleString()}</p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Buyers</p>
            <p className="admin-users-stat-value admin-users-stat-value--secondary">
              {stats.buyers.toLocaleString()}
            </p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Sellers</p>
            <p className="admin-users-stat-value">{stats.sellers.toLocaleString()}</p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Pending Verification</p>
            <p className="admin-users-stat-value admin-users-stat-value--error">
              {stats.pendingVerification}
            </p>
          </article>
        </div>

        <div className="admin-users-filters">
          <div className="admin-users-filter-group">
            <label className="admin-users-filter-field">
              <span className="material-symbols-outlined" aria-hidden="true">
                filter_alt
              </span>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                <option value="all">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
              </select>
            </label>
            <label className="admin-users-filter-field">
              <span className="material-symbols-outlined" aria-hidden="true">
                verified_user
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
          <div className="admin-users-filter-actions">
            <button type="button" className="admin-users-btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
            <button type="button" className="admin-users-btn-ghost" onClick={loadUsers}>
              Refresh
            </button>
          </div>
        </div>

        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Orders</th>
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-users-empty">
                    Loading users...
                  </td>
                </tr>
              ) : pagedUsers.length > 0 ? (
                pagedUsers.map((user) => (
                  <tr key={user.id} onClick={() => setSelectedUserId(user.id)}>
                    <td>
                      <div className="admin-users-user-cell">
                        <div className="admin-users-user-avatar">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <div>
                          <p className="admin-users-user-name">{user.name}</p>
                          <p className="admin-users-user-id">
                            #{user.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-users-role-badge admin-users-role-badge--${user.role}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`admin-users-status-badge admin-users-status-badge--${user.status}`}
                      >
                        {STATUS_LABELS[user.status] || user.status}
                      </span>
                    </td>
                    <td>{formatDate(user.joinedAt)}</td>
                    <td>{user.ordersCount}</td>
                    <td>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        chevron_right
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-users-empty">
                    {users.length === 0
                      ? "No buyers or sellers registered yet."
                      : "No users match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="admin-users-table-footer">
            <p>
              Showing {pagedUsers.length} of {filteredUsers.length} users
            </p>
            <div className="admin-users-pagination">
              <button
                type="button"
                className="admin-users-page-btn"
                disabled={currentPage <= 1}
                aria-label="Previous page"
                onClick={() => setPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="admin-users-page-btn admin-users-page-btn--active">
                {currentPage}
              </button>
              <button
                type="button"
                className="admin-users-page-btn"
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

      {selectedUser && (
        <>
          <button
            type="button"
            className="admin-users-panel-overlay"
            aria-label="Close user details"
            onClick={() => setSelectedUserId(null)}
          />
          <aside className="admin-users-panel" aria-labelledby="admin-user-panel-title">
            <div className="admin-users-panel-inner">
              <div className="admin-users-panel-header">
                <h3 id="admin-user-panel-title">User Details</h3>
                <button
                  type="button"
                  className="admin-users-panel-close"
                  aria-label="Close panel"
                  onClick={() => setSelectedUserId(null)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="admin-users-panel-profile">
                <div className="admin-users-panel-avatar">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="" />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>
                <h4>{selectedUser.name}</h4>
                <p>{selectedUser.email}</p>
              </div>

              <div className="admin-users-panel-meta">
                <div className="admin-users-panel-meta-row">
                  <span>User ID</span>
                  <span>#{selectedUser.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Role</span>
                  <span>{ROLE_LABELS[selectedUser.role] || selectedUser.role}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Status</span>
                  <span>{STATUS_LABELS[selectedUser.status] || selectedUser.status}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Phone</span>
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>City</span>
                  <span>{selectedUser.city}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Joined</span>
                  <span>{formatDate(selectedUser.joinedAt)}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Total Orders</span>
                  <span>{selectedUser.ordersCount}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Verified</span>
                  <span>{selectedUser.verified ? "Yes" : "No"}</span>
                </div>
              </div>

              <div className="admin-users-panel-actions">
                {selectedUser.status === "pending" && (
                  <button
                    type="button"
                    className="admin-users-panel-btn-primary"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Saving..." : "Approve Verification"}
                  </button>
                )}
                {selectedUser.status !== "suspended" ? (
                  <button
                    type="button"
                    className="admin-users-panel-btn-danger"
                    onClick={handleSuspend}
                    disabled={actionLoading}
                  >
                    Suspend Account
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-users-panel-btn-primary"
                    onClick={handleReactivate}
                    disabled={actionLoading}
                  >
                    Reactivate Account
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AdminUserManagement;
