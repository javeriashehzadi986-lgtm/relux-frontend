import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import "./maleFashion.css";

const CATEGORY_FILTERS = [
  "Sherwanis",
  "Waistcoats",
  "Formal Suits",
  "Casual Kurta",
];

const SIZES = ["S", "M", "L", "XL"];

const PRODUCTS = [
  {
    id: "male-1",
    brand: "Deepak Perwani",
    title: "Midnight Velvet Sherwani",
    listingType: "rent",
    price: "Rs. 7,000",
    badge: "Like New",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBm9Dz5PJZZdS9RkLNJkkpAdAC8YptD1AtAK2ClUVixihYYs_BjsHxT-VzgKKt-TzDF8jzC0X6SuUpC_bQjaJFiNdlBcv7vayPOW4snRGYg8DCY4kyFSakBn6uvd84zP2KcFNTycDIvv063KAIzLY6IZbhbiH6AAK4IquoYgvppg_k8NeNhvuoGBrIwdJfKRcdlt0zAO5W9Bse0yof9I20mQecQuJVZaPP4TMgY4-ZgmmNySNRqtI6TAauth1NdwdXUg-BdPHwQdfiP",
  },
  {
    id: "male-2",
    brand: "Republic by Omar Farooq",
    title: "Charcoal Italian Wool Suit",
    listingType: "resale",
    price: "Rs. 42,000",
    badge: "Excellent",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB82Zbg2Ch_SZ5m2n60FQX76_RhFiEEfyOXKH1S-1I2wCQus6u5Ix7KK_zD8XIfTpNPG0MsLWZ5KXKj9aiLdTE-qW-4owhklrrp9fgQVoC7YEHZLmn1N0d_7Ht8XTU5z7Xl9w3JpHiVgrG-2kz62QsERr8ccY54WAmqzgoJgDNFLUVgv1P30IWPT_zKulyCOTrTouU7M7Nt5usiLbFmEEkNLiw_UTsGCsAYoTp1nzQECpi4pjqTRdyH8_zA3nFXP_ON572uc_rBSd_N",
  },
  {
    id: "male-3",
    brand: "Nomi Ansari",
    title: "Ivory Silk Waistcoat",
    listingType: "rent",
    price: "Rs. 5,000",
    badge: "New with Tags",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF5WgXJ9JhDVSA3zNBCOdn9lNZDOG9s5polxhKNCuMs0TtnjT7qIa9dUIxQSGfOMvfPWXGTU6v155SxyOBgGwDVPLlcQuXBDOxDoi0-b7efi15ogsJ4lfdts5QxJdcUkMDhA4OD7Vr03LOfrKttnBZ7bI4uoNlkemmXY5tEvs2yQ6lRkXxOq4sF8OM5t5CLmwblcC6D5HlHADplK0X5i5cyjowKaJ3ZcZv85G01J0_Ab7uXnlCGT-Kp6WjPOi5l4mg25ryB3CP1Msq",
  },
  {
    id: "male-4",
    brand: "Hassan Sheheryar Yasin (HSY)",
    title: "Royal Jamawar Sherwani",
    listingType: "resale",
    price: "Rs. 95,000",
    badge: "Excellent",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb3_ALdFPd5HGLtVL-cIEcGqcxxDGt0kuf-X5pfJOsd1xZRtPgWYF0yXRjqm38kGVj3MzV7l4caXI7wcEaVJrMCMEXF_v_dUFXQmJs8feQ2-_VsAr5xAw8rK3AUpa0j-Q_f7_3BjHfx2_NK77LRc50wzRDXl0mcJXfrNDAYnyciydbA9V-nF8yS_7O1qBLVl2wE7Dazwzc6bE4fDVBsT4D-eS7NfYsNkxzFV8rrWwJ7v4O6Ab3TqsGPqVEQndFBV2us5DujAXzA7f-",
  },
  {
    id: "male-5",
    brand: "Mohtaram",
    title: "Satin Lapel Midnight Tuxedo",
    listingType: "rent",
    price: "Rs. 8,000",
    badge: "Like New",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjYn_WmKVW8k7h_gK1CVNnRrkwuDb_3yJxE7Oly1EQHTrrLexAc9QYitj6GOJ4CsTVPBZr4HivaPqAIv0NefQF6UVpVoLRa9AEYp4eop-m-CMFvG4U4G0-yxXTk68j1tJHqnez-14FMUcQuO6jVMxzVq1yKW8E-K2Mhc1UElyBeKAaJCF-It5fEfpOmB3uJ6GNgZefZlOKF7ZDqnU0J-eBwURgk2yoaXh777zyJaLx2mBDe-VzRG-5_r_quOrQR_r2qlMkIc-n6mjF",
  },
  {
    id: "male-6",
    brand: "Faraz Manan",
    title: "Black Raw Silk Prince Coat",
    listingType: "resale",
    price: "Rs. 110,000",
    badge: "Excellent",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQaRXEDQg_VAfzy3K_0l080hT8vxQ-mKgynO3cELXGCiekZJ0ZVxIpvLmwFNwgNQs7oVyKYQ9omNljZkn1uzk7HS9ckvwafEW9ybPYyMzdWf-FI6jVDDJz1wsNwa2Y8Ar3mQw_ncDF6fMtemMk84IxDXoh_vAdp-kYBkpQhtHQ5jzjXoO0891SxUR2xDqY1RgQ1FmhCUxBwVXqgHcn2XU0pxdarKMCM4AAId2Duasu6bHSiLlAJlRVjfYgW55fcie64yT59JuKzz1x",
  },
];

const MaleFashion = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const [selectedCategories, setSelectedCategories] = useState(["Formal Suits"]);
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [selectedSize, setSelectedSize] = useState("M");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(() => new Set());

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      if (listingType !== "all" && product.listingType !== listingType) return false;
      if (!query) return true;
      return (
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, listingType]);

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
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
              <p className="male-filter-label">Category</p>
              <div className="male-filter-options">
                {CATEGORY_FILTERS.map((category) => (
                  <label key={category} className="male-filter-checkbox">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <span
                      className={
                        selectedCategories.includes(category)
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
