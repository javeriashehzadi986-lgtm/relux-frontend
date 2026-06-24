import React, { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "./profileWishlist.css";

const FILTER_TABS = [
  { id: "all", label: "All Items" },
  { id: "sale", label: "For Sale" },
  { id: "rental", label: "Rentals" },
];

const SORT_OPTIONS = [
  { id: "recently-added", label: "Recently Added" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "popular", label: "Most Popular" },
];

const WISHLIST_ITEMS = [
  {
    id: "wish-1",
    type: "rental",
    title: "Emerald Velvet Pishwas",
    price: "Rs. 8,500",
    priceSuffix: "/ day",
    meta: "Bridal & Formals • House of Faiza • New",
    rentalNote: "Min 3 days rental",
    popularity: 4,
    addedAt: 3,
    sortPrice: 8500,
    badges: [
      { label: "Rental Available", variant: "primary" },
      { label: "New Arrival", variant: "secondary" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd-JIBa5HUjfMEtRYeHVHpk_nH8YSJHSq0uTCCo3H_pp2kvzzIQDZS4cFrZhQT5NmPTnsqLZObNoJq7jSJ63V9wd-vHjMIZ_15A9i8eIi-GCKLAUZjUGgzOHenMe7NzOF-_qY39flbOmsENniFxyRoE6Oxy-EXgb92lTL5-bugn_quSxLRU6tpZ57eYE0_MVGsm_RfGKtNyuSdBG3xcYiZuBp0xfNW2ZYBaGoNqQfBDer7BqVVyhzU71DOFpGC0QoiVA0KsyHz9Lb0",
    actionLabel: "Rent Now",
    actionVariant: "primary",
  },
  {
    id: "wish-2",
    type: "sale",
    title: "Ivory Bloom Saree",
    price: "Rs. 45,000",
    priceSuffix: null,
    meta: "Sarees • Faraz Manan • Like New",
    rentalNote: null,
    popularity: 5,
    addedAt: 1,
    sortPrice: 45000,
    badges: [{ label: "Trending", variant: "tertiary" }],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJcszAI1MM_HBp3H-q22SGOmVzMI2lBMwAelOiXJ8HRUpRSRSYQQJAeysfo7xnyx2rVR0Nq_YjD3XK64s1EeX7CsI0Fmv7fUV5sFY0wgyYeKyH52v-1XkTNoLCBEAyLi1PtPAHgOBvqLS-V6P8TTwOMjfN2Wvyg7B2Ayg41hji9mhzkxkIs7AwsA9KiurAh0vkSCClhPJi47A1Q96wXs4IqTyDNmZKJ1d6HydnOEdvlWATSNTnKCTpsrJHvY0VkW_uHXO4L4_1NUGy",
    actionLabel: "Add to Cart",
    actionVariant: "secondary",
  },
  {
    id: "wish-3",
    type: "rental",
    title: "Royal Crimson Lehenga",
    price: "Rs. 12,000",
    priceSuffix: "/ day",
    meta: "Bridalwear • Sabyasachi • New",
    rentalNote: "Min 5 days rental",
    popularity: 3,
    addedAt: 2,
    sortPrice: 12000,
    badges: [{ label: "Rental Available", variant: "primary" }],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRjx-qEt9AQUou1MRuw14yslWfAD6HDc5d1rWOUObnGXPnUyQk4gm9dR9wOvAmbcJ9eQyQ8v4w_YiF8yyxuhz2Ewyuzi6Mguu--E3ggcfif4sC2ZaILRFd62OXgN45CpinzFSmChuDYP1Og8vMtv7nUm5cxOmYPJh_ZRScb6fc5mEfsWlSGzYaQMVePQIGFQYxs6ic7daJi7LOy9yryyR76X5iBHrVPUIs-WSU2fb0D5W9S_iJZhUOpQ3tQlCYbBtTjUUQ7gx222Fh",
    actionLabel: "Rent Now",
    actionVariant: "primary",
  },
];

const RECOMMENDED = [
  {
    id: "rec-1",
    category: "BRIDAL & FORMALS",
    title: "Emerald Royal Pishwas",
    price: "Rs. 22,000 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqtbhMIAfH3M2Nqdv1Hxy32sWUYmDiHdJQb_SHxRv5n1u8bVapr7Gft3XyzDb97yC33R4uiBVU4WXwV0VnDGqyKCLbrh9-muK1svdYDdfeOTQPraz3F2UdsRNJ-c4UtVZWIKn4Ju_TH6sF1icnEuzRV54mT_5D-GyAoWnm-UhgTLS2Krc04y3ccfEIpBXe-8Mk26T2izQfVXQAbr17OhGuYNlYm28n7YbHXGafCzMLBY2Q5LPh4yVbqjy906Dc5GxG2j4ZT_BhIdQ9",
  },
  {
    id: "rec-2",
    category: "BRIDAL",
    title: "Ivory Zardozi Lehenga",
    price: "Rs. 25,000 / day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6i4Pz4zfCiKWd17DhwBM0jkfqBaRZJuHOtMU1A45q4iZlRyoZ1yRUx0Jr6mi1Rrq9fOA-R4Kgoso1uFqZfCIyrHQuf4FGzg9K2U2565R0EPffmdMRNZ7pPiEaEvX0vykeqcyQn5YLb75WMetH7DVEXzmQw5onvjrgclwo3paDnOHG0IU5dPDl1ju8QOflIYDwVpc_S38MsUYGu-6BCuiLveyNdyX0uSw9wpUqlRjseTEpS_4koh9651C5D709VJLtnZ5AdBlT-DJO",
  },
  {
    id: "rec-3",
    category: "Accessories",
    title: "Monolith Tote Bag",
    price: "Rs. 32,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUOPVhq7B_f8AJfYPTG5D_5vDzz4oZj6e2eZrveTKjnd7G_TGmBteEGP37NENF1UkjktVIkvw6zunbJk4iK3DegzlDO7rjneo5KNUAEyECpFHo4mrhhuR2rSDgoz2ikQk62KfIA7MTwFe-F3QA8EOyMwK-iN3_j_P5dAOI-HwcvgeMyR6iCpC_MiXymriYdCBC3h5bVY67CFVindji0AUrw0-HekA_5bqGxr1APqjsCkAGHcPDqlVwAP_RDespsSG-oCHQHx4V4fNF",
  },
  {
    id: "rec-4",
    category: "Fashion",
    title: "Silk Pattern Scarf",
    price: "Rs. 6,800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0W7A_Bfmi7JJWDwEnu_tNQ9k9RAWbbh29BiN6jS2PVNjdCC4969pTufKJAS3M-hlX3RsaWpXp0CacB8ypgWQ-J5qDjs3fEhVhfpY9GWG5IOoZzKbychQW9vXhXwlAIsYHwya76E1yOg5p6Xi1KmRaQzQ5kXiYG2gA2MA85PxnMg0XxbWX6y8GjLlCCNhVTxQE_lq1iDp-m1eIZxx-rp_YdRchzZ_NgVizdGim0ts4wYfTU53i2N0yaO6uRh0wIvqABsFkmF4xp7KW",
  },
];

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
  return sorted.sort((a, b) => a.addedAt - b.addedAt);
};

const ProfileWishlist = () => {
  const carouselRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recently-added");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState(
    () => new Set(WISHLIST_ITEMS.map((item) => item.id))
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = WISHLIST_ITEMS.filter((item) => {
      if (!savedIds.has(item.id)) return false;
      const matchesFilter =
        activeFilter === "all" || item.type === activeFilter;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.meta.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
    return sortItems(items, sortBy);
  }, [activeFilter, searchQuery, sortBy, savedIds]);

  const removeFromWishlist = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction * 324,
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
          filteredItems.map((item) => (
            <article key={item.id} className="profile-wishlist-card">
              <div className="profile-wishlist-image-wrap">
                <img alt={item.title} src={item.image} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="profile-wishlist-favorite-btn"
                  aria-label={`Remove ${item.title} from wishlist`}
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Heart size={22} fill="currentColor" aria-hidden="true" />
                </Button>
                {item.badges.length > 0 && (
                  <div className="profile-wishlist-badges">
                    {item.badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={`profile-wishlist-badge profile-wishlist-badge--${badge.variant}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="profile-wishlist-card-body">
                <div className="profile-wishlist-card-top">
                  <h3 className="profile-wishlist-card-title">{item.title}</h3>
                  <p className="profile-wishlist-card-price">
                    {item.price}
                    {item.priceSuffix && (
                      <span className="profile-wishlist-card-price-suffix">
                        {item.priceSuffix}
                      </span>
                    )}
                  </p>
                </div>
                <p className="profile-wishlist-card-meta">{item.meta}</p>
                <div className="profile-wishlist-card-actions">
                  <Button
                    type="button"
                    className={`profile-wishlist-action-btn profile-wishlist-action-btn--${item.actionVariant}`}
                  >
                    {item.actionLabel}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="profile-wishlist-view-btn"
                    aria-label={`View ${item.title}`}
                  >
                    <Eye size={20} />
                  </Button>
                </div>
                {item.rentalNote && (
                  <p className="profile-wishlist-rental-note">{item.rentalNote}</p>
                )}
              </div>
            </article>
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
              <p>No wishlist items match your search or filter.</p>
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

        <div
          ref={carouselRef}
          className="profile-wishlist-carousel"
        >
          {RECOMMENDED.map((item) => (
            <article key={item.id} className="profile-wishlist-carousel-item">
              <div className="profile-wishlist-carousel-image-wrap">
                <img alt={item.title} src={item.image} />
              </div>
              <p className="profile-wishlist-carousel-category">{item.category}</p>
              <h3 className="profile-wishlist-carousel-item-title">{item.title}</h3>
              <p className="profile-wishlist-carousel-price">{item.price}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

export default ProfileWishlist;
