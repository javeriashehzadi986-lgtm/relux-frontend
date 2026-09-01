import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import "./adminPayments.css";

const PAGE_SIZE = 10;

const EMPTY_STATS = {
  totalTransactions: 0,
  transactionTrend: "No payments yet",
  totalRevenue: "PKR 0",
  revenueProgress: 0,
  rentalPayments: "PKR 0",
  rentalShare: "0% of paid",
  resalePayments: "PKR 0",
  resaleShare: "0% of paid",
};

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function PersonCell({ name, avatar }) {
  return (
    <div className="admin-payments-person">
      {avatar ? (
        <img src={avatar} alt="" />
      ) : (
        <span className="admin-payments-avatar-fallback" aria-hidden="true">
          {initials(name)}
        </span>
      )}
      <span>{name}</span>
    </div>
  );
}

function TypeBadge({ type }) {
  return (
    <Badge variant="outline" className={`admin-payments-type admin-payments-type--${type}`}>
      {type === "rental" ? "Rental" : "Resale"}
    </Badge>
  );
}

function StatusBadge({ status }) {
  const label =
    status === "paid"
      ? "Paid"
      : status === "refunded"
        ? "Refunded"
        : status === "pending"
          ? "Pending"
          : status === "failed"
            ? "Failed"
            : "Unpaid";
  return (
    <Badge
      variant="outline"
      className={`admin-payments-status admin-payments-status--${status === "unpaid"}`}
    >
      {label}
    </Badge>
  );
}

function stripeDashboardUrl(payment) {
  if (payment.stripePaymentIntentId) {
    return `https://dashboard.stripe.com/test/payments/${payment.stripePaymentIntentId}`;
  }
  return "https://dashboard.stripe.com/test/payments";
}

