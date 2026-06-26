import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpDown, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import "./kidsFashion.css";

const CATEGORY_FILTERS = [
  "Casual Wear",
  "Party Wear",
  "Traditional",
  "Wedding",
  "School Events",
];

const SIZES = ["2-3y", "4-5y", "6-7y", "8-9y"];

const CONDITION_OPTIONS = [
  "All Conditions",
  "Brand New",
  "Like New",
  "Gently Used",
];

const PRODUCTS = [
  {
    id: "kids-1",
    title: "Emerald Velvet Lehenga",
    brand: "J. Kids Collection",
    listingType: "rent",
    price: "Rs. 5,000",
    badge: "Like New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPAWrywHthD2bIuMRXjlirsHrAedKSqWI-mzFaO807fPcAcaY7KgVeI6CRbp8kjMxunVoWIu4hESh79OzHJwhvKllhtXd2ekZsfrnUKnUfwfdUYL-o8vM8VGHUm31aPIu0DF7guEAxU645MVyvbTCX1ReVpws7FRo-ztloti1iq9jmifrTUNu7RldvMf5DyBJKbT7MZ7th-Aw8ren-UiyEaf0whTZ6LqKcCKJm6W_2husgdLt9i28idwuttpPMAYjxbVm67_xgYuWI",
  },
  {
    id: "kids-2",
    title: "Mint Silk Sherwani",
    brand: "Maria B. Mini",
    listingType: "resale",
    price: "Rs. 18,500",
    badge: "Brand New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAz4exkEofpmXi50Vw6wY7bgfHZtOM5Dr4DuRutbc9SLWfqtAYaY7YCN7UtI9gbG-Ey2f7FAUSE3BMnvZK5SsDcnq_N4x1Da3oGwz8KjKED4zDr6dc7OwIK7yKpt7QFCdQvA26977PjBe_HM8-22bbqq7kNdfA8tLdV_hntoHw1B0KDvVLeupCs87zb-yDq48EqzUtrszsejNOQl0ZwwdzZxwfyqtKosFsyB20D69zbH-XSY9AhSNH3LArmDCdrmsxOA-kW_YnXBC3g",
  },
  {
    id: "kids-3",
    title: "Powder Pink Gharara",
    brand: "Agha Noor Kids",
    listingType: "rent",
    price: "Rs. 5,000",
    badge: "Gently Used",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTaodaeaveS1nq7pWfSfEZ9AOVpHOwFZ990Kgtsfu7Z-NqiwCJjW8z9uzoqS5EI4eFhPK9aqPMBx1QyM2Y6XwJvad7zH55RJuRD1-t7eipFiFJywpf6JJ_VVznR__rnK3YZ0kGVrOXCUpL24fNj5WUzu31DS6op79GhmR8-mfLoruak2JH8XpnesDutq8NQzzLS92By02t1Od3DRbmZqZjUYq1jT9TethW8uswCxLYdSLb_ZUtOJgSxYlEw6yVsleyn5YH5sX0OmI_",
    favorited: true,
  },
  {
    id: "kids-4",
    title: "Mirror-Work Kurta",
    brand: "Sana Safinaz Kids",
    listingType: "resale",
    price: "Rs. 6,800",
    badge: "Like New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByB2PgwX9GpWg2xk3YWxDpV6evW2fzOeV0cyc_-s8PxYK2VyxOYzWPNNxHVQDgPkhKRjads6J-0qk9iql0xRdereQOmlmxsI1NrZPqSp3-kP1wEXqg3S7f3K723kHk6Kt3ZjflKecKtHQ7reE8fJzzvcmne7AtI5idwkMTEKsoxy_QEBap5jhgcc41IIq3d5AS-om88voSa-dRphgnxoqGfHOGqvFciV2ySUgRG3alwCiTy5yOuj0Kb-6xIsp_4ofTlQ0dQ2-PRqJa",
  },
  {
    id: "kids-5",
    title: "Royal Prince Coat",
    brand: "Hsy Kids",
    listingType: "rent",
    price: "Rs. 7,000",
    badge: "Brand New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGHGBDkETCLdgHiyzRFRDE7FeVjj6peT5rKszrK5whuWLU4ftEgyP0NUS2bGBWPP8iH5NzfGP--3KGjTlj6vV2UkJBf4XyDTwJFHluvUzNErMtxG_WxaiuZG9UC_585aqTfAko5B7IGLfKA-p4HrLPLfPjK-dI0uSzZXQOH2vLEEZEyesA47JRkWrT6bJ2-BMxptXi2BYNExScnHsi7s4ddFlIjyg89SNSz52w3gL9IpQfLnWKgiI1-TfhSRwAff7zuiLLVk2z-Kbr",
  },
  {
    id: "kids-6",
    title: "Organza Dream Frock",
    brand: "Zainab Chottani Mini",
    listingType: "resale",
    price: "Rs. 22,000",
    badge: "Like New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDoZLfvpC2xIpJRpKksp_kudjGPhMGZu267CKS_CKPZQzOaAiLO1qygDIDINywMxm-ad95VVpzgCrDhDJRZ8XPjWcCyPK4K9vw8XesTonzn0C67TE8Ga6BwiGsn1QvzFaLfRgO2Or5wCEyzcH186tIEirb7RZ4vA1lBOogddJlhGIAAxFpaU5e1L_OG2rsYZDVPiSU62lxTHhdkA7MO16vwnTkoiQW-IVNhBqlu8MsVeUU_kw0ytnnbbnbtzSK3J4AVZGjWUdVPCL",
  },
];

