import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { refreshPublicCatalog } from "@/data/catalogStore";
import api from "@/services/api";

export function useBuyerOrders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "buyer") {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await refreshPublicCatalog();
      const data = await api.getMyBuyerOrders();
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

  return {
    orders,
    loading,
    error,
    refreshOrders,
    requestRental,
    cancelOrder,
    removeOrder,
  };
}
