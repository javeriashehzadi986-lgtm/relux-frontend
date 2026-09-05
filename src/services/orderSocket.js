import { io } from "socket.io-client";
import { api } from "./api";
import { getChatSocket } from "./chatSocket";

let orderOnlySocket = null;

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

  if (orderOnlySocket?.connected) {
    return orderOnlySocket;
  }

  if (orderOnlySocket) {
    const token = api.getToken();
    orderOnlySocket.auth = token ? { token } : {};
    orderOnlySocket.connect();
    return orderOnlySocket;
  }

  const token = api.getToken();
  if (!token) {
    return null;
  }

  orderOnlySocket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return orderOnlySocket;
}

export function connectOrderSocket() {
  return getOrCreateSocket();
}

export function onOrderUpdated(callback) {
  const socket = getOrCreateSocket();
  if (!socket) return () => {};

  socket.on("order:updated", callback);
  return () => {
    socket.off("order:updated", callback);
  };
}
