import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, CalendarCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
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
            onClick={() => onAction(action.id, order.id)}
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
          onClick={() => onAction(action.id, order.id)}
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
    confirmReturnOrder,
  } = useSellerOrders();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState("");

  const handleOrderAction = async (actionId, orderId) => {
    setActionError("");
    const handlers = {
      approve: approveOrder,
      reject: rejectOrder,
      ship: shipOrder,
      "confirm-return": confirmReturnOrder,
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
                      <span>{order.dateLabel}</span>
                    </div>
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
    </>
  );
}
