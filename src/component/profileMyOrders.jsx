import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  User,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { hydrateBuyerOrder, getBuyerOrderLogistics } from "@/data/dressCatalog";
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

const getOrderStatusKey = (order) => {
  if (order.status === "cancelled") return "cancelled";

  const fs = order.fulfillmentStatus;
  if (fs === "shipped") return "shipped";
  if (fs === "returned") return "returned";
  if (fs === "delivered") {
    return order.type === "rental" ? "rental-active" : "delivered";
  }

  return order.status || "processing";
};

const getOrderStatusLabel = (order) => {
  if (order.status === "cancelled") return "Cancelled";
  return order.fulfillmentLabel || order.statusLabel || "Processing";
};

const matchesFilter = (order, filter) => {
  const statusKey = getOrderStatusKey(order);

  if (filter === "all") return true;
  if (filter === "purchases") return order.type === "purchase";
  if (filter === "rentals") return order.type === "rental";
  if (filter === "delivered") {
    return statusKey === "delivered" || order.fulfillmentStatus === "delivered";
  }
  if (filter === "in-progress") {
    return (
      statusKey === "processing" ||
      statusKey === "rental-active" ||
      statusKey === "awaiting-payment" ||
      statusKey === "shipped" ||
      statusKey === "paid" ||
      statusKey === "returned" ||
      order.fulfillmentStatus === "shipped" ||
      order.fulfillmentStatus === "processing"
    );
  }
  return true;
};

