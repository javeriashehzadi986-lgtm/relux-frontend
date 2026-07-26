import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import "./maleFashion.css";
import { filterProductCards } from "@/data/dressCatalog";
import { LISTING_SIZE_OPTIONS } from "@/data/listingSpecs";
import { getStyleOptionsForCategory } from "@/data/styleCategories";
import { usePublicListings } from "@/hooks/usePublicListings";
import { useWishlist } from "@/hooks/useWishlist";

const STYLE_FILTERS = getStyleOptionsForCategory("Male");
const SIZES = LISTING_SIZE_OPTIONS;
const PRICE_MIN = 1000;
const PRICE_MAX = 50000;

const MaleFashion = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const { products, loading, error, refresh } = usePublicListings("male");

  const filteredProducts = useMemo(
    () =>
      filterProductCards(products, {
        listingType,
        style: selectedStyle,
        size: selectedSize,
        priceMax,
        search: searchQuery,
        sortBy,
      }),
    [
      products,
      listingType,
      selectedStyle,
      selectedSize,
      priceMax,
      searchQuery,
      sortBy,
    ],
  );

  const clearFilters = () => {
    setSelectedStyle("");
    setSelectedSize("");
    setListingType("all");
    setPriceMax(PRICE_MAX);
    setSearchQuery("");
  };

  const selectStyle = (style) => {
    setSelectedStyle((current) => (current === style ? "" : style));
  };

  const toggleFavorite = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="male-page">
      <div className="male-layout">
        <aside className="male-sidebar">
          <div className="male-sidebar-inner">
            <h2 className="male-sidebar-title">Filter By</h2>

            <div className="male-filter-block">
              <p className="male-filter-label">Style</p>
              <div className="male-filter-options">
                {STYLE_FILTERS.map((category) => (
                  <label key={category} className="male-filter-checkbox">
                    <Checkbox
                      checked={selectedStyle === category}
                      onCheckedChange={() => selectStyle(category)}
                      aria-label={`Style: ${category}`}
                    />
                    <span
                      className={
                        selectedStyle === category
                          ? "male-filter-checkbox-text is-active"
                          : "male-filter-checkbox-text"
                      }
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="male-filter-block">
              <p className="male-filter-label">Type</p>
              <div className="male-type-tabs">
                <Button
                  type="button"
                  variant="ghost"
                  className={`male-type-tab ${
                    listingType === "all" ? "male-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("all")}
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`male-type-tab ${
                    listingType === "rent" ? "male-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("rent")}
                >
                  Rent
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`male-type-tab ${
                    listingType === "resale" ? "male-type-tab--active" : ""
                  }`}
                  onClick={() => setListingType("resale")}
                >
                  Resale
                </Button>
              </div>
            </div>

            <div className="male-filter-block">
              <p className="male-filter-label">Price Range</p>
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step="500"
                value={priceMax}
                className="male-range-input"
                aria-label="Price range"
                onChange={(event) => setPriceMax(Number(event.target.value))}
              />
              <div className="male-range-labels">
                <span>PKR {PRICE_MIN.toLocaleString("en-PK")}</span>
                <span>
                  {priceMax >= PRICE_MAX
                    ? `PKR ${PRICE_MAX.toLocaleString("en-PK")}+`
                    : `PKR ${priceMax.toLocaleString("en-PK")}`}
                </span>
              </div>
            </div>

            <div className="male-filter-block">
              <p className="male-filter-label">Size</p>
              <div className="male-size-grid">
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="ghost"
                    className={`male-size-btn ${
                      selectedSize === size ? "male-size-btn--active" : ""
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

        <section className="male-main">
          <div className="male-toolbar">
            <div className="male-search-wrap">
              <Search className="male-search-icon" size={18} aria-hidden="true" />
              <Input
                type="search"
                className="male-search"
                placeholder="Search for sherwanis, suits or waistcoats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="male-sort-wrap">
              <span className="male-sort-label">Sort By:</span>
              <select
                className="male-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading && (
            <p className="male-catalog-status">Loading listings...</p>
          )}

          {error && (
            <div className="male-catalog-status male-catalog-status--error">
              <p>{error}</p>
              <Button type="button" variant="outline" onClick={refresh}>
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p className="male-catalog-status">
              No approved listings match your filters yet. Try adjusting filters or check back
              soon.
            </p>
          )}

          <div className="male-products-grid">
            {!loading &&
              !error &&
              filteredProducts.map((product) => (
              <Card key={product.id} className="male-product-card">
                <div className="male-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`male-favorite-btn ${
                      isSaved(product.id) ? "male-favorite-btn--active" : ""
                    }`}
                    aria-label={`Save ${product.title}`}
                    onClick={() => toggleFavorite(product)}
                  >
                    <Heart
                      size={18}
                      fill={isSaved(product.id) ? "currentColor" : "none"}
                    />
                  </Button>
                  <div className="male-product-badges">
                    <span
                      className={`male-product-badge male-product-badge--${product.badgeVariant}`}
                    >
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="male-product-body">
                  <p className="male-product-brand">{product.brand}</p>
                  <h3 className="male-product-title">{product.title}</h3>
                  <div className="male-product-prices">
                    <div>
                      <span className="male-price-label">
                        {product.listingType === "rent" ? "Rent" : "Resale"}
                      </span>
                      <span
                        className={
                          product.listingType === "rent"
                            ? "male-price-rental"
                            : "male-price-resale"
                        }
                      >
                        {product.price}
                      </span>
                    </div>
                  </div>
                  <Button type="button" className="male-view-btn" asChild>
                    <Link to={`/dress/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {!loading && !error && filteredProducts.length > 0 && (
          <div className="male-pagination">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="male-page-btn male-page-btn--nav"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="male-page-numbers">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant="ghost"
                  className={`male-page-btn ${
                    currentPage === page ? "male-page-btn--active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <span className="male-page-ellipsis">...</span>
              <Button
                type="button"
                variant="ghost"
                className="male-page-btn"
                onClick={() => setCurrentPage(12)}
              >
                12
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="male-page-btn male-page-btn--nav"
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

export default MaleFashion;
