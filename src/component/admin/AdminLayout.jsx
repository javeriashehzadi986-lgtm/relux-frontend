import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_NAV_SECTIONS, ADMIN_USER } from "./adminNavConfig";
import {
  resetAdminSidebar,
  setAdminSidebarOpen,
  syncAdminSidebarToBody,
  toggleAdminSidebar,
} from "@/utils/adminSidebar";
import "./adminLayout.css";

function getActiveLabel(pathname) {
  for (const section of ADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.end ? pathname === item.path : pathname.startsWith(item.path)) {
        return item.label;
      }
    }
  }
  return "Admin";
}

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLabel = getActiveLabel(location.pathname);

  useEffect(() => {
    syncAdminSidebarToBody();

    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        syncAdminSidebarToBody();
      } else {
        setAdminSidebarOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      resetAdminSidebar();
    };
  }, []);

  const closeSidebarOnMobile = () => {
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setAdminSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <button
        type="button"
        className="admin-sidebar-overlay"
        aria-label="Close navigation"
        onClick={() => setAdminSidebarOpen(false)}
      />

      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <h1>Relux Hub</h1>
          <p>Marketplace Admin</p>
        </div>

        <nav className="admin-sidebar-nav">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="admin-sidebar-section-label">{section.label}</p>
              <div className="admin-sidebar-links">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `admin-sidebar-link ${isActive ? "admin-sidebar-link--active" : ""}`.trim()
                    }
                    onClick={closeSidebarOnMobile}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <img src={ADMIN_USER.avatar} alt={ADMIN_USER.name} />
            <div>
              <strong>{ADMIN_USER.name}</strong>
              <span>{ADMIN_USER.role}</span>
            </div>
          </div>
          <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
            <span className="material-symbols-outlined" aria-hidden="true">
              logout
            </span>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-mobile-bar">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            aria-label="Open navigation"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="admin-mobile-bar-title">{activeLabel}</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
