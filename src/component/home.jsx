import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CalendarDays, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./home.css";

const categories = [
  {
    title: "Female Fashion",
    subtitle: "Elevate your wardrobe with consciously crafted feminine silhouettes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiukL7lSowGGH1BNwfMAuup6a8qUrB5S2pBcM2k76YsM95ete1CKxoRlOz8gZYhKv9P7FSMnYvvQRfmXqbGHXDuS3T9-lgAALWZOlhXkvfnRk7biekOv8gkuW3HXT_RxXSwzGwHkgRW5bn4aAd-TQL8IYO2a6uTOX6DhXc4DmMq8pHr092RKKGkfmbTj7dzefQZWyaldzYKvWMeAlzzFwG2-ETdaCBmA8vuli47HBmfdUL5YEwQMj77rtmCVET6JJFJXMdpbqB0pXm",
  },
  {
    title: "Male Fashion",
    subtitle: "Shop pre-loved men's fashion curated for timeless style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaq_12MLIjP788-IcuyL49DoE_LqVyMo-bT2kI6tbfr1IRlATc7JAkbZvXTAJ5iSWIezBzWltEPOzV5rzcJ8Hsj6ynHOZGSRUB9tb-n90tbADlW5bbnSaVWxbwJwBHzrjd0sXY9iukLhUUwDiZ998w_h1mSMG2Q5Xv1njglITUncIDEjUcwdUVbcsa8PwVa-bPzA6EMX7cEWqqfgSOREUSRSw4ALLsAs6HhGg87ez0fvWMw3ecpvT30UeJImAlTyZQn2Ls4fVwYSHu",
  },
  {
    title: "Kids Fashion",
    subtitle: "Gentle on the planet, perfect for the next generation of style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2byFAgLoJ73OybxhWp_M92XJtCnNdZJ9CUqa73mYX6qoO-ood2-CpKvlk3Fh_cV1ajJM0dS2DZYq7SXGG3uh5rxeYjtJFiPBIm3GmVbxPZ7RUPz2lIWIEgeF9S2dVSN8vVYJ8FOIjthXFarAaCdDtzLg7a-oYSbMnfy0bK9kmi-nGi9lT6a9uLV3wZ1klYuJE_85sAwPs1CoA-F2OmSGcTCIeZxcr1pIGOVm2mc1NIVo91LRTj0DJSp6uP1PaHjmxtsB8KWmY64Sg",
  },
];

const featuredRentals = [
  {
    title: "Hand-worked Bridal Lehenga",
    price: "PKR 25,000",
    priceSuffix: "/day",
    badge: "Bridal",
    badgeVariant: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBt7NUnhgK0C16PPvLHU4uIAKfx5CVN_pVg5TFDLmem4ouSEN_Uy_bB16vJDFrxx1QEvls37p6ppI__UDgIZlMggdx-oYdo2EADHB0DBxlD4CRuK5RdtmEPpiIt33qGEakx_uALpVwDSM4kjbHZjXbmVQH1DhbeonE-fZd3GBb8mKfeJrelAs_OhLEPpKcPG65yJs0zWr4oPh59QAcYmJgpkla7UdrkRgk-VFXMY8XWqdfoM8SMa0tXLGvTYqL60I6czaeW7a5fSp1s",
  },
  {
    title: "Emerald Heritage Pishwas",
    price: "PKR 12,000",
    priceSuffix: "/day",
    badge: "Festive",
    badgeVariant: "secondary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDseSfchAa6Yw6IK2M-MKkXymNJvoL-cID5JHoONidTxi2tCUf12T4BrPX9UUomFeobQ8slPcSP3aXbs_5dgQuYjz8fnKJPqny84CU-AGeCAvjd3eMWDfVJ4sFMfzTwu93Zoo7XNh8aLVheXqE3apyy6pwhE3C2wztt3YR5oLZFm7k8lyiDuWL0equs3Dypdwo9UfNoxaevQG2AdofKyV8-hyWgTnxTCxfNY6St-dhZxA40P2lrD5ValWZG_OvyMmfCYhuUUmEfriik",
  },
  {
    title: "Golden Zardozi Anarkali",
    price: "PKR 15,000",
    priceSuffix: "/day",
    badge: "Formal",
    badgeVariant: "tertiary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVuQO3M7twbez7dvvHttrX0U0x8v-kbrcetWGYcUhOxinoWnn7kgmFK_WsEG5vFXis_l36dUwl6XC6_I1NnufpUUw6qOm2s35xwA0a4-J7alfc8R_an8PB9960Mc7njUhvGJQP3S3dVpacZqxYMV3USvXruxluEdXqsTiRjNcb7xUFK4jiwk_UzuzgemA_GSjjxFLU_ctbnhTEF38Tb5lwDGA7D7tJVTRklmC1J8yq_AkXfjMuwMVgNltF0EYoaHq4GKnvwx6AO078",
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
  return (
    <div className="home-container">
      {/* Hero */}
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
            Sustainable luxury for every occasion. Rent high-end fashion or give your premium wardrobe a second life by reselling.
            </p>
            <Button size="lg" asChild>
              <Link to="/rentDresses">Explore Dresses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>Curated Categories</h2>
          <p>Finest selections for every occasion</p>
        </div>
        <div className="home-categories-grid">
          {categories.map((category) => (
            <Link
              key={category.title}
              to="/categories"
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

      {/* Featured Rentals */}
      <section className="home-section-alt">
        <div className="home-section-inner">
          <div className="home-section-header-center">
            <h2>Featured Rentals</h2>
            <p>Our most coveted pieces of the season</p>
          </div>
          <div className="home-products-grid">
            {featuredRentals.map((product) => (
              <Card key={product.title} className="home-product-card">
                <div className="home-product-image">
                  <img alt={product.title} src={product.image} />
                  {product.badge && (
                    <span
                      className={`home-product-badge home-product-badge--${product.badgeVariant ?? "primary"}`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
                <CardContent className="home-product-body">
                  <CardTitle className="home-product-title">
                    {product.title}
                  </CardTitle>
                  <p className="home-product-price">
                    {product.price}
                    {product.priceSuffix && (
                      <span className="home-product-price-suffix">
                        {" "}
                        {product.priceSuffix}
                      </span>
                    )}
                  </p>
                  <Button variant="outline" size="full">
                    Rent Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="home-featured-more">
            <Button size="lg" asChild>
              <Link to="/rentDresses">Explore More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
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

      {/* Seller Banner */}
      <section className="home-section">
        <div className="home-seller-banner">
          <div className="home-seller-content">
            <h2>Earn by Renting & Reselling Your Dresses</h2>
            <p>
            Join our community of stylish sellers. Give your bridal and formal outfits a second life while earning premium rental income.
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
