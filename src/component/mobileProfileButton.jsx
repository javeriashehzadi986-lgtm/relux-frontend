import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPostAuthPath } from "@/utils/authRedirect";
import { isDashboardRoute } from "@/utils/dashboardSidebar";
import "./mobileProfileButton.css";

function isOnProfileArea(pathname) {
  return (
    isDashboardRoute(pathname) ||
    pathname === "/seller-pending" ||
    pathname === "/seller-rejected"
  );
}

const MobileProfileButton = () => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  if (loading || isOnProfileArea(location.pathname)) {
    return null;
  }

  const path =
    isAuthenticated && user ? getPostAuthPath(user, null) : "/login";
  const label = isAuthenticated ? "Profile" : "Sign in";

  return (
    <Link
      to={path}
      state={!isAuthenticated ? { from: location.pathname } : undefined}
      className="mobile-profile-btn"
      aria-label={
        isAuthenticated ? "Go to your profile" : "Sign in to your account"
      }
    >
      <span className="mobile-profile-btn__icon" aria-hidden="true">
        <User size={20} strokeWidth={2} />
      </span>
      <span className="mobile-profile-btn__label">{label}</span>
    </Link>
  );
};

export default MobileProfileButton;
