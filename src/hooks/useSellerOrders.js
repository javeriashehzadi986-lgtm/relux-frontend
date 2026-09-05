import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshPublicCatalog } from "@/data/catalogStore";
import api from "@/services/api";
import { connectOrderSocket, onOrderUpdated } from "@/services/orderSocket";

function mergeOrderList(prev, nextOrder) {
  if (!nextOrder?.id) return prev;
  const idx = prev.findIndex((o) => String(o.id) === String(nextOrder.id));
  if (idx === -1) {
    return [nextOrder, ...prev];
  }
  const copy = [...prev];
  copy[idx] = { ...copy[idx], ...nextOrder };
  return copy;
}

export function useSellerOrders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(async (options = {}) => {
    const silent = Boolean(options.silent);

    if (!isAuthenticated || user?.role !== "seller") {
      setOrders([]);
      if (!silent) setLoading(false);
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError("");
    try {
      await refreshPublicCatalog();
      const data = await api.getMySellerOrders();
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      if (!silent) {
        setOrders([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "seller") return undefined;

    const handleFocus = () => {
      refreshOrders({ silent: true });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshOrders({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, refreshOrders, user?.role]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "seller") return undefined;

    const socket = connectOrderSocket();
    if (!socket) return undefined;

    let refreshTimer = null;
    const scheduleSilentRefresh = () => {
      if (refreshTimer) return;
      refreshTimer = window.setTimeout(() => {
        refreshTimer = null;
        refreshOrders({ silent: true });
      }, 250);
    };

    const handleOrderUpdated = (payload) => {
      if (payload?.order) {
        setOrders((prev) => mergeOrderList(prev, payload.order));
      }
      scheduleSilentRefresh();
    };

    const unsubscribe = onOrderUpdated(handleOrderUpdated);
    const onConnect = () => {
      scheduleSilentRefresh();
    };
    const onReconnect = () => {
      scheduleSilentRefresh();
    };

    socket.on("connect", onConnect);
    socket.io?.on?.("reconnect", onReconnect);
    if (socket.connected) {
      scheduleSilentRefresh();
    } else {
      socket.connect();
    }

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      socket.off("connect", onConnect);
      socket.io?.off?.("reconnect", onReconnect);
      unsubscribe();
    };
  }, [isAuthenticated, refreshOrders, user?.role]);

  const approveOrder = useCallback(
    async (orderId) => {
      await api.approveSellerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const rejectOrder = useCallback(
    async (orderId) => {
      await api.rejectSellerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const completeOrder = useCallback(
    async (orderId) => {
      await api.completeSellerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const shipOrder = useCallback(
    async (orderId) => {
      await api.shipSellerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const confirmReturn = useCallback(
    async (orderId) => {
      await api.confirmSellerOrderReturn(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const disputeReturn = useCallback(
    async (orderId, body = {}) => {
      await api.disputeSellerRentalReturn(orderId, body);
      await refreshOrders();
    },
    [refreshOrders],
  );

  return {
    orders,
    loading,
    error,
    refreshOrders,
    approveOrder,
    rejectOrder,
    completeOrder,
    shipOrder,
    confirmReturn,
    disputeReturn,
  };
}
