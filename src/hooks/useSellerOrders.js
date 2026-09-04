import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshPublicCatalog } from "@/data/catalogStore";
import api from "@/services/api";

export function useSellerOrders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "seller") {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await refreshPublicCatalog();
      const data = await api.getMySellerOrders();
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "seller") return undefined;

    const handleFocus = () => {
      refreshOrders();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refreshOrders();
      }
    });

    return () => {
      window.removeEventListener("focus", handleFocus);
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
