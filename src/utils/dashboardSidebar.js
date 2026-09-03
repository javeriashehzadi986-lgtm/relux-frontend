const STORAGE_KEY = "relux-dashboard-sidebar-open";
const EVENT_NAME = "relux-dashboard-sidebar-change";

function isDesktopDashboard() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function isDashboardSidebarOpen() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  // Default: open on desktop, open on mobile too (tabs stay either way)
  return true;
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
  const isOpen = isDashboardSidebarOpen();
  document.body.classList.toggle("dashboard-sidebar-closed", !isOpen);
}

export function resetDashboardSidebar() {
  sessionStorage.removeItem(STORAGE_KEY);
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

export function isDesktopDashboardViewport() {
  return isDesktopDashboard();
}
