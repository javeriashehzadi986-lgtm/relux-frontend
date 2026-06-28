import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURED_RENTAL_PRODUCTS } from "@/data/featuredRentals";
import { useWishlist } from "@/hooks/useWishlist";
import "./profileWishlist.css";

const FILTER_TABS = [
  { id: "all", label: "All Items" },
  { id: "rent", label: "Rent" },
  { id: "resale", label: "Resale" },
];

const SORT_OPTIONS = [
  { id: "recently-added", label: "Recently Added" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

const RECOMMENDED = FEATURED_RENTAL_PRODUCTS.slice(0, 4);

const sortItems = (items, sortBy) => {
  const sorted = [...items];
  if (sortBy === "price-low") {
    return sorted.sort((a, b) => a.sortPrice - b.sortPrice);
  }
  if (sortBy === "price-high") {
    return sorted.sort((a, b) => b.sortPrice - a.sortPrice);
  }
  if (sortBy === "popular") {
    return sorted.sort((a, b) => b.popularity - a.popularity);
  }
  return sorted.sort((a, b) => b.addedAt - a.addedAt);
};

const ProfileWishlist = () => {
  const carouselRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recently-added");
  const [searchQuery, setSearchQuery] = useState("");
  const { items: wishlistItems, remove } = useWishlist();

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = wishlistItems.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.listingType === activeFilter;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
    return sortItems(items, sortBy);
  }, [activeFilter, searchQuery, sortBy, wishlistItems]);

  const removeFromWishlist = (id) => {
    remove(id);
  };

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="profile-wishlist">
      <header className="profile-wishlist-search-bar">
        <div className="profile-wishlist-search-wrap">
          <Search
            className="profile-wishlist-search-icon"
            size={18}
            aria-hidden="true"
          />
          <Input
            type="search"
            className="profile-wishlist-search"
            placeholder="Search wishlist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="profile-wishlist-hero">
        <div>
          <h1 className="profile-wishlist-title">My Wishlist</h1>
          <p className="profile-wishlist-subtitle">
            Save your favorite products and rentals for later.
          </p>
        </div>

        <div className="profile-wishlist-controls">
          <div className="profile-wishlist-tabs-wrap">
            {FILTER_TABS.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                className={`profile-wishlist-tab ${
                  activeFilter === tab.id ? "profile-wishlist-tab--active" : ""
                }`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <select
            className="profile-wishlist-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort wishlist"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="profile-wishlist-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => (
            <Card key={product.id} className="profile-wishlist-product-card">
              <div className="profile-wishlist-product-image-wrap">
                <Link to={`/dress/${product.id}`} aria-label={`View ${product.title}`}>
                  <img alt={product.title} src={product.image} />
                </Link>
                <span
                  className={`profile-wishlist-product-badge profile-wishlist-product-badge--${product.badgeVariant}`}
                >
                  {product.badge}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="profile-wishlist-favorite-btn profile-wishlist-favorite-btn--active"
                  aria-label={`Remove ${product.title} from wishlist`}
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Heart size={18} fill="currentColor" aria-hidden="true" />
                </Button>
              </div>
              <div className="profile-wishlist-product-body">
                <div>
                  <p className="profile-wishlist-product-brand">{product.brand}</p>
                  <h3 className="profile-wishlist-product-title">
                    <Link to={`/dress/${product.id}`}>{product.title}</Link>
                  </h3>
                </div>
                <div className="profile-wishlist-product-prices">
                  <div>
                    <span className="profile-wishlist-price-label">
                      {product.listingType === "rent" ? "Rent" : "Resale"}
                    </span>
                    <span
                      className={
                        product.listingType === "rent"
                          ? "profile-wishlist-price-rental"
                          : "profile-wishlist-price-resale"
                      }
                    >
                      {product.price}
                    </span>
                  </div>
                </div>
                <Button type="button" className="profile-wishlist-view-btn" asChild>
                  <Link to={`/dress/${product.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="profile-wishlist-empty">
            <CardContent className="profile-wishlist-empty-content">
              <Heart
                className="profile-wishlist-empty-icon"
                size={56}
                strokeWidth={1}
                aria-hidden="true"
              />
              <p>
                {wishlistItems.length === 0
                  ? "Your wishlist is empty. Save items you love while browsing."
                  : "No wishlist items match your search or filter."}
              </p>
              <Button type="button" className="profile-wishlist-view-btn" asChild>
                <Link to="/categories">Browse Collection</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <section className="profile-wishlist-recommended">
        <div className="profile-wishlist-recommended-header">
          <h2 className="profile-wishlist-recommended-title">You May Also Like</h2>
          <div className="profile-wishlist-carousel-nav">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="profile-wishlist-carousel-btn"
              aria-label="Previous recommendations"
              onClick={() => scrollCarousel(-1)}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="profile-wishlist-carousel-btn"
              aria-label="Next recommendations"
              onClick={() => scrollCarousel(1)}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div ref={carouselRef} className="profile-wishlist-carousel">
          {RECOMMENDED.map((product) => (
            <article key={product.id} className="profile-wishlist-carousel-item">
              <Link
                to={`/dress/${product.id}`}
                className="profile-wishlist-carousel-card"
              >
                <div className="profile-wishlist-carousel-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <span
                    className={`profile-wishlist-product-badge profile-wishlist-product-badge--${product.badgeVariant}`}
                  >
                    {product.badge}
                  </span>
                </div>
                <p className="profile-wishlist-carousel-brand">{product.brand}</p>
                <h3 className="profile-wishlist-carousel-item-title">{product.title}</h3>
                <p className="profile-wishlist-carousel-price">
                  <span className="profile-wishlist-carousel-price-label">
                    {product.listingType === "rent" ? "Rent" : "Resale"}
                  </span>
                  {product.price}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default ProfileWishlist;
