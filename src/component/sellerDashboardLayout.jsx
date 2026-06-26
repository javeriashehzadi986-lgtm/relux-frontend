import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ClipboardList,
  ShoppingBag,
  User,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./sellerDashboard.css";

const navItems = [
  {
    id: "listings",
    label: "My Listings",
    icon: ClipboardList,
    to: "/myListing",
  },
  {
    id: "orders",
    label: "Orders & Requests",
    icon: ShoppingBag,
    to: "/ordersRequests",
  },
  { id: "profile", label: "Profile", icon: User, to: "/sellerDashboard" },
  {
    id: "support",
    label: "Support Center",
    icon: HelpCircle,
    to: "/supportCenter",
  },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

function SellerDashboardLayout({ active, children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );
  const [logoutOpen, setLogoutOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogoutConfirm = () => {
    setLogoutOpen(false);
    navigate("/login");
  };

  return (
    <div className="seller-dashboard-page">
      <div className="seller-dashboard-topbar">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="seller-dashboard-menu-btn"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? "Hide dashboard menu" : "Show dashboard menu"}
          aria-expanded={sidebarOpen}
        >
          <Menu size={22} strokeWidth={1.75} />
        </Button>
        <span className="seller-dashboard-topbar-title">Dashboard</span>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="seller-dashboard-overlay"
          onClick={closeSidebar}
          aria-label="Close dashboard menu"
        />
      )}

      <div className="seller-dashboard-shell">
        <aside
          className={`seller-dashboard-sidebar ${
            sidebarOpen ? "is-open" : "is-hidden"
          }`}
        >
          <nav className="seller-dashboard-nav">
            <ul>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      asChild
                      variant="ghost"
                      className={`seller-dashboard-nav-link ${
                        active === item.id ? "is-active" : ""
                      }`}
                    >
                      <Link to={item.to}>
                        <Icon size={20} strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="seller-dashboard-sidebar-footer">
            <Separator className="seller-dashboard-nav-separator" />
            <Button
              type="button"
              variant="ghost"
              className="seller-dashboard-logout"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut size={20} strokeWidth={1.75} />
              <span>Logout</span>
            </Button>
          </div>
        </aside>

        <div className="seller-dashboard-content">
          <div className="seller-dashboard-panel">{children}</div>
        </div>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="seller-dashboard-logout-overlay"
          className="seller-dashboard-logout-dialog"
        >
          <div className="seller-dashboard-logout-dialog-icon" aria-hidden="true">
            <LogOut size={22} strokeWidth={1.75} />
          </div>
          <DialogHeader className="seller-dashboard-logout-dialog-header">
            <DialogTitle className="seller-dashboard-logout-dialog-title">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="seller-dashboard-logout-dialog-desc">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="seller-dashboard-logout-dialog-footer">
            <Button
              type="button"
              variant="outline"
              className="seller-dashboard-logout-cancel"
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="seller-dashboard-logout-sure"
              onClick={handleLogoutConfirm}
            >
              Sure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SellerDashboardLayout;
