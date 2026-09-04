import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { NOTIFICATIONS_UPDATED_EVENT } from "@/utils/notificationEvents";

const POLL_MS = 15000;

export function useUnreadNotificationCount() {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await api.getUnreadNotificationCount();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();
    if (!isAuthenticated) return undefined;

    const timer = window.setInterval(load, POLL_MS);
    const onUpdated = () => {
      load();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdated);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onUpdated);
    };
  }, [isAuthenticated, load]);

  return { unreadCount, refresh: load };
}
