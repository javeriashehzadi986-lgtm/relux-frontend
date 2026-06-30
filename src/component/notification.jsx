import React, { useMemo, useState } from "react";
import {
  CheckCheck,
  CheckCircle2,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import "./notification.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "orders", label: "Orders" },
  { id: "payments", label: "Payments" },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "booking",
    title: "Booking Confirmed",
    time: "2 hours ago",
    unread: true,
    category: "orders",
    icon: CheckCircle2,
    iconVariant: "primary",
    body: (
      <>
        Your dress booking for the{" "}
        <strong className="notification-highlight">Emerald Silk Drape</strong> has
        been confirmed. Get ready to shine!
      </>
    ),
  },
  {
    id: "return",
    title: "Return Reminder",
    time: "5 hours ago",
    unread: false,
    category: "orders",
    icon: CalendarClock,
    iconVariant: "secondary",
    body: (
      <>
        Your rental return date for the{" "}
        <em className="notification-italic">Champagne Zardozi</em> is tomorrow.
        Please prepare for courier pickup.
      </>
    ),
  },
  {
    id: "listing",
    title: "Listing Accepted",
    time: "1 day ago",
    unread: false,
    category: "orders",
    icon: ClipboardCheck,
    iconVariant: "tertiary",
    body: (
      <>
        A seller has accepted your listing request for the{" "}
        <strong>Ivory Sculpt</strong> gown. Your item is now live.
      </>
    ),
  },
  {
    id: "collection",
    title: "New Collection",
    time: "2 days ago",
    unread: false,
    category: "orders",
    image:
      "https://lh3.googleusercontent.com/aida-public/ADBb0uiFJh-4krbzfm2r7ndHuGhvCoCWU4sh5muhVNh4dTiDAJNOsaMX330FJgowNJhpgEwgto2z63Eu67OqBo4tPwe6cZmebAYqoBC9E0gn4SNd_0BZlBce1WBK1OtlWRBzGfwLdXPLb97iX3UadKqY2mkm3WxREsTkvBSZetpxdUry0-X4hN8sFxq0df_bnhkd-lDPWu1DOoB_Ezdyzd3MVXk7EEwOWRgGelEZ_18oy1wT6Wo3Fy3YROcht65vQm03K3wxyUjru_fzRTQ",
    body: (
      <>
        The new bridal collection has been added to the atelier. Explore curated
        looks for your special day.
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment Successful",
    time: "3 days ago",
    unread: false,
    category: "payments",
    icon: CreditCard,
    iconVariant: "muted",
    body: (
      <>
        Payment for your recent rental has been completed successfully. Thank you
        for choosing Relux Hub.
      </>
    ),
  },
];

const NOTIFICATIONS_PREF_KEY = "relux-notifications-enabled";

const Notification = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      return localStorage.getItem(NOTIFICATIONS_PREF_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [permissionMessage, setPermissionMessage] = useState("");

  const handleNotificationToggle = async () => {
    setPermissionMessage("");

    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      try {
        localStorage.setItem(NOTIFICATIONS_PREF_KEY, "false");
      } catch {
        // ignore storage errors
      }
      return;
    }

    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setNotificationsEnabled(true);
        try {
          localStorage.setItem(NOTIFICATIONS_PREF_KEY, "true");
        } catch {
          // ignore storage errors
        }
        return;
      }

      if (permission === "denied") {
        setPermissionMessage(
          "Notifications are blocked in your browser. Enable them in browser settings to receive alerts."
        );
        return;
      }

      setPermissionMessage("Notification permission was not granted.");
      return;
    }

    setNotificationsEnabled(true);
    try {
      localStorage.setItem(NOTIFICATIONS_PREF_KEY, "true");
    } catch {
      // ignore storage errors
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === "unread") return item.unread;
      if (activeFilter === "orders") return item.category === "orders";
      if (activeFilter === "payments") return item.category === "payments";
      return true;
    });
  }, [notifications, activeFilter]);

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false }))
    );
  };

  return (
    <div className="notification-page">
      <div className="notification-permission-bar">
        <span className="notification-permission-label">Allow notifications</span>
        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Allow notifications"
          className={`notification-toggle ${
            notificationsEnabled ? "notification-toggle--on" : ""
          }`}
          onClick={handleNotificationToggle}
        >
          <span className="notification-toggle-thumb" />
        </button>
      </div>

      {permissionMessage && (
        <p className="notification-permission-message" role="alert">
          {permissionMessage}
        </p>
      )}

      <header className="notification-header">
        <div className="notification-header-copy">
          <h1>Notifications</h1>
          <p>Stay updated with your atelier activities and rentals.</p>
        </div>
        <Button
          type="button"
          size="sm"
          className="notification-mark-read-btn"
          onClick={markAllAsRead}
        >
          <CheckCheck size={16} />
          Mark all as read
        </Button>
      </header>

      <div className="notification-filters">
        {FILTERS.map((filter) => (
          <Button
            key={filter.id}
            type="button"
            variant={activeFilter === filter.id ? "default" : "secondary"}
            size="sm"
            className={`notification-filter-btn ${
              activeFilter === filter.id ? "is-active" : ""
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Card className="notification-list-card py-0 gap-0 ring-0 shadow-none">
        <CardContent className="notification-list-content">
          {filteredNotifications.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === filteredNotifications.length - 1;

            return (
              <article
                key={item.id}
                className={`notification-item ${
                  item.unread ? "is-unread" : ""
                } ${isLast ? "is-last" : ""}`}
              >
                {item.image ? (
                  <div className="notification-icon notification-icon--image">
                    <img alt="" src={item.image} />
                  </div>
                ) : (
                  <div
                    className={`notification-icon notification-icon--${item.iconVariant}`}
                  >
                    <Icon size={22} />
                  </div>
                )}

                <div className="notification-item-body">
                  <div className="notification-item-top">
                    <CardTitle
                      className={`notification-item-title ${
                        item.unread ? "is-bold" : ""
                      }`}
                    >
                      {item.title}
                    </CardTitle>
                    <span
                      className={`notification-time ${
                        item.unread ? "is-unread" : ""
                      }`}
                    >
                      {item.unread && <span className="notification-dot" />}
                      {item.time}
                    </span>
                  </div>
                  <p className="notification-item-text">{item.body}</p>
                </div>
              </article>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notification;
