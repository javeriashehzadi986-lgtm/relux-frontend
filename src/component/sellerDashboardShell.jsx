import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  ShoppingBag,
  HelpCircle,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./profile.css";

const SIDEBAR_ITEMS = [
  { id: "listings", label: "My Listings", icon: ClipboardList, to: "/sellerProfile?section=listings" },
  { id: "orders", label: "Orders & Requests", icon: ShoppingBag, to: "/sellerProfile?section=orders" },
  { id: "support", label: "Support Center", icon: HelpCircle, to: "/sellerProfile?section=support" },
  { id: "settings", label: "Settings", icon: Settings, to: "/sellerProfile?section=settings" },
  { id: "profile", label: "My Profile", icon: User, to: "/sellerProfile" },
];

const WIDE_SECTIONS = new Set(["listings", "orders", "support", "settings"]);

export function SellerDashboardShell({ activeSection = "listings", children }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isWide = WIDE_SECTIONS.has(activeSection);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const renderSidebarNav = (className = "") => (
    <nav className={`profile-sidebar-nav ${className}`.trim()}>
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            className={`profile-sidebar-link ${
              isActive ? "profile-sidebar-link--active" : ""
            }`}
            asChild
          >
            <Link to={item.to}>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.25 : 1.75}
                fill={item.id === "profile" && isActive ? "currentColor" : "none"}
              />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="profile-page">
      <aside className="profile-sidebar" aria-label="Seller navigation">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {renderSidebarNav()}
        <div className="profile-sidebar-footer">
          <Button
            type="button"
            variant="ghost"
            className="profile-sidebar-link profile-sidebar-link--logout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <div className="profile-mobile-nav">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {renderSidebarNav("profile-sidebar-nav--mobile")}
      </div>

      <main className={`profile-main ${isWide ? "profile-main--wide" : ""}`.trim()}>
        {children}
      </main>

      {showLogoutConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seller-shell-logout-title"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle id="seller-shell-logout-title" className="profile-logout-modal-title">
                Log out?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                Are you sure you want to log out of your account?
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="profile-logout-confirm-btn"
                onClick={handleLogoutConfirm}
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
