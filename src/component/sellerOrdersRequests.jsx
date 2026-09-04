import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hydrateSellerOrder } from "@/data/dressCatalog";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import "./sellerOrdersRequests.css";

const filterChips = [
  "All",
  "Sale Orders",
  "Rental Requests",
  "Pending",
  "Completed",
];

function DateIcon({ type }) {
  if (type === "check") {
    return <CheckCircle2 size={16} strokeWidth={1.75} />;
  }
  if (type === "calendar-check") {
    return <CalendarCheck size={16} strokeWidth={1.75} />;
  }
  return <Calendar size={16} strokeWidth={1.75} />;
}

function OrderActions({ order, onAction }) {
  const actions = Array.isArray(order.actions) ? order.actions : [];
  const detailAction = actions.find((action) => action.id === "details");
  const interactiveActions = actions.filter((action) => action.id !== "details");

  const hasApproveReject =
    interactiveActions.some((action) => action.id === "approve") &&
    interactiveActions.some((action) => action.id === "reject");

  const hasConfirmAndDispute =
    interactiveActions.some((action) => action.id === "confirm-return") &&
    interactiveActions.some((action) => action.id === "dispute-return");

  if (hasApproveReject) {
    const rejectAction = interactiveActions.find((action) => action.id === "reject");
    const approveAction = interactiveActions.find((action) => action.id === "approve");
    const otherActions = interactiveActions.filter(
      (action) => action.id !== "approve" && action.id !== "reject",
    );

    return (
      <>
        <div className="orders-requests-actions orders-requests-actions--split">
          <Button
            type="button"
            variant="outline"
            className="orders-requests-btn-outline"
            onClick={() => onAction(rejectAction.id, order.id)}
          >
            {rejectAction.label}
          </Button>
          <Button
            type="button"
            className="orders-requests-btn-primary"
            onClick={() => onAction(approveAction.id, order.id)}
          >
            {approveAction.label}
          </Button>
        </div>
        {otherActions.map((action) => (
          <Button
            key={action.id}
            type="button"
            className="orders-requests-btn-primary orders-requests-btn-full"
            disabled={Boolean(action.disabled)}
          onClick={() => !action.disabled && onAction(action.id, order.id)}
          >
            {action.label}
          </Button>
        ))}
        {detailAction?.link ? (
          <Button
            type="button"
            variant="outline"
            className="orders-requests-btn-muted orders-requests-btn-full"
            asChild
          >
            <Link to={`/dress/${order.dressId}`}>{detailAction.label}</Link>
          </Button>
        ) : null}
      </>
    );
  }

  if (hasConfirmAndDispute) {
    const primaryAction = interactiveActions.find(
      (action) => action.id === "confirm-return",
    );
    const disputeAction = interactiveActions.find(
      (action) => action.id === "dispute-return",
    );
    const otherActions = interactiveActions.filter(
      (action) =>
        action.id !== primaryAction?.id && action.id !== disputeAction?.id,
    );

    return (
      <>
        <div className="orders-requests-actions orders-requests-actions--split">
          <Button
            type="button"
            variant="outline"
            className="orders-requests-btn-outline"
            onClick={() => onAction(disputeAction.id, order.id)}
          >
            {disputeAction.label}
          </Button>
          <div className="orders-requests-confirm-wrap">
            <Button
              type="button"
              className="orders-requests-btn-primary"
              onClick={() => onAction(primaryAction.id, order.id)}
            >
              {primaryAction.label}
            </Button>
            <p className="orders-requests-payment-release-note">
              Confirming return releases escrow payment to you (rental charge kept,
              remainder refunded to buyer).
            </p>
          </div>
        </div>
        {otherActions.map((action) => (
          <Button
            key={action.id}
            type="button"
            className="orders-requests-btn-primary orders-requests-btn-full"
            disabled={Boolean(action.disabled)}
            onClick={() => !action.disabled && onAction(action.id, order.id)}
          >
            {action.label}
          </Button>
        ))}
        {detailAction?.link ? (
          <Button
            type="button"
            variant="outline"
            className="orders-requests-btn-muted orders-requests-btn-full"
            asChild
          >
            <Link to={`/dress/${order.dressId}`}>{detailAction.label}</Link>
          </Button>
        ) : null}
      </>
    );
  }

  if (interactiveActions.length === 1 && !detailAction) {
    const action = interactiveActions[0];
    return (
      <Button
        type="button"
        className="orders-requests-btn-primary orders-requests-btn-full"
        onClick={() => onAction(action.id, order.id)}
      >
        {action.label}
      </Button>
    );
  }

  return (
    <>
      {interactiveActions.map((action) => (
        <Button
          key={action.id}
          type="button"
          className={
            action.variant === "outline"
              ? "orders-requests-btn-outline orders-requests-btn-full"
              : "orders-requests-btn-primary orders-requests-btn-full"
          }
          disabled={Boolean(action.disabled)}
          onClick={() => !action.disabled && onAction(action.id, order.id)}
        >
          {action.label}
        </Button>
      ))}
      {detailAction?.link ? (
        <Button
          type="button"
          variant="outline"
          className="orders-requests-btn-muted orders-requests-btn-full"
          asChild
        >
          <Link to={`/dress/${order.dressId}`}>{detailAction.label}</Link>
        </Button>
      ) : null}
    </>
  );
}

