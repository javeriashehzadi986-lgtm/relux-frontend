import { io } from "socket.io-client";
import { api } from "./api";

let socket = null;

function getSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return window.location.origin;
}

/**
 * Single shared Socket.IO connection for chat, orders, support, and auctions.
 * Must stay connected whenever the user is authenticated so order/support
 * pages receive realtime events without visiting Messages first.
 */
export function connectRealtimeSocket() {
  const token = api.getToken();
  if (!token) {
    disconnectRealtimeSocket();
    return null;
  }

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(getSocketUrl(), {
    path: "/socket.io",
    // Refresh JWT on every (re)connect so room auth does not go stale.
    auth: (cb) => {
      const latest = api.getToken();
      cb(latest ? { token: latest } : {});
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
  });

  return socket;
}

export function getRealtimeSocket() {
  return socket;
}

export function disconnectRealtimeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onRealtimeEvent(event, callback) {
  const active = connectRealtimeSocket();
  if (!active) return () => {};

  active.on(event, callback);
  return () => {
    active.off(event, callback);
  };
}
