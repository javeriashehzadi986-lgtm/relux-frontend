import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { applyAuctionApiData } from "@/data/dressCatalog";
import {
  connectBidSocket,
  joinAuction,
  leaveAuction,
  onAuctionUpdate,
  onAuctionViewerUpdate,
} from "@/services/bidSocket";

export function useAuctionSocket({
  productId,
  enabled = true,
  onUpdate,
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (!enabled || !productId) return undefined;

    const socket = connectBidSocket();
    if (!socket) return undefined;

    const handleConnect = () => {
      joinAuction(productId);
    };

    if (socket.connected) {
      joinAuction(productId);
    } else {
      socket.on("connect", handleConnect);
    }

    const unsubscribeUpdate = onAuctionUpdate((payload) => {
      if (String(payload?.productId) !== String(productId)) return;

      onUpdate?.((currentDress) =>
        applyAuctionApiData(currentDress, {
          summary: payload.summary,
          history: payload.history ?? [],
        }),
      );

      if (user) {
        api
          .getProductBids(productId)
          .then((data) => {
            onUpdate?.((currentDress) => applyAuctionApiData(currentDress, data));
          })
          .catch(() => {});
      }
    });

    const unsubscribeViewer = onAuctionViewerUpdate((payload) => {
      if (String(payload?.productId) !== String(productId)) return;

      onUpdate?.((currentDress) =>
        applyAuctionApiData(currentDress, {
          summary: payload.summary ?? {},
          history: payload.history ?? currentDress?.bidHistory ?? [],
          viewer: payload.viewer ?? null,
        }),
      );
    });

    return () => {
      socket.off("connect", handleConnect);
      leaveAuction(productId);
      unsubscribeUpdate();
      unsubscribeViewer();
    };
  }, [enabled, productId, user, onUpdate]);
}
