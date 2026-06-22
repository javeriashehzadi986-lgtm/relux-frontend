import React, { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import "./pre-owned.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBb2DiQ8MC1DfYStLafGXfXUEFjccoMS7zH7cZllgJY23g_z-QworZ-9hhU9eZRgCPTFzXzjbYerKKJSK_PMZ9z3rZvCYuLHzhUuA3e4K6760gF2JpQ54su2r17oy3VOqrIut1OUFwv6HRUfUfUlBGPkAN1eIbUalXRYq2stR6Ctmx-_AuxceEypUZokm0n3g7xcloLjL5LhhiHs0AlzIAw-5WQZ_Fl_RKc615Lz2mrMk5_EtxZFfYcOWypJVnf10rSUww1orOMj9jg";

const filters = ["Condition", "Price Range", "Brand", "Size"];

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "price-low", label: "Price: Low to High" },
];

const products = [
  {
    title: "Emerald Silk Drape",
    price: "PKR 45,000",
    meta: "Zainab Chottani • Size M",
    badge: "Pristine",
    badgeVariant: "mint",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdHfnREjGOEK6oBcaxsVkC-niDWmfoNAZNQuvob0AIjAc90Qyb-mrXwCUqtJVt0gmwySi2Hn3kUsHfbwmD3hSOwzm2Ej5yNdG5rfBoYygF9XHU4nvdMlsRcrJYVWsINOmjJ2vhM7ln8vvZEp3RqeG07wKQ0qqFfqPZl4h2SvQQLxsfXKOxgstCuvBnuSwWMb5HJbYpiwYlfTmu0MaU4Txr7z50GC5ElMyWijabMA3P5qBpdygy1Bl02xfHrIy8vIBf8aCubGgEXoHW",
  },
  {
    title: "Champagne Zardozi",
    price: "PKR 120,000",
    meta: "Sana Safinaz • Size S",
    badge: "Gently Loved",
    badgeVariant: "pink",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBh8pJQ1zEnRFHSaRimZE1zVRZsfR-JeC8IByce4cYaBxqZEYydDybyJBF2LlrKfKxtSvHrVdDOTTqCWql3GMRMNQXsLl-rQmXqBlDQEakl1vhW5mFQryk8Qbka_qum8FAbWNAGya-IfAtuOai1aMwJlFfIJbUGhNbTq-2iQjxmKXoFdQ-nqcb4mzrzXI91z6BemwVAIJl4ONv6uBpeaG9yK9RW1UhgUIVq7ZegP3ANwt2Y2afZXBisZmMgZWz_SBnvVlMXZt2rMQ0K",
  },
  {
    title: "Ivory Sculpt",
    price: "PKR 35,000",
    meta: "Faraz Manan • Size L",
    badge: "Pristine",
    badgeVariant: "mint",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjKtVyKl8ybIhAgr9GNbSJnNjSW-dCGTjLoXtudkuwqpVUJxqm4YoJRpoYOyy0PAsFwTlrI2sy50MySYYG6SUiFRlgBY7hTDVCy_Xg65WJxZNYqnX7cpBh8ErMhg7ddAuK8c8jjqqbn4vSF8o2sTFL_moFYUA4bRoJ_aV2fwxzzw_2ma21pw_IIlwG4Fca1YWWzel73JeCmJYm_hlNUTIrigOR_qvuaTKdQBK0DobVyYNRRW2UntU_Ufrpe4pfj5Bxkx92hliw69lT",
  },
];

const Preowned = () => {
  const [sortBy, setSortBy] = useState("price-low");

  return (
    <div className="preowned-page">
      <section className="preowned-hero-section">
        <div className="preowned-hero">
          <img
            className="preowned-hero-image"
            alt="A bride in a detailed ivory lace gown in a sun-drenched minimalist atelier"
            src={HERO_IMAGE}
          />
          <div className="preowned-hero-overlay">
            <h1>
              The Pre-Owned
              <br />
              Collection
            </h1>
            <p>
              Experience luxury sustainability. Gently loved designer pieces
              curated for your most memorable moments.
            </p>
          </div>
        </div>
      </section>

      <div className="preowned-layout">
        <aside className="preowned-sidebar">
          <div className="preowned-sidebar-inner">
            <div className="preowned-filter-block">
              <h3>Filters</h3>
              <ul className="preowned-filter-list">
                {filters.map((item) => (
                  <li key={item}>
                    <Button type="button" variant="ghost" className="preowned-filter-item">
                      <span>{item}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="preowned-filter-block">
              <h3>Sort By</h3>
              <div className="preowned-sort-list">
                {sortOptions.map((option) => (
                  <label key={option.id} className="preowned-sort-option">
                    <input
                      type="radio"
                      name="preowned-sort"
                      value={option.id}
                      checked={sortBy === option.id}
                      onChange={() => setSortBy(option.id)}
                    />
                    <span className="preowned-sort-radio" />
                    <span
                      className={
                        sortBy === option.id
                          ? "preowned-sort-label is-active"
                          : "preowned-sort-label"
                      }
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="preowned-products">
          <div className="preowned-products-grid">
            {products.map((product) => (
              <Card
                key={product.title}
                className="preowned-product-card py-0 gap-0 ring-0 shadow-none"
              >
                <div className="preowned-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  <span
                    className={`preowned-product-badge preowned-product-badge--${product.badgeVariant}`}
                  >
                    {product.badge}
                  </span>
                  <Button
                    type="button"
                    variant="icon"
                    size="icon"
                    className="preowned-wishlist-btn"
                    aria-label={`Add ${product.title} to wishlist`}
                  >
                    <Heart size={20} />
                  </Button>
                </div>
                <CardContent className="preowned-product-body">
                  <div className="preowned-product-header">
                    <CardTitle className="preowned-product-title">
                      {product.title}
                    </CardTitle>
                    <p className="preowned-product-price">{product.price}</p>
                  </div>
                  <p className="preowned-product-meta">{product.meta}</p>
                  <Button type="button" size="buy">
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="preowned-load-more-wrap">
            <Button type="button" variant="outline" className="preowned-load-more">
              Explore More Pieces
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Preowned;
