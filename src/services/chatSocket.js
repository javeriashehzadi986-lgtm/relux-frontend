import { io } from "socket.io-client";
import { api } from "./api";

let socket = null;

function getSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return window.location.origin;
}

export function connectChatSocket() {
  const token = api.getToken();
  if (!token) {
    disconnectChatSocket();
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

  return socket;
}

export function getChatSocket() {
  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinConversation(conversationId) {
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:join", { conversationId });
}

export function leaveConversation(conversationId) {
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:leave", { conversationId });
}

export function emitConversationRead(conversationId) {
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:read", { conversationId });
}

export function emitTypingStart(conversationId) {
  if (!socket?.connected || !conversationId) return;
  socket.emit("typing:start", { conversationId });
}

export function emitTypingStop(conversationId) {
  if (!socket?.connected || !conversationId) return;
  socket.emit("typing:stop", { conversationId });
}

export function sendChatMessage(conversationId, text, image = "") {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error("Chat connection is not ready"));
      return;
    }

    socket.emit(
      "message:send",
      { conversationId, text, image },
      (response) => {
        if (response?.ok) {
          resolve(response.message);
        } else {
          reject(new Error(response?.message || "Failed to send message"));
        }
      },
    );
  });
}
