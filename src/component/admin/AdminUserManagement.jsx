import React, { useMemo, useState } from "react";
import { ADMIN_USERS, ADMIN_USER_STATS } from "@/data/adminUsersData";
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
};

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AdminUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ADMIN_USERS.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="admin-users-page">
      <header className="admin-users-header">
        <div className="admin-users-header-left">
          <button type="button" className="admin-users-menu-btn" aria-label="Open menu">
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
            <p className="admin-users-stat-value">{ADMIN_USER_STATS.totalUsers.toLocaleString()}</p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Buyers</p>
            <p className="admin-users-stat-value admin-users-stat-value--secondary">
              {ADMIN_USER_STATS.buyers.toLocaleString()}
            </p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Sellers</p>
            <p className="admin-users-stat-value">{ADMIN_USER_STATS.sellers.toLocaleString()}</p>
          </article>
          <article className="admin-users-stat-card">
            <p className="admin-users-stat-label">Pending Verification</p>
            <p className="admin-users-stat-value admin-users-stat-value--error">
              {ADMIN_USER_STATS.pendingVerification}
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
              </select>
            </label>
          </div>
          <div className="admin-users-filter-actions">
            <button type="button" className="admin-users-btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
            <button type="button" className="admin-users-btn-export">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                download
              </span>
              Export CSV
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
              {filteredUsers.map((user) => (
                <tr key={user.id} onClick={() => setSelectedUser(user)}>
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
                        <p className="admin-users-user-id">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`admin-users-role-badge admin-users-role-badge--${user.role}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-users-status-badge admin-users-status-badge--${user.status}`}
                    >
                      {STATUS_LABELS[user.status]}
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
              ))}
            </tbody>
          </table>

          <div className="admin-users-table-footer">
            <p>
              Showing {filteredUsers.length} of {ADMIN_USERS.length} users
            </p>
            <div className="admin-users-pagination">
              <button type="button" className="admin-users-page-btn" disabled aria-label="Previous page">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button type="button" className="admin-users-page-btn admin-users-page-btn--active">
                1
              </button>
              <button type="button" className="admin-users-page-btn" aria-label="Next page">
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
            onClick={() => setSelectedUser(null)}
          />
          <aside className="admin-users-panel" aria-labelledby="admin-user-panel-title">
            <div className="admin-users-panel-inner">
              <div className="admin-users-panel-header">
                <h3 id="admin-user-panel-title">User Details</h3>
                <button
                  type="button"
                  className="admin-users-panel-close"
                  aria-label="Close panel"
                  onClick={() => setSelectedUser(null)}
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
                  <span>{selectedUser.id}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Role</span>
                  <span>{ROLE_LABELS[selectedUser.role]}</span>
                </div>
                <div className="admin-users-panel-meta-row">
                  <span>Status</span>
                  <span>{STATUS_LABELS[selectedUser.status]}</span>
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
                  <button type="button" className="admin-users-panel-btn-primary">
                    Approve Verification
                  </button>
                )}
                <button type="button" className="admin-users-panel-btn-outline">
                  View Activity
                </button>
                {selectedUser.status !== "suspended" ? (
                  <button type="button" className="admin-users-panel-btn-danger">
                    Suspend Account
                  </button>
                ) : (
                  <button type="button" className="admin-users-panel-btn-primary">
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
