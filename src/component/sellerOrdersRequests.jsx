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

function OrderActions({ order, onApprove, onReject, onComplete }) {
  if (order.actions === "approve-reject") {
    return (
      <div className="orders-requests-actions orders-requests-actions--split">
        <Button
          type="button"
          variant="outline"
          className="orders-requests-btn-outline"
          onClick={() => onReject(order.id)}
        >
          Reject
        </Button>
        <Button
          type="button"
          className="orders-requests-btn-primary"
          onClick={() => onApprove(order.id)}
        >
          Approve
        </Button>
      </div>
    );
  }

  if (order.actions === "complete") {
    return (
      <Button
        type="button"
        className="orders-requests-btn-primary orders-requests-btn-full"
        onClick={() => onComplete(order.id)}
      >
        Mark as Completed
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="orders-requests-btn-muted orders-requests-btn-full"
      asChild
    >
      <Link to={`/dress/${order.dressId}`}>View Details</Link>
    </Button>
  );
}

export function SellerOrdersRequestsContent() {
  const { orders, loading, error, approveOrder, rejectOrder, completeOrder } =
    useSellerOrders();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionError, setActionError] = useState("");

  const handleApprove = async (orderId) => {
    setActionError("");
    try {
      await approveOrder(orderId);
    } catch (err) {
      setActionError(err.message || "Failed to approve");
    }
  };

  const handleReject = async (orderId) => {
    setActionError("");
    try {
      await rejectOrder(orderId);
    } catch (err) {
      setActionError(err.message || "Failed to reject");
    }
  };

  const handleComplete = async (orderId) => {
    setActionError("");
    try {
      await completeOrder(orderId);
    } catch (err) {
      setActionError(err.message || "Failed to complete");
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
          return order.status === "Completed";
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
                    </div>
                  </div>
                  <span
                    className={`orders-requests-status orders-requests-status--${order.statusVariant}`}
                  >
                    {order.status}
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

                <OrderActions
                  order={order}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onComplete={handleComplete}
                />
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
