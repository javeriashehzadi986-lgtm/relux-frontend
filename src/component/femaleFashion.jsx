import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import "./femaleFashion.css";
import { filterProductCards } from "@/data/dressCatalog";
import { LISTING_SIZE_OPTIONS } from "@/data/listingSpecs";
import { usePublicListings } from "@/hooks/usePublicListings";
import {
  usePublicMainCategories,
  usePublicStyleFilters,
} from "@/hooks/usePublicStyleFilters";
import { useWishlist } from "@/hooks/useWishlist";

const SIZES = LISTING_SIZE_OPTIONS;

/** Shared fashion browse for any admin-managed main category slug. */
export function FashionBrowse({ categorySlug = "female" }) {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const initialStyle = searchParams.get("style") || "";
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTags, setActiveTags] = useState([]);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const { products, loading, error, refresh } = usePublicListings(categorySlug);
  const styleFilters = usePublicStyleFilters(categorySlug);
  const { mains } = usePublicMainCategories();
  const categoryMeta = mains.find((item) => item.slug === categorySlug);
  const pageTitle = categoryMeta?.title || `${categorySlug} Fashion`;

  useEffect(() => {
    const fromUrl = searchParams.get("style") || "";
    if (fromUrl) setSelectedStyle(fromUrl);
  }, [searchParams, categorySlug]);

  useEffect(() => {
    if (selectedStyle && !styleFilters.some((item) => item.key === selectedStyle)) {
      // Keep URL style if filters still loading; clear only after styles arrived.
      if (styleFilters.length > 0) setSelectedStyle("");
    }
  }, [selectedStyle, styleFilters]);

  const filteredProducts = useMemo(
    () =>
      filterProductCards(products, {
        listingType,
        style: selectedStyle,
        size: selectedSize,
        search: searchQuery,
        sortBy,
      }),
    [
      products,
      listingType,
      selectedStyle,
      selectedSize,
      searchQuery,
      sortBy,
    ],
  );

  const selectStyle = (style) => {
    setSelectedStyle((current) => (current === style ? "" : style));
  };

  const clearFilters = () => {
    setSelectedStyle("");
    setSelectedSize("");
    setListingType("all");
    setSearchQuery("");
    setActiveTags([]);
  };

  const removeTag = (id) => {
    setActiveTags((current) => current.filter((tag) => tag.id !== id));
    if (id.startsWith("size-")) setSelectedSize("");
    if (id.startsWith("style-")) setSelectedStyle("");
    if (id.startsWith("type-")) setListingType("all");
  };

  const toggleFavorite = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="female-page">
      <div className="female-layout">
        <aside className="female-sidebar">
          <div className="female-sidebar-inner">
            <div className="female-sidebar-header">
              <h2 className="female-sidebar-title">Filters</h2>
              <Button
                type="button"
                variant="ghost"
                className="female-clear-btn"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>

            <div className="female-filter-block">
              <p className="female-filter-label">Style</p>
              <div className="female-filter-options">
                {styleFilters.length === 0 ? (
                  <p className="female-filter-empty">No styles added yet.</p>
                ) : (
                  styleFilters.map((style) => (
                    <label key={style.key} className="female-filter-checkbox">
                      <Checkbox
                        checked={selectedStyle === style.key}
                        onCheckedChange={() => selectStyle(style.key)}
                        aria-label={`Style: ${style.label}`}
                      />
                      <span
                        className={
                          selectedStyle === style.key
                            ? "female-filter-checkbox-text is-active"
                            : "female-filter-checkbox-text"
                        }
                      >
                        {style.label}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="female-filter-block">
              <p className="female-filter-label">Type</p>
              <div className="female-type-tabs">
                <Button
                  type="button"
                  variant="ghost"
                  className={`female-type-tab ${
                    listingType === "all" ? "female-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("all")}
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`female-type-tab ${
                    listingType === "rent" ? "female-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("rent")}
                >
                  Rent
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`female-type-tab ${
                    listingType === "resale" ? "female-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("resale")}
                >
                  Resale
                </Button>
              </div>
            </div>

            <div className="female-filter-block">
              <p className="female-filter-label">Size</p>
              <div className="female-size-grid">
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="ghost"
                    className={`female-size-btn ${
                      selectedSize === size ? "female-size-btn--active" : ""
                    }`}
                    onClick={() =>
                      setSelectedSize((current) =>
                        current === size ? "" : size,
                      )
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="female-main">
          <h1 className="female-page-heading">{pageTitle}</h1>
          <div className="female-toolbar">
            <div className="female-search-wrap">
              <Search className="female-search-icon" size={18} aria-hidden="true" />
              <Input
                type="search"
                className="female-search"
                placeholder="Search designer bridal, abayas, luxury gowns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="female-sort-wrap">
              <span className="female-sort-label">Sort By:</span>
              <div className="female-sort-select-wrap">
                <select
                  className="female-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown
                  className="female-sort-chevron"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="female-active-tags">
              {activeTags.map((tag) => (
                <span key={tag.id} className="female-active-tag">
                  {tag.label}
                  <button
                    type="button"
                    className="female-active-tag-remove"
                    aria-label={`Remove ${tag.label} filter`}
                    onClick={() => removeTag(tag.id)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {loading && (
            <p className="female-catalog-status">Loading listings...</p>
          )}

          {error && (
            <div className="female-catalog-status female-catalog-status--error">
              <p>{error}</p>
              <Button type="button" variant="outline" onClick={refresh}>
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="female-catalog-status">
              {selectedStyle
                ? `No approved products found for this style in ${pageTitle}. Seller must list the item under this main category and this style, then admin must approve it.`
                : `No approved listings in ${pageTitle} yet.`}
            </p>
          )}

          <div className="female-products-grid">
            {!loading &&
              !error &&
              filteredProducts.map((product) => (
              <Card key={product.id} className="female-product-card">
                <div className="female-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <span
                    className={`female-product-badge female-product-badge--${product.badgeVariant}`}
                  >
                    {product.badge}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`female-favorite-btn ${
                      isSaved(product.id) ? "female-favorite-btn--active" : ""
                    }`}
                    aria-label={`Save ${product.title}`}
                    onClick={() => toggleFavorite(product)}
                  >
                    <Heart
                      size={18}
                      fill={isSaved(product.id) ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
                <div className="female-product-body">
                  <div>
                    <p className="female-product-brand">{product.brand}</p>
                    <h3 className="female-product-title">{product.title}</h3>
                  </div>
                  <div className="female-product-prices">
                    <div>
                      <span className="female-price-label">
                        {product.listingType === "rent" ? "Rent" : "Resale"}
                      </span>
                      <span
                        className={
                          product.listingType === "rent"
                            ? "female-price-rental"
                            : "female-price-resale"
                        }
                      >
                        {product.price}
                      </span>
                    </div>
                  </div>
                  <Button type="button" className="female-view-btn" asChild>
                    <Link to={`/dress/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {!loading && !error && filteredProducts.length > 0 && (
          <div className="female-pagination">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="female-page-btn female-page-btn--nav"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="female-page-numbers">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant="ghost"
                  className={`female-page-btn ${
                    currentPage === page ? "female-page-btn--active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="female-page-ellipsis">...</span>
              <Button
                type="button"
                variant="ghost"
                className="female-page-btn"
                onClick={() => setCurrentPage(12)}
              >
                12
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="female-page-btn female-page-btn--nav"
              aria-label="Next page"
              disabled={currentPage === 12}
              onClick={() => setCurrentPage((page) => Math.min(12, page + 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default function FemaleFashion() {
  return <FashionBrowse categorySlug="female" />;
}

export function CategoryFashion() {
  const { slug } = useParams();
  return <FashionBrowse categorySlug={slug || "female"} />;
}
