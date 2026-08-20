import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import {
  Heart,
  Bell,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { getNavbarButtonConfig, getPostAuthPath } from "@/utils/authRedirect";
import {
  isDashboardRoute,
  resetDashboardSidebar,
  setDashboardSidebarOpen,
  syncDashboardSidebarToBody,
} from "@/utils/dashboardSidebar";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const { unreadCount } = useUnreadMessageCount();
  const { unreadCount: unreadNotifications } = useUnreadNotificationCount();
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
    if (isGuest) {
      goToSignup(location.pathname);
      return;
    }

    navigate(getPostAuthPath(user));
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-start">
          <Button
            type="button"
            variant="icon"
            size="icon"
            className="navbar-menu-btn"
            aria-label="Sign up to continue"
            onClick={handleMenuClick}
          >
            <Menu size={22} />
          </Button>
          <Link to="/home" className="logo">
            Relux Hub
          </Link>
        </div>

        <ul className="navlinks">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <Link to="/becomeASeller">Become a Seller</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
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
    </nav>
  );
};

export default Navbar;
