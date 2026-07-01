'import React, { useState } from "react"'
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./rentDresses.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSxCO9JolOYBO6rHnTn-mbdQ4545GuGOH6JubGi30jIvc7TmRwcYQvReNCump9jUggZXpnIDfyWQF4i3tDPMpSSICc7zF_ApCDHDQntUZftuGlreFVpqw-q3o4W_mLrwP74LUJqzIIPSd7pE-RCsoUEaknstJspeWJvIUe_fwyJBiwqbNfHLCksXSLCU1qHQ29egOgQva-f0X401xSTF_WfANQ1M2Rw1UW5wNPaYH8chsL1LBq3s35vAQobWkLemoCEpM1AANT-s7";

const collections = [
  "Bridal Wear",
  "Mehndi Outfits",
  "Walima Gowns",
  "Party Wear",
];

const products = [
  {
    title: "Crimson Heritage Lehenga",
    price: "PKR 25,000 / day",
    rating: "4.9",
    size: "Size: M",
    badge: "New Arrival",
    badgeVariant: "light",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fB6-yOWqiAy6q3jboGPz27AfrlAW5SoMxNOhmsCigHIz7dkOYF-iHfO2qSKNnlZDv_lPYQcmoTYhdmjq2Jy8y6ncdzgrnzZdxk8PlPXtG18q7B7WTVS36kxpLRdDuXuu-57YIEIYrpkpzUmnmfdkoZR32AkG1ONENxckqc5eYno2LvmJFG1zJd-e3fhP--rr_bh4mava9r5ws8lXIGqLlExaO4mNFIiEolcoN_AbPUgnouHiuxBLgQj_u60iSU021gVrmmqEbZJm",
  },
  {
    title: "Mint Pearl Walima Gown",
    price: "PKR 18,500 / day",
    rating: "4.8",
    size: "Size: S, M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8TzKIlJBFhyEUYqerMoEjBDiDqV0rpb4lQJuyr8wSrrXnBdPmGXiTxuy8RQ2INfNuIEI8mSmiHm3DxRCuiuzBjnobYo2KMjppce0_DqAsnNyqHqW0XvZGvlilOWRnLYpLARVEl90grSGeTTYVHki2aL08XFQ4kPtzXTRvOuzU-vola6Kct2i-lfkoD4Q1IXuzEXuHn2SSvK1AKkwnpyH6BGifQXc-CtofQyw4tiEQt5WxJBoPzwOOzrC2a6uHAflnWvvLWUQdGD",
  },
  {
    title: "Midnight Shimmer Sari",
    price: "PKR 12,000 / day",
    rating: "5.0",
    size: "Size: Free",
    badge: "Popular",
    badgeVariant: "dark",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS3OSRuKBlFQaR6X9Pl6OHL_0z6-vbwPn2xgwSPup3xx03sk6jdHtcCNHghmMdzGSRAvuPKKh0Ax249zaFG0fc4UECR_PKclziGNP3GpKXTTXM0jxHb5qmNIAJJSVrdUwxV-Efisd9Kiy0j_RqCqlzxqAYajyGrPPF6pPw69C4Sesgj6CDuRW5Ye6Y41mF4TOaY3Miry8w2xDmM1mndI21wlYTB0daYwYI1WQPUJrUpYsZ4LxQOVzcdAWlVjL2GJeVBAgqxCI_NCT_",
  },
  {
    title: "Saffron Mirror Mehndi Wear",
    price: "PKR 10,000 / day",
    rating: "4.7",
    size: "Size: M, L",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA93c4b1FSOa8Eyrm2J9GlSFG4O9FMsPn0AU5IHCV0dufkXhsU76TTsYDTGUYBhkq-p4OmFZH8je-QrAmMWkPLWQacM9xFpQg7ZHwpLULdT2xPKpLgWab4VhaEe5zIX-Mmco908T6-3L9S4aRna4LpEy72o0TxfO4uT6TR8DzI1Ln8LDZBUl7T-tRbajylqmZFcsOQ89MTV4Z-LqbgjVgyCSX-V2ATE_BWiyBytkME8O2pwQyqxa7WJ1WoAjzOQXQLTJsbJW26lhroT",
  },
  {
    title: "Golden Sand Party Gown",
    price: "PKR 15,000 / day",
    rating: "4.9",
    size: "Size: S",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhOmURP3037SfHwsoDt53YSSy4U7oIsgH11826JAcEfggPkqk-m1gSK-rahhuaHwFvn1RIZyJqS0N2QkoTvaN_CKFUxXKnanI7Tm1pBZTwT7KxorP_kP26s76q8oqwgutIfK_cyQWySRgh5ioqzMYx62VY6RyEjZiUzpHbKabScsYoum_JogkFK45wIXsj0VCOktfRxQA6t8BZ46kmWVa-K4co9jqLZ7xQvbCkwMNTselMjESer8JVkRvfzMcwKWX7Q7AOZPS-HHM9",
  },
  {
    title: "Emerald Royal Pishwas",
    price: "PKR 22,000 / day",
    rating: "5.0",
    size: "Size: M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRUaZkpTcunQa7V2BucWaBc7YhKkyPpp9Ih9uKs-HWKutP6pnm55Y_Aw5kzW7d_8rTGz_vUhWryD7n51HnhBN6ezUYH5RYI0MGSbExKiYsSUSLYczd809KBs7O7MACawdXr0gqfF9b8_v4Imza95o9AxD4dpoL0nV0cwMcoJgr7Ypgst03iKLqTvxBU9HPIXaXLnbaUQfa5nFRYyLdvNrUVboEGmevDutFNBPGjQbQEmKV2Cq-y0XRR4YgjbKSz20RSrdLh8yP1wE7",
  },
];

