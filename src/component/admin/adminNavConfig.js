export const ADMIN_NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ path: "/admin", label: "Dashboard", icon: "dashboard", end: true }],
  },
  {
    label: "Marketplace",
    items: [
      { path: "/admin/users", label: "Users", icon: "group" },
      { path: "/admin/seller-verification", label: "Seller Verification", icon: "verified_user" },
      { path: "/admin/products", label: "Products", icon: "inventory_2" },
      { path: "/admin/categories", label: "Categories", icon: "category" },
    ],
  },
  {
    label: "Orders",
    items: [
      { path: "/admin/resale-orders", label: "Resale Orders", icon: "shopping_bag" },
      { path: "/admin/rental-orders", label: "Rental Orders", icon: "event_available" },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/admin/reviews", label: "Reviews", icon: "rate_review" },
      { path: "/admin/payments", label: "Payments", icon: "payments" },
      { path: "/admin/notifications", label: "Notifications", icon: "notifications" },
      { path: "/admin/support", label: "Support Center", icon: "support_agent" },
    ],
  },
  {
    label: "Account",
    items: [{ path: "/admin/profile", label: "My Profile", icon: "person" }],
  },
];

export const ADMIN_USER = {
  name: "Alex Rivera",
  role: "Super Admin",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB318p0ASk7p2tO95wsx8Jq0kaTgr3MOqb-ncub0SBhW1z4zMezEl2iqzlSDl1uPBuRWmHuLJdKS-l9PzeXhdMoZQSXiE3LrnD1VXmSveP9246LG8c7dAtd0IHfhfnNyoUdKCFZEOB-44LwwYKFarIHtdYFkHzMEqzkNOLwDVsx_oycj8gcYVv7zrZ9yYECLZwgWj7s8DCPXVuCQfrbLRP3BpapO4VjS2m977VU4TsSUKb-YAsMshc-lrMpAapx3k_nq2FO-FGV9-4",
};
