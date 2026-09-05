import { connectRealtimeSocket, onRealtimeEvent } from "./realtimeSocket";

export function connectReportSocket() {
  return connectRealtimeSocket();
}

export function onReportUpdated(callback) {
  return onRealtimeEvent("report:updated", callback);
}