const ProfileMyOrders = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, loading, error, refreshOrders, cancelOrder, removeOrder, confirmReceived, markReturned, acceptSettlement, disputeSettlement, disputeSaleDelivery } =
    useBuyerOrders();
  const [cancelTarget, setCancelTarget] = useState(null);
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [disputeKind, setDisputeKind] = useState("settlement");
  const [disputeReason, setDisputeReason] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [actionError, setActionError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshOrders({ silent: true });
      }
    }, 45000);

    return () => window.clearInterval(interval);
  }, [refreshOrders]);

  const handleRefreshOrders = async () => {
    setRefreshing(true);
    try {
      await refreshOrders({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

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

    if (action.id === "confirm-received") {
      setActionError("");
      try {
        await confirmReceived(order.id);
      } catch (err) {
        setActionError(err.message || "Failed to confirm receipt");
      }
      return;
    }

    if (action.id === "mark-returned") {
      if (action.disabled) {
        setActionError(action.disabledReason || "Return is not available yet");
        return;
      }
      setActionError("");
      try {
        await markReturned(order.id);
      } catch (err) {
        setActionError(err.message || "Failed to mark return");
      }
      return;
    }

    if (action.id === "accept-settlement") {
      setActionError("");
      try {
        await acceptSettlement(order.id);
      } catch (err) {
        setActionError(err.message || "Failed to accept settlement");
      }
      return;
    }

    if (action.id === "dispute-settlement") {
      setDisputeKind("settlement");
      setDisputeTarget(order);
      setDisputeReason("");
      return;
    }

    if (action.id === "dispute-delivery") {
      setDisputeKind("delivery");
      setDisputeTarget(order);
      setDisputeReason("");
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

  const submitDispute = async () => {
    if (!disputeTarget?.id) return;
    if (!disputeReason.trim()) {
      setActionError(
        disputeKind === "delivery"
          ? "Please describe the delivery issue"
          : "Please explain why you are disputing this settlement",
      );
      return;
    }
    setSubmittingDispute(true);
    setActionError("");
    try {
      if (disputeKind === "delivery") {
        await disputeSaleDelivery(disputeTarget.id, { disputeReason: disputeReason.trim() });
      } else {
        await disputeSettlement(disputeTarget.id, { disputeReason: disputeReason.trim() });
      }
      setDisputeTarget(null);
    } catch (err) {
      setActionError(err.message || "Failed to submit dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  const formatPkr = (amount) =>
    `PKR ${Math.round(Number(amount) || 0).toLocaleString("en-PK")}`;

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
          <div className="profile-orders-title-row">
            <h1 className="profile-orders-title">My Orders</h1>
            <Button
              type="button"
              variant="outline"
              className="profile-orders-refresh-btn"
              onClick={handleRefreshOrders}
              disabled={loading || refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Orders"}
            </Button>
          </div>
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
          filteredOrders.map((order) => {
            const statusKey = getOrderStatusKey(order);
            const logistics = getBuyerOrderLogistics(order);

            return (
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
                        {(order.type === "rental" || order.type === "purchase") && order.paymentLabel ? (
                          <div className="profile-order-detail">
                            <ShieldCheck size={18} aria-hidden="true" />
                            <span className="profile-order-detail-text--highlight">
                              Payment: {order.paymentLabel}
                            </span>
                          </div>
                        ) : null}
                        {(order.type === "rental" || order.type === "purchase") &&
                        order.escrowLabel &&
                        order.escrowStatus !== "released" ? (
                          <div className="profile-order-detail">
                            <ShieldCheck size={18} aria-hidden="true" />
                            <span className="profile-order-detail-text--highlight">
                              {order.escrowLabel}
                            </span>
                          </div>
                        ) : null}
                        {order.escrowSettlementStatus === "proposed" ? (
                          <div className="profile-order-settlement-box">
                            <p>
                              <strong>Settlement proposed:</strong> Rent{" "}
                              {formatPkr(order.rentalChargePkr)}, damage{" "}
                              {formatPkr(order.damageDeductionPkr)}, your refund{" "}
                              {formatPkr(order.refundAmountPkr)}
                            </p>
                            {order.settlementNote ? (
                              <p className="profile-order-settlement-note">
                                Seller note: {order.settlementNote}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                        {order.type === "rental" &&
                        (order.status === "rental-active" || order.status === "returned") ? (
                          order.sellerReturnContact ? (
                            <div className="profile-order-return-box">
                              <p className="profile-order-return-title">
                                <MapPin size={16} aria-hidden="true" />
                                Return to seller
                              </p>
                              <p className="profile-order-return-line">
                                <User size={14} aria-hidden="true" />
                                {order.sellerReturnContact.name}
                              </p>
                              <p className="profile-order-return-line">
                                <Phone size={14} aria-hidden="true" />
                                {order.sellerReturnContact.phone}
                              </p>
                              <p className="profile-order-return-line">
                                {order.sellerReturnContact.address},{" "}
                                {order.sellerReturnContact.city}
                              </p>
                              {order.sellerReturnContact.email ? (
                                <p className="profile-order-return-line profile-order-return-email">
                                  {order.sellerReturnContact.email}
                                </p>
                              ) : null}
                              <p className="profile-order-return-note">
                                Ship or drop off the item to this address before marking it as
                                returned.
                              </p>
                            </div>
                          ) : (
                            <div className="profile-order-return-box profile-order-return-box--missing">
                              <p className="profile-order-return-note">
                                Return contact is not available for this order. Message the seller
                                or contact support for return instructions.
                              </p>
                            </div>
                          )
                        ) : null}
                        {Array.isArray(logistics) &&
                        logistics.length > 0 &&
                        order.status !== "cancelled" ? (
                          <div className="profile-order-tracking">
                            <p className="profile-order-tracking-title">
                              <Truck size={16} aria-hidden="true" />
                              Shipping &amp; tracking
                            </p>
                            <ol className="profile-order-tracking-list">
                              {logistics.map((step) => (
                                <li
                                  key={step.key || `${step.label}-${step.date}`}
                                  className={`profile-order-tracking-step${
                                    step.active ? " profile-order-tracking-step--active" : ""
                                  }${step.completed ? " profile-order-tracking-step--completed" : ""}`}
                                >
                                  <span className="profile-order-tracking-dot" aria-hidden="true" />
                                  <div>
                                    <p className="profile-order-tracking-label">{step.label}</p>
                                    <span className="profile-order-tracking-date">{step.date}</span>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="profile-order-summary">
                      <p className="profile-order-amount-label">Total Amount</p>
                      <p className="profile-order-amount">{order.amount}</p>
                      <span
                        className={`profile-order-status profile-order-status--${statusKey}`}
                      >
                        {statusKey === "rental-active" && (
                          <span className="profile-order-status-dot" aria-hidden="true" />
                        )}
                        {statusKey === "delivered" && (
                          <CheckCircle2 size={14} aria-hidden="true" />
                        )}
                        {statusKey === "shipped" && (
                          <Truck size={14} aria-hidden="true" />
                        )}
                        {getOrderStatusLabel(order)}
                      </span>
                      {order.paymentLabel ? (
                        <p
                          className={`profile-order-payment-line ${
                            order.paymentStatus === "refunded"
                              ? "profile-order-payment-line--refunded"
                              : ""
                          }`.trim()}
                        >
                          {order.paymentLabel}
                        </p>
                      ) : null}
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
                          className={`${actionClass}${action.disabled ? " profile-order-action--disabled" : ""}`}
                          disabled={Boolean(action.disabled)}
                          title={action.disabled ? action.disabledReason : undefined}
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
            );
          })
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

      <Dialog open={Boolean(disputeTarget)} onOpenChange={(open) => !open && setDisputeTarget(null)}>
        <DialogContent className="profile-logout-modal profile-orders-dispute-dialog" showCloseButton={false}>
          <DialogHeader className="profile-logout-modal-header">
            <DialogTitle className="profile-logout-modal-title">
              {disputeKind === "delivery" ? "Report Delivery Issue" : "Dispute Settlement"}
            </DialogTitle>
            <DialogDescription className="profile-logout-modal-description">
              {disputeKind === "delivery"
                ? "Tell admin what went wrong (not received, wrong item, not as pictured, etc.). Payment stays in escrow until admin resolves it."
                : "Explain why you disagree with the seller's proposed split. An admin will review and set the final escrow amounts."}
            </DialogDescription>
          </DialogHeader>
          <div className="profile-orders-dispute-body">
            <Label htmlFor="profile-orders-dispute-reason" className="profile-orders-dispute-label">
              {disputeKind === "delivery" ? "Delivery issue details" : "Dispute details"}
            </Label>
            <Textarea
              id="profile-orders-dispute-reason"
              className="profile-orders-dispute-textarea"
              rows={4}
              placeholder={
                disputeKind === "delivery"
                  ? "Describe the delivery problem..."
                  : "Describe the issue with the proposed rent or damage charges..."
              }
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            />
            {actionError ? (
              <p className="profile-orders-dispute-error" role="alert">
                {actionError}
              </p>
            ) : null}
          </div>
          <DialogFooter className="profile-logout-modal-actions">
            <Button
              type="button"
              variant="ghost"
              className="profile-logout-cancel-btn"
              onClick={() => setDisputeTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="profile-logout-confirm-btn"
              onClick={submitDispute}
              disabled={submittingDispute}
            >
              {submittingDispute ? "Submitting..." : "Submit Dispute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProfileMyOrders;
