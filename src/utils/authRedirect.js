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

/** Where "Apply as Seller" should send the user */
export function getSellerApplicationPath(isAuthenticated) {
  return isAuthenticated ? "/sellerVerification" : "/signup";
}

/** Navigation state when sending guests to signup before seller application */
export function getSellerSignupState() {
  return { from: "/sellerVerification", intent: "seller" };
}

export const NAVBAR_AUTH_LABEL = "Sign up";

export function getNavbarButtonLabel(user) {
  if (!user) return NAVBAR_AUTH_LABEL;

  if (user.role === "admin") return "Admin";

  if (user.role === "seller") {
    if (user.status === "pending") return "Pending Approval";
    if (user.status === "rejected") return "Application Rejected";
    return "Seller Dashboard";
  }

  return "My Profile";
}

export function getNavbarButtonConfig(user, { isAuthenticated, loading } = {}) {
  if (loading || !isAuthenticated || !user) {
    return {
      label: NAVBAR_AUTH_LABEL,
      path: "/signup",
      isGuest: true,
    };
  }

  return {
    label: getNavbarButtonLabel(user),
    path: getPostAuthPath(user),
    isGuest: false,
  };
}
