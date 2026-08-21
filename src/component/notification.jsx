import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCheck,
  CheckCircle2,
  CalendarClock,
  ClipboardCheck,
  CreditCard,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  formatNotificationTime,
  useNotifications,
} from "@/hooks/useNotifications";
import "./notification.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "orders", label: "Orders" },
  { id: "payments", label: "Payments" },
];

const ICONS = {
  orders: CheckCircle2,
  payments: CreditCard,
  listings: ClipboardCheck,
  bids: CalendarClock,
  system: Megaphone,
};

const NOTIFICATIONS_PREF_KEY = "relux-notifications-enabled";

function NotificationBody({ message, highlight }) {
  if (!highlight) {
    return message;
  }

  const parts = message.split(highlight);
  if (parts.length === 1) {
    return (
      <>
        {message}{" "}
        <strong className="notification-highlight">{highlight}</strong>
      </>
    );
  }

  return parts.map((part, index) => (
    <React.Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? (
        <strong className="notification-highlight">{highlight}</strong>
      ) : null}
    </React.Fragment>
  ));
}

const Notification = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const {
    notifications,
    loading,
    error,
    refresh,
    markAllAsRead,
  } = useNotifications(activeFilter);
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
          "Notifications are blocked in your browser. Enable them in browser settings to receive alerts.",
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

  const handleNotificationClick = async (item) => {
    navigate(`/notification/${item.id}`);
  };

  return (
    <div className="notification-page">
      <div className="notification-permission-bar">
        <span className="notification-permission-label">Allow browser alerts</span>
        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Allow browser alerts"
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
          disabled={loading || notifications.every((item) => !item.unread)}
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

      {loading && (
        <p className="notification-status" role="status">
          Loading notifications...
        </p>
      )}

      {error && !loading && (
        <div className="notification-status notification-status--error" role="alert">
          <p>{error}</p>
          <Button type="button" variant="outline" onClick={refresh}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <p className="notification-status">
          No notifications yet. Activity on your orders, listings, and bids will appear here.
        </p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <Card className="notification-list-card py-0 gap-0 ring-0 shadow-none">
          <CardContent className="notification-list-content">
            {notifications.map((item, index) => {
              const Icon = ICONS[item.category] ?? CheckCircle2;
              const isLast = index === notifications.length - 1;

              return (
                <article
                  key={item.id}
                  className={`notification-item ${
                    item.unread ? "is-unread" : ""
                  } ${isLast ? "is-last" : ""} notification-item--clickable`}
                  onClick={() => handleNotificationClick(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleNotificationClick(item);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {item.imageUrl ? (
                    <div className="notification-icon notification-icon--image">
                      <img alt="" src={item.imageUrl} />
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
                        {formatNotificationTime(item.createdAt)}
                      </span>
                    </div>
                    <p className="notification-item-text">
                      <NotificationBody
                        message={item.message}
                        highlight={item.highlight}
                      />
                    </p>
                    <Link
                      to={`/notification/${item.id}`}
                      className="notification-item-link"
                      onClick={(event) => event.stopPropagation()}
                    >
                      View details
                    </Link>
                  </div>
                </article>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notification;
