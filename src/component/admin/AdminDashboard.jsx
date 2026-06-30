import React from "react";
import { Link } from "react-router-dom";
import { ADMIN_NAV_SECTIONS } from "./adminNavConfig";
import { ADMIN_USER_STATS } from "@/data/adminUsersData";
import { ADMIN_RENTAL_ORDER_STATS } from "@/data/adminRentalOrdersData";
import "./adminDashboard.css";

const QUICK_STATS = [
  {
    label: "Total Users",
    value: ADMIN_USER_STATS.totalUsers.toLocaleString("en-US"),
    trend: null,
    icon: "group",
  },
  {
    label: "Sellers",
    value: ADMIN_USER_STATS.sellers.toLocaleString("en-US"),
    trend: null,
    icon: "storefront",
  },
  {
    label: "Active Rentals",
    value: ADMIN_RENTAL_ORDER_STATS.ongoingRentals,
    trend: ADMIN_RENTAL_ORDER_STATS.activeTrend,
    icon: "event_available",
  },
  {
    label: "Overdue Rentals",
    value: ADMIN_RENTAL_ORDER_STATS.overdueItems,
    trend: null,
    icon: "warning",
    alert: true,
  },
];

const AdminDashboard = () => {
  const quickLinks = ADMIN_NAV_SECTIONS.flatMap((section) =>
    section.items.filter((item) => item.path !== "/admin"),
  );

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Alex. Here is your marketplace overview.</p>
        </div>
      </header>

      <div className="admin-dashboard-stats">
        {QUICK_STATS.map((stat) => (
          <article key={stat.label} className="admin-dashboard-stat-card">
            <div
              className={`admin-dashboard-stat-icon ${
                stat.alert ? "admin-dashboard-stat-icon--alert" : ""
              }`.trim()}
            >
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="admin-dashboard-stat-label">{stat.label}</p>
              <p className="admin-dashboard-stat-value">{stat.value}</p>
              {stat.trend && (
                <p className="admin-dashboard-stat-trend">
                  <span className="material-symbols-outlined">trending_up</span>
                  {stat.trend}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="admin-dashboard-links">
        <h2>Quick Access</h2>
        <div className="admin-dashboard-links-grid">
          {quickLinks.map((item) => (
            <Link key={item.path} to={item.path} className="admin-dashboard-link-card">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
              <span className="material-symbols-outlined admin-dashboard-link-arrow">chevron_right</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
