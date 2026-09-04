import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import "./adminReportsComplaints.css";

const ISSUE_TYPE_OPTIONS = [
  { value: "all", label: "Issue Type: All" },
  { value: "order", label: "Order" },
  { value: "rental", label: "Rental" },
  { value: "payment", label: "Payment" },
  { value: "return", label: "Return" },
  { value: "listing", label: "Listing" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Status: All" },
  { value: "pending", label: "Open / Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const ROLE_OPTIONS = [
  { value: "all", label: "User: All" },
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
];

const TYPE_LABELS = {
  order: "Order",
  rental: "Rental",
  payment: "Payment",
  return: "Return",
  listing: "Listing",
  other: "Other",
};

const STATUS_LABELS = {
  pending: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const PAGE_SIZE = 10;

const MODAL_CONFIG = {
  resolve: {
    icon: CheckCircle2,
    iconClass: "admin-reports-modal-icon--resolve",
    title: "Resolve Dispute / Request?",
    description:
      "Your typed message will be shown to the buyer and (if linked) the seller. Write your own decision first.",
    confirmLabel: "Resolve",
    confirmClass: "admin-reports-modal-confirm--resolve",
  },
  reject: {
    icon: XCircle,
    iconClass: "admin-reports-modal-icon--reject",
    title: "Dismiss Request?",
    description:
      "The request will be closed. Your typed message will be shown to the user — write it in the reply box first.",
    confirmLabel: "Dismiss",
    confirmClass: "admin-reports-modal-confirm--reject",
  },
  askSeller: {
    icon: Send,
    iconClass: "admin-reports-modal-icon--resolve",
    title: "Ask Seller for Response?",
    description:
      "Your typed message will be sent to the seller. Write exactly what you want them to see.",
    confirmLabel: "Contact Seller",
    confirmClass: "admin-reports-modal-confirm--resolve",
  },
  askBuyer: {
    icon: Send,
    iconClass: "admin-reports-modal-icon--resolve",
    title: "Ask Buyer for Response?",
    description:
      "Your typed message will be sent to the buyer. Write exactly what you want them to see.",
    confirmLabel: "Contact Buyer",
    confirmClass: "admin-reports-modal-confirm--resolve",
  },
  askBoth: {
    icon: Send,
    iconClass: "admin-reports-modal-icon--resolve",
    title: "Contact Buyer & Seller?",
    description:
      "Your typed message will be sent to both parties. Write exactly what you want them to see.",
    confirmLabel: "Contact Both",
    confirmClass: "admin-reports-modal-confirm--resolve",
  },
};

function getDisputeStageLabel(stage) {
  switch (stage) {
    case "awaiting_seller":
      return "Waiting for seller";
    case "awaiting_buyer":
      return "Waiting for buyer";
    case "awaiting_both":
      return "Waiting for buyer & seller";
    case "seller_responded":
      return "Seller responded";
    case "buyer_responded":
      return "Buyer responded";
    case "both_responded":
      return "Both responded — ready to release escrow";
    case "resolved":
      return "Resolved";
    default:
      return "New dispute";
  }
}

function canContactDisputeParties(report) {
  if (!report) return false;
  if (report.isDispute) return true;
  return Boolean(report.orderId && report.buyerId && report.sellerId);
}

function isMediationReady(report) {
  if (!canContactDisputeParties(report)) return true;
  return Boolean(report.mediationComplete);
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function ReportTypeBadge({ type }) {
  return (
    <Badge variant="outline" className="admin-reports-type-badge">
      {TYPE_LABELS[type] ?? type}
    </Badge>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={`admin-reports-status-badge admin-reports-status-badge--${status}`}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

function ReporterAvatar({ name, src }) {
  if (src) {
    return <img src={src} alt="" />;
  }
  return (
    <span className="admin-reports-avatar-fallback" aria-hidden="true">
      {getInitials(name)}
    </span>
  );
}

const AdminSupportCenter = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [page, setPage] = useState(1);
  const [orderSettlement, setOrderSettlement] = useState(null);
  const [orderSettlementType, setOrderSettlementType] = useState("rental");
  const [adminRentalCharge, setAdminRentalCharge] = useState("");
  const [adminDamageCharge, setAdminDamageCharge] = useState("");
  const [adminSellerPayout, setAdminSellerPayout] = useState("");
  const [adminBuyerRefund, setAdminBuyerRefund] = useState("");
  const [settlementLoading, setSettlementLoading] = useState(false);
  const [releasingEscrow, setReleasingEscrow] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getAdminReports();
      setReports(data.reports ?? []);
    } catch (error) {
      setLoadError(error.message || "Failed to load support requests");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesQuery =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.reportedBy.toLowerCase().includes(query) ||
        report.reportAgainst.toLowerCase().includes(query);

      const matchesType = typeFilter === "all" || report.reportType === typeFilter;
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      const matchesRole = roleFilter === "all" || report.reporterRole === roleFilter;

      return matchesQuery && matchesType && matchesStatus && matchesRole;
    });
  }, [reports, searchQuery, statusFilter, typeFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedReports = filteredReports.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter, statusFilter, roleFilter]);

  useEffect(() => {
    if (pagedReports.length === 0) {
      setSelectedReportId("");
      return;
    }
    if (!pagedReports.some((report) => report.id === selectedReportId)) {
      setSelectedReportId(pagedReports[0].id);
    }
  }, [pagedReports, selectedReportId]);

  const selectedReport =
    filteredReports.find((report) => report.id === selectedReportId) ?? null;

  useEffect(() => {
    setReplyText(selectedReport?.adminReply || "");
  }, [selectedReport?.mongoId]);

  useEffect(() => {
    if (activeModal) return undefined;

    document.body.style.pointerEvents = "";
    document.body.removeAttribute("inert");
    document.body.style.overflow = "";

    return () => {
      document.body.style.pointerEvents = "";
      document.body.removeAttribute("inert");
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  useEffect(() => {
    let cancelled = false;

    async function loadSettlement() {
      if (!selectedReport?.orderId) {
        setOrderSettlement(null);
        return;
      }

      setSettlementLoading(true);
      try {
        const data = await api.getAdminOrderSettlement(selectedReport.orderId);
        if (!cancelled) {
          setOrderSettlement(data.settlement ?? null);
          setOrderSettlementType(data.orderType || data.settlement?.orderType || "rental");
          setAdminRentalCharge(String(data.settlement?.rentalChargePkr ?? ""));
          setAdminDamageCharge(String(data.settlement?.damageDeductionPkr ?? ""));
          setAdminSellerPayout(String(data.settlement?.sellerPayoutPkr ?? data.settlement?.itemAmountPkr ?? ""));
          setAdminBuyerRefund(String(data.settlement?.refundAmountPkr ?? "0"));
        }
      } catch {
        if (!cancelled) setOrderSettlement(null);
      } finally {
        if (!cancelled) setSettlementLoading(false);
      }
    }

    loadSettlement();
    return () => {
      cancelled = true;
    };
  }, [selectedReport?.orderId, selectedReport?.mongoId]);

  const handleReleaseEscrow = async () => {
    if (!selectedReport?.orderId || !orderSettlement) return;
    const decision = replyText.trim();
    if (!decision) {
      setActionError(
        "Write your own message/decision in the reply box before releasing escrow.",
      );
      return;
    }
    setReleasingEscrow(true);
    setActionError("");
    try {
      if (orderSettlementType === "sale") {
        await api.resolveAdminSaleEscrow(selectedReport.orderId, {
          sellerPayoutPkr: Number(adminSellerPayout) || 0,
          refundAmountPkr: Number(adminBuyerRefund) || 0,
          decision,
          adminSettlementNote: decision,
        });
      } else {
        await api.resolveAdminOrderSettlement(selectedReport.orderId, {
          rentalChargePkr: Number(adminRentalCharge) || 0,
          damageDeductionPkr: Number(adminDamageCharge) || 0,
          decision,
          adminSettlementNote: decision,
        });
      }
      await loadReports();
      const data = await api.getAdminOrderSettlement(selectedReport.orderId);
      setOrderSettlement(data.settlement ?? null);
      setOrderSettlementType(data.orderType || data.settlement?.orderType || "rental");
    } catch (error) {
      setActionError(error.message || "Failed to release escrow");
    } finally {
      setReleasingEscrow(false);
    }
  };

  const formatPkr = (amount) =>
    `PKR ${Math.round(Number(amount) || 0).toLocaleString("en-PK")}`;

  const modalConfig = activeModal ? MODAL_CONFIG[activeModal] : null;
  const ModalIcon = modalConfig?.icon;
  const isClosed = selectedReport?.status === "resolved";
  const escrowAlreadyReleased =
    orderSettlement?.escrowStatus === "released" ||
    orderSettlement?.escrowSettlementStatus === "admin_settled";
  const canReleaseEscrow =
    Boolean(orderSettlement) &&
    orderSettlement.escrowSettlementStatus === "disputed" &&
    !escrowAlreadyReleased &&
    isMediationReady(selectedReport);
  const mediationPending =
    canContactDisputeParties(selectedReport) &&
    selectedReport?.orderId &&
    !isMediationReady(selectedReport) &&
    !escrowAlreadyReleased;
  const canContactParties = canContactDisputeParties(selectedReport);
  const waitingForSeller =
    Boolean(selectedReport?.adminMessageToSeller) &&
    !(
      selectedReport?.sellerResponses?.length > 0 ||
      selectedReport?.sellerResponse
    );
  const waitingForBuyer =
    Boolean(selectedReport?.adminMessageToBuyer) &&
    !(
      selectedReport?.buyerResponses?.length > 0 ||
      selectedReport?.buyerResponse
    );

  const patchReport = async (body) => {
    if (!selectedReport) return;
    setActionLoading(true);
    setActionError("");
    try {
      await api.updateAdminReport(selectedReport.mongoId, body);
      await loadReports();
    } catch (error) {
      setActionError(error.message || "Failed to update request");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkInProgress = async () => {
    if (!selectedReport || isClosed) return;
    try {
      await patchReport({
        status: "in_progress",
        adminReply: replyText.trim() || selectedReport.adminReply || "",
      });
    } catch {
      /* error already set */
    }
  };

  const handleConfirmModal = async () => {
    if (!selectedReport || !activeModal) return;

    const trimmedReply = replyText.trim();
    if (!trimmedReply) {
      setActionError(
        "Write your own message in the reply box first. Automatic messages are disabled.",
      );
      return;
    }

    let body;
    if (activeModal === "askSeller") {
      body = {
        askSeller: true,
        messageToSeller: trimmedReply,
        adminReply: trimmedReply,
      };
    } else if (activeModal === "askBuyer") {
      body = {
        askBuyer: true,
        messageToBuyer: trimmedReply,
        adminReply: trimmedReply,
      };
    } else if (activeModal === "askBoth") {
      body = {
        askBoth: true,
        messageToSeller: trimmedReply,
        messageToBuyer: trimmedReply,
        adminReply: trimmedReply,
      };
    } else if (activeModal === "resolve") {
      body = {
        status: "resolved",
        decision: trimmedReply,
        adminReply: trimmedReply,
      };
    } else {
      body = {
        status: "resolved",
        decision: trimmedReply,
        adminReply: trimmedReply,
        adminNote: "Dismissed by admin",
      };
    }

    try {
      setActionError("");
      await patchReport(body);
      setActiveModal(null);
    } catch {
      /* keep modal open so admin can retry; error shown in banner */
    }
  };

  return (
    <div className="admin-reports-page">
      <header className="admin-reports-toolbar">
        <div className="admin-reports-header">
          <h1>Support Center</h1>
          <p>Review and resolve buyer &amp; seller support requests.</p>
        </div>

        <div className="admin-reports-toolbar-actions">
          <div className="admin-reports-search">
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by ID or user name"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search support requests"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="admin-reports-filter-select" aria-label="Filter by user role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="admin-reports-select-content" position="popper">
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="admin-reports-filter-select" aria-label="Filter by issue type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="admin-reports-select-content" position="popper">
              {ISSUE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="admin-reports-filter-select" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="admin-reports-select-content" position="popper">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {(loadError || actionError) && (
        <p className="admin-reports-banner-error" role="alert">
          {loadError || actionError}
        </p>
      )}

      <div className="admin-reports-layout">
        <Card className="admin-reports-table-panel">
          <div className="admin-reports-table-wrap">
            <Table className="admin-reports-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="admin-reports-empty">
                      Loading requests...
                    </TableCell>
                  </TableRow>
                ) : pagedReports.length > 0 ? (
                  pagedReports.map((report) => (
                    <TableRow
                      key={report.mongoId || report.id}
                      className={
                        selectedReport?.id === report.id
                          ? "admin-reports-row admin-reports-row--selected"
                          : "admin-reports-row"
                      }
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      <TableCell className="admin-reports-id">#{report.id}</TableCell>
                      <TableCell>
                        <div className="admin-reports-person">
                          <ReporterAvatar
                            name={report.reportedBy}
                            src={report.reporterAvatar}
                          />
                          <div className="admin-reports-person-text">
                            <span>{report.reportedBy}</span>
                            <small>
                              {report.reporterRole === "seller" ? "Seller" : "Buyer"}
                              {report.isDispute ? " · Dispute" : ""}
                            </small>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{report.reportAgainst}</TableCell>
                      <TableCell>
                        <ReportTypeBadge type={report.reportType} />
                      </TableCell>
                      <TableCell className="admin-reports-date">{report.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={report.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="admin-reports-empty">
                      {reports.length === 0
                        ? "No support requests yet."
                        : "No requests match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="admin-reports-pagination">
            <p>
              Showing {pagedReports.length} of {filteredReports.length} requests
            </p>
            <div className="admin-reports-pagination-controls">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Card>

        {selectedReport && (
          <Card className="admin-reports-detail-panel">
            <div className="admin-reports-detail-header">
              <div>
                <span className="admin-reports-detail-label">Active Request</span>
                <h2>#{selectedReport.id}</h2>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="admin-reports-close-btn"
                onClick={() => setSelectedReportId("")}
                aria-label="Close detail panel"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="admin-reports-detail-body">
              {isClosed && (
                <p className="admin-reports-closed-banner" role="status">
                  This request is resolved. Select an open request to send messages or take
                  action.
                </p>
              )}

              {actionLoading && (
                <p className="admin-reports-action-banner" role="status">
                  Saving your changes...
                </p>
              )}

              <section>
                <h3>Reporter</h3>
                <div className="admin-reports-reporter-card">
                  <ReporterAvatar
                    name={selectedReport.reportedBy}
                    src={selectedReport.reporterAvatar}
                  />
                  <div>
                    <p>{selectedReport.reportedBy}</p>
                    <span>{selectedReport.reporterMeta}</span>
                  </div>
                </div>
              </section>

              {selectedReport.isDispute && (
                <section>
                  <h3>Dispute Parties</h3>
                  <div className="admin-reports-item-card admin-reports-dispute-card">
                    <div>
                      <p>
                        Buyer: {selectedReport.buyerName || selectedReport.reportedBy}
                      </p>
                      <span>
                        Seller: {selectedReport.seller || "Unknown"}
                        {selectedReport.sellerEmail
                          ? ` • ${selectedReport.sellerEmail}`
                          : ""}
                      </span>
                      {selectedReport.productTitle && (
                        <span>Product: {selectedReport.productTitle}</span>
                      )}
                      {selectedReport.orderId && (
                        <span>
                          Order: #{String(selectedReport.orderId).slice(-6).toUpperCase()}
                        </span>
                      )}
                      <span className="admin-reports-stage">
                        Stage: {getDisputeStageLabel(selectedReport.disputeStage)}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              <section>
                <h3>Subject</h3>
                <div className="admin-reports-item-card">
                  {selectedReport.itemImage && (
                    <img src={selectedReport.itemImage} alt="" />
                  )}
                  <div>
                    <p>{selectedReport.reportAgainst}</p>
                    <span>
                      Issue type:{" "}
                      {selectedReport.issueType ||
                        TYPE_LABELS[selectedReport.reportType]}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Buyer / User Message</h3>
                <blockquote className="admin-reports-description">
                  &ldquo;{selectedReport.description}&rdquo;
                </blockquote>
              </section>

              {selectedReport.adminMessageToBuyer && (
                <section>
                  <h3>Message sent to Buyer</h3>
                  <blockquote className="admin-reports-description">
                    &ldquo;{selectedReport.adminMessageToBuyer}&rdquo;
                  </blockquote>
                </section>
              )}

              {(selectedReport.buyerResponses?.length > 0 || selectedReport.buyerResponse) && (
                <section>
                  <h3>Buyer Responses</h3>
                  {(selectedReport.buyerResponses?.length
                    ? selectedReport.buyerResponses
                    : [{ text: selectedReport.buyerResponse }]
                  ).map((entry, index) => (
                    <blockquote
                      key={`buyer-resp-${index}`}
                      className="admin-reports-description admin-reports-description--buyer"
                    >
                      &ldquo;{entry.text}&rdquo;
                    </blockquote>
                  ))}
                </section>
              )}

              {selectedReport.adminMessageToSeller && (
                <section>
                  <h3>Message sent to Seller</h3>
                  <blockquote className="admin-reports-description">
                    &ldquo;{selectedReport.adminMessageToSeller}&rdquo;
                  </blockquote>
                </section>
              )}

              {(selectedReport.sellerResponses?.length > 0 || selectedReport.sellerResponse) && (
                <section>
                  <h3>Seller Responses</h3>
                  {(selectedReport.sellerResponses?.length
                    ? selectedReport.sellerResponses
                    : [{ text: selectedReport.sellerResponse }]
                  ).map((entry, index) => (
                    <blockquote
                      key={`seller-resp-${index}`}
                      className="admin-reports-description admin-reports-description--seller"
                    >
                      &ldquo;{entry.text}&rdquo;
                    </blockquote>
                  ))}
                </section>
              )}

              {selectedReport.evidence?.length > 0 && (
                <section>
                  <div className="admin-reports-evidence-header">
                    <h3>Uploaded Evidence</h3>
                    <span>{selectedReport.evidence.length} Photos</span>
                  </div>
                  <div className="admin-reports-evidence-grid">
                    {selectedReport.evidence.map((photo, index) => (
                      <img key={index} src={photo} alt={`Evidence ${index + 1}`} />
                    ))}
                  </div>
                </section>
              )}

              {selectedReport.orderId && (
                <section className="admin-reports-escrow-section">
                  <h3>Escrow Settlement</h3>
                  {settlementLoading ? (
                    <p>Loading settlement details...</p>
                  ) : orderSettlement ? (
                    <div className="admin-reports-escrow-card">
                      {orderSettlementType === "sale" ? (
                        <>
                          <p>
                            <strong>Total paid:</strong>{" "}
                            {formatPkr(orderSettlement.totalPaidPkr)}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {orderSettlement.escrowSettlementStatus || "none"}
                          </p>
                          <p>
                            <strong>Item amount:</strong>{" "}
                            {formatPkr(orderSettlement.itemAmountPkr)}
                          </p>
                          {orderSettlement.saleEscrowAutoReleaseAt ? (
                            <p>
                              <strong>Auto-release at:</strong>{" "}
                              {new Date(orderSettlement.saleEscrowAutoReleaseAt).toLocaleString()}
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Deposit:</strong> {formatPkr(orderSettlement.depositPkr)}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {orderSettlement.escrowSettlementStatus || "none"}
                          </p>
                          <p>
                            <strong>Seller proposed rent:</strong>{" "}
                            {formatPkr(orderSettlement.rentalChargePkr)}
                          </p>
                          <p>
                            <strong>Seller proposed damage:</strong>{" "}
                            {formatPkr(orderSettlement.damageDeductionPkr)}
                          </p>
                        </>
                      )}
                      <p>
                        <strong>Buyer refund (proposed):</strong>{" "}
                        {formatPkr(orderSettlement.refundAmountPkr)}
                      </p>
                      <p>
                        <strong>Seller payout (proposed):</strong>{" "}
                        {formatPkr(orderSettlement.sellerPayoutPkr)}
                      </p>
                      {orderSettlement.disputeReason ? (
                        <blockquote className="admin-reports-description">
                          Buyer dispute: {orderSettlement.disputeReason}
                        </blockquote>
                      ) : null}
                      {mediationPending ? (
                        <p className="admin-reports-mediation-note">
                          Use &ldquo;Contact Both Parties&rdquo; and wait for buyer and seller to
                          respond in Support Center before releasing escrow.
                        </p>
                      ) : null}
                      {canReleaseEscrow ? (
                        <div className="admin-reports-escrow-form">
                          {orderSettlementType === "sale" ? (
                            <>
                              <label>
                                Seller payout (PKR)
                                <Input
                                  type="number"
                                  min="0"
                                  value={adminSellerPayout}
                                  onChange={(e) => setAdminSellerPayout(e.target.value)}
                                />
                              </label>
                              <label>
                                Buyer refund (PKR)
                                <Input
                                  type="number"
                                  min="0"
                                  value={adminBuyerRefund}
                                  onChange={(e) => setAdminBuyerRefund(e.target.value)}
                                />
                              </label>
                            </>
                          ) : (
                            <>
                              <label>
                                Final rent charge (PKR)
                                <Input
                                  type="number"
                                  min="0"
                                  value={adminRentalCharge}
                                  onChange={(e) => setAdminRentalCharge(e.target.value)}
                                />
                              </label>
                              <label>
                                Final damage deduction (PKR)
                                <Input
                                  type="number"
                                  min="0"
                                  value={adminDamageCharge}
                                  onChange={(e) => setAdminDamageCharge(e.target.value)}
                                />
                              </label>
                            </>
                          )}
                          <Button
                            type="button"
                            className="admin-reports-action-btn admin-reports-action-btn--primary"
                            onClick={handleReleaseEscrow}
                            disabled={releasingEscrow}
                          >
                            {releasingEscrow ? "Releasing..." : "Release Escrow & Resolve"}
                          </Button>
                        </div>
                      ) : escrowAlreadyReleased ? (
                        <p className="admin-reports-escrow-released-note">
                          Escrow has been released for this order. Buyer refund and seller payout
                          notifications were sent.
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p>No escrow settlement linked to this order.</p>
                  )}
                </section>
              )}

              <section className="admin-reports-reply-section">
                <h3>
                  {selectedReport.isDispute
                    ? "Message to buyer / seller / Final decision"
                    : "Admin Reply"}
                </h3>
                <Textarea
                  className="admin-reports-reply-input"
                  placeholder={
                    selectedReport.isDispute
                      ? "Write what to ask the buyer or seller, or your final decision for both parties..."
                      : "Type your reply for the user..."
                  }
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  rows={4}
                  disabled={actionLoading || isClosed}
                />
                <p className="admin-reports-reply-hint">
                  {selectedReport.isDispute
                    ? "Type your own message above, then use Contact / Resolve. No automatic text is sent."
                    : "Type your own reply — this is what the user will see. No automatic text is sent."}
                </p>
              </section>
            </div>

            <div className="admin-reports-detail-actions">
              {!canContactParties && !isClosed ? (
                <p className="admin-reports-action-hint">
                  Contact buttons need a linked order dispute with both buyer and seller. Ask the
                  user to re-submit with an order selected, or use Resolve for general requests.
                </p>
              ) : null}

              {(waitingForSeller || waitingForBuyer) && !isClosed ? (
                <p className="admin-reports-action-hint admin-reports-action-hint--waiting">
                  {waitingForSeller && waitingForBuyer
                    ? "Waiting for buyer and seller to respond in Support Center. You can send a follow-up message anytime."
                    : waitingForSeller
                      ? "Waiting for seller response. You can send a follow-up message anytime."
                      : "Waiting for buyer response. You can send a follow-up message anytime."}
                </p>
              ) : null}

              <Button
                type="button"
                className="admin-reports-action-btn admin-reports-action-btn--primary"
                onClick={() => setActiveModal("askBoth")}
                disabled={actionLoading || isClosed || !canContactParties}
              >
                <Send size={16} aria-hidden="true" />
                Contact Both Parties
              </Button>

              <div className="admin-reports-action-row">
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn"
                  onClick={() => setActiveModal("askSeller")}
                  disabled={actionLoading || isClosed || !canContactParties}
                >
                  <Send size={16} aria-hidden="true" />
                  Ask Seller
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn"
                  onClick={() => setActiveModal("askBuyer")}
                  disabled={actionLoading || isClosed || !canContactParties}
                >
                  <Send size={16} aria-hidden="true" />
                  Ask Buyer
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="admin-reports-action-btn"
                onClick={() => setActiveModal("resolve")}
                disabled={actionLoading || isClosed}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Resolve with Decision
              </Button>
              <div className="admin-reports-action-row">
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn"
                  onClick={handleMarkInProgress}
                  disabled={
                    actionLoading || isClosed || selectedReport.status === "in_progress"
                  }
                >
                  Mark In Progress
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn"
                  onClick={() => setActiveModal("reject")}
                  disabled={actionLoading || isClosed}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Dialog
        open={Boolean(activeModal)}
        onOpenChange={(open) => {
          if (!open) setActiveModal(null);
        }}
      >
        {activeModal && modalConfig && ModalIcon ? (
          <DialogContent
            className="admin-reports-modal"
            overlayClassName="admin-reports-modal-overlay"
            showCloseButton={false}
          >
            <div className={`admin-reports-modal-icon ${modalConfig.iconClass}`}>
              <ModalIcon size={32} aria-hidden="true" />
            </div>
            <DialogHeader className="admin-reports-modal-header">
              <DialogTitle className="admin-reports-modal-title">{modalConfig.title}</DialogTitle>
              <DialogDescription className="admin-reports-modal-description">
                {modalConfig.description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="admin-reports-modal-actions">
              <Button
                type="button"
                variant="outline"
                className="admin-reports-modal-cancel-btn"
                onClick={() => setActiveModal(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className={`admin-reports-modal-confirm-btn ${modalConfig.confirmClass}`}
                onClick={handleConfirmModal}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : modalConfig.confirmLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
};

export default AdminSupportCenter;
