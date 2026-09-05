import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshPublicCatalog } from "@/data/catalogStore";
import api from "@/services/api";

export function useBuyerOrders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(async (options = {}) => {
    const silent = Boolean(options.silent);

    if (!isAuthenticated || user?.role !== "buyer") {
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
      const data = await api.getMyBuyerOrders();
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
    if (!isAuthenticated || user?.role !== "buyer") return undefined;

    const refreshOnFocus = () => {
      refreshOrders();
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        refreshOrders();
      }
    });

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [isAuthenticated, refreshOrders, user?.role]);

  const requestRental = useCallback(
    async ({ dressId, size, rentStart, rentEnd, rentalDays, sellerId, customerName }) => {
      if (!dressId) {
        throw new Error("Product is required");
      }
      if (!sellerId) {
        throw new Error(
          "This listing has no linked seller. Rent from a seller-submitted product.",
        );
      }

      const data = await api.createRentalRequest({
        productId: dressId,
        size,
        rentStart,
        rentEnd,
        rentalDays,
        customerName,
      });

      await refreshOrders();
      return data.order;
    },
    [refreshOrders],
  );

  const cancelOrder = useCallback(
    async (orderId) => {
      await api.cancelBuyerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const removeOrder = useCallback(
    async (orderId) => {
      await api.removeBuyerOrder(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const confirmReceived = useCallback(
    async (orderId) => {
      await api.confirmBuyerOrderReceived(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const markReturned = useCallback(
    async (orderId) => {
      await api.markBuyerOrderReturned(orderId);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const disputeSaleDelivery = useCallback(
    async (orderId, body) => {
      await api.disputeSaleDelivery(orderId, body);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const disputeRentalDelivery = useCallback(
    async (orderId, body) => {
      await api.disputeRentalDelivery(orderId, body);
      await refreshOrders();
    },
    [refreshOrders],
  );

  const disputeDelivery = useCallback(
    async (order, body) => {
      if (order?.type === "rental") {
        return disputeRentalDelivery(order.id, body);
      }
      return disputeSaleDelivery(order.id, body);
    },
    [disputeRentalDelivery, disputeSaleDelivery],
  );

  return {
    orders,
    loading,
    error,
    refreshOrders,
    requestRental,
    cancelOrder,
    removeOrder,
    confirmReceived,
    markReturned,
    disputeSaleDelivery,
    disputeRentalDelivery,
    disputeDelivery,
  };
}
