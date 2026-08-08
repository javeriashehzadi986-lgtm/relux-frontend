import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CalendarDays, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useFeaturedRentals } from "@/hooks/useFeaturedRentals";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useWishlist } from "@/hooks/useWishlist";
import "./home.css";

const categories = [
  {
    title: "Female Fashion",
    to: "/femaleFashion",
    subtitle: "Elevate your wardrobe with consciously crafted feminine silhouettes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiukL7lSowGGH1BNwfMAuup6a8qUrB5S2pBcM2k76YsM95ete1CKxoRlOz8gZYhKv9P7FSMnYvvQRfmXqbGHXDuS3T9-lgAALWZOlhXkvfnRk7biekOv8gkuW3HXT_RxXSwzGwHkgRW5bn4aAd-TQL8IYO2a6uTOX6DhXc4DmMq8pHr092RKKGkfmbTj7dzefQZWyaldzYKvWMeAlzzFwG2-ETdaCBmA8vuli47HBmfdUL5YEwQMj77rtmCVET6JJFJXMdpbqB0pXm",
  },
  {
    title: "Male Fashion",
    to: "/maleFashion",
    subtitle: "Shop pre-loved men's fashion curated for timeless style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaq_12MLIjP788-IcuyL49DoE_LqVyMo-bT2kI6tbfr1IRlATc7JAkbZvXTAJ5iSWIezBzWltEPOzV5rzcJ8Hsj6ynHOZGSRUB9tb-n90tbADlW5bbnSaVWxbwJwBHzrjd0sXY9iukLhUUwDiZ998w_h1mSMG2Q5Xv1njglITUncIDEjUcwdUVbcsa8PwVa-bPzA6EMX7cEWqqfgSOREUSRSw4ALLsAs6HhGg87ez0fvWMw3ecpvT30UeJImAlTyZQn2Ls4fVwYSHu",
  },
  {
    title: "Kids Fashion",
    to: "/kidsFashion",
    subtitle: "Gentle on the planet, perfect for the next generation of style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2byFAgLoJ73OybxhWp_M92XJtCnNdZJ9CUqa73mYX6qoO-ood2-CpKvlk3Fh_cV1ajJM0dS2DZYq7SXGG3uh5rxeYjtJFiPBIm3GmVbxPZ7RUPz2lIWIEgeF9S2dVSN8vVYJ8FOIjthXFarAaCdDtzLg7a-oYSbMnfy0bK9kmi-nGi9lT6a9uLV3wZ1klYuJE_85sAwPs1CoA-F2OmSGcTCIeZxcr1pIGOVm2mc1NIVo91LRTj0DJSp6uP1PaHjmxtsB8KWmY64Sg",
  },
];

const steps = [
  {
    icon: ClipboardList,
    iconClass: "green",
    title: "Choose Dress",
    description:
      "Browse our curated collection of designer pieces and select your favorite look for the event.",
  },
  {
    icon: CalendarDays,
    iconClass: "pink",
    title: "Rent for Event",
    description:
      "Book for your specific dates. We offer flexible rental periods to suit your schedule.",
  },
  {
    icon: RotateCcw,
    iconClass: "yellow",
    title: "Return After Use",
    description:
      "Drop it back or we'll pick it up. Don't worry about cleaning—we handle the dry cleaning for you.",
  },
];

