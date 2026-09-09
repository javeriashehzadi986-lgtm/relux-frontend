import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import "./adminCategoriesManagement.css";

const CATEGORY_ICONS = [
  "checkroom",
  "apparel",
  "styler",
  "shopping_bag",
  "dry_cleaning",
  "iron",
  "watch",
  "diamond",
  "spa",
  "sports",
  "child_care",
  "woman",
  "man",
  "category",
];

const ICON_VARIANTS = [
  { value: "primary-dim", label: "Soft green" },
  { value: "primary-container", label: "Green fill" },
  { value: "tertiary", label: "Warm accent" },
];

function formatListings(count) {
  return Number(count || 0).toLocaleString("en-US");
}

const emptyForm = {
  name: "",
  icon: "category",
  iconVariant: "primary-dim",
  imageUrl: "",
  productStyleKey: "",
};

function suggestStyleKeyFromName(name = "") {
  const cleaned = name.trim().replace(/\s+wear$/i, "").trim();
  return cleaned || name.trim();
}

const AdminCategoriesManagement = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("female");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAdminCategories();
      const mains = data.mainCategories ?? [];
      setMainCategories(mains);
      setSubcategories(data.subcategories ?? {});
      setQuickStats(data.quickStats ?? []);
      setSelectedCategorySlug((current) => {
        if (mains.some((item) => item.slug === current)) return current;
        return mains[0]?.slug ?? "";
      });
    } catch (err) {
      setError(err.message || "Failed to load categories");
      setMainCategories([]);
      setSubcategories({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const query = searchQuery.trim().toLowerCase();

  const filteredMainCategories = useMemo(() => {
    if (!query) return mainCategories;
    return mainCategories.filter((category) => {
      const nameMatch = category.name.toLowerCase().includes(query);
      const subMatch = (subcategories[category.slug] ?? []).some((sub) =>
        sub.name.toLowerCase().includes(query),
      );
      return nameMatch || subMatch;
    });
  }, [mainCategories, query, subcategories]);

  const selectedCategory =
    mainCategories.find((category) => category.slug === selectedCategorySlug) ??
    mainCategories[0] ??
    null;

  const filteredSubcategories = useMemo(() => {
    const subs = subcategories[selectedCategorySlug] ?? [];
    if (!query) return subs;
    return subs.filter((sub) => sub.name.toLowerCase().includes(query));
  }, [query, selectedCategorySlug, subcategories]);

  const openModal = (type, item = null) => {
    if (type === "main") {
      setModal({
        type: "main",
        mode: item ? "edit" : "create",
        id: item?.id ?? null,
        form: item
          ? {
              name: item.name,
              icon: item.icon,
              iconVariant: item.iconVariant,
              imageUrl: item.imageUrl || item.image || "",
              productStyleKey: "",
            }
          : { ...emptyForm },
      });
      return;
    }

    setModal({
      type: "sub",
      mode: item ? "edit" : "create",
      id: item?.id ?? null,
      form: item
        ? {
            name: item.name,
            icon: "category",
            iconVariant: "primary-dim",
            imageUrl: item.imageUrl || item.image || "",
            productStyleKey: item.productStyleKey || suggestStyleKeyFromName(item.name),
          }
        : { ...emptyForm },
    });
  };

  const closeModal = () => setModal(null);

  const updateForm = (field, value) => {
    setModal((current) => {
      if (!current) return current;
      const nextForm = { ...current.form, [field]: value };
      // While creating a subcategory, keep style key in sync with the name
      // unless the admin already typed a custom key.
      if (
        current.type === "sub" &&
        current.mode === "create" &&
        field === "name"
      ) {
        const autoFromOld = suggestStyleKeyFromName(current.form.name);
        const keyStillAuto =
          !current.form.productStyleKey ||
          current.form.productStyleKey === autoFromOld;
        if (keyStillAuto) {
          nextForm.productStyleKey = suggestStyleKeyFromName(value);
        }
      }
      return { ...current, form: nextForm };
    });
  };

  const handleImagePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setImageUploading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.uploadCategoryImage(file);
      updateForm("imageUrl", data.url);
    } catch (err) {
      setError(err.message || "Could not upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const saveModal = async (event) => {
    event.preventDefault();
    if (!modal) return;

    if (modal.type === "main" && !modal.form.imageUrl.trim()) {
      setError("Please add an image for the main category");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      if (modal.mode === "create") {
        await api.createAdminCategory({
          name: modal.form.name.trim(),
          type: modal.type,
          parentSlug: modal.type === "sub" ? selectedCategorySlug : undefined,
          icon: modal.form.icon,
          iconVariant: modal.form.iconVariant,
          imageUrl: modal.form.imageUrl,
          productStyleKey: modal.form.productStyleKey.trim(),
        });
        setSuccess(
          modal.type === "main" ? "Main category created" : "Subcategory created",
        );
      } else {
        await api.updateAdminCategory(modal.id, {
          name: modal.form.name.trim(),
          icon: modal.form.icon,
          iconVariant: modal.form.iconVariant,
          imageUrl: modal.form.imageUrl,
          productStyleKey: modal.form.productStyleKey.trim(),
        });
        setSuccess("Category updated");
      }
      closeModal();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not save category");
    } finally {
      setActionLoading(false);
    }
  };

  const askDeleteCategory = (item, type = "sub") => {
    const isMain =
      type === "main" ||
      item.type === "main" ||
      (!item.parentSlug &&
        !item.productStyleKey &&
        mainCategories.some((m) => m.id === item.id));
    setDeleteTarget({
      ...item,
      type: isMain ? "main" : "sub",
    });
  };

  const closeDeleteDialog = () => {
    if (actionLoading) return;
    setDeleteTarget(null);
  };

  const deleteCategory = async () => {
    if (!deleteTarget) return;
    const item = deleteTarget;
    const isMain = item.type === "main";

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.deleteAdminCategory(item.id);
      if (isMain) {
        setMainCategories((current) => current.filter((main) => main.id !== item.id));
        setSubcategories((current) => {
          const next = { ...current };
          delete next[item.slug];
          return next;
        });
        setSelectedCategorySlug((current) => (current === item.slug ? "" : current));
      } else {
        setSubcategories((current) => {
          const parentSlug = item.parentSlug || selectedCategorySlug;
          const next = { ...current };
          next[parentSlug] = (next[parentSlug] ?? []).filter((sub) => sub.id !== item.id);
          return next;
        });
      }
      setSuccess(data.message || "Category deleted");
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not delete category");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <header className="admin-categories-header">
        <div className="admin-categories-header-left">
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
        </div>
        <button type="button" className="admin-categories-refresh" onClick={loadCategories}>
          Refresh
        </button>
      </header>

      {error && (
        <p className="admin-categories-banner admin-categories-banner--error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="admin-categories-banner admin-categories-banner--success" role="status">
          {success}
        </p>
      )}

      <div className="admin-categories-body">
        <div className="admin-categories-intro">
          <div>
            <h2>Categories Management</h2>
            <p>Manage clothing categories available on Relux Hub.</p>
          </div>
          <button
            type="button"
            className="admin-categories-btn-primary"
            onClick={() => openModal("main")}
            disabled={actionLoading}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Main Category
          </button>
        </div>

        {loading ? (
          <p className="admin-categories-empty">Loading categories...</p>
        ) : mainCategories.length === 0 ? (
          <p className="admin-categories-empty">
            No categories loaded. Check that backend is running, you are logged in as admin, then
            click Refresh.
          </p>
        ) : (
          <>
            <div className="admin-categories-main-grid">
              {filteredMainCategories.map((category) => {
                const isSelected = category.slug === selectedCategorySlug;

                return (
                  <article
                    key={category.id}
                    className={`admin-categories-main-card ${
                      isSelected ? "admin-categories-main-card--selected" : ""
                    }`.trim()}
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
                        onClick={() => setSelectedCategorySlug(category.slug)}
                      >
                        View Category
                      </button>
                      <button
                        type="button"
                        className="admin-categories-edit-btn"
                        aria-label={`Edit ${category.name} category`}
                        onClick={() => openModal("main", category)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        type="button"
                        className="admin-categories-edit-btn admin-categories-edit-btn--danger"
                        aria-label={`Delete ${category.name} category`}
                        onClick={() => askDeleteCategory({ ...category, type: "main" }, "main")}
                        disabled={actionLoading}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {selectedCategory && (
              <section className="admin-categories-subsection">
                <div className="admin-categories-subsection-header">
                  <div className="admin-categories-subsection-title">
                    <h4>
                      Subcategories: <span>{selectedCategory.name}</span>
                    </h4>
                    <span className="admin-categories-subsection-count">
                      {filteredSubcategories.reduce(
                        (sum, sub) => sum + Number(sub.listings || 0),
                        0,
                      )}{" "}
                      listings
                    </span>
                  </div>
                  <button
                    type="button"
                    className="admin-categories-btn-add-sub"
                    onClick={() => openModal("sub")}
                    disabled={actionLoading}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      add
                    </span>
                    Add Subcategory
                  </button>
                </div>
                <div className="admin-categories-subsection-body">
                  <div className="admin-categories-sub-grid">
                    {filteredSubcategories.length === 0 ? (
                      <p className="admin-categories-empty">No subcategories yet.</p>
                    ) : (
                      filteredSubcategories.map((subcategory) => (
                        <div key={subcategory.id} className="admin-categories-sub-card">
                          <div className="admin-categories-sub-card-inner">
                            <div className="admin-categories-sub-card-main">
                              <div className="admin-categories-sub-thumb">
                                {subcategory.image ? (
                                  <img src={subcategory.image} alt="" />
                                ) : (
                                  <span
                                    className="material-symbols-outlined"
                                    aria-hidden="true"
                                  >
                                    checkroom
                                  </span>
                                )}
                              </div>
                              <div>
                                <h5>{subcategory.name}</h5>
                                <p>{subcategory.listings} listings</p>
                              </div>
                            </div>
                            <div className="admin-categories-sub-actions">
                              <button
                                type="button"
                                className="admin-categories-sub-action-btn"
                                aria-label={`Edit ${subcategory.name}`}
                                title="Edit"
                                onClick={() => openModal("sub", subcategory)}
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                type="button"
                                className="admin-categories-sub-action-btn admin-categories-sub-action-btn--danger"
                                aria-label={`Delete ${subcategory.name}`}
                                title="Delete Subcategory"
                                onClick={() => askDeleteCategory(subcategory, "sub")}
                                disabled={actionLoading}
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <button
                      type="button"
                      className="admin-categories-add-placeholder"
                      onClick={() => openModal("sub")}
                    >
                      <div className="admin-categories-add-placeholder-inner">
                        <span className="material-symbols-outlined">add_circle</span>
                        <span>Add Subcategory</span>
                      </div>
                    </button>
                  </div>
                </div>
              </section>
            )}

            <div className="admin-categories-quick-stats">
              {quickStats.map((stat) => (
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
          </>
        )}
      </div>

      {modal && (
        <div className="admin-categories-modal-backdrop" onClick={closeModal}>
          <div
            className="admin-categories-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3>
              {modal.mode === "create" ? "Add" : "Edit"}{" "}
              {modal.type === "main" ? "Main Category" : "Subcategory"}
            </h3>
            <form onSubmit={saveModal} className="admin-categories-modal-form">
              <label>
                Name
                <input
                  type="text"
                  value={modal.form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  required
                />
              </label>

              {modal.type === "main" ? (
                <>
                  <div className="admin-categories-image-field">
                    <span className="admin-categories-image-field-label">
                      Category image
                    </span>
                    {modal.form.imageUrl ? (
                      <div className="admin-categories-image-preview">
                        <img src={modal.form.imageUrl} alt="Category preview" />
                      </div>
                    ) : (
                      <p className="admin-categories-image-hint">
                        Required. JPG, PNG, or WEBP up to 5MB.
                      </p>
                    )}
                    <label className="admin-categories-image-upload-btn">
                      <span className="material-symbols-outlined">upload</span>
                      {imageUploading
                        ? "Uploading..."
                        : modal.form.imageUrl
                          ? "Replace image"
                          : "Upload image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImagePick}
                        disabled={imageUploading || actionLoading}
                        hidden
                      />
                    </label>
                  </div>
                  <fieldset className="admin-categories-icon-picker">
                    <legend>Choose icon</legend>
                    <div className="admin-categories-icon-grid" role="listbox" aria-label="Category icons">
                      {(CATEGORY_ICONS.includes(modal.form.icon)
                        ? CATEGORY_ICONS
                        : [modal.form.icon, ...CATEGORY_ICONS]
                      ).map((icon) => {
                        const selected = modal.form.icon === icon;
                        return (
                          <button
                            key={icon}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            className={`admin-categories-icon-choice ${
                              selected ? "admin-categories-icon-choice--selected" : ""
                            }`}
                            onClick={() => updateForm("icon", icon)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {icon}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <label>
                    Icon color
                    <select
                      value={modal.form.iconVariant}
                      onChange={(e) => updateForm("iconVariant", e.target.value)}
                    >
                      {ICON_VARIANTS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Style key
                    <input
                      type="text"
                      value={modal.form.productStyleKey}
                      onChange={(e) => updateForm("productStyleKey", e.target.value)}
                      placeholder="e.g. Ethnic"
                      required
                    />
                  </label>
                </>
              )}

              <div className="admin-categories-modal-actions">
                <button type="button" onClick={closeModal} disabled={actionLoading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    actionLoading ||
                    imageUploading ||
                    !modal.form.name.trim() ||
                    (modal.type === "main" && !modal.form.imageUrl.trim())
                  }
                >
                  {actionLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-categories-modal-backdrop" onClick={closeDeleteDialog}>
          <div
            className="admin-categories-modal admin-categories-delete-dialog"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-categories-delete-title"
          >
            <h3 id="admin-categories-delete-title">Delete category?</h3>
            <p className="admin-categories-delete-text">
              {deleteTarget.type === "main"
                ? `Delete main category "${deleteTarget.name}"? Remove its subcategories first if any are still active.`
                : `Delete subcategory "${deleteTarget.name}"? It will be hidden from admin and public lists.`}
            </p>
            <div className="admin-categories-modal-actions">
              <button type="button" onClick={closeDeleteDialog} disabled={actionLoading}>
                Cancel
              </button>
              <button
                type="button"
                className="admin-categories-delete-confirm"
                onClick={deleteCategory}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesManagement;
