import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import {
  Heart,
  Bell,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { getNavbarButtonConfig } from "@/utils/authRedirect";
import {
  isDashboardRoute,
  resetDashboardSidebar,
  setDashboardSidebarOpen,
  syncDashboardSidebarToBody,
  toggleDashboardSidebar,
} from "@/utils/dashboardSidebar";

const NAV_ITEMS = [
  { to: "/home", label: "Home" },
  { to: "/categories", label: "Categories" },
  { to: "/becomeASeller", label: "Become a Seller" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { unreadCount } = useUnreadMessageCount();
  const { unreadCount: unreadNotifications } = useUnreadNotificationCount();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const onDashboard = isDashboardRoute(location.pathname);

  const { label: dashboardLabel, path: dashboardPath, isGuest } = getNavbarButtonConfig(
    user,
    { isAuthenticated, loading },
  );

  useEffect(() => {
    if (onDashboard && isAuthenticated) {
      setDashboardSidebarOpen(true);
      syncDashboardSidebarToBody();
    } else {
      resetDashboardSidebar();
    }
  }, [onDashboard, isAuthenticated, location.pathname]);

  useEffect(() => {
    if (!onDashboard || !isAuthenticated) return undefined;

    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setDashboardSidebarOpen(true);
        syncDashboardSidebarToBody();
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onDashboard, isAuthenticated]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("navbar-mobile-open", mobileNavOpen);
    return () => {
      document.body.classList.remove("navbar-mobile-open");
    };
  }, [mobileNavOpen]);

  const goToSignup = (returnTo) => {
    navigate("/signup", { state: { from: returnTo ?? location.pathname } });
  };

  const handleProtectedNav = (path) => (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      goToSignup(path);
    }
  };

  const handleMenuClick = () => {
    if (onDashboard && isAuthenticated) {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        toggleDashboardSidebar();
      }
      return;
    }

    if (!window.matchMedia("(max-width: 900px)").matches) {
      return;
    }

    setMobileNavOpen((open) => !open);
  };

  const menuLabel =
    onDashboard && isAuthenticated
      ? "Toggle dashboard menu"
      : mobileNavOpen
        ? "Close menu"
        : "Open menu";

  const showMobileDrawer = !onDashboard || !isAuthenticated;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-start">
          <Button
            type="button"
            variant="icon"
            size="icon"
            className={`navbar-menu-btn ${mobileNavOpen ? "navbar-menu-btn--active" : ""}`}
            aria-label={menuLabel}
            aria-expanded={showMobileDrawer ? mobileNavOpen : undefined}
            onClick={handleMenuClick}
          >
            {showMobileDrawer && mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
          <Link to="/home" className="logo">
            Relux Hub
          </Link>
        </div>

        <ul className="navlinks">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="nav-icons">
            <Link
              to="/messages"
              aria-label="Messages"
              className="nav-icon-link"
              onClick={handleProtectedNav("/messages")}
            >
              <MessageCircle size={22} />
              {isAuthenticated && unreadCount > 0 ? (
                <span className="nav-icon-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              ) : null}
            </Link>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              onClick={handleProtectedNav("/wishlist")}
            >
              <Heart size={22} />
            </Link>

            <Link
              to="/notification"
              aria-label="Notifications"
              className="nav-icon-link"
              onClick={handleProtectedNav("/notification")}
            >
              <Bell size={22} />
              {isAuthenticated && unreadNotifications > 0 ? (
                <span className="nav-icon-badge">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              ) : null}
            </Link>
          </div>

          <Link
            to={dashboardPath}
            className="signup-btn"
            onClick={
              isGuest
                ? (event) => {
                    event.preventDefault();
                    goToSignup(location.pathname);
                  }
                : undefined
            }
          >
            {dashboardLabel}
          </Link>
        </div>
      </div>

      {showMobileDrawer ? (
        <>
          <button
            type="button"
            className={`navbar-mobile-overlay ${mobileNavOpen ? "navbar-mobile-overlay--open" : ""}`}
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className={`navbar-mobile-drawer ${mobileNavOpen ? "navbar-mobile-drawer--open" : ""}`}
            aria-hidden={!mobileNavOpen}
          >
            <ul className="navbar-mobile-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} onClick={() => setMobileNavOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={dashboardPath}
              className="navbar-mobile-cta"
              onClick={(event) => {
                if (isGuest) {
                  event.preventDefault();
                  goToSignup(location.pathname);
                }
                setMobileNavOpen(false);
              }}
            >
              {dashboardLabel}
            </Link>
          </div>
        </>
      ) : null}
    </nav>
  );
};

export default Navbar;
