const STORAGE_KEY = "relux-admin-sidebar-open";
const EVENT_NAME = "relux-admin-sidebar-change";

function isDesktop() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function isAdminSidebarOpen() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return isDesktop();
}

export function setAdminSidebarOpen(isOpen) {
  sessionStorage.setItem(STORAGE_KEY, String(isOpen));
  document.body.classList.toggle("admin-sidebar-closed", !isOpen);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function toggleAdminSidebar() {
  setAdminSidebarOpen(!isAdminSidebarOpen());
}

export function syncAdminSidebarToBody() {
  document.body.classList.toggle("admin-sidebar-closed", !isAdminSidebarOpen());
}

export function resetAdminSidebar() {
  sessionStorage.removeItem(STORAGE_KEY);
  document.body.classList.remove("admin-sidebar-closed");
}

export function subscribeAdminSidebar(callback) {
  const handler = () => callback(isAdminSidebarOpen());
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
