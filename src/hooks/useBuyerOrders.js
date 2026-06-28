import { useCallback, useSyncExternalStore } from "react";
import {
  addRentalRequest,
  cancelBuyerOrder,
  getBuyerOrdersRevision,
  loadBuyerOrders,
  removeBuyerOrder,
  subscribeBuyerOrdersRevision,
  updateBuyerOrders,
} from "@/data/buyerOrdersStore";

export function useBuyerOrders() {
  useSyncExternalStore(
    subscribeBuyerOrdersRevision,
    getBuyerOrdersRevision,
    getBuyerOrdersRevision,
  );

  const orders = loadBuyerOrders();

  const requestRental = useCallback(
    (payload) => addRentalRequest(payload),
    [],
  );

  const cancelOrder = useCallback((orderId) => {
    cancelBuyerOrder(orderId);
  }, []);

  const removeOrder = useCallback((orderId) => {
    removeBuyerOrder(orderId);
  }, []);

  const setOrders = useCallback((updater) => {
    updateBuyerOrders(updater);
  }, []);

  return {
    orders,
    requestRental,
    cancelOrder,
    removeOrder,
    setOrders,
  };
}
