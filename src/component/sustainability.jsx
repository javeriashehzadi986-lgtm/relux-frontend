import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Recycle, ShoppingBag, CheckCircle } from "lucide-react";
import "./sustainability.css";

const pillars = [
  {
    icon: Recycle,
    title: "Give Clothes a Second Life",
    desc: "Extend the lifecycle of high-quality items by passing them to a new home. Our resale platform makes it effortless to monetize your pre-loved wardrobe.",
  },
  {
    icon: Leaf,
    title: "Reduce Fashion Waste",
    desc: "Break the cycle of fast fashion. Choose rentals for special occasions to minimize textile waste while maintaining a fresh, luxury look.",
  },
  {
    icon: ShoppingBag,
    title: "Smart Rental & Resale Shopping",
    desc: "Shop responsibly with intelligence. Our platform helps you make choices that are kind to both your wallet and the planet.",
  },
];

const commitments = [
  "Supporting global circular fashion initiatives",
  "Encouraging clothing reuse and authenticated resale",
  "Extending garment lifecycles through curated rentals",
  "Promoting conscious and responsible consumption",
  "Building a community of ethical fashion enthusiasts",
];

function Sustainability() {
  return (
    <div className="sustainability-page">
      {/* Brand header (design mockup — not site navbar) */}
      <header className="sustainability-header">
        <Link to="/home" className="sustainability-logo">
          Relux Hub
        </Link>
      </header>

      {/* Hero */}
      <section className="sustainability-hero">
        <div className="sustainability-container">
          <div className="sustainability-hero-grid">
            <div className="sustainability-hero-left">
              <h1 className="sustainability-hero-title">
                <span className="sustainability-hero-title-line">Sustainability at</span>
                <span className="sustainability-hero-title-line">Relux Hub</span>
              </h1>

              <p className="sustainability-hero-text">
                We promote sustainable fashion by encouraging clothing resale and
                dress rentals, helping garments stay in use longer instead of
                being discarded.
              </p>

              <div className="sustainability-hero-buttons">
                <Button variant="sustainabilityPrimary">
                  Explore Collection
                </Button>
                <Button variant="sustainabilitySecondary">
                  Start Selling
                </Button>
              </div>
            </div>

            <div className="sustainability-hero-image-wrap">
              <img
                src="/sustainability-hero.jpg"
                alt=""
                aria-hidden="true"
                className="sustainability-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="sustainability-pillars">
        <div className="sustainability-container">
          <div className="sustainability-pillars-header">
            <h2 className="sustainability-pillars-title">The Pillars of Relux Hub</h2>
            <p className="sustainability-pillars-desc">
              Luxury is no longer just about the label; it&apos;s about the legacy.
              Explore how we&apos;re transforming the wardrobe into a circular ecosystem.
            </p>
          </div>
          <div className="sustainability-pillars-grid">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="sustainability-pillar-card">
                  <div className="sustainability-pillar-icon">
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="sustainability-commitment">
        <div className="sustainability-commitment-inner">
          <h2>Our Commitment</h2>
          <p className="sustainability-commitment-desc">
            We are building more than a marketplace; we are fostering a community
            dedicated to the future of ethical fashion.
          </p>
          <ul className="sustainability-commitment-list">
            {commitments.map((item) => (
              <li key={item}>
                <CheckCircle
                  className="sustainability-check"
                  size={20}
                  strokeWidth={2}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      
      <section className="sustainability-cta">
        <div className="sustainability-cta-inner">
          <h2>Ready to Join the Sustainable Fashion Movement?</h2>
          <p className="sustainability-cta-desc">
            Discover pre-loved fashion, rent beautiful outfits, and give clothes
            a second life with Relux Hub.
          </p>
          <div className="sustainability-cta-buttons">
            <Button variant="sustainabilityPrimary">
              Explore Collection
            </Button>
            <Button variant="sustainabilityOutline">
              Start Selling Clothes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sustainability;
