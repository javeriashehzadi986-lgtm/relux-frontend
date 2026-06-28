import React, { useMemo, useState } from "react";
import {
  ADMIN_CATEGORY_QUICK_STATS,
  ADMIN_MAIN_CATEGORIES,
  ADMIN_SUBCATEGORIES,
} from "@/data/adminCategoriesData";
import "./adminCategoriesManagement.css";

function formatListings(count) {
  return count.toLocaleString("en-US");
}

const AdminCategoriesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("female");

  const query = searchQuery.trim().toLowerCase();

  const filteredMainCategories = useMemo(() => {
    if (!query) return ADMIN_MAIN_CATEGORIES;

    return ADMIN_MAIN_CATEGORIES.filter((category) => {
      const nameMatch = category.name.toLowerCase().includes(query);
      const subMatch = ADMIN_SUBCATEGORIES[category.id]?.some((sub) =>
        sub.name.toLowerCase().includes(query),
      );
      return nameMatch || subMatch;
    });
  }, [query]);

  const selectedCategory =
    ADMIN_MAIN_CATEGORIES.find((category) => category.id === selectedCategoryId) ??
    ADMIN_MAIN_CATEGORIES[0];

  const filteredSubcategories = useMemo(() => {
    const subs = ADMIN_SUBCATEGORIES[selectedCategoryId] ?? [];
    if (!query) return subs;
    return subs.filter((sub) => sub.name.toLowerCase().includes(query));
  }, [query, selectedCategoryId]);

  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="admin-categories-page">
      <header className="admin-categories-header">
        <div className="admin-categories-header-search-wrap">
          <span className="material-symbols-outlined" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search categories or subcategories..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div className="admin-categories-header-actions">
          <button type="button" className="admin-categories-icon-btn" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="admin-categories-notify-dot" aria-hidden="true" />
          </button>
          <button type="button" className="admin-categories-icon-btn" aria-label="Help">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="admin-categories-header-divider" aria-hidden="true" />
          <div className="admin-categories-manager-label">
            <span>Categories Manager</span>
            <span className="material-symbols-outlined" aria-hidden="true">
              expand_more
            </span>
          </div>
        </div>
      </header>

      <div className="admin-categories-body">
        <div className="admin-categories-intro">
          <div>
            <h2>Categories Management</h2>
            <p>Manage clothing categories available on Relux Hub.</p>
          </div>
          <button type="button" className="admin-categories-btn-primary">
            <span className="material-symbols-outlined">add_circle</span>
            Add New Main Category
          </button>
        </div>

        <div className="admin-categories-main-grid">
          {filteredMainCategories.map((category) => {
            const isSelected = category.id === selectedCategoryId;

            return (
              <article
                key={category.id}
                className={`admin-categories-main-card ${
                  isSelected ? "admin-categories-main-card--selected" : ""
                }`.trim()}
                onClick={() => selectCategory(category.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCategory(category.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="admin-categories-main-card-top">
                  <div
                    className={`admin-categories-main-icon admin-categories-main-icon--${category.iconVariant}`}
                  >
                    <span className="material-symbols-outlined">{category.icon}</span>
                  </div>
                  <span
                    className={`admin-categories-badge ${
                      isSelected
                        ? "admin-categories-badge--selected"
                        : "admin-categories-badge--active"
                    }`.trim()}
                  >
                    {isSelected ? "Selected" : "Active"}
                  </span>
                </div>
                <h3>{category.name}</h3>
                <div className="admin-categories-stats-list">
                  <div className="admin-categories-stat-row">
                    <span>Total Listings</span>
                    <span>{formatListings(category.totalListings)}</span>
                  </div>
                  <div className="admin-categories-stat-row admin-categories-stat-row--sale">
                    <span>Sale Listings</span>
                    <span>{formatListings(category.saleListings)}</span>
                  </div>
                  <div className="admin-categories-stat-row admin-categories-stat-row--rental">
                    <span>Rental Listings</span>
                    <span>{formatListings(category.rentalListings)}</span>
                  </div>
                  <div className="admin-categories-ratio-bar" aria-hidden="true">
                    <span style={{ width: `${category.salePercent}%` }} />
                    <span style={{ width: `${category.rentalPercent}%` }} />
                  </div>
                </div>
                <div className="admin-categories-main-card-actions">
                  <button
                    type="button"
                    className={`admin-categories-view-btn ${
                      isSelected
                        ? "admin-categories-view-btn--selected"
                        : "admin-categories-view-btn--default"
                    }`.trim()}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectCategory(category.id);
                    }}
                  >
                    View Category
                  </button>
                  <button
                    type="button"
                    className="admin-categories-edit-btn"
                    aria-label={`Edit ${category.name} category`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <section className="admin-categories-subsection">
          <div className="admin-categories-subsection-header">
            <div className="admin-categories-subsection-title">
              <h4>
                Subcategories: <span>{selectedCategory.name}</span>
              </h4>
              <span className="admin-categories-subsection-count">
                {filteredSubcategories.length} Total
              </span>
            </div>
            <button type="button" className="admin-categories-btn-add-sub">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                add
              </span>
              Add Subcategory
            </button>
          </div>
          <div className="admin-categories-subsection-body">
            <div className="admin-categories-sub-grid">
              {filteredSubcategories.length === 0 ? (
                <p className="admin-categories-empty">No subcategories match your search.</p>
              ) : (
                filteredSubcategories.map((subcategory) => (
                  <div key={subcategory.id} className="admin-categories-sub-card">
                    <div className="admin-categories-sub-card-inner">
                      <div className="admin-categories-sub-card-main">
                        <div className="admin-categories-sub-thumb">
                          <img src={subcategory.image} alt="" />
                        </div>
                        <div>
                          <h5>{subcategory.name}</h5>
                          <p>{subcategory.listings} active listings</p>
                        </div>
                      </div>
                      <div className="admin-categories-sub-actions">
                        <button
                          type="button"
                          className="admin-categories-sub-action-btn"
                          aria-label={`Edit ${subcategory.name}`}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-categories-sub-action-btn admin-categories-sub-action-btn--danger"
                          aria-label={`Delete ${subcategory.name}`}
                          title="Delete Subcategory"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button type="button" className="admin-categories-add-placeholder">
                <div className="admin-categories-add-placeholder-inner">
                  <span className="material-symbols-outlined">add_circle</span>
                  <span>Add Subcategory</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        <div className="admin-categories-quick-stats">
          {ADMIN_CATEGORY_QUICK_STATS.map((stat) => (
            <article key={stat.id} className="admin-categories-quick-stat">
              <div className="admin-categories-quick-stat-icon">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <p className="admin-categories-quick-stat-label">{stat.label}</p>
                <p className="admin-categories-quick-stat-value">{stat.value}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesManagement;
