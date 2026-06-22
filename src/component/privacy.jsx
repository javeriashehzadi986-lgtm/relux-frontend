import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  UserSearch,
  Settings2,
  Wallet,
  Share2,
  Lock,
  Gavel,
  RefreshCw,
} from "lucide-react";
import "./privacy.css";

const collectItems = [
  "Name & Email",
  "Phone & Profile Info",
  "CNIC images (Identity verification)",
  "Listing & Product details",
];

const gridRowOne = [
  {
    title: "Information We Collect",
    intro: "We collect data to ensure a seamless circular fashion experience:",
    icon: UserSearch,
    type: "list",
    items: collectItems,
  },
  {
    title: "Usage & Purpose",
    text: "Your data powers account management, seller verification, rental processing, and platform improvements to serve you better.",
    icon: Settings2,
  },
  {
    title: "Security Measures",
    text: "While we use robust protection measures, users are responsible for keeping their credentials safe. Change your password periodically to stay secure.",
    icon: Lock,
  },
];

const gridRowTwo = [
  {
    title: "Seller Verification",
    text: "CNIC images are stored in a highly secure, encrypted vault and are never displayed publicly. They are strictly for trust-building within the community.",
    icon: ShieldCheck,
  },
  {
    title: "Information Sharing",
    text: "We hold a strict policy: No selling to 3rd parties. Data is only shared for core operations or legal compliance.",
    icon: Share2,
    highlightText: "No selling to 3rd parties.",
  },
  {
    title: "Your Rights",
    text: "You have the right to access, update, or request the deletion of your account. Contact our support team for any data-related inquiries.",
    icon: Gavel,
  },
];

const fullWidthCards = [
  {
    title: "Secure Payments",
    text: "All transactions are securely processed via Stripe. Relux Hub does not store your full card information; we prioritize your financial safety through industry-leading encryption.",
    icon: Wallet,
    type: "payments",
  },
  {
    title: "Policy Updates",
    text: "We periodically update this policy to reflect platform changes. Major updates will be communicated via your registered email or in-app notifications.",
    icon: RefreshCw,
    type: "updates",
  },
];

function Privacy() {
  return (
    <div className="privacy-page">
      <header className="privacy-brand-header">
        <Link to="/home" className="privacy-logo">
          Relux Hub
        </Link>
      </header>

      {/* Hero — screenshot design, no zip header */}
      <section className="privacy-hero">
        <div className="privacy-hero-inner">
          <div className="privacy-hero-left">
            <h1 className="privacy-hero-title">Privacy Policy</h1>
            <p className="privacy-hero-desc">
              At Relux Hub, your trust is the foundation of our luxury community.
              We are dedicated to protecting your personal narrative with the same
              care we give to every curated piece in our collection. This policy
              outlines how we safeguard your data in a transparent, elegant manner.
            </p>
          </div>
          <div className="privacy-hero-visual-wrap">
            <img
              src="/privacy-hero-visual.jpg"
              alt="10 tips to protect your privacy online"
              className="privacy-hero-visual"
            />
          </div>
        </div>
      </section>

      <main className="privacy-main">
        <div className="privacy-grid">
          {gridRowOne.map((card) => (
            <PrivacyCard key={card.title} {...card} />
          ))}
        </div>
        <div className="privacy-grid">
          {gridRowTwo.map((card) => (
            <PrivacyCard key={card.title} {...card} />
          ))}
        </div>
        <div className="privacy-grid privacy-grid--full">
          {fullWidthCards.map((card) => (
            <PrivacyCard key={card.title} {...card} wide />
          ))}
        </div>

        <section className="privacy-contact">
          <div className="privacy-contact-inner">
            <h2 className="privacy-contact-title">Have privacy questions?</h2>
            <p className="privacy-contact-desc">
              Our support team can help with data requests, account privacy, and
              policy questions.
            </p>
            <div className="privacy-contact-buttons">
              <Button asChild variant="default">
                <Link to="/contactUs">Contact Us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/help">View FAQ</Link>
              </Button>
            </div>
          </div>
          <div className="privacy-contact-blur privacy-contact-blur--1" />
          <div className="privacy-contact-blur privacy-contact-blur--2" />
        </section>
      </main>
    </div>
  );
}

function PrivacyCard({
  title,
  text,
  intro,
  items,
  icon: Icon,
  type,
  wide,
  highlightText,
}) {
  if (type === "payments") {
    return (
      <Card className="privacy-card privacy-card--payments privacy-card--wide">
        <div className="privacy-payments-row">
          <div className="privacy-payments-icon">
            <Icon size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="privacy-card-title">{title}</h2>
            <p className="privacy-card-text">
              All transactions are securely processed via{" "}
              <strong>Stripe</strong>. Relux Hub does not store your full card
              information; we prioritize your financial safety through
              industry-leading encryption.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (type === "updates") {
    return (
      <Card className="privacy-card privacy-card--updates privacy-card--wide">
        <div className="privacy-updates-row">
          <Icon className="privacy-updates-icon" size={24} />
          <div>
            <h3 className="privacy-card-title">{title}</h3>
            <p className="privacy-card-text">{text}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`privacy-card ${wide ? "privacy-card--wide" : ""}`}
    >
      <div className="privacy-card-icon">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <h2 className="privacy-card-title">{title}</h2>
      {intro && <p className="privacy-card-text">{intro}</p>}
      {items && (
        <ul className="privacy-card-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {text && !intro && (
        <p className="privacy-card-text">
          {highlightText ? (
            <>
              We hold a strict policy:{" "}
              <span className="privacy-highlight">{highlightText}</span> Data is
              only shared for core operations or legal compliance.
            </>
          ) : (
            text
          )}
        </p>
      )}
    </Card>
  );
}

export default Privacy;
