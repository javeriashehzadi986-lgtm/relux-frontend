import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

const POLL_MS = 15000;

export function useUnreadMessageCount() {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await api.getUnreadMessageCount();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    load();

    if (!isAuthenticated) return undefined;

    const timer = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(timer);
  }, [isAuthenticated, load]);

  return { unreadCount, refresh: load };
}
