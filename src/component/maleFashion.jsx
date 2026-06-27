import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import "./maleFashion.css";
import { getDressesByCategory } from "@/data/dressCatalog";
import { LISTING_SIZE_OPTIONS } from "@/data/listingSpecs";
import { getStyleOptionsForCategory } from "@/data/styleCategories";
import { useListingCatalog } from "@/hooks/useListingCatalog";

const STYLE_FILTERS = getStyleOptionsForCategory("Male");
const SIZES = LISTING_SIZE_OPTIONS;

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => new Set());
  const catalogRevision = useListingCatalog();

  const filteredProducts = useMemo(
    () =>
      getDressesByCategory("/maleFashion", {
        listingType,
        style: selectedStyle,
        size: selectedSize,
        search: searchQuery,
        sortBy,
      }),
    [
      catalogRevision,
      listingType,
      selectedStyle,
      selectedSize,
      searchQuery,
      sortBy,
    ],
  );

  const clearFilters = () => {
    setSelectedStyle("");
    setSelectedSize("");
    setListingType("all");
    setSearchQuery("");
  };

  const selectStyle = (style) => {
    setSelectedStyle((current) => (current === style ? "" : style));
  };

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
                min="1000"
                max="50000"
                step="500"
                defaultValue="25000"
                className="male-range-input"
                aria-label="Price range"
              />
              <div className="male-range-labels">
                <span>PKR 1,000</span>
                <span>PKR 50,000</span>
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
                    onClick={() => setSelectedSize(size)}
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
                <option value="condition">Condition: Best</option>
              </select>
            </div>
          </div>

          <div className="male-products-grid">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="male-product-card">
                <div className="male-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`male-favorite-btn ${
                      favorites.has(product.id) ? "male-favorite-btn--active" : ""
                    }`}
                    aria-label={`Save ${product.title}`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      size={18}
                      fill={favorites.has(product.id) ? "currentColor" : "none"}
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
        </section>
      </div>
    </div>
  );
};

export default MaleFashion;
