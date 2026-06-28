import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import "./kidsFashion.css";
import { getDressesByCategory } from "@/data/dressCatalog";
import { LISTING_SIZE_OPTIONS } from "@/data/listingSpecs";
import { getStyleOptionsForCategory } from "@/data/styleCategories";
import { useListingCatalog } from "@/hooks/useListingCatalog";
import { useWishlist } from "@/hooks/useWishlist";

const CATEGORY_FILTERS = getStyleOptionsForCategory("Kids");
const SIZES = LISTING_SIZE_OPTIONS;

const PRICE_MIN = 500;
const PRICE_MAX = 25000;

const KidsFashion = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [selectedSize, setSelectedSize] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const catalogRevision = useListingCatalog();

  const filteredProducts = useMemo(
    () =>
      getDressesByCategory("/kidsFashion", {
        listingType,
        style: selectedCategory,
        size: selectedSize,
        priceMax,
        search: searchQuery,
        sortBy,
      }),
    [
      catalogRevision,
      selectedCategory,
      selectedSize,
      listingType,
      priceMax,
      sortBy,
      searchQuery,
    ],
  );

  const selectCategory = (category) => {
    setSelectedCategory((current) => (current === category ? "" : category));
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSize("");
    setListingType("all");
    setPriceMax(PRICE_MAX);
    setSearchQuery("");
  };

  const toggleFavorite = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="kids-page">
      <div className="kids-layout">
        <aside className="kids-sidebar">
          <div className="kids-sidebar-inner">
            <div className="kids-sidebar-header">
              <h2 className="kids-sidebar-title">Filters</h2>
              <Button
                type="button"
                variant="ghost"
                className="kids-clear-btn"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Category</p>
              <div className="kids-filter-options">
                {CATEGORY_FILTERS.map((category) => (
                  <label key={category} className="kids-filter-checkbox">
                    <Checkbox
                      checked={selectedCategory === category}
                      onCheckedChange={() => selectCategory(category)}
                      aria-label={`Category: ${category}`}
                    />
                    <span
                      className={
                        selectedCategory === category
                          ? "kids-filter-checkbox-text is-active"
                          : "kids-filter-checkbox-text"
                      }
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Type</p>
              <div className="kids-type-tabs">
                <Button
                  type="button"
                  variant="ghost"
                  className={`kids-type-tab ${
                    listingType === "all" ? "kids-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("all")}
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`kids-type-tab ${
                    listingType === "rent" ? "kids-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("rent")}
                >
                  Rent
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`kids-type-tab ${
                    listingType === "resale" ? "kids-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("resale")}
                >
                  Resale
                </Button>
              </div>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Price Range</p>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step="500"
                value={priceMax}
                className="kids-range-input"
                aria-label="Price range"
                onChange={(event) => setPriceMax(Number(event.target.value))}
              />
              <div className="kids-range-labels">
                <span>Rs. {PRICE_MIN.toLocaleString("en-PK")}</span>
                <span>
                  {priceMax >= PRICE_MAX
                    ? `Rs. ${PRICE_MAX.toLocaleString("en-PK")}+`
                    : `Rs. ${priceMax.toLocaleString("en-PK")}`}
                </span>
              </div>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Size</p>
              <div className="kids-size-grid">
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="ghost"
                    className={`kids-size-btn ${
                      selectedSize === size ? "kids-size-btn--active" : ""
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

        <section className="kids-main">
          <div className="kids-toolbar">
            <div className="kids-search-wrap">
              <Search className="kids-search-icon" size={18} aria-hidden="true" />
              <Input
                type="search"
                className="kids-search"
                placeholder="Search kids outfits, brands, styles..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="kids-sort-wrap">
              <span className="kids-sort-label">Sort By:</span>
              <div className="kids-sort-select-wrap">
                <select
                  className="kids-sort-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  aria-label="Sort products"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown
                  className="kids-sort-chevron"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="kids-products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="kids-product-card">
                  <div className="kids-product-image-wrap">
                    <img alt={product.title} src={product.image} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`kids-favorite-btn ${
                        isSaved(product.id) ? "kids-favorite-btn--active" : ""
                      }`}
                      aria-label={`Save ${product.title}`}
                      onClick={() => toggleFavorite(product)}
                    >
                      <Heart
                        size={20}
                        fill={isSaved(product.id) ? "currentColor" : "none"}
                      />
                    </Button>
                    <span className="kids-product-badge">{product.badge}</span>
                  </div>
                  <div className="kids-product-body">
                    <div className="kids-product-top">
                      <h3 className="kids-product-title">{product.title}</h3>
                      <span className="kids-product-brand">{product.brand}</span>
                    </div>
                    <div className="kids-product-prices">
                      <span className="kids-price-label">
                        {product.listingType === "rent" ? "Rent" : "Resale"}
                      </span>
                      <span
                        className={
                          product.listingType === "rent"
                            ? "kids-price-rental"
                            : "kids-price-resale"
                        }
                      >
                        {product.price}
                        {product.listingType === "rent" && (
                          <small className="kids-price-suffix"> /day</small>
                        )}
                      </span>
                    </div>
                    <Button type="button" className="kids-view-btn" asChild>
                      <Link to={`/dress/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="kids-empty-state">No outfits match your filters.</p>
            )}
          </div>

          <div className="kids-pagination">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="kids-page-btn kids-page-btn--nav"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="kids-page-numbers">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant="ghost"
                  className={`kids-page-btn ${
                    currentPage === page ? "kids-page-btn--active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="kids-page-ellipsis">...</span>
              <Button
                type="button"
                variant="ghost"
                className="kids-page-btn"
                onClick={() => setCurrentPage(12)}
              >
                12
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="kids-page-btn kids-page-btn--nav"
              aria-label="Next page"
              disabled={currentPage === 12}
              onClick={() => setCurrentPage((page) => Math.min(12, page + 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default KidsFashion;
