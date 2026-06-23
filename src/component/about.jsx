import React from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./about.css";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACboYj7aqZN7JBkaPWgbR-0zpyUQk8dxRN2cXKTAeke8yZX8AqI2cNu0-Pwlmltms60vwK_-lfks-deT5vqTELgEWurH9zNAP8cNf-OQSyeS2dWuapLygN0QxQJQTxlPG7d8BYF2NzeR1-p-L0_arkQG_WrydLIWioxqJ8CWorpXPmLkzgemcLNyYntEpm7iMMzlokwAn4wM6enHKWZrqKngLcxQVH8uv7swUxhSxgqvyk-Mkh6s07qkffLLdEjjdeVY1KEdjGUIFb";

const SIDEBAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCD2SmsmzZf08a_zeHdGydEMir9Cq0FQsZ-RF59lOEkuTdkFKo5fqNU1go5v6GjeUautE-LeD95hNvoie8eGcKsk2GnRSE_dgh6Hb3pZGJ5Gikocgqg3YXu7vRlayOiM46rFtRUb1q1GFTrM1OE3w51VbBLEDuQa5x1AqExZepz7EnRK4yhiasecfFdRxObOSUpx0E6W6LUDA4ayUcKBmpm2_OaymAIhiY81MUycZk2q5VabyQQwAT7SuwtGUJkLW0BOzB8LahOk68W";

const OFFER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsJW9q0ehQxztpyVk8TOkBcng8RTq7Qh4TdywJTPiAOM2lGQBqGfYtwoLs4uC_UVN9gILc9vDP8CJpxjw4evmiNawetzZ2CjNMRLbrsughMuFGPTnk7Z3G6iIwuR2-arZ-HAEALvg6V3Hbh8IDFIc-9qORAMXEdWyRistTdcBnIK04jKAVCJxiS7aRuMe6F4MDdrJCcJ7SV3D2aas65yD2P3k1svVqyPB9T1jrhWwY4wCpMeYMltDXO72WkDBbwYa7Fa2E4luByhNd";

const sidebarLinks = [
  { id: "how", label: "How it Works", icon: HelpCircle, href: "#how-it-works" },
  {
    id: "contact",
    label: "Contact Us",
    icon: MessageCircle,
    href: "/contactUs",
    isLink: true,
    active: true,
  },
];

const offerItems = [
  "Bridal Wear Rentals",
  "Walima & Mehndi Collections",
  "Party & Formal Wear",
  "Verified Designer Sellers",
  "Secure Booking System",
  "Affordable Luxury Fashion Access",
];

const whyItems = [
  "Premium quality designer outfits only",
  "Trusted seller verification system",
  "Easy and transparent rental process",
  "Secure and encrypted payments",
];

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="about-hero">
          <img
            className="about-hero-image"
            alt="Luxurious Pakistani bridal wear with intricate gold embroidery"
            src={HERO_IMAGE}
          />
          <div className="about-hero-overlay">
            <h1>Curated Elegance for Your Most Precious Moments.</h1>
            <p>
              Pakistan&apos;s premier destination for luxury bridal and formal wear
              rentals.
            </p>
          </div>
        </div>
      </section>

      <div className="about-layout">
        <aside className="about-sidebar">
          <Card className="about-discover-card py-0 gap-0 ring-0 shadow-none">
            <CardContent className="about-discover-content">
              <CardTitle className="about-discover-title">Discover More</CardTitle>
              <nav className="about-sidebar-nav">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const className = `about-sidebar-link ${
                    link.active ? "is-active" : ""
                  }`;

                  if (link.isLink) {
                    return (
                      <Link key={link.id} to={link.href} className={className}>
                        {Icon && <Icon size={20} />}
                        <span>{link.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <Button
                      key={link.id}
                      type="button"
                      variant="ghost"
                      className={className}
                      asChild
                    >
                      <a href={link.href}>
                        {Icon && <Icon size={20} />}
                        <span>{link.label}</span>
                      </a>
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <div className="about-sidebar-image-card">
            <img
              alt="Intricate detail of Pakistani embroidery on premium fabric"
              src={SIDEBAR_IMAGE}
            />
            <div className="about-sidebar-image-overlay">
              <p>Explore Collections</p>
            </div>
          </div>
        </aside>

        <div className="about-content-grid">
          <Card
            id="our-story"
            className="about-card about-card--platform py-0 gap-0 ring-0 shadow-none"
          >
            <CardContent className="about-card-content">
              <span className="about-card-label">The Platform</span>
              <CardTitle className="about-card-title">About Relux Hub</CardTitle>
              <CardDescription className="about-card-text">
                Relux Hub is a premium online platform for renting luxury
                Pakistani bridal, formal, and party wear dresses. It connects
                customers with designers and sellers, making high-end fashion
                more accessible, affordable, and convenient.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="about-card about-card--mission py-0 gap-0 ring-0 shadow-none">
            <CardContent className="about-card-content">
              <span className="about-card-label about-card-label--light">
                Purpose
              </span>
              <CardTitle className="about-card-title about-card-title--light">
                Our Mission
              </CardTitle>
              <blockquote className="about-mission-quote">
                &ldquo;To make luxury fashion accessible by allowing users to rent
                designer outfits for weddings, events, and special occasions at
                affordable prices without compromising elegance and quality.&rdquo;
              </blockquote>
            </CardContent>
          </Card>

          <Card
            id="how-it-works"
            className="about-card about-card--offer py-0 gap-0 ring-0 shadow-none about-card--wide"
          >
            <CardContent className="about-offer-content">
              <div className="about-offer-copy">
                <span className="about-card-label">Curated Services</span>
                <CardTitle className="about-card-title">What We Offer</CardTitle>
                <ul className="about-offer-list">
                  {offerItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={20} className="about-offer-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="about-offer-image-wrap">
                <img
                  alt="Modern Pakistani festive attire, mint green dress with silver embellishments"
                  src={OFFER_IMAGE}
                />
              </div>
            </CardContent>
          </Card>

          <Card
            id="authentication"
            className="about-card about-card--why py-0 gap-0 shadow-none"
          >
            <CardContent className="about-card-content">
              <span className="about-card-label">Trust &amp; Quality</span>
              <CardTitle className="about-card-title">Why Relux Hub</CardTitle>
              <div className="about-why-list">
                {whyItems.map((item, index) => (
                  <div key={item} className="about-why-item">
                    <span className="about-why-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="about-card about-card--vision py-0 gap-0 ring-0 shadow-none">
            <CardContent className="about-card-content about-card-content--end">
              <span className="about-card-label">Future</span>
              <CardTitle className="about-card-title">Vision</CardTitle>
              <CardDescription className="about-card-text about-card-text--dark">
                Relux Hub aims to become a leading fashion rental marketplace in
                Pakistan, redefining how people experience luxury clothing for
                special occasions, fostering a sustainable and inclusive fashion
                ecosystem.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
