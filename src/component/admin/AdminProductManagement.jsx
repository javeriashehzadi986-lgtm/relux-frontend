import React, { useMemo, useState } from "react";
import { ADMIN_PRODUCTS, ADMIN_PRODUCTS_TOTAL } from "@/data/adminProductsData";
import "./adminProductManagement.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAURk_bun2HOkUySQS4zop9iVJL40MAu1viYY4ZLdAO4wuRnkZJUKf2XtI4sOKaE0qfCEKiLXqGL91LPXRNJr7RVS5GXk5RvS2huL9JS-A4GJX0Vw5tleaN9oADaohoyP72PI6bfIrYoV-BNI0z-JYwxy9zOn9H48GpTMbNtd9B7O2NseZuKmNz4chzxWrbhQN4Pmp3c1EZQSYBgTHwK1pFpl5slb4Y68y_MOx9t_IqLAIXQmzSuS4EUJv5pLU5O_rPZ8nzA4lGcNk";

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
        }`.trim()}
        aria-hidden="true"
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

const AdminProductManagement = () => {
  const [selectedId, setSelectedId] = useState(ADMIN_PRODUCTS[0]?.id ?? null);

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

  const filteredProducts = useMemo(() => {
    const query = appliedFilters.name.trim().toLowerCase();

    return ADMIN_PRODUCTS.filter((product) => {
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
  }, [appliedFilters]);

  const selectedProduct =
    filteredProducts.find((product) => product.id === selectedId) ??
    ADMIN_PRODUCTS.find((product) => product.id === selectedId) ??
    null;

  const applyFilters = () => {
    setAppliedFilters({
      name: draftName,
      type: draftType,
      category: draftCategory,
      status: draftStatus,
    });
  };

  return (
    <div className="admin-products-page">
      <header className="admin-products-header">
        <div className="admin-products-header-left">
          <button type="button" className="admin-products-menu-btn" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="admin-products-header-titles">
            <h1>Products Management</h1>
            <p>View and manage all clothing listings on Relux Hub.</p>
          </div>
        </div>
        <div className="admin-products-header-right">
          <div className="admin-products-avatar">
            <img src={ADMIN_AVATAR} alt="Admin profile" />
          </div>
        </div>
      </header>

      <div className="admin-products-body">
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
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
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
                  {filteredProducts.map((product) => (
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
                          <span
                            className={`admin-products-seller-avatar ${
                              product.listingType === "rent"
                                ? "admin-products-seller-avatar--tertiary"
                                : ""
                            }`.trim()}
                          >
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
                          pulse={product.status === "active" && selectedId === product.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-products-table-footer">
              <p>
                Showing {filteredProducts.length} of {ADMIN_PRODUCTS_TOTAL} products
              </p>
              <div className="admin-products-pagination">
                <button type="button" className="admin-products-page-btn" aria-label="Previous page">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button type="button" className="admin-products-page-btn" aria-label="Next page">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {selectedProduct && (
            <aside className="admin-products-detail" aria-label="Product details">
              <div className="admin-products-detail-header">
                <h3>Product Details</h3>
                <button type="button" className="admin-products-detail-menu" aria-label="More options">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              <div className="admin-products-gallery">
                <div className="admin-products-gallery-main">
                  <img src={selectedProduct.gallery[0]} alt={selectedProduct.title} />
                </div>
                {selectedProduct.gallery[1] && (
                  <div className="admin-products-gallery-thumb">
                    <img src={selectedProduct.gallery[1]} alt="" />
                  </div>
                )}
                {selectedProduct.gallery[2] && (
                  <div className="admin-products-gallery-thumb">
                    <img src={selectedProduct.gallery[2]} alt="" />
                  </div>
                )}
                {selectedProduct.gallery[3] && (
                  <div className="admin-products-gallery-thumb admin-products-gallery-more">
                    <img src={selectedProduct.gallery[3]} alt="" />
                    {selectedProduct.extraGalleryCount > 0 && (
                      <span>+{selectedProduct.extraGalleryCount}</span>
                    )}
                  </div>
                )}
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
                    {selectedProduct.sellerAvatar ? (
                      <img src={selectedProduct.sellerAvatar} alt="" />
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          fontWeight: 700,
                        }}
                      >
                        {selectedProduct.sellerInitials}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="admin-products-seller-name">{selectedProduct.sellerFullName}</p>
                    <div className="admin-products-seller-rating">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        star
                      </span>
                      <strong>{selectedProduct.sellerRating}</strong>
                      <span>({selectedProduct.sellerReviews} Reviews)</span>
                    </div>
                  </div>
                  <button type="button" className="admin-products-seller-mail" aria-label="Email seller">
                    <span className="material-symbols-outlined">mail</span>
                  </button>
                </div>
              </div>

              <div className="admin-products-detail-actions">
                <button type="button" className="admin-products-btn-view">
                  <span className="material-symbols-outlined">visibility</span>
                  View Listing
                </button>
                <div className="admin-products-btn-row">
                  <button type="button" className="admin-products-btn-outline">
                    <span className="material-symbols-outlined">archive</span>
                    Remove
                  </button>
                  <button type="button" className="admin-products-btn-danger">
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagement;
