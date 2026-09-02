const STORAGE_KEY = "relux-dashboard-sidebar-open";
const EVENT_NAME = "relux-dashboard-sidebar-change";

function isDesktopDashboard() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function isDashboardSidebarOpen() {
  if (isDesktopDashboard()) {
    return true;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return true;
}

export function setDashboardSidebarOpen(isOpen) {
  const effectiveOpen = isDesktopDashboard() ? true : isOpen;
  sessionStorage.setItem(STORAGE_KEY, String(effectiveOpen));
  document.body.classList.toggle("dashboard-sidebar-closed", !effectiveOpen);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function toggleDashboardSidebar() {
  if (isDesktopDashboard()) {
    return;
  }
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
