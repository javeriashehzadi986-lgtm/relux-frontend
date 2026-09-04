import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNotificationTime } from "@/hooks/useNotifications";
import { getNotificationActions } from "@/utils/notificationActions";
import { emitNotificationsUpdated } from "@/utils/notificationEvents";
import api from "@/services/api";
import "./notification.css";

const ICONS = {
  orders: CheckCircle2,
  payments: CreditCard,
  listings: ClipboardCheck,
  bids: CalendarClock,
  system: Megaphone,
};

const CATEGORY_LABELS = {
  orders: "Orders",
  payments: "Payments",
  listings: "Listings",
  bids: "Bids",
  system: "System",
};

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

function formatFullDate(dateValue) {
  if (!dateValue) return "";
  return new Date(dateValue).toLocaleString("en-PK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNotification() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getNotification(id);
        if (!cancelled) {
          setNotification(data.notification ?? null);
          // Detail fetch marks the item read on the server — refresh nav badge.
          emitNotificationsUpdated();
        }
      } catch (err) {
        if (!cancelled) {
          setNotification(null);
          setError(err.message || "Could not load notification");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadNotification();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="notification-page">
        <p className="notification-status">Loading notification...</p>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="notification-page">
        <Link to="/notification" className="notification-detail-back">
          <ArrowLeft size={18} />
          Back to notifications
        </Link>
        <div className="notification-status notification-status--error" role="alert">
          <p>{error || "Notification not found"}</p>
          <Button type="button" variant="outline" asChild>
            <Link to="/notification">Return to notifications</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = ICONS[notification.category] ?? CheckCircle2;
  const { primary, secondary, nextSteps } = getNotificationActions(notification);

  const goToAction = (action) => {
    if (!action?.path) return;
    navigate(action.path, action.state ? { state: action.state } : undefined);
  };

  return (
    <div className="notification-page">
      <Link to="/notification" className="notification-detail-back">
        <ArrowLeft size={18} />
        Back to notifications
      </Link>

      <Card className="notification-detail-card">
        <CardContent className="notification-detail-content">
          <div className="notification-detail-header">
            {notification.imageUrl ? (
              <div className="notification-icon notification-icon--image notification-detail-icon">
                <img alt="" src={notification.imageUrl} />
              </div>
            ) : (
              <div
                className={`notification-icon notification-icon--${notification.iconVariant} notification-detail-icon`}
              >
                <Icon size={28} />
              </div>
            )}

            <div className="notification-detail-heading">
              <span className="notification-detail-category">
                {CATEGORY_LABELS[notification.category] ?? "Notification"}
              </span>
              <h1>{notification.title}</h1>
              <p className="notification-detail-time">
                {formatFullDate(notification.createdAt)}
              </p>
              <p className="notification-detail-relative">
                {formatNotificationTime(notification.createdAt)}
              </p>
            </div>
          </div>

          {notification.highlight ? (
            <div className="notification-detail-related">
              <span className="notification-detail-related-label">Related to</span>
              <strong>{notification.highlight}</strong>
            </div>
          ) : null}

          <div className="notification-detail-message">
            <p>
              <NotificationBody
                message={notification.message}
                highlight={notification.highlight}
              />
            </p>
          </div>

          {nextSteps.length > 0 ? (
            <div className="notification-detail-next">
              <div className="notification-detail-next-heading">
                <Sparkles size={18} />
                <strong>What to do next</strong>
              </div>
              <ul>
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {primary || secondary ? (
            <div className="notification-detail-actions">
              {primary ? (
                <Button type="button" onClick={() => goToAction(primary)}>
                  {primary.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button type="button" variant="outline" onClick={() => goToAction(secondary)}>
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
