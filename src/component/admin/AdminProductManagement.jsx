import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { toggleAdminSidebar } from "@/utils/adminSidebar";
import AdminRejectReasonDialog from "./AdminRejectReasonDialog";
import "./adminProductManagement.css";

const CATEGORY_LABELS = {
  male: "Male",
  female: "Female",
  kids: "Kids",
};

const TYPE_LABELS = {
  sale: "Sale",
  rent: "Rent",
};

const STATUS_LABELS = {
  pending: "Pending Review",
  active: "Active",
  sold: "Sold",
  rented: "Rented",
  removed: "Removed",
};

function ProductStatusBadge({ status, pulse = false }) {
  return (
    <span className={`admin-products-status-badge admin-products-status-badge--${status}`}>
      <span
        className={`admin-products-status-dot ${
          status === "active" && pulse ? "admin-products-status-dot--pulse" : ""
        } ${status === "pending" ? "admin-products-status-dot--pulse" : ""}`.trim()}
        aria-hidden="true"
      />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    pendingReview: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const [draftName, setDraftName] = useState("");
  const [draftType, setDraftType] = useState("all");
  const [draftCategory, setDraftCategory] = useState("all");
  const [draftStatus, setDraftStatus] = useState("all");

  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    type: "all",
    category: "all",
    status: "all",
  });

  const loadListings = useCallback(async () => {
    setLoading(true);
    setActionError("");
    try {
      const data = await api.getAdminListings();
      setProducts(data.listings ?? []);
      setStats(
        data.stats ?? { pendingReview: 0, approvedThisWeek: 0, rejectedThisWeek: 0 },
      );
    } catch (error) {
      const message = error.message || "Failed to load listings";
      if (message.includes("do not have access")) {
        setActionError(
          "Access denied. Log out and sign in with the admin account (admin@reluxhub.com).",
        );
      } else if (message.includes("Session expired") || message.includes("Not authorized")) {
        setActionError("Session expired. Please log in again as admin.");
      } else {
        setActionError(message);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const filteredProducts = useMemo(() => {
    const query = appliedFilters.name.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query);
      const matchesType =
        appliedFilters.type === "all" || product.listingType === appliedFilters.type;
      const matchesCategory =
        appliedFilters.category === "all" || product.category === appliedFilters.category;
      const matchesStatus =
        appliedFilters.status === "all" || product.status === appliedFilters.status;

      return matchesName && matchesType && matchesCategory && matchesStatus;
    });
  }, [products, appliedFilters]);

  const selectedProduct =
    filteredProducts.find((product) => product.id === selectedId) ??
    products.find((product) => product.id === selectedId) ??
    null;

  useEffect(() => {
    if (filteredProducts.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!filteredProducts.some((product) => product.id === selectedId)) {
      setSelectedId(filteredProducts[0].id);
    }
  }, [filteredProducts, selectedId]);

  const applyFilters = () => {
    setAppliedFilters({
      name: draftName,
      type: draftType,
      category: draftCategory,
      status: draftStatus,
    });
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    setActionError("");
    try {
      await api.approveListing(selectedProduct.id);
      await loadListings();
    } catch (error) {
      setActionError(error.message || "Failed to approve listing");
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
    if (!selectedProduct) return;
    const adminNote = rejectReason.trim();
    if (!adminNote) {
      setRejectError("Please enter a rejection reason.");
      return;
    }

    setActionLoading(true);
    setRejectError("");
    setActionError("");
    try {
      await api.rejectListing(selectedProduct.id, { adminNote });
      setShowRejectDialog(false);
      setRejectReason("");
      await loadListings();
    } catch (error) {
      setRejectError(error.message || "Failed to reject listing");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <div className="admin-products-header-left">
          <button
            type="button"
            className="admin-products-menu-btn"
            aria-label="Open menu"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-products-header-titles">
            <h1>Products Management</h1>
            <p>Review new listings and manage approved products on Relux Hub.</p>
          </div>
        </div>
      </header>

      <div className="admin-products-body">
        <div className="admin-products-stats-row">
          <article className="admin-products-stat-card">
            <p>Pending Review</p>
            <strong>{loading ? "..." : stats.pendingReview}</strong>
          </article>
          <article className="admin-products-stat-card">
            <p>Approved This Week</p>
            <strong>{loading ? "..." : stats.approvedThisWeek}</strong>
          </article>
          <article className="admin-products-stat-card">
            <p>Rejected This Week</p>
            <strong>{loading ? "..." : stats.rejectedThisWeek}</strong>
          </article>
        </div>

        {actionError ? <p className="admin-products-action-error">{actionError}</p> : null}

        <div className="admin-products-filters">
          <div className="admin-products-filter-field">
            <label htmlFor="admin-product-name">Clothing Name</label>
            <input
              id="admin-product-name"
              type="text"
              placeholder="e.g. Vintage Denim"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
          </div>
          <div className="admin-products-filter-field admin-products-filter-field--fixed">
            <label htmlFor="admin-product-type">Listing Type</label>
            <select
              id="admin-product-type"
              value={draftType}
              onChange={(event) => setDraftType(event.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="admin-products-filter-field admin-products-filter-field--fixed">
            <label htmlFor="admin-product-category">Category</label>
            <select
              id="admin-product-category"
              value={draftCategory}
              onChange={(event) => setDraftCategory(event.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div className="admin-products-filter-field admin-products-filter-field--fixed">
            <label htmlFor="admin-product-status">Status</label>
            <select
              id="admin-product-status"
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value)}
            >
              <option value="all">Any Status</option>
              <option value="pending">Pending Review</option>
              <option value="active">Active</option>
              <option value="removed">Removed</option>
            </select>
          </div>
          <button type="button" className="admin-products-apply-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>

        <div className="admin-products-layout">
          <section className="admin-products-table-card" aria-label="Products table">
            <div className="admin-products-table-scroll">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6}>Loading listings...</td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No listings match your filters.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={
                          selectedId === product.id ? "admin-products-row--selected" : undefined
                        }
                        onClick={() => setSelectedId(product.id)}
                      >
                        <td>
                          <div className="admin-products-product-cell">
                            <div className="admin-products-thumb">
                              <img src={product.image} alt="" />
                            </div>
                            <div>
                              <p className="admin-products-product-title">{product.title}</p>
                              <p className="admin-products-product-id">ID: #{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-products-seller-cell">
                            <span className="admin-products-seller-avatar">
                              {product.sellerInitials}
                            </span>
                            <span>{product.sellerName}</span>
                          </div>
                        </td>
                        <td>{CATEGORY_LABELS[product.category]}</td>
                        <td>
                          <span
                            className={`admin-products-type-badge admin-products-type-badge--${product.listingType}`}
                          >
                            {TYPE_LABELS[product.listingType]}
                          </span>
                        </td>
                        <td className="admin-products-price">{product.price}</td>
                        <td>
                          <ProductStatusBadge
                            status={product.status}
                            pulse={product.status === "pending" && selectedId === product.id}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="admin-products-table-footer">
              <p>
                Showing {filteredProducts.length} of {products.length} listings
              </p>
            </div>
          </section>

          {selectedProduct && (
            <aside className="admin-products-detail" aria-label="Product details">
              <div className="admin-products-detail-header">
                <h3>Product Details</h3>
              </div>

              <div className="admin-products-gallery">
                <div className="admin-products-gallery-main">
                  <img src={selectedProduct.gallery[0]} alt={selectedProduct.title} />
                </div>
                {selectedProduct.gallery.slice(1, 4).map((image, index) => (
                  <div key={`${image}-${index}`} className="admin-products-gallery-thumb">
                    <img src={image} alt="" />
                  </div>
                ))}
              </div>

              <h4 className="admin-products-detail-title">{selectedProduct.title}</h4>
              <div className="admin-products-detail-badges">
                <span className="admin-products-detail-badge admin-products-detail-badge--type">
                  {TYPE_LABELS[selectedProduct.listingType]}
                </span>
                <span className="admin-products-detail-badge admin-products-detail-badge--status">
                  {STATUS_LABELS[selectedProduct.status]}
                </span>
              </div>

              <div className="admin-products-meta-grid">
                <div className="admin-products-meta-item">
                  <span>Subcategory</span>
                  <strong>{selectedProduct.subcategory}</strong>
                </div>
                <div className="admin-products-meta-item">
                  <span>Size</span>
                  <strong>{selectedProduct.size}</strong>
                </div>
                <div className="admin-products-meta-item">
                  <span>Condition</span>
                  <strong>{selectedProduct.condition}</strong>
                </div>
                <div className="admin-products-meta-item">
                  <span>List Price</span>
                  <strong className="admin-products-meta-price">{selectedProduct.price}</strong>
                </div>
              </div>

              <p className="admin-products-description-label">Description</p>
              <p className="admin-products-description">{selectedProduct.description}</p>

              <div className="admin-products-seller-card">
                <p>Seller Information</p>
                <div className="admin-products-seller-row">
                  <div className="admin-products-seller-photo">
                    <span>{selectedProduct.sellerInitials}</span>
                  </div>
                  <div>
                    <p className="admin-products-seller-name">{selectedProduct.sellerFullName}</p>
                    <p>{selectedProduct.sellerEmail}</p>
                    <p>{selectedProduct.sellerPhone}</p>
                  </div>
                </div>
              </div>

              {selectedProduct.verificationStatus === "pending" ? (
                <div className="admin-products-review-actions">
                  <button
                    type="button"
                    className="admin-products-btn-approve"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    Approve Listing
                  </button>
                  <button
                    type="button"
                    className="admin-products-btn-danger"
                    onClick={openRejectDialog}
                    disabled={actionLoading}
                  >
                    Reject Listing
                  </button>
                </div>
              ) : selectedProduct.adminNote ? (
                <p className="admin-products-admin-note">Admin note: {selectedProduct.adminNote}</p>
              ) : null}
            </aside>
          )}
        </div>
      </div>

      <AdminRejectReasonDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject listing"
        description="This reason will be shown to the seller on their listing in My Listings."
        confirmLabel="Reject Listing"
        loading={actionLoading}
        error={rejectError}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default AdminProductManagement;
