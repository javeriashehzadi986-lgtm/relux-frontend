import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
  getRealtimeSocket,
} from "./realtimeSocket";

export function connectChatSocket() {
  return connectRealtimeSocket();
}

export function getChatSocket() {
  return getRealtimeSocket();
}

export function disconnectChatSocket() {
  disconnectRealtimeSocket();
}

export function joinConversation(conversationId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:join", { conversationId });
}

export function leaveConversation(conversationId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:leave", { conversationId });
}

export function emitConversationRead(conversationId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit("conversation:read", { conversationId });
}

export function emitTypingStart(conversationId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit("typing:start", { conversationId });
}

export function emitTypingStop(conversationId) {
  const socket = getRealtimeSocket();
  if (!socket?.connected || !conversationId) return;
  socket.emit("typing:stop", { conversationId });
}

export function sendChatMessage(conversationId, text, image = "") {
  return new Promise((resolve, reject) => {
    const socket = getRealtimeSocket();
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
