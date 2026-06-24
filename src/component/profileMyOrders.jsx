import React, { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "./profileMyOrders.css";

const FILTER_TABS = [
  { id: "all", label: "All Orders" },
  { id: "purchases", label: "Purchases" },
  { id: "rentals", label: "Rentals" },
  { id: "delivered", label: "Delivered" },
  { id: "in-progress", label: "In Progress" },
];

const ORDERS = [
  {
    id: "RLX-10294",
    type: "rental",
    typeLabel: "Rental",
    title: "Zari Embroidered Silk Ensemble",
    variant: "Size: M • Emerald Green",
    meta: [
      { icon: "calendar-check", text: "4 Days Rental" },
      { icon: "check-circle", text: "Payment Paid", highlight: true },
    ],
    amount: "$240.00",
    status: "rental-active",
    statusLabel: "Rental Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWl1Ln5sy_lzXjuKL5bO9sdZnA8wZhzpAqph4Te-beOkNHee3vSnNyYoEJQlR-ma8QV2WJlvuYKDycZT6AREto9x9TRJMXEuM34XJzHc1dVRd-p_Yc5XL3idw3hUvuDoLSfbsHOqQDZVir-PBLXEiJYo3kRDEgdVSZcbQyyDeENhNKhcIcXabmuSrh2YNj7KbAQZmORgGtjbjE8zsx_WgMJnZ8O8o39MBOnoDGOuKP-7_iRrwXzc7iE8wyqwmnMUktWuFzPappm8ao",
    actions: [
      { id: "track", label: "Track Order", variant: "primary", icon: "truck" },
      { id: "details", label: "View Details", variant: "outline" },
      { id: "rent-again", label: "Rent Again", variant: "ghost", icon: "history", alignEnd: true },
    ],
  },
  {
    id: "RLX-10452",
    type: "rental",
    typeLabel: "Rental",
    title: "Sculptural Wool Blazer",
    variant: "Size: 40 • Charcoal Gray",
    meta: [{ icon: "clock", text: "Rental Period: July 01 - July 08" }],
    amount: "$185.00",
    status: "processing",
    statusLabel: "Processing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDY9_eQ9oa-A4ljLCKAcN2dn-NqQHEFETGF1_1uA0dLmxSlssqy5eN0zl6jVfV65Nu23G92HJul2xJen5xr7dc0HQnTl03dpknqqkJng4HVgg1arIggdQTi3p6CM0VAmZk8ax8TGYkrYCiMoc-TzDNh60uIYdPcOHYAZUyF4cLba91RjGZUDu_HnSLHQW-8KVwgr76eBd0q4d8KSKwnkUeebqV90zKkWm-XHFOGOy__l7y8c9KUc5MNKP3LFoK_nkMZl5wWwNf4q5r_",
    actions: [
      { id: "details", label: "View Details", variant: "outline" },
      { id: "cancel", label: "Cancel Request", variant: "danger" },
    ],
  },
];

const META_ICONS = {
  "calendar-check": CalendarCheck,
  "check-circle": CheckCircle2,
  clock: Clock,
};

const ACTION_ICONS = {
  truck: Truck,
  history: History,
};

const matchesFilter = (order, filter) => {
  if (filter === "all") return true;
  if (filter === "purchases") return order.type === "purchase";
  if (filter === "rentals") return order.type === "rental";
  if (filter === "delivered") return order.status === "delivered";
  if (filter === "in-progress") {
    return order.status === "processing" || order.status === "rental-active";
  }
  return true;
};

const ProfileMyOrders = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return ORDERS.filter((order) => {
      const matchesSearch =
        !query ||
        order.title.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      return matchesFilter(order, activeFilter) && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="profile-orders">
      <header className="profile-orders-search-bar">
        <div className="profile-orders-search-wrap">
          <Search
            className="profile-orders-search-icon"
            size={18}
            aria-hidden="true"
          />
          <Input
            type="search"
            className="profile-orders-search"
            placeholder="Search by Order ID or Product Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="profile-orders-hero">
        <div>
          <nav className="profile-orders-breadcrumb" aria-label="Breadcrumb">
            <span>Dashboard</span>
            <ChevronRight size={12} aria-hidden="true" />
            <span className="profile-orders-breadcrumb-current">My Orders</span>
          </nav>
          <h1 className="profile-orders-title">My Orders</h1>
        </div>

        <div className="profile-orders-tabs-wrap">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              className={`profile-orders-tab ${
                activeFilter === tab.id ? "profile-orders-tab--active" : ""
              }`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="profile-orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="profile-order-card">
              <CardContent className="profile-order-card-inner">
                <div className="profile-order-image-wrap">
                  <img alt={order.title} src={order.image} />
                </div>

                <div className="profile-order-body">
                  <div className="profile-order-top">
                    <div>
                      <div className="profile-order-meta-row">
                        <span className="profile-order-id">Order #{order.id}</span>
                        <span
                          className={`profile-order-type profile-order-type--${order.type}`}
                        >
                          {order.typeLabel}
                        </span>
                      </div>
                      <h3 className="profile-order-title">{order.title}</h3>
                      <p className="profile-order-variant">{order.variant}</p>
                      <div className="profile-order-details">
                        {order.meta.map((item) => {
                          const Icon = META_ICONS[item.icon];
                          return (
                            <div key={item.text} className="profile-order-detail">
                              <Icon size={18} aria-hidden="true" />
                              <span
                                className={
                                  item.highlight
                                    ? "profile-order-detail-text--highlight"
                                    : ""
                                }
                              >
                                {item.text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="profile-order-summary">
                      <p className="profile-order-amount-label">Total Amount</p>
                      <p className="profile-order-amount">{order.amount}</p>
                      <span
                        className={`profile-order-status profile-order-status--${order.status}`}
                      >
                        {order.status === "rental-active" && (
                          <span className="profile-order-status-dot" aria-hidden="true" />
                        )}
                        {order.status === "delivered" && (
                          <CheckCircle2 size={14} aria-hidden="true" />
                        )}
                        {order.statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="profile-order-actions">
                    {order.actions.map((action) => {
                      const ActionIcon = action.icon
                        ? ACTION_ICONS[action.icon]
                        : null;
                      return (
                        <Button
                          key={action.id}
                          type="button"
                          variant="ghost"
                          className={`profile-order-action profile-order-action--${action.variant} ${
                            action.alignEnd ? "profile-order-action--end" : ""
                          }`}
                        >
                          {ActionIcon && <ActionIcon size={16} aria-hidden="true" />}
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="profile-orders-empty">
            <ShoppingBag
              className="profile-orders-empty-icon"
              size={64}
              strokeWidth={1}
              aria-hidden="true"
            />
            <h2 className="profile-orders-empty-title">No orders found</h2>
            <p className="profile-orders-empty-text">
              It seems you haven&apos;t placed any orders yet. Explore our latest
              premium collection.
            </p>
            <Button type="button" className="profile-orders-empty-btn">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileMyOrders;
