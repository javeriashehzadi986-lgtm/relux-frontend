import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import {
  Heart,
  Bell,
  Menu,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isDashboardRoute,
  isDashboardSidebarOpen,
  resetDashboardSidebar,
  setDashboardSidebarOpen,
  subscribeDashboardSidebar,
  syncDashboardSidebarToBody,
  toggleDashboardSidebar,
} from "@/utils/dashboardSidebar";

const Navbar = () => {
  const location = useLocation();
  const onDashboard = isDashboardRoute(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(() => isDashboardSidebarOpen());

  useEffect(() => {
    if (onDashboard) {
      setDashboardSidebarOpen(true);
      syncDashboardSidebarToBody();
    } else {
      resetDashboardSidebar();
      setDashboardSidebarOpen(false);
    }

    setSidebarOpen(isDashboardSidebarOpen());
    return subscribeDashboardSidebar(setSidebarOpen);
  }, [onDashboard, location.pathname]);

  const handleMenuClick = () => {
    if (!onDashboard) return;
    toggleDashboardSidebar();
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-start">
          {onDashboard && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              className={`navbar-menu-btn ${
                sidebarOpen ? "navbar-menu-btn--active" : ""
              }`}
              aria-label={
                sidebarOpen ? "Hide dashboard menu" : "Show dashboard menu"
              }
              aria-expanded={sidebarOpen}
              onClick={handleMenuClick}
            >
              <Menu size={22} />
            </Button>
          )}
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
            <Link to="/messages" aria-label="Messages">
              <MessageCircle size={22} />
            </Link>

            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={22} />
            </Link>

            <Link to="/notification" aria-label="Notifications">
              <Bell size={22} />
            </Link>
          </div>

          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
