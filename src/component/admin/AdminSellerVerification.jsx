import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { toggleAdminSidebar } from "@/utils/adminSidebar";
import AdminRejectReasonDialog from "./AdminRejectReasonDialog";
import "./adminSellerVerification.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAURk_bun2HOkUySQS4zop9iVJL40MAu1viYY4ZLdAO4wuRnkZJUKf2XtI4sOKaE0qfCEKiLXqGL91LPXRNJr7RVS5GXk5RvS2huL9JS-A4GJX0Vw5tleaN9oADaohoyP72PI6bfIrYoV-BNI0z-JYwxy9zOn9H48GpTMbNtd9B7O2NseZuKmNz4chzxWrbhQN4Pmp3c1EZQSYBgTHwK1pFpl5slb4Y68y_MOx9t_IqLAIXQmzSuS4EUJv5pLU5O_rPZ8nzA4lGcNk";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAppliedDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AdminSellerVerification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    pendingReview: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    avgReviewHours: 28,
  });
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setActionError("");
    try {
      const data = await api.getAdminSellerApplications();
      setApplications(data.applications ?? []);
      setStats(data.stats ?? { pendingReview: 0, approvedThisWeek: 0, rejectedThisWeek: 0, avgReviewHours: 28 });
    } catch (error) {
      setActionError(error.message || "Failed to load seller applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      if (application.status !== "pending") return false;
      if (!query) return true;

      return (
        application.name.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        application.shopName.toLowerCase().includes(query)
      );
    });
  }, [applications, searchQuery]);

  const selectedApplication =
    applications.find((application) => application.id === selectedId) ?? null;

  useEffect(() => {
    if (filteredApplications.length === 0) return;
    if (!filteredApplications.some((application) => application.id === selectedId)) {
      setSelectedId(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedId]);

  const handleApprove = async () => {
    if (!selectedApplication) return;
    setActionLoading(true);
    setActionError("");
    try {
      await api.approveSellerApplication(selectedApplication.id);
      await loadApplications();
      setSelectedId(null);
    } catch (error) {
      setActionError(error.message || "Failed to approve seller");
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = () => {
    setRejectReason("");
    setRejectError("");
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedApplication) return;
    const adminNote = rejectReason.trim();
    if (!adminNote) {
      setRejectError("Please enter a rejection reason.");
      return;
    }

    setActionLoading(true);
    setRejectError("");
    setActionError("");
    try {
      await api.rejectSellerApplication(selectedApplication.id, { adminNote });
      setShowRejectDialog(false);
      setRejectReason("");
      await loadApplications();
      setSelectedId(null);
    } catch (error) {
      setRejectError(error.message || "Failed to reject seller");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-verify-page">
      <header className="admin-verify-header">
        <div className="admin-verify-header-left">
          <button
            type="button"
            className="admin-verify-menu-btn"
            aria-label="Open menu"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-verify-header-titles">
            <h1>Seller Verification</h1>
            <p>Review seller applications and verify identity documents on Relux Hub.</p>
          </div>
        </div>

        <div className="admin-verify-header-right">
          <div className="admin-verify-header-search">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="admin-verify-avatar">
            <img src={ADMIN_AVATAR} alt="Admin profile" />
          </div>
        </div>
      </header>

      <div className="admin-verify-body">
        <div className="admin-verify-mobile-search">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="admin-verify-stats">
          <article className="admin-verify-stat-card">
            <p className="admin-verify-stat-label">Pending Review</p>
            <p className="admin-verify-stat-value">
              {loading ? "..." : stats.pendingReview}
            </p>
          </article>
          <article className="admin-verify-stat-card">
            <p className="admin-verify-stat-label">Approved This Week</p>
            <p className="admin-verify-stat-value">
              {loading ? "..." : stats.approvedThisWeek}
            </p>
          </article>
          <article className="admin-verify-stat-card">
            <p className="admin-verify-stat-label">Rejected This Week</p>
            <p className="admin-verify-stat-value">
              {loading ? "..." : stats.rejectedThisWeek}
            </p>
          </article>
          <article className="admin-verify-stat-card">
            <p className="admin-verify-stat-label">Avg. Review Time</p>
            <p className="admin-verify-stat-value">
              {stats.avgReviewHours}h
            </p>
          </article>
        </div>

        {actionError ? <p className="admin-verify-applied-date">{actionError}</p> : null}

        <div className="admin-verify-layout">
          <section aria-label="Pending seller applications">
            <p className="admin-verify-queue-title">Pending Applications</p>
            <div className="admin-verify-queue">
              {loading ? (
                <p className="admin-verify-applied-date">Loading applications...</p>
              ) : filteredApplications.length === 0 ? (
                <p className="admin-verify-applied-date">No pending applications match your search.</p>
              ) : (
                filteredApplications.map((application) => (
                  <button
                    key={application.id}
                    type="button"
                    className={`admin-verify-seller-card ${
                      selectedId === application.id ? "admin-verify-seller-card--selected" : ""
                    }`.trim()}
                    onClick={() => setSelectedId(application.id)}
                  >
                    <span className="admin-verify-seller-card-accent" aria-hidden="true" />
                    <div className="admin-verify-seller-card-row">
                      <div className="admin-verify-seller-card-main">
                        <div className="admin-verify-seller-avatar">
                          {application.avatar ? (
                            <img src={application.avatar} alt="" />
                          ) : (
                            getInitials(application.name)
                          )}
                        </div>
                        <div>
                          <h3>{application.name}</h3>
                          <p>{application.email}</p>
                        </div>
                      </div>
                      <div className="admin-verify-seller-card-meta">
                        <span className="admin-verify-status-pill">Pending</span>
                        <p className="admin-verify-applied-date">
                          Applied: {formatAppliedDate(application.appliedAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section aria-label="Application details">
            {!selectedApplication || selectedApplication.status !== "pending" ? (
              <div className="admin-verify-detail-empty">
                <span className="material-symbols-outlined" aria-hidden="true">
                  verified_user
                </span>
                <p>Select a pending seller application to review documents.</p>
              </div>
            ) : (
              <div className="admin-verify-detail">
                <div className="admin-verify-detail-header">
                  <div className="admin-verify-detail-profile">
                    <div className="admin-verify-seller-avatar">
                      {selectedApplication.avatar ? (
                        <img src={selectedApplication.avatar} alt="" />
                      ) : (
                        getInitials(selectedApplication.name)
                      )}
                    </div>
                    <div>
                      <h2>{selectedApplication.name}</h2>
                      <p>{selectedApplication.email}</p>
                    </div>
                  </div>
                  <span className="admin-verify-status-pill">Pending</span>
                </div>

                <div className="admin-verify-detail-grid">
                  <div className="admin-verify-detail-field">
                    <span>Shop Name</span>
                    <strong>{selectedApplication.shopName}</strong>
                  </div>
                  <div className="admin-verify-detail-field">
                    <span>Phone</span>
                    <strong>{selectedApplication.phone}</strong>
                  </div>
                  <div className="admin-verify-detail-field">
                    <span>City</span>
                    <strong>{selectedApplication.city}</strong>
                  </div>
                  <div className="admin-verify-detail-field">
                    <span>Applied On</span>
                    <strong>{formatAppliedDate(selectedApplication.appliedAt)}</strong>
                  </div>
                  <div className="admin-verify-detail-field">
                    <span>Bank</span>
                    <strong>{selectedApplication.bankName}</strong>
                  </div>
                  <div className="admin-verify-detail-field">
                    <span>Account Title</span>
                    <strong>{selectedApplication.accountTitle}</strong>
                  </div>
                </div>

                <h3 className="admin-verify-docs-title">Identity Documents</h3>
                <div className="admin-verify-docs-grid">
                  <figure className="admin-verify-doc-card">
                    <p>CNIC Front</p>
                    <img src={selectedApplication.cnicFront} alt="CNIC front side" />
                  </figure>
                  <figure className="admin-verify-doc-card">
                    <p>CNIC Back</p>
                    <img src={selectedApplication.cnicBack} alt="CNIC back side" />
                  </figure>
                </div>

                <p className="admin-verify-notes">
                  <strong>Seller note:</strong> {selectedApplication.notes}
                </p>

                <div className="admin-verify-actions">
                  <button
                    type="button"
                    className="admin-verify-btn-approve"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Approve Seller"}
                  </button>
                  <button
                    type="button"
                    className="admin-verify-btn-reject"
                    onClick={openRejectDialog}
                    disabled={actionLoading}
                  >
                    Reject Application
                  </button>
                  <button type="button" className="admin-verify-btn-secondary">
                    Request More Info
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <AdminRejectReasonDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject seller application"
        description="This reason will be shown to the seller on their rejected application page."
        confirmLabel="Reject Application"
        loading={actionLoading}
        error={rejectError}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default AdminSellerVerification;
