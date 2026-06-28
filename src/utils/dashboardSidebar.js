const STORAGE_KEY = "relux-dashboard-sidebar-open";
const EVENT_NAME = "relux-dashboard-sidebar-change";

export function isDashboardSidebarOpen() {
  return sessionStorage.getItem(STORAGE_KEY) !== "false";
}

export function setDashboardSidebarOpen(isOpen) {
  sessionStorage.setItem(STORAGE_KEY, String(isOpen));
  document.body.classList.toggle("dashboard-sidebar-closed", !isOpen);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function toggleDashboardSidebar() {
  setDashboardSidebarOpen(!isDashboardSidebarOpen());
}

export function syncDashboardSidebarToBody() {
  document.body.classList.toggle(
    "dashboard-sidebar-closed",
    !isDashboardSidebarOpen(),
  );
}

export function resetDashboardSidebar() {
  document.body.classList.remove("dashboard-sidebar-closed");
}

export function subscribeDashboardSidebar(callback) {
  const handler = () => callback(isDashboardSidebarOpen());
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function isDashboardRoute(pathname) {
  return (
    pathname === "/profile" ||
    pathname === "/wishlist" ||
    pathname === "/sellerProfile" ||
    pathname === "/addListing"
  );
}
