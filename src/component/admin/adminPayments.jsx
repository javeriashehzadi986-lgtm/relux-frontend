import React, { useMemo, useState } from "react";
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
import "./adminPayments.css";

const PAYMENT_STATS = {
  totalTransactions: 1240,
  transactionTrend: "+12% this month",
  totalRevenue: "$45.2k",
  revenueProgress: 75,
  rentalPayments: "$12.8k",
  rentalShare: "28% of total",
  resalePayments: "$32.4k",
  resaleShare: "72% of total",
};

const PAYMENTS = [
  {
    id: "TR-8291",
    buyerName: "Elena Rose",
    buyerEmail: "elena.rose@example.com",
    buyerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxD4xqrhCoC8k9yxI9R1VGhD0owOYxNGvBZVxbM1svkf6At3fvASFkGJCq1JX9qi1GQjyhs7JsS4i6ocd6z886u4qgiVB527GaNqi9Bl5PfRGfElZfRi9AbAkMzI2Toov_G-HoVFpf5KyT8k3cPwM4ontB2xvKXU5NYhGIsdx0MErCT3IoI3r7c_RqTybR2WGvyDT7s4A4foxlfbZcNtRtSINvDIVCMBRZGsmztnPRg84kbK6JMbpz229yKe_Ua0gc7PBKT_OOqnk",
    sellerName: "Mark Davies",
    sellerEmail: "mark.d@relux.com",
    sellerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA82IX0cSnBEOANFeRPukGRRipwwnSCK_6ACBUm97dvFgSV-LrAgAsxc8H7fFbgBw4MRBlBDBvUo7TthaoGMuepE9aaM5DOPHu6ApnpNcAWiXkooh0xDRBcJ_vQgkah0qsRb77D7UMhs5QuUKytMN6Ky1nOxjX_rWB-QqaHhVfxxYZIVFRFgsQ-maOe3mdhYx9qykZnpmkQUa3mvWCBKJ1fY97hdj4s9pJxEEMGM8eUGNur9A_n_H5livJjM1s9gE6ViL5je-wWbJA",
    item: "Silk Midi Skirt",
    itemId: "ITEM-4421",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbuROd5qOwXq14nrKCfFudQVFzmggWDDGZoKCJ_VQEuxx22vblsz77NAGmJHDKNLUU3LpzQqSJ-69PZsg8pb3GckFbMU0nAI9QRMGn5ztXN7MoRpmtqQMgze9eAnIfQZJI2rnu_Ng1RHLY-xTvaxCytJjDRmWXryIvyeEJH0R5p4gPEdFPLW9GIHBHTLKifZu5hBJe0LHjb5cJxtcJXq06VAeufSCs7y-o_EVDWzPNBRem3_-ynwcnSKTZVU2nTWJAYgifE_Y8IeQ",
    type: "resale",
    amount: "$85.00",
    date: "Oct 24, 2023",
    transactionDate: "Oct 24, 2023 - 14:32 PM",
    status: "paid",
    stripeStatus: "Succeeded",
  },
  {
    id: "TR-9012",
    buyerName: "Julian Chen",
    buyerEmail: "julian.chen@example.com",
    buyerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMpRK98ctOeml1IGBL8uWTs9wtmthDzx5dLcH-nhxpJoxD1i1h-r216fduPp1Znw-2RnLtfPHy8CJWBNZEeEBi17_M9k2viKf0sFUjZCMXU2od7QdT5dSunVdjkGnSg-elEh5_T8lkSpGoav-ajL1WJqrXll4ofxbf5lGbNyGIwur1gPT28xJk2ZYvEcpLxjYy-kMOccQ_Mm-1vZyYek55qE2vivAoMK0SyGQTWjITyaoa-AVXj38HZA8MOSTZNo_QR-_iY8LSJUo",
    sellerName: "Sarah Blake",
    sellerEmail: "sarah.blake@relux.com",
    sellerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDx9JY36vH0Ri-EiUevYEF3oCNNSDHxOOsqItDOmbrrxpI9yxvE2AGDG4AbP8rN7FbvkuMXsnaNZx16-RHZ3NWtlbXVOaiDwS7n4KoCYNOPsHQ_ugkpGy_U3cbwRXyB2S2FB3gSvslwVftY6yc1l1pHfWEfHQvQTkQx75_3o2gF_S8naUqi3t04dpzRS2y6kYys2RWI7r2Z0s9PMjSIRNwcwPB_7lt4SvoqSZcw8J-pSv_kcJQPq4wjP_XIrIq-85rSuZRQ6q0QIaU",
    item: "Wool Trench Coat",
    itemId: "ITEM-3310",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbuROd5qOwXq14nrKCfFudQVFzmggWDDGZoKCJ_VQEuxx22vblsz77NAGmJHDKNLUU3LpzQqSJ-69PZsg8pb3GckFbMU0nAI9QRMGn5ztXN7MoRpmtqQMgze9eAnIfQZJI2rnu_Ng1RHLY-xTvaxCytJjDRmWXryIvyeEJH0R5p4gPEdFPLW9GIHBHTLKifZu5hBJe0LHjb5cJxtcJXq06VAeufSCs7y-o_EVDWzPNBRem3_-ynwcnSKTZVU2nTWJAYgifE_Y8IeQ",
    type: "rental",
    amount: "$120.00",
    date: "Oct 23, 2023",
    transactionDate: "Oct 23, 2023 - 11:18 AM",
    status: "paid",
    stripeStatus: "Succeeded",
  },
  {
    id: "TR-7742",
    buyerName: "Amara Okafor",
    buyerEmail: "amara.okafor@example.com",
    buyerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBopqQV3ENLAmT_ehi4AeFzR0wJKnpGwdzUOCAJBeHSNTLIywQDyb6U69saxcTn9a3xs3r08qwTHgXKSOOHT5Xy8aRCH4eePVKpSSG4fi723S5XUwVznfoZL0MyklF7EVxwG9Fq17YJZNgKwC1HCkU8QkDRfHYmsTtdu90_3B_G9vM1r8-V11nT4rUwQ6fmM1amCllVvxsaUiVoSkpPObOitA8GqEnmZ9fgXOH3QAhLOrgQ6GW0HpOxIVhDmuabF7kcNRHc1mTvC8Y",
    sellerName: "Tom Wilson",
    sellerEmail: "tom.wilson@relux.com",
    sellerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBnov52Yi_0IRpeMu6ArpERqmZxwSVbC7qoI5Sg7-oWGxYtx7-Qm8eppm0vK2VBPtbxN1oBgomncJ2NuiflZpKNFQZyWc3NLtBbULacq9HdS2YujqcBuj5aOB6ramThleHlkUcFeseUZ9bpoZ6GBAQIj9A9slqHMLmM4vnNWJD3HBDjL45WivJmrGsi6gYax3zxi7DyxbIKeOAoqCr-aV1kiczs6BpBZCFuHqNq8q_A66cHQ15P_YgQrGguf-qDVQfW4pWlSwCq3o4",
    item: "Linen Trousers",
    itemId: "ITEM-2188",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbuROd5qOwXq14nrKCfFudQVFzmggWDDGZoKCJ_VQEuxx22vblsz77NAGmJHDKNLUU3LpzQqSJ-69PZsg8pb3GckFbMU0nAI9QRMGn5ztXN7MoRpmtqQMgze9eAnIfQZJI2rnu_Ng1RHLY-xTvaxCytJjDRmWXryIvyeEJH0R5p4gPEdFPLW9GIHBHTLKifZu5hBJe0LHjb5cJxtcJXq06VAeufSCs7y-o_EVDWzPNBRem3_-ynwcnSKTZVU2nTWJAYgifE_Y8IeQ",
    type: "resale",
    amount: "$45.00",
    date: "Oct 22, 2023",
    transactionDate: "Oct 22, 2023 - 09:05 AM",
    status: "refunded",
    stripeStatus: "Refunded",
  },
];