const Home = () => {
  const requireLogin = useRequireLogin();
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const { products: featuredRentals, loading, error, refresh } = useFeaturedRentals(6);

  const toggleFavorite = (product) => {
    if (!requireLogin()) return;
    toggleWishlist(product);
  };

  return (
    <div className="home-container">
      <section className="home-hero">
        <img
          alt="Designer Pakistani Bridal Wear"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfX3jgFevQQ19fVVSBN-PEVzjpHJjJFZISihrsL3P79alPIyN5hk5Fdlv2vqoNwYefzuPWXxNL6hJ7BLGNpj3y7f2FYSDSLKPeuMxRHs__qhLr_1Oxm4WikJomKqKD3xWyGGqhuDsOXQ26jrrcy4Mw3GzmMZDa4HZinG7_lwN5lTJVPCqlOE31JXLJmsMh0X8n13gKei02-egcQ-s2bV6aifTqJ2_c9ds1iHYIqxSJV_bxcnu3jM1SoABEqd9TPshQHm4vJffYsQ6y"
        />
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <span className="home-hero-label">The Atelier Collection</span>
            <h1>Rent & Resell pre-owned  Dresses in Pakistan</h1>
            <p>
              Sustainable luxury for every occasion. Rent high-end fashion or give your premium
              wardrobe a second life by reselling.
            </p>
            <Button size="lg" asChild>
              <Link to="/categories">Explore Dresses</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h2>Curated Categories</h2>
          <p>Finest selections for every occasion</p>
        </div>
        <div className="home-categories-grid">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.to}
              className="home-category-card"
            >
              <Card className="home-category-shadcn-card">
                <div className="home-category-image">
                  <img alt={category.title} src={category.image} />
                </div>
                <CardContent className="home-category-card-content">
                  <CardTitle className="home-category-title">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="home-category-subtitle">
                    {category.subtitle}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section-alt">
        <div className="home-section-inner">
          <div className="home-section-header-center">
            <h2>Featured Rentals</h2>
            <p>Our most coveted pieces of the season</p>
          </div>
          {loading && (
            <p className="home-catalog-status" role="status">
              Loading featured rentals...
            </p>
          )}

          {error && (
            <div className="home-catalog-status home-catalog-status--error" role="alert">
              <p>{error}</p>
              <Button type="button" variant="outline" onClick={refresh}>
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && featuredRentals.length === 0 && (
            <p className="home-catalog-status">
              No rental listings yet. Check back soon or explore all categories.
            </p>
          )}

          {!loading && !error && featuredRentals.length > 0 && (
            <div className="home-products-grid">
              {featuredRentals.map((product) => (
                <Card key={product.id} className="home-product-card">
                  <div className="home-product-image-wrap">
                    <img alt={product.title} src={product.image} />
                    <span
                      className={`home-product-badge home-product-badge--${product.badgeVariant}`}
                    >
                      {product.badge}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={`home-product-favorite ${
                        isSaved(product.id) ? "home-product-favorite--active" : ""
                      }`}
                      aria-label={`Save ${product.title}`}
                      onClick={() => toggleFavorite(product)}
                    >
                      <Heart
                        size={18}
                        fill={isSaved(product.id) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                  <CardContent className="home-product-body">
                    <div>
                      <p className="home-product-brand">{product.brand}</p>
                      <CardTitle className="home-product-title">{product.title}</CardTitle>
                    </div>
                    <div className="home-product-prices">
                      <div>
                        <span className="home-price-label">Rent</span>
                        <span className="home-price-rental">{product.price}</span>
                      </div>
                    </div>
                    <Button type="button" className="home-view-btn" asChild>
                      <Link to={`/dress/${product.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="home-featured-more">
            <Button size="lg" asChild>
              <Link to="/femaleFashion?type=rent">Explore More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header-center">
          <h2>Simple. Seamless. Stylish.</h2>
        </div>
        <div className="home-steps-grid">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="home-step-card">
                <CardContent className="home-step-card-content">
                  <div className={`home-step-icon ${step.iconClass}`}>
                    <Icon size={32} />
                  </div>
                  <CardTitle className="home-step-title">{step.title}</CardTitle>
                  <CardDescription className="home-step-description">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-seller-banner">
          <div className="home-seller-content">
            <h2>Earn by Renting & Reselling Your Dresses</h2>
            <p>
              Join our community of stylish sellers. Give your bridal and formal outfits a second
              life while earning premium rental income.
            </p>
            <Button variant="light" size="lg" asChild>
              <Link to="/becomeASeller">Become a Seller</Link>
            </Button>
          </div>
          <div className="home-seller-image">
            <img
              alt="Seller wardrobe"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKXlnZaiVOYW0sDBWOr-K9oIe3EbunycifjFB94bXJHON3GjLkQPV0juMgoWEe1e1ROgwPcshrTayvzn4irNGDdjU9AYmU8szOBAgkg-kvJUv4CJOUsP3oihipI5qx80p0EVInEY77ZyOeI0qTYO-5vPaXq_5pO6IzTbmSm6-WeDWcMk8glQ2Nvb9QGpgG4eASVqtwM-4flTdRc6bFHJDjA5heNlhQezG8zGO4GK8CbC3NRDWvJ_djGrTPZH7OpJCQLCQUZNOUwBo3"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
