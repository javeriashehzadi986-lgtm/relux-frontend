import { io } from "socket.io-client";
import { api } from "./api";
import { getChatSocket } from "./chatSocket";

let reportOnlySocket = null;

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

  if (reportOnlySocket?.connected) {
    return reportOnlySocket;
  }

  if (reportOnlySocket) {
    const token = api.getToken();
    reportOnlySocket.auth = token ? { token } : {};
    reportOnlySocket.connect();
    return reportOnlySocket;
  }

  const token = api.getToken();
  if (!token) {
    return null;
  }

  reportOnlySocket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return reportOnlySocket;
}

export function connectReportSocket() {
  return getOrCreateSocket();
}

export function onReportUpdated(callback) {
  const socket = getOrCreateSocket();
  if (!socket) return () => {};

  socket.on("report:updated", callback);
  return () => {
    socket.off("report:updated", callback);
  };
}
