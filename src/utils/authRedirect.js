export function getPostAuthPath(user, returnTo) {
  if (returnTo) return returnTo;

  if (!user) return "/login";

  if (user.role === "admin") return "/admin/profile";

  if (user.role === "seller") {
    if (user.status === "pending") return "/seller-pending";
    if (user.status === "rejected") return "/seller-rejected";
    return "/sellerProfile";
  }

  return "/profile";
}

export const NAVBAR_AUTH_LABEL = "Sign up";

export function getNavbarButtonConfig(user, { isAuthenticated, loading } = {}) {
  if (loading || !isAuthenticated || !user) {
    return {
      label: NAVBAR_AUTH_LABEL,
      path: "/signup",
      isGuest: true,
    };
  }

  return {
    label: NAVBAR_AUTH_LABEL,
    path: getPostAuthPath(user),
    isGuest: false,
  };
}
