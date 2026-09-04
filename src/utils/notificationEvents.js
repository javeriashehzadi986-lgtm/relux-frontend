export const NOTIFICATIONS_UPDATED_EVENT = "relux-notifications-updated";

export function emitNotificationsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
