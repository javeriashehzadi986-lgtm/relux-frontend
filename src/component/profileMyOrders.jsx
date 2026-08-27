import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { hydrateBuyerOrder } from "@/data/dressCatalog";
import { useBuyerOrders } from "@/hooks/useBuyerOrders";
import "./profileMyOrders.css";

const FILTER_TABS = [
  { id: "all", label: "All Orders" },
  { id: "purchases", label: "Purchases" },
  { id: "rentals", label: "Rentals" },
  { id: "delivered", label: "Delivered" },
  { id: "in-progress", label: "In Progress" },
];

const getOrderActionRoute = (actionId, order) => {
  if (actionId === "checkout") {
    return `/orders/${order.id}/checkout`;
  }
  if (actionId === "details" || actionId === "rent-again") {
    return `/dress/${order.dressId}`;
  }
  return null;
};

const META_ICONS = {
  "calendar-check": CalendarCheck,
  "check-circle": CheckCircle2,
  clock: Clock,
};

const ACTION_ICONS = {
  history: History,
};

const CANCELLED_ORDER_ACTIONS = [
  { id: "details", label: "View Details", variant: "outline", link: true },
  { id: "remove", label: "Remove from Order List", variant: "danger" },
];

const getOrderActions = (order) => {
  if (order.status === "cancelled") {
    return CANCELLED_ORDER_ACTIONS;
  }

  return order.actions ?? [];
};

const getOrderStatusLabel = (order) => {
  if (order.status === "cancelled") return "Cancelled";
  return order.statusLabel;
};

const matchesFilter = (order, filter) => {
  if (filter === "all") return true;
  if (filter === "purchases") return order.type === "purchase";
  if (filter === "rentals") return order.type === "rental";
  if (filter === "delivered") return order.status === "delivered";
  if (filter === "in-progress") {
    return (
      order.status === "processing" ||
      order.status === "rental-active" ||
      order.status === "awaiting-payment"
    );
  }
  return true;
};

const ProfileMyOrders = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, loading, error, cancelOrder, removeOrder } = useBuyerOrders();
  const [cancelTarget, setCancelTarget] = useState(null);
  const [actionError, setActionError] = useState("");

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return orders.map(hydrateBuyerOrder).filter((order) => {
      const matchesSearch =
        !query ||
        order.title.toLowerCase().includes(query) ||
        order.brand.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      return matchesFilter(order, activeFilter) && matchesSearch;
    });
  }, [activeFilter, orders, searchQuery]);

  const handleOrderAction = async (action, order) => {
    if (action.id === "cancel") {
      setCancelTarget(order.id);
      return;
    }

    if (action.id === "remove") {
      setActionError("");
      try {
        await removeOrder(order.id);
      } catch (err) {
        setActionError(err.message || "Failed to remove order");
      }
      return;
    }

    if (action.id === "pay" || action.id === "checkout") {
      navigate(getOrderActionRoute("checkout", order));
      return;
    }

    const route = action.link ? getOrderActionRoute(action.id, order) : null;
    if (route) navigate(route);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setActionError("");
    try {
      await cancelOrder(cancelTarget);
    } catch (err) {
      setActionError(err.message || "Failed to cancel order");
    }
    setCancelTarget(null);
  };

  return (
    <section className="profile-orders">
      {(error || actionError) && (
        <p className="profile-orders-empty-text" role="alert" style={{ color: "#b42318" }}>
          {actionError || error}
        </p>
      )}
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
            <Link to="/profile">Dashboard</Link>
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
        {loading ? (
          <div className="profile-orders-empty">
            <p className="profile-orders-empty-text">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className="profile-order-card">
              <CardContent className="profile-order-card-inner">
                <div className="profile-order-image-wrap">
                  <Link to={`/dress/${order.dressId}`} aria-label={`View ${order.title}`}>
                    <img alt={order.title} src={order.image} />
                  </Link>
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
                      <h3 className="profile-order-title">
                        <Link to={`/dress/${order.dressId}`}>{order.title}</Link>
                      </h3>
                      <p className="profile-order-variant">{order.variant}</p>
                      <p className="profile-order-brand">{order.brand}</p>
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
                        {getOrderStatusLabel(order)}
                      </span>
                    </div>
                  </div>

                  <div className="profile-order-actions">
                    {getOrderActions(order).map((action) => {
                      const ActionIcon = action.icon
                        ? ACTION_ICONS[action.icon]
                        : null;
                      const actionClass = `profile-order-action profile-order-action--${action.variant} ${
                        action.alignEnd ? "profile-order-action--end" : ""
                      }`;

                      if (action.link) {
                        const route = getOrderActionRoute(action.id, order);
                        return (
                          <Button
                            key={action.id}
                            type="button"
                            variant="ghost"
                            className={actionClass}
                            asChild
                          >
                            <Link to={route ?? `/dress/${order.dressId}`}>
                              {ActionIcon && <ActionIcon size={16} aria-hidden="true" />}
                              {action.label}
                            </Link>
                          </Button>
                        );
                      }

                      return (
                        <Button
                          key={action.id}
                          type="button"
                          variant="ghost"
                          className={actionClass}
                          onClick={() => handleOrderAction(action, order)}
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
            <h2 className="profile-orders-empty-title">No orders yet</h2>
            <p className="profile-orders-empty-text">
              Your order list is empty. When you rent or buy an item, it will show
              up here — only your own orders, not anyone else&apos;s.
            </p>
            <Button type="button" className="profile-orders-empty-btn" asChild>
              <Link to="/categories">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>

      {cancelTarget && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-order-title"
          onClick={() => setCancelTarget(null)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardContent className="profile-logout-modal-header">
              <h2 id="cancel-order-title" className="profile-logout-modal-title">
                Cancel rental request?
              </h2>
              <p className="profile-logout-modal-description">
                This will withdraw your pending rental request. You can request again
                from the dress page anytime.
              </p>
            </CardContent>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setCancelTarget(null)}
              >
                Keep Request
              </Button>
              <Button
                type="button"
                className="profile-logout-confirm-btn"
                onClick={confirmCancel}
              >
                Cancel Request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default ProfileMyOrders;
