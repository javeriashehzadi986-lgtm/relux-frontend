import { connectRealtimeSocket, onRealtimeEvent } from "./realtimeSocket";

export function connectOrderSocket() {
  return connectRealtimeSocket();
}

export function onOrderUpdated(callback) {
  return onRealtimeEvent("order:updated", callback);
}
