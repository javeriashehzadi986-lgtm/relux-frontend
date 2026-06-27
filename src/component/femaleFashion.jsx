import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { STYLE_CATEGORIES } from "@/data/styleCategories";

const STYLE_FILTERS = STYLE_CATEGORIES;

const SIZES = ["XS", "S", "M", "L"];

const PRODUCTS = [
  {
    id: "female-1",
    brand: "Elan Luxury",
    title: "Royal Emerald Bridal Lehenga",
    style: "Bridal",
    listingType: "rent",
    price: "₨ 8,000",
    badge: "Pristine",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVh_ymJd-uGzRCLTDxmtnYgowXIFZWtD28_5edk15Gpg4mQoddsgPTHf1fk-2u_oFQqQ1gtj6xhbmpVSrzC15BhQvKsq2R_ChKwevbAcUNJCacjJU7E5xmD-C7v1NtcAl_lMXTCAD90dTQPcyujG6o3_m1PzYNME80G-fqj8c3D8p36AlEsVOrjOCC2h89kbWv2mRoid7mF-nJhsBYd8cfuPHT_Xkux1UE1DuFtMJDS_-OpnABEIPG9hYNpBhqfR3s4zHZlrK1cUlB",
  },
  {
    id: "female-2",
    brand: "Zaha Couture",
    title: "Ethereal Lace Abaya",
    style: "Bridal",
    listingType: "resale",
    price: "₨ 42,000",
    badge: "Like New",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9l5_S5Kw0tPO7ImG2ZCifAkI0JT8r4EKvjL-K7_quuPiR7HLBim3qJpa59SC8Agt_xkwZ6MgmPm2CBqqEgNY4Vij6YK01lGM8s5QuBsR607KgqyTRTeOzZkjGR8219b6etQp_PY3vwv_LPXWOM3Pi_RcUQTByHjkloMkMKxtSgoNFWAbwqPwm961bsAkT61WJ4DL8jY6hBCMo4USGAe8gXnv0Rt-oaW9NHtuH8B7BSKvYAJYilEShAp9g2hiyDNzhUfUyf9QZMmFF",
  },
  {
    id: "female-3",
    brand: "Faraz Manan",
    title: "Blossom Organza Gown",
    style: "Party",
    listingType: "rent",
    price: "₨ 7,000",
    badge: "Pristine",
    badgeVariant: "primary",
    favorited: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSA-FJBW7OromnSWzZSaHuJAV_MxdaCIyzJjOHs7AgM4b_wO0uMO8sbTQPIHShD0bLtq47KqVXpUvrhEnxdaT5WAy3oql7kxmp--lvNe8-iOqVk9jiltunEjG51lwYO7nH6v-8acmcHh9udaov2s1KkOlHZdCdFf_WxvUt7cQV0HuCXd27mhz0aXeoKFeHNwUMxywEgZa1B_HdP4hFIxf5jL5hIFythWSOarf44Iwswbd66Blj5h0LDYjJ7Xr6FZ7yMucslpNcpam2",
  },
  {
    id: "female-4",
    brand: "Mohsin Naveed Ranjha",
    title: "Velvet Heritage Kalidar",
    style: "Traditional",
    listingType: "resale",
    price: "₨ 78,000",
    badge: "Excellent",
    badgeVariant: "excellent",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNdmYNvWHyRjwu1661dhd_ETKzt6rlAE2bcQ7ksK6Fw8t6lbIHIaKD2HqjeWEJ-A6TTpxGVX_nwtpT8eHDwejRE7C7PHD7O2W9UtRjCqJzqmbXxPSfZvInUQfruDnZdYzZEUiep3cg6bl7LHnc-EoGtgZD1vPCIf6SFoMJbbbym55Br4mLsUWKVtEUzpQaofausGFpvcIg5V3GCEEtDCBFAk1YgwlBHyJT832Euo-Wiy-62tYPNZfQP6tRECVSDMtsxU1QBanClpV",
  },
  {
    id: "female-5",
    brand: "Misha Lakhani",
    title: "Champagne Silk Ensemble",
    style: "Formal",
    listingType: "rent",
    price: "₨ 5,000",
    badge: "Pristine",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXt2_iQb3X05D6P02Pvy4ESkJJj9OVHETS3gSRosW5k6Nqu6s6cn3J4da9t-xu7KIIhDvoP3-S-wKVzt8Poims4tKB-Q_t7DQ4FxaNn_eCYL7tg23fRgK_znqK7OurgsU5WGEr6kMnZxxWOeniJjEvAAK_ppJvD9pdeX8Ed1pVoaOd9MxvhOtRuxAQ4tJ40Kj-7pbc1ZWZg0v8zHZBfqVt5nwNLAGrx0DJG-O6-PNXE7G4u-YwTUEv7ptGqfNSPIf2Sw55UrqFbuGr",
  },
  {
    id: "female-6",
    brand: "Sania Maskatiya",
    title: "Midnight Sequin Sari",
    style: "Party",
    listingType: "resale",
    price: "₨ 65,000",
    badge: "Like New",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoBmnjhPkmcaBgjtBRhlPyinWu7MHuLIVAcbP-HuaNF5WYwITDkY9mkGhV46Del984wBsu1FW4OBWjXvarO5YxkX_FfgiDIolFOuW7YnWTtQChMbygTiZ84y_S8AXlWwk09OvIU3p3_nQIYLMhn5Td_ZxqAssJUJi4T_XpsTfpT_YdpKqB_2I1ibcos8s9AbdWjw4iW5kKs-pSFF-F3FoCXFERABgzrD1pqwtbLPPcHQHy3_1vfXg2Bxje4wEQnTUI7rRh-sByb8_c",
  },
];

