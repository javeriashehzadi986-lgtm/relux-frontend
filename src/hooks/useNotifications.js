import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

export function formatNotificationTime(dateValue) {
  if (!dateValue) return "";

  const diffMs = Date.now() - new Date(dateValue).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(dateValue).toLocaleDateString("en-PK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function useNotifications(activeFilter = "all") {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getMyNotifications(activeFilter);
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
      setError(err.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, unread: false, read: true })),
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.message || "Could not mark notifications as read");
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, unread: false, read: true } : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setError(err.message || "Could not update notification");
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: load,
    markAllAsRead,
    markAsRead,
  };
}