function TypeBadge({ type }) {
  return (
    <Badge variant="outline" className={`admin-payments-type admin-payments-type--${type}`}>
      {type === "rental" ? "Rental" : "Resale"}
    </Badge>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={`admin-payments-status admin-payments-status--${status}`}>
      {status === "paid" ? "Paid" : "Refunded"}
    </Badge>
  );
}

const AdminPayments = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const filteredPayments = useMemo(() => {
    return PAYMENTS.filter((payment) => {
      if (typeFilter !== "all" && payment.type !== typeFilter) return false;
      if (statusFilter !== "all" && payment.status !== statusFilter) return false;
      return true;
    });
  }, [typeFilter, statusFilter]);

  const selectedPayment =
    PAYMENTS.find((payment) => payment.id === selectedId) ?? null;

  const openDetails = (paymentId) => {
    setSelectedId(paymentId);
  };

  const closeDetails = () => {
    setSelectedId(null);
  };

  return (
    <div className="admin-payments-page">
      <div className="admin-payments-header">
        <h1>Payments</h1>
        <p>View and monitor all payments processed through Stripe.</p>
      </div>

      <div className="admin-payments-metrics">
        <Card className="admin-payments-metric-card">
          <CardContent className="admin-payments-metric-content">          <div>
            <p>Total Transactions</p>
            <h2>{PAYMENT_STATS.totalTransactions.toLocaleString()}</h2>
            <span className="admin-payments-trend">
              <TrendingUp size={14} aria-hidden="true" />
              {PAYMENT_STATS.transactionTrend}
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
            <h2>{PAYMENT_STATS.totalRevenue}</h2>
            <div className="admin-payments-progress">
              <span style={{ width: `${PAYMENT_STATS.revenueProgress}%` }} />
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
            <h2>{PAYMENT_STATS.rentalPayments}</h2>
            <span className="admin-payments-meta">{PAYMENT_STATS.rentalShare}</span>
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
            <h2>{PAYMENT_STATS.resalePayments}</h2>
            <span className="admin-payments-meta">{PAYMENT_STATS.resaleShare}</span>
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
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" className="admin-payments-export-btn">
            <Download size={18} aria-hidden="true" />
            Export CSV
          </Button>
        </div>

        <div className="admin-payments-table-wrap">
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
              {filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className={
                    selectedId === payment.id ? "admin-payments-row--selected" : ""
                  }
                  onClick={() => openDetails(payment.id)}
                >
                  <TableCell className="admin-payments-id">#{payment.id}</TableCell>
                  <TableCell>
                    <div className="admin-payments-person">
                      <img src={payment.buyerAvatar} alt="" />
                      <span>{payment.buyerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="admin-payments-person">
                      <img src={payment.sellerAvatar} alt="" />
                      <span>{payment.sellerName}</span>
                    </div>
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
        </div>

        <div className="admin-payments-pagination">
          <p>Showing 1 to 10 of {PAYMENT_STATS.totalTransactions.toLocaleString()} entries</p>
          <div className="admin-payments-pagination-controls">
            <Button type="button" variant="outline" size="icon" aria-label="Previous page" disabled={page === 1}>
              <ChevronLeft size={18} />
            </Button>
            {[1, 2, 3].map((pageNumber) => (
              <Button
                key={pageNumber}
                type="button"
                variant={page === pageNumber ? "default" : "outline"}
                size="icon"
                className={page === pageNumber ? "is-active" : ""}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button type="button" variant="outline" size="icon" aria-label="Next page">
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
                  <img src={selectedPayment.buyerAvatar} alt="" />
                  <div>
                    <p>{selectedPayment.buyerName}</p>
                    <span>{selectedPayment.buyerEmail}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Seller Information</h3>
                <div className="admin-payments-drawer-person">
                  <img src={selectedPayment.sellerAvatar} alt="" />
                  <div>
                    <p>{selectedPayment.sellerName}</p>
                    <span>{selectedPayment.sellerEmail}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Clothing Details</h3>
                <div className="admin-payments-item-card">
                  <img src={selectedPayment.itemImage} alt={selectedPayment.item} />
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
                Transaction Date: {selectedPayment.transactionDate}
              </p>

              <Button type="button" className="admin-payments-stripe-btn">
                <ExternalLink size={18} aria-hidden="true" />
                View Stripe Details
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminPayments;