const FemaleFashion = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const [selectedStyle, setSelectedStyle] = useState("Formal");
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [selectedSize, setSelectedSize] = useState("S");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTags, setActiveTags] = useState([
    { id: "formal", label: "Formal" },
    { id: "size-s", label: "Size: S" },
  ]);
  const [favorites, setFavorites] = useState(
    () => new Set(PRODUCTS.filter((p) => p.favorited).map((p) => p.id))
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      if (listingType !== "all" && product.listingType !== listingType) return false;
      if (selectedStyle && product.style !== selectedStyle) {
        return false;
      }
      if (!query) return true;
      return (
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, listingType, selectedStyle]);

  const selectStyle = (style) => {
    setSelectedStyle(style);
  };

  const clearFilters = () => {
    setSelectedStyle("");
    setSelectedSize("");
    setListingType("all");
    setActiveTags([]);
  };

  const removeTag = (id) => {
    setActiveTags((current) => current.filter((tag) => tag.id !== id));
    if (id === "size-s") setSelectedSize("");
    if (id === "formal") {
      setSelectedStyle("");
    }
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
                {STYLE_FILTERS.map((category) => (
                  <label key={category} className="female-filter-checkbox">
                    <Checkbox
                      checked={selectedStyle === category}
                      onCheckedChange={() => selectStyle(category)}
                      aria-label={`Style: ${category}`}
                    />
                    <span
                      className={
                        selectedStyle === category
                          ? "female-filter-checkbox-text is-active"
                          : "female-filter-checkbox-text"
                      }
                    >
                      {category}
                    </span>
                  </label>
                ))}
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
              <p className="female-filter-label">Price Range</p>
              <input
                type="range"
                min="5000"
                max="150000"
                step="1000"
                defaultValue="50000"
                className="female-range-input"
                aria-label="Price range"
              />
              <div className="female-range-labels">
                <span>₨ 5,000</span>
                <span>₨ 150,000+</span>
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
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="female-main">
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
                  <option value="popularity">Popularity</option>
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

          <div className="female-products-grid">
            {filteredProducts.map((product) => (
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
                      favorites.has(product.id) ? "female-favorite-btn--active" : ""
                    }`}
                    aria-label={`Save ${product.title}`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      size={18}
                      fill={favorites.has(product.id) ? "currentColor" : "none"}
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
        </section>
      </div>
    </div>
  );
};

export default FemaleFashion;