const KidsFashion = () => {
  const [searchParams] = useSearchParams();
  const initialListingType = searchParams.get("type");
  const [selectedCategories, setSelectedCategories] = useState([
    "Party Wear",
    "Traditional",
  ]);
  const [listingType, setListingType] = useState(
    initialListingType === "rent" || initialListingType === "resale"
      ? initialListingType
      : "all",
  );
  const [selectedSize, setSelectedSize] = useState("4-5y");
  const [condition, setCondition] = useState("All Conditions");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(
    () => new Set(PRODUCTS.filter((p) => p.favorited).map((p) => p.id))
  );

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (product) =>
          listingType === "all" || product.listingType === listingType
      ),
    [listingType]
  );

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
    <div className="kids-page">
      <div className="kids-layout">
        <aside className="kids-sidebar">
          <div className="kids-sidebar-inner">
            <h2 className="kids-sidebar-title">Refine Collection</h2>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Category</p>
              <div className="kids-filter-options">
                {CATEGORY_FILTERS.map((category) => (
                  <label key={category} className="kids-filter-checkbox">
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <span
                      className={
                        selectedCategories.includes(category)
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
              <p className="kids-filter-label">Availability</p>
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
                min="500"
                max="15000"
                step="500"
                defaultValue="7500"
                className="kids-range-input"
                aria-label="Price range"
              />
              <div className="kids-range-labels">
                <span>Rs. 500</span>
                <span>Rs. 15,000+</span>
              </div>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Size (Age)</p>
              <div className="kids-size-grid">
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="ghost"
                    className={`kids-size-btn ${
                      selectedSize === size ? "kids-size-btn--active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="kids-filter-block">
              <p className="kids-filter-label">Condition</p>
              <select
                className="kids-condition-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                aria-label="Condition"
              >
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <section className="kids-main">
          <div className="kids-header">
            <div>
              <h1 className="kids-title">Little Curations</h1>
              <p className="kids-subtitle">
                Discover 142 premium traditional outfits for kids
              </p>
            </div>
            <div className="kids-sort-wrap">
              <ArrowUpDown
                className="kids-sort-icon"
                size={18}
                aria-hidden="true"
              />
              <select
                className="kids-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>

          <div className="kids-products-grid">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="kids-product-card">
                <div className="kids-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`kids-favorite-btn ${
                      favorites.has(product.id) ? "kids-favorite-btn--active" : ""
                    }`}
                    aria-label={`Save ${product.title}`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      size={20}
                      fill={favorites.has(product.id) ? "currentColor" : "none"}
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
            ))}
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
