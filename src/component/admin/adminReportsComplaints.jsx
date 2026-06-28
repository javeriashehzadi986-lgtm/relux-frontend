import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import "./adminReportsComplaints.css";

const REPORT_TYPE_OPTIONS = [
  { value: "all", label: "Report Type: All" },
  { value: "listing", label: "Listing Report" },
  { value: "rental", label: "Rental Issue" },
  { value: "resale", label: "Resale Order Issue" },
  { value: "user", label: "User Complaint" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Status: All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const REPORTS = [
  {
    id: "REP-1234",
    reportedBy: "Lucas Thorne",
    reporterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPnOfNLlX5qo4jA4Ft9Z8RVn45Jk7vDMgCldS1jxIZ5BQTSyb-0PdkiJqI2QNIppny-HuO5-Rf3fESjN-DTzYA7yOaun1t7GI9Soxm_BfWsehz5RtZrO_rxFUugn4i_h8gB_zRNAPeYCQwzs9WLaZHZKtx4fA6Sj_p08ogMMrY6IMmXp1YQh_6G4WQXJ3dxNfYYWca8X8Ta7RwAMRZoL_aKsteZvgO7aTpfDTBKOhtoJAYVSn-b4FpqopZb7IXSH6TFjRbHezUhBY",
    reporterMeta: "Member since Jan 2022 • 42 Rentals",
    reportAgainst: "Velvet Gala Dress",
    reportType: "listing",
    date: "Oct 24, 2023",
    status: "pending",
    itemImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDd3x4_VQVnPcF19_XKK0FqKvpqJ8DcxxECcK190uXrrzbK7sSF_YWQPh0MHMOItnGfUhYQeqxfpuCzLGAbJXq4aX8phkGu6ddB0EbiAeobN7fOT8g_2u3Zbs4INfM3FnpAxGL754aHY7vFjnSIioYyZs0y-oMox4vjisorVuiy49o4ofnjJav0sewi19N6YdJQGTB_XmRTWf0lrsoi-xllGAaAVQJzSbeFITXynq0EL8zB6X76PiRAW6OsLGhi8dxSOE872PYwvqU",
    seller: "Boutique De Luxe",
    description:
      "The item received is significantly different from the description. There is a noticeable tear in the inner lining of the dress that was not mentioned or shown in the listing photos. The seller is unresponsive to my messages about a refund.",
    evidence: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0sP_yIrlzPNVA1CcLBt3G60wSQtLx4YUBkLKsze6C3nVCFQjhdhAqcU2X90R__wnsbaJLMhfYYiKU_AnY6pEU9Eif6Z_Jv_NtFt1N7Qmg9fAAAa1oMOVQOyJQldYDuMcYeMFIGIxXVK-F2Z-a6XWhavSeaZxwt3UjJVenN9QTabowB_2Vpq_7mGhsdFk17a48lrFhHASa4vDFVrKIx-86BqNcwMq1gnxBB-I4QZNXIqJvYqlQ9t_X9bsVIzT1yHymCZ5BQjkP704",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfMPDLjsP3ueuiZ1anZs6EijEpBqiSOaB2QpkvTiSFImxbOrbq0xj22V_BHYMgwlyEw-d8yJbJVrvoy4eMg5Gk7pSloqMiqcMwWN7iOkjUJbTuh65DwiE_vQhcwkmKJtBNn9Gz3eyLjrKFXKS4fEJHdJgXzqxNBEqDp4Y9ZS8WxDph3ClV__2b6EuhoD0wnE_XciycYRnCY7IwT8FG9Cy1mhLW1y8aP89zLDGCTgfgtCvdq4zRO1lG749MyTCsp7vEODQ-AGF9KWk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzCPf7TUXupl4RnxMhZCu_1LzA-aZQscAZwpwJ4uG9xiFtFiBm7lry9zPEk0ffO6M9jF7BOmr1npoSCLS_3vVWeTJsLlZ81bi5Vbq3BjLDEooofbtsZmWX-nnt5vSNqNnBOw6TDfbfUlFg5geoWog_T-U_2exeYY2KiiEoRfv_2LQl4ZO3xw8TUEwuK0vDCbF7AIZUZMO8FeDkRdbdZIS-9-6lItgYLnSnEjLX8svYxhQTZJH9WVtkrlal1jEdic0-Qy00b1I00KQ",
    ],
  },
  {
    id: "REP-1235",
    reportedBy: "Sarah Jenkins",
    reporterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDYfq9MCcxoUye0gfNiiOmA6QyCZctEa-2JO2TmQwwMii56g14hsomWr0d4I4aUinKo7LDZCg4X1D2UmwE7RMWIM8WDYbhNqCbfqD-5S7RtprbuPiIWOEXXS-1BwG4q_orih1ZhiNyP8Yw_tzFDTZoR2ok4cN-4PMhatPzp5AmoARGziNQ-2PXg78bUzQU8TmK1t-1a4F5vJ5PCFG2ptfum4izqo1mMDKAZ36s5EfZOugpfLJvrCyA7iuuC3oICzyndqGjnYebCfc",
    reporterMeta: "Member since Mar 2021 • 18 Purchases",
    reportAgainst: "UrbanKicks Shop",
    reportType: "user",
    date: "Oct 23, 2023",
    status: "in_progress",
    itemImage: null,
    seller: null,
    description:
      "The seller has been sending inappropriate messages after I declined a purchase. I would like this account reviewed and the harassment to stop.",
    evidence: [],
  },
  {
    id: "REP-1236",
    reportedBy: "Marcus Zhao",
    reporterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeZo0X0qsi8nnYoLH0b78-SujeLYDZ24I2Y_BMQPVlXxm4FJOBErFHUj0n5YoRsET1WC47RTTeAS7aO4FmEvqWdCoDnViA0T_tQjZGmX77nmzlfpCijmIQ-9j6b06dzc2B9rdSdasiB69iW6rXncMewsT1ivDpgfxbFK18TL7TbyyaXh6fYQSE9nCt-MCWjL2JSByZj_7rzBB0Oew0eyqyFenE-MqIWSoL57JXV5yIE4zEXPW04X6pcwYPGW7EB6QDqnnrHmXypgU",
    reporterMeta: "Member since Aug 2020 • 56 Rentals",
    reportAgainst: "Order #ORD-982",
    reportType: "rental",
    date: "Oct 22, 2023",
    status: "resolved",
    itemImage: null,
    seller: "Luxe Rentals Co.",
    description:
      "The rental item was returned late and the security deposit has not been refunded after two weeks despite the item passing inspection.",
    evidence: [],
  },
  {
    id: "REP-1237",
    reportedBy: "Elena Gilbert",
    reporterAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPweGTPed76eknkc0AeN9UMZo2IVPfAnGkboYZ2YUOXI_-5H5P_F0drWFzKq0y-vP6i8vylcDPM10JSUYB2-GJcIGx0dDWq4Dlv2PsNmacUJkI-0C1vlJ_wTq9Y19AxctHcetTIU5zdIEBTs5MjpUq9YCxvD3FoZINuLIDTXIgncbFBxhYzdI5ACWVsnrVCyX0CAuTUD0xPX5dU8eOoZIk7crgzlqm8bok_emeCHWBxyTt9BYq4w9DH3rBVDsajlCTZkBwsK-tiHY",
    reporterMeta: "Member since Nov 2022 • 9 Purchases",
    reportAgainst: "EcoBag L",
    reportType: "resale",
    date: "Oct 21, 2023",
    status: "pending",
    itemImage: null,
    seller: "Green Threads",
    description:
      "The bag arrived with a broken strap and visible scuff marks that were not disclosed in the listing. Requesting a partial refund or return label.",
    evidence: [],
  },
];

const TYPE_LABELS = {
  listing: "Listing Report",
  rental: "Rental Issue",
  resale: "Resale Issue",
  user: "User Complaint",
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const MODAL_CONFIG = {
  resolve: {
    icon: CheckCircle2,
    iconClass: "admin-reports-modal-icon--resolve",
    title: "Resolve Report?",
    description:
      "By marking this as resolved, an automated notification will be sent to both parties and the case will be closed.",
    confirmLabel: "Confirm Action",
    confirmClass: "admin-reports-modal-confirm--resolve",
  },
  reject: {
    icon: XCircle,
    iconClass: "admin-reports-modal-icon--reject",
    title: "Reject Report?",
    description:
      "The report will be dismissed as insufficient evidence. The reporter will be notified of the decision.",
    confirmLabel: "Confirm Action",
    confirmClass: "admin-reports-modal-confirm--reject",
  },
  suspend: {
    icon: AlertTriangle,
    iconClass: "admin-reports-modal-icon--suspend",
    title: "Suspend User?",
    description:
      "This action will temporarily disable the reported user's account until further investigation is complete.",
    confirmLabel: "Confirm Action",
    confirmClass: "admin-reports-modal-confirm--suspend",
  },
};

function ReportTypeBadge({ type }) {
  return (
    <Badge variant="outline" className="admin-reports-type-badge">
      {TYPE_LABELS[type] ?? type}
    </Badge>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge variant="outline" className={`admin-reports-status-badge admin-reports-status-badge--${status}`}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

const AdminReportsComplaints = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReportId, setSelectedReportId] = useState(REPORTS[0].id);
  const [activeModal, setActiveModal] = useState(null);
  const [page, setPage] = useState(1);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return REPORTS.filter((report) => {
      const matchesQuery =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.reportedBy.toLowerCase().includes(query) ||
        report.reportAgainst.toLowerCase().includes(query);

      const matchesType = typeFilter === "all" || report.reportType === typeFilter;
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const selectedReport =
    filteredReports.find((report) => report.id === selectedReportId) ??
    filteredReports[0] ??
    null;

  const totalReports = 128;
  const modalConfig = activeModal ? MODAL_CONFIG[activeModal] : null;
  const ModalIcon = modalConfig?.icon;

  return (
    <div className="admin-reports-page">
      <header className="admin-reports-toolbar">
        <div className="admin-reports-header">
          <h1>Reports &amp; Complaints</h1>
          <p>Review and manage user reports and complaints.</p>
        </div>

        <div className="admin-reports-toolbar-actions">
          <div className="admin-reports-search">
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by Report ID or User Name"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search by report ID or user name"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="admin-reports-filter-select" aria-label="Filter by report type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPE_OPTIONS.map((option) => (
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
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="admin-reports-layout">
        <Card className="admin-reports-table-panel">
          <div className="admin-reports-table-wrap">
            <Table className="admin-reports-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Report Against</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
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
                          <img src={report.reporterAvatar} alt="" />
                          <span>{report.reportedBy}</span>
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
                      No reports match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="admin-reports-pagination">
            <p>
              Showing {filteredReports.length} of {totalReports} reports
            </p>
            <div className="admin-reports-pagination-controls">
              <Button type="button" variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={18} aria-hidden="true" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => setPage((p) => p + 1)}>
                <ChevronRight size={18} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Card>

        {selectedReport && (
          <Card className="admin-reports-detail-panel">
            <div className="admin-reports-detail-header">
              <div>
                <span className="admin-reports-detail-label">Active Review</span>
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
              <section>
                <h3>Reporter Information</h3>
                <div className="admin-reports-reporter-card">
                  <img src={selectedReport.reporterAvatar} alt="" />
                  <div>
                    <p>{selectedReport.reportedBy}</p>
                    <span>{selectedReport.reporterMeta}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3>Reported Item</h3>
                <div className="admin-reports-item-card">
                  {selectedReport.itemImage && (
                    <img src={selectedReport.itemImage} alt="" />
                  )}
                  <div>
                    <p>{selectedReport.reportAgainst}</p>
                    {selectedReport.seller && (
                      <span>Seller: {selectedReport.seller}</span>
                    )}
                    {selectedReport.reportType === "listing" && (
                      <Button type="button" variant="link" className="admin-reports-view-link">
                        View Listing
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3>Complaint Description</h3>
                <blockquote className="admin-reports-description">
                  &ldquo;{selectedReport.description}&rdquo;
                </blockquote>
              </section>

              {selectedReport.evidence.length > 0 && (
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
            </div>

            <div className="admin-reports-detail-actions">
              <Button
                type="button"
                className="admin-reports-action-btn admin-reports-action-btn--primary"
                onClick={() => setActiveModal("resolve")}
              >
                Mark as Resolved
              </Button>
              <div className="admin-reports-action-row">
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn"
                  onClick={() => setActiveModal("reject")}
                >
                  Reject Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="admin-reports-action-btn admin-reports-action-btn--danger"
                  onClick={() => setActiveModal("suspend")}
                >
                  <Ban size={16} aria-hidden="true" />
                  Suspend User
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(activeModal)} onOpenChange={(open) => !open && setActiveModal(null)}>
        {modalConfig && ModalIcon && (
          <DialogContent className="admin-reports-modal" showCloseButton={false}>
            <div className={`admin-reports-modal-icon ${modalConfig.iconClass}`}>
              <ModalIcon size={32} aria-hidden="true" />
            </div>
            <DialogHeader className="admin-reports-modal-header">
              <DialogTitle>{modalConfig.title}</DialogTitle>
              <DialogDescription>{modalConfig.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="admin-reports-modal-actions">
              <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                className={modalConfig.confirmClass}
                onClick={() => setActiveModal(null)}
              >
                {modalConfig.confirmLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminReportsComplaints;