const RentDresses = () => {
  const [activeCollection, setActiveCollection] = useState("Bridal Wear");

  return (
    <div className="rent-page">
      <section className="rent-hero-section">
        <div className="rent-hero">
          <img
            className="rent-hero-image"
            alt="Stunning Pakistani bridal model in a heavy gold embroidered lehenga"
            src={HERO_IMAGE}
          />
          <div className="rent-hero-overlay">
            <h1>Rent Dresses</h1>
            <p>
              Experience affordable luxury with our curated collection of bridal
              and party wear.
            </p>
          </div>
        </div>
      </section>

      <div className="rent-layout">
        <aside className="rent-sidebar">
          <div className="rent-filter-block">
            <h3>Collections</h3>
            <ul className="rent-collections">
              {collections.map((item) => (
                <li key={item}>
                  <Button
                    type="button"
                    variant="ghost"
                    className={`rent-collection-link ${
                      activeCollection === item ? "is-active" : ""
                    }`}
                    onClick={() => setActiveCollection(item)}
                  >
                    <span className="rent-collection-dot" />
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rent-filter-block">
            <h3>Price Range</h3>
            <div className="rent-price-range">
              <input
                type="range"
                min="5"
                max="100"
                defaultValue="50"
                className="rent-range-input"
                aria-label="Price range"
              />
              <div className="rent-range-labels">
                <span>PKR 5k</span>
                <span>PKR 100k+</span>
              </div>
            </div>
          </div>

          <Card className="rent-promo-card">
            <CardContent className="rent-promo-content">
              <CardTitle className="rent-promo-title">
                Sustainable Fashion
              </CardTitle>
              <CardDescription className="rent-promo-text">
                Every rental reduces water waste and CO2 emissions. Look good,
                do good.
              </CardDescription>
            </CardContent>
          </Card>
        </aside>

        <section className="rent-products">
          <div className="rent-products-grid">
            {products.map((product) => (
              <Card key={product.title} className="rent-product-card">
                <div className="rent-product-image-wrap">
                  <img alt={product.title} src={product.image} />
                  {product.badge && (
                    <span
                      className={`rent-product-badge rent-product-badge--${product.badgeVariant ?? "light"}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <CardContent className="rent-product-body">
                  <CardTitle className="rent-product-title">
                    {product.title}
                  </CardTitle>
                  <div className="rent-product-meta">
                    <span className="rent-product-price">{product.price}</span>
                    <div className="rent-product-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <div className="rent-product-footer">
                    <span className="rent-product-size">{product.size}</span>
                    <Button type="button" size="sm">
                      Rent Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RentDresses;
