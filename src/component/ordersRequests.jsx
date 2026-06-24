import React, { useMemo, useState } from "react";
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
import SellerDashboardLayout from "./sellerDashboardLayout";
import "./sellerDashboard.css";
import "./ordersRequests.css";

const filterChips = [
  "All",
  "Sale Orders",
  "Rental Requests",
  "Pending",
  "Completed",
];

const orders = [
  {
    id: "rental-sarah",
    customerName: "Sarah J.",
    customerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCg4KFJi-xjnYJbPlL3HbtXyyr5yhiE2Fydqsz_bIuZwvZZ_eugrV_sy_7379PovdV0Wxpqm8vbDy_YnbBcSppKq5WmJAOKWPlRfoiZ9311-QHE1Ef7gBJ9ckQ0B3aSo3nMCp_C0JfZj7VtXKFN6IJWYJlZVPsVQitXIy1BI55NYfH7hRSHwlcGQkcbm9qMvRqgandAUOidyQFy0zz_7J2miRGR9bTG5XfwhylJsYzSJs_NsXKwxUf7_Kj-zoqZs8pScqjOTe35z2oK",
    orderType: "Rental Request",
    orderCategory: "rental",
    status: "Pending",
    statusVariant: "pending",
    itemTitle: "Silk Midi Dress",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlSDh7x60x1UteO_W2UilmXBHTvl8i8y81ePzIhhn40UeUVmbjiFtEK8RXC6_LLT9iyLO0rWT7NU7GwXf4_GIkGUo_aoefGw6W96ZmcuEdD1JVPMSx0SgGvyxDIE3u-n6YZnoR39xLa4tf4WySGJ2F0RzNG5_uyNeP6DiqcfiLS0RtHsVCKhdyr4pKyI78RMdDqaO3NvADStRMQnjXY5XgkzX7oj_13C_UdiE378ldJx5GBaA9RuyN87ttLWAdMGvo7fjS4ywU46-4",
    dateLabel: "Oct 12 - Oct 15",
    dateIcon: "calendar",
    actions: "approve-reject",
  },
  {
    id: "sale-michael",
    customerName: "Michael K.",
    customerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADRF3dFT31nsuCTQUdKAKqxaR67QOv6g5YU5POm7fHaKL-GYF9hysuHvZ-ixN-qt2TjnCG2jGHltrv-FGJXj_U8wNHmD32HtZQNiZmOSYlOg05dulbIGk_TG9CHP5hE2-KXQtrApzu3ryfX5uFMIUvWi7p1-Duac0AGXi1g9iquJ6DvUUaHUPisKgqg8ES3I8gSHJQDoaVJAI8dK0FeBncnorYNPdhQk8COrpJiwFiPKQ3Q5pbTtDNcJt3rGwYl8qY-qo2NJ3Q4VOC",
    orderType: "Sale Order",
    orderCategory: "sale",
    status: "Approved",
    statusVariant: "approved",
    itemTitle: "Tailored Wool Blazer",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlU7p5bA5NVI6b4zFxcHYyPDo0PdZzBRaZ32I-fEPE1Kf346un0l1Ll18TKnXlFrcUqIFINZ_T9y8zBBXnPQFGv7xl8Woa64WcjOX8Itv8oSzHzRE9McEBEqmjtLYjk8ZVcO2C4Q1t5ZfIL1jGi5PKNy4WEG0RiSk1ydihmNy56AN43CpmfAJdSIJYyktUuG55aXi0bDQxaTNEM0PUQ7v2M2bmLmtAlR1AjB4pCFyHGMvFcmwYSI-egpGaB3iMbSryT7tIocxKVUU",
    dateLabel: "Oct 10, 2023",
    dateIcon: "calendar-check",
    actions: "complete",
  },
  {
    id: "sale-emma",
    customerName: "Emma L.",
    customerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmmRXlXMAVXf2walMsI-ndj7u9oNLV5d-UPyxUQk6O9Oe5yeNruVuipyQlQ1DrBifOSt0fYPaQPc-CzfGG7C1uR81oWzXKR7SgA7dmsvckaCWLKPk_OnM2QqzEQezTtecPTGMfLL7dESS7a6FPy9zl-Q-SkUCIekS1JUkODrdOjGGiQZtaIeMEGD2oiTPv2DAfZz8i5gZupft13Zkiw7nk_uuKZNluWGSShf7_rIOCCenUeUprphbINJaBPgHFnx6lRfKUqu1N7X4g",
    orderType: "Sale Order",
    orderCategory: "sale",
    status: "Completed",
    statusVariant: "completed",
    itemTitle: "Cashmere Knit",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQemD3e6BOZATewDckoKN6LGnMsltEY2gw2q8lUInmROjSEuYbIBlXLU9LUnCGJIGwNMXoNKyqeBcXytDaU5EI9HU4SsDZZzh8zPiKHd9ZgptgIA9vSmf2EVijv5Q65Z4SF_wE4V54whxi3f5U9mej7h0idCDMflF_MmbmFSiI6jigtowaWzcJQd8eQ8qHoXkLskRTeqv-DsFY0OYczzrRtmuKiRt8dqoNh-zIy4f85wyWtLtisvVC3LIzzo-_yP2PF2M4C_dnSjkz",
    dateLabel: "Oct 8, 2023",
    dateIcon: "check",
    actions: "view",
    dimmed: true,
  },
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

function OrderActions({ order }) {
  if (order.actions === "approve-reject") {
    return (
      <div className="orders-requests-actions orders-requests-actions--split">
        <Button type="button" variant="outline" className="orders-requests-btn-outline">
          Reject
        </Button>
        <Button type="button" className="orders-requests-btn-primary">
          Approve
        </Button>
      </div>
    );
  }

  if (order.actions === "complete") {
    return (
      <Button type="button" className="orders-requests-btn-primary orders-requests-btn-full">
        Mark as Completed
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="orders-requests-btn-muted orders-requests-btn-full"
    >
      View Details
    </Button>
  );
}

const OrdersRequests = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.customerName.toLowerCase().includes(query) ||
        order.itemTitle.toLowerCase().includes(query) ||
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
  }, [activeFilter, searchQuery]);

  return (
    <SellerDashboardLayout active="orders">
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

      <section className="orders-requests-list">
        {filteredOrders.map((order) => (
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
                    <img src={order.customerAvatar} alt={order.customerName} />
                  </div>
                  <div>
                    <p className="orders-requests-customer-name">
                      {order.customerName}
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
                  <img src={order.itemImage} alt={order.itemTitle} />
                </div>
                <div className="orders-requests-item-copy">
                  <CardTitle className="orders-requests-item-title">
                    {order.itemTitle}
                  </CardTitle>
                  <div className="orders-requests-item-date">
                    <DateIcon type={order.dateIcon} />
                    <span>{order.dateLabel}</span>
                  </div>
                </div>
              </div>

              <OrderActions order={order} />
            </CardContent>
          </Card>
        ))}
      </section>
    </SellerDashboardLayout>
  );
};

export default OrdersRequests;