const AdminPayments = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .getAdminPayments()
      .then((data) => {
        if (cancelled) return;
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setStats(data.stats ? { ...EMPTY_STATS, ...data.stats } : EMPTY_STATS);
      })
      .catch((err) => {
        if (cancelled) return;
        setPayments([]);
        setStats(EMPTY_STATS);
        setError(err.message || "Could not load payments");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (typeFilter !== "all" && payment.type !== typeFilter) return false;
      if (statusFilter !== "all" && payment.status !== statusFilter) return false;
      return true;
    });
  }, [payments, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePayments = filteredPayments.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter]);

  const selectedPayment =
    payments.find((payment) => payment.id === selectedId) ?? null;

  const openDetails = (paymentId) => setSelectedId(paymentId);
  const closeDetails = () => setSelectedId(null);

  const exportCsv = () => {
    const rows = [
      [
        "Transaction ID",
        "Buyer",
        "Buyer Email",
        "Seller",
        "Seller Email",
        "Item",
        "Type",
        "Amount",
        "Status",
        "Stripe Status",
        "Date",
      ],
      ...filteredPayments.map((p) => [
        p.id,
        p.buyerName,
        p.buyerEmail,
        p.sellerName,
        p.sellerEmail,
        p.item,
        p.type,
        p.amount,
        p.status,
        p.stripeStatus,
        p.transactionDate,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "relux-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return start + i;
  });

  return (
    <div className="admin-payments-page">
      <div className="admin-payments-header">
        <h1>Payments</h1>
        <p>
          Paid, pending Stripe checkout, refunds, and failed attempts. Unpaid orders are
          under Resale Orders or Rental Orders.
        </p>
      </div>

      {error ? (
        <p className="admin-payments-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-payments-metrics">
        <Card className="admin-payments-metric-card">
          <CardContent className="admin-payments-metric-content">
            <div>
              <p>Total Transactions</p>
              <h2>{Number(stats.totalTransactions || 0).toLocaleString()}</h2>
              <span className="admin-payments-trend">
                <TrendingUp size={14} aria-hidden="true" />
                {stats.transactionTrend}
              </span>
            </div>
            <div className="admin-payments-metric-icon">
              <Wallet size={22} aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-payments-metric-card">
          <CardContent className="admin-payments-metric-content">
            <div>
              <p>Total Revenue</p>
              <h2>{stats.totalRevenue}</h2>
              <div className="admin-payments-progress">
                <span style={{ width: `${stats.revenueProgress || 0}%` }} />
              </div>
            </div>
            <div className="admin-payments-metric-icon">
              <Wallet size={22} aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-payments-metric-card">
          <CardContent className="admin-payments-metric-content">
            <div>
              <p>Rental Payments</p>
              <h2>{stats.rentalPayments}</h2>
              <span className="admin-payments-meta">{stats.rentalShare}</span>
            </div>
            <div className="admin-payments-metric-icon">
              <Calendar size={22} aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-payments-metric-card">
          <CardContent className="admin-payments-metric-content">
            <div>
              <p>Resale Payments</p>
              <h2>{stats.resalePayments}</h2>
              <span className="admin-payments-meta">{stats.resaleShare}</span>
            </div>
            <div className="admin-payments-metric-icon">
              <ShoppingBag size={22} aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-payments-table-panel">
        <div className="admin-payments-table-toolbar">
          <div className="admin-payments-filters">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="admin-payments-filter-select" aria-label="Filter by payment type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Payment Type</SelectItem>
                <SelectItem value="resale">Resale</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="admin-payments-filter-select" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending checkout</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            className="admin-payments-export-btn"
            onClick={exportCsv}
            disabled={!filteredPayments.length}
          >
            <Download size={18} aria-hidden="true" />
            Export CSV
          </Button>
        </div>

        <div className="admin-payments-table-wrap">
          {loading ? (
            <p className="admin-payments-empty">Loading payments…</p>
          ) : pagePayments.length === 0 ? (
            <p className="admin-payments-empty">
              No payment transactions yet. Paid checkouts will appear here; open orders
              stay under Resale or Rental Orders.
            </p>
          ) : (
            <Table className="admin-payments-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Clothing Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagePayments.map((payment) => (
                  <TableRow
                    key={payment.mongoId || payment.id}
                    className={
                      selectedId === payment.id ? "admin-payments-row--selected" : ""
                    }
                    onClick={() => openDetails(payment.id)}
                  >
                    <TableCell className="admin-payments-id">#{payment.id}</TableCell>
                    <TableCell>
                      <PersonCell name={payment.buyerName} avatar={payment.buyerAvatar} />
                    </TableCell>
                    <TableCell>
                      <PersonCell name={payment.sellerName} avatar={payment.sellerAvatar} />
                    </TableCell>
                    <TableCell className="admin-payments-item">{payment.item}</TableCell>
                    <TableCell>
                      <TypeBadge type={payment.type} />
                    </TableCell>
                    <TableCell className="admin-payments-amount">{payment.amount}</TableCell>
                    <TableCell className="admin-payments-date">{payment.date}</TableCell>
                    <TableCell className="admin-payments-status-cell">
                      <StatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="admin-payments-pagination">
          <p>
            {filteredPayments.length === 0
              ? "Showing 0 entries"
              : `Showing ${pageStart + 1} to ${Math.min(
                  pageStart + PAGE_SIZE,
                  filteredPayments.length,
                )} of ${filteredPayments.length} entries`}
          </p>
          <div className="admin-payments-pagination-controls">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={18} />
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                type="button"
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="icon"
                className={currentPage === pageNumber ? "is-active" : ""}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </Card>

      {selectedPayment && (
        <>
          <Button
            type="button"
            variant="ghost"
            className="admin-payments-backdrop"
            aria-label="Close transaction details"
            onClick={closeDetails}
          />
          <Card className="admin-payments-drawer" aria-label="Transaction details">
            <div className="admin-payments-drawer-header">
              <div>
                <h2>Transaction Details</h2>
                <p>#{selectedPayment.id}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={closeDetails}>
                <X size={20} />
              </Button>
            </div>

            <div className="admin-payments-drawer-body">
              <section>
                <h3>Buyer Information</h3>
                <div className="admin-payments-drawer-person">
                  {selectedPayment.buyerAvatar ? (
                    <img src={selectedPayment.buyerAvatar} alt="" />
                  ) : (
                    <span className="admin-payments-avatar-fallback" aria-hidden="true">
                      {initials(selectedPayment.buyerName)}
                    </span>
                  )}
                  <div>
                    <p>{selectedPayment.buyerName}</p>
                    <span>{selectedPayment.buyerEmail || "—"}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Seller Information</h3>
                <div className="admin-payments-drawer-person">
                  {selectedPayment.sellerAvatar ? (
                    <img src={selectedPayment.sellerAvatar} alt="" />
                  ) : (
                    <span className="admin-payments-avatar-fallback" aria-hidden="true">
                      {initials(selectedPayment.sellerName)}
                    </span>
                  )}
                  <div>
                    <p>{selectedPayment.sellerName}</p>
                    <span>{selectedPayment.sellerEmail || "—"}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Clothing Details</h3>
                <div className="admin-payments-item-card">
                  {selectedPayment.itemImage ? (
                    <img src={selectedPayment.itemImage} alt={selectedPayment.item} />
                  ) : (
                    <div className="admin-payments-item-placeholder" aria-hidden="true" />
                  )}
                  <div>
                    <p>{selectedPayment.item}</p>
                    <span>Item ID: #{selectedPayment.itemId}</span>
                    <TypeBadge type={selectedPayment.type} />
                  </div>
                </div>
              </section>

              <section className="admin-payments-drawer-stats">
                <div className="admin-payments-stat-box admin-payments-stat-box--primary">
                  <p>Amount Paid</p>
                  <strong>{selectedPayment.amount}</strong>
                </div>
                <div className="admin-payments-stat-box">
                  <p>Stripe Status</p>
                  <span>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {selectedPayment.stripeStatus}
                  </span>
                </div>
              </section>

              <p className="admin-payments-drawer-date">
                Transaction Date: {selectedPayment.transactionDate || "—"}
              </p>

              <Button type="button" className="admin-payments-stripe-btn" asChild>
                <a
                  href={stripeDashboardUrl(selectedPayment)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  View Stripe Details
                </a>
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminPayments;
