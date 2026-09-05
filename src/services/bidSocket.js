import { connectRealtimeSocket, getRealtimeSocket, onRealtimeEvent } from "./realtimeSocket";

export function connectBidSocket() {
  return connectRealtimeSocket();
}

export function joinAuction(productId) {
  const socket = connectRealtimeSocket();
  if (!socket?.connected || !productId) return;
  socket.emit("auction:join", { productId });
}

export function leaveAuction(productId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !productId) return;
  socket.emit("auction:leave", { productId });
}

export function onAuctionUpdate(callback) {
  return onRealtimeEvent("auction:update", callback);
}

export function onAuctionViewerUpdate(callback) {
  return onRealtimeEvent("auction:viewer", callback);
}
