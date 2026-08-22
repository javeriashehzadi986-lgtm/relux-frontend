import { io } from "socket.io-client";
import { api } from "./api";
import { getChatSocket } from "./chatSocket";

let bidOnlySocket = null;

function getSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return window.location.origin;
}

function getOrCreateSocket() {
  const chatSocket = getChatSocket();
  if (chatSocket) {
    return chatSocket;
  }

  if (bidOnlySocket?.connected) {
    return bidOnlySocket;
  }

  if (bidOnlySocket) {
    const token = api.getToken();
    bidOnlySocket.auth = token ? { token } : {};
    bidOnlySocket.connect();
    return bidOnlySocket;
  }

  const token = api.getToken();
  bidOnlySocket = io(getSocketUrl(), {
    auth: token ? { token } : {},
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return bidOnlySocket;
}

export function connectBidSocket() {
  return getOrCreateSocket();
}

export function joinAuction(productId) {
  const socket = getOrCreateSocket();
  if (!socket?.connected || !productId) return;
  socket.emit("auction:join", { productId });
}

export function leaveAuction(productId) {
  const socket = getOrCreateSocket();
  if (!socket?.connected || !productId) return;
  socket.emit("auction:leave", { productId });
}

export function onAuctionUpdate(callback) {
  const socket = getOrCreateSocket();
  if (!socket) return () => {};

  socket.on("auction:update", callback);
  return () => {
    socket.off("auction:update", callback);
  };
}

export function onAuctionViewerUpdate(callback) {
  const socket = getOrCreateSocket();
  if (!socket) return () => {};

  socket.on("auction:viewer", callback);
  return () => {
    socket.off("auction:viewer", callback);
  };
}