export function SellerOrdersRequestsContent() {
  const {
    orders,
    loading,
    error,
    approveOrder,
    rejectOrder,
    completeOrder,
    shipOrder,
    confirmReturn,
    disputeReturn,
  } = useSellerOrders();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState("");
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const handleOrderAction = async (actionId, orderId) => {
    setActionError("");

    if (actionId === "dispute-return") {
      const order = orders.find((item) => item.id === orderId);
      setDisputeTarget(order || { id: orderId });
      setDisputeReason("");
      return;
    }

    const handlers = {
      approve: approveOrder,
      reject: rejectOrder,
      ship: shipOrder,
      "confirm-return": confirmReturn,
      complete: completeOrder,
    };

    const handler = handlers[actionId];
    if (!handler) return;

    try {
      await handler(orderId);
    } catch (err) {
      setActionError(err.message || "Action failed");
    }
  };

  const submitReturnDispute = async () => {
    if (!disputeTarget?.id) return;
    const reason = disputeReason.trim();
    if (!reason) {
      setActionError("Please describe the return issue.");
      return;
    }
    setSubmittingDispute(true);
    setActionError("");
    try {
      await disputeReturn(disputeTarget.id, { disputeReason: reason });
      setDisputeTarget(null);
      setDisputeReason("");
    } catch (err) {
      setActionError(err.message || "Failed to submit return dispute");
    } finally {
      setSubmittingDispute(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.map(hydrateSellerOrder).filter((order) => {
      const matchesSearch =
        !query ||
        order.customerName.toLowerCase().includes(query) ||
        order.itemTitle.toLowerCase().includes(query) ||
        order.brand.toLowerCase().includes(query) ||
        order.orderType.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case "Sale Orders":
          return order.orderCategory === "sale";
        case "Rental Requests":
          return order.orderCategory === "rental";
        case "Pending":
          return order.status === "Pending";
        case "Completed":
          return (
            order.status === "Completed" ||
            order.status === "Delivered" ||
            order.status === "Rental Completed"
          );
        default:
          return true;
      }
    });
  }, [activeFilter, orders, searchQuery]);

  return (
    <>
      <CardHeader className="seller-dashboard-heading px-0">
        <CardTitle className="seller-dashboard-page-title">
          Orders &amp; Requests
        </CardTitle>
        <CardDescription>
          Manage your clothing orders and rental requests
        </CardDescription>
      </CardHeader>

      <section className="orders-requests-filters">
        <Field className="orders-requests-search-field">
          <Label htmlFor="orders-search" className="sr-only">
            Search orders or customers
          </Label>
          <div className="orders-requests-search-wrap">
            <Search className="orders-requests-search-icon" size={20} />
            <Input
              id="orders-search"
              type="search"
              placeholder="Search orders or customers..."
              className="orders-requests-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </Field>

        <div className="orders-requests-chips">
          {filterChips.map((chip) => (
            <Button
              key={chip}
              type="button"
              variant={activeFilter === chip ? "default" : "outline"}
              className={`orders-requests-chip ${
                activeFilter === chip ? "is-active" : ""
              }`}
              onClick={() => setActiveFilter(chip)}
            >
              {chip}
            </Button>
          ))}
        </div>
      </section>

      {(error || actionError) && (
        <p role="alert" style={{ color: "#b42318", marginBottom: "1rem" }}>
          {actionError || error}
        </p>
      )}

      <section className="orders-requests-list">
        {loading ? (
          <Card className="orders-requests-empty">
            <CardContent className="orders-requests-empty-content">
              <p>Loading orders...</p>
            </CardContent>
          </Card>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className={`orders-requests-card py-0 gap-0 ring-0 shadow-none ${
                order.dimmed ? "is-dimmed" : ""
              }`}
            >
              <CardContent className="orders-requests-card-content">
                <div className="orders-requests-card-top">
                  <div className="orders-requests-customer">
                    <div className="orders-requests-customer-avatar">
                      {order.customerAvatar ? (
                        <img src={order.customerAvatar} alt={order.customerName} />
                      ) : (
                        <span aria-hidden="true">
                          {(order.customerName || "B")
                            .split(/\s+/)
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="orders-requests-customer-name">
                        <Link
                          to={`/messages/${order.dressId}`}
                          state={{
                            buyerId: order.buyerId,
                            productId: order.dressId,
                            listingTitle: order.itemTitle,
                            listingImage: order.itemImage,
                          }}
                        >
                          {order.customerName}
                        </Link>
                      </p>
                      <span className="orders-requests-order-type">
                        {order.orderType}
                      </span>
                      {order.escrowLabel ? (
                        <span className="orders-requests-escrow">{order.escrowLabel}</span>
                      ) : null}
                      {order.productAvailabilityLabel && order.statusVariant === "completed" ? (
                        <span className="orders-requests-listing-status">
                          Listing: {order.productAvailabilityLabel}
                        </span>
                      ) : null}
                      {order.paymentLabel ? (
                        <span
                          className={`orders-requests-payment orders-requests-payment--${order.paymentStatus || "unpaid"}`}
                        >
                          Payment: {order.paymentLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <span
                    className={`orders-requests-status orders-requests-status--${order.statusVariant || "approved"}`}
                  >
                    {order.fulfillmentLabel || order.status}
                  </span>
                </div>

                <div className="orders-requests-item-row">
                  <div className="orders-requests-item-image">
                    <Link to={`/dress/${order.dressId}`} aria-label={order.itemTitle}>
                      <img src={order.itemImage} alt={order.itemTitle} />
                    </Link>
                  </div>
                  <div className="orders-requests-item-copy">
                    <CardTitle className="orders-requests-item-title">
                      <Link to={`/dress/${order.dressId}`}>{order.itemTitle}</Link>
                    </CardTitle>
                    <p className="orders-requests-item-brand">{order.brand}</p>
                    <div className="orders-requests-item-date">
                      <DateIcon type={order.dateIcon} />
                      <span>
                        {order.orderCategory === "rental"
                          ? order.dateLabel ||
                            `${order.rentalDays || 1} day${
                              Number(order.rentalDays) === 1 ? "" : "s"
                            } rental`
                          : order.dateLabel || "Sale order"}
                      </span>
                    </div>
                    {order.orderCategory === "rental" && (order.rentStart || order.rentEnd) ? (
                      <p className="orders-requests-rental-meta">
                        {order.rentalDays
                          ? `${order.rentalDays} day${Number(order.rentalDays) === 1 ? "" : "s"}`
                          : "Rental"}
                        {order.rentStart && order.rentEnd
                          ? ` requested · ${order.rentStart} → ${order.rentEnd}`
                          : ""}
                      </p>
                    ) : null}
                  </div>
                </div>

                <OrderActions order={order} onAction={handleOrderAction} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="orders-requests-empty">
            <CardContent className="orders-requests-empty-content">
              <p>
                {orders.length === 0
                  ? "No rental requests or sale orders yet. When a buyer requests one of your items, it will appear here."
                  : "No orders match your search or filter."}
              </p>
              <Button type="button" className="orders-requests-btn-primary" asChild>
                <Link to="/sellerProfile?section=listings">View Listings</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <Dialog
        open={Boolean(disputeTarget)}
        onOpenChange={(open) => !open && setDisputeTarget(null)}
      >
        <DialogContent className="orders-requests-return-dispute-dialog">
          <DialogHeader className="orders-requests-return-dispute-header">
            <DialogTitle>Report Return Issue</DialogTitle>
            <DialogDescription>
              Describe the problem with this return (damage, late return, missing item, not as
              expected, etc.). Escrow stays held and admin will mediate with both parties — same
              as resale delivery disputes.
            </DialogDescription>
          </DialogHeader>
          <div className="orders-requests-return-dispute-body">
            <Field>
              <Label htmlFor="return-dispute-reason">Issue details</Label>
              <Textarea
                id="return-dispute-reason"
                className="orders-requests-return-dispute-textarea"
                rows={4}
                placeholder="Describe the return issue for admin..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
              />
            </Field>
            {actionError ? (
              <p className="orders-requests-error" role="alert">
                {actionError}
              </p>
            ) : null}
          </div>
          <DialogFooter className="orders-requests-return-dispute-footer">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDisputeTarget(null)}
              disabled={submittingDispute}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="orders-requests-btn-primary"
              onClick={submitReturnDispute}
              disabled={submittingDispute}
            >
              {submittingDispute ? "Submitting..." : "Submit to Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
