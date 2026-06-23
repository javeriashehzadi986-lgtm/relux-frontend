import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Tag,
  UserCheck,
  CreditCard,
  ShieldCheck,
  Package,
  Shield,
  RefreshCw,
} from "lucide-react";
import "./terms.css";

const FASHION_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMJfcVa-H0mM36qsKEsWAFPug2TuPK-XF3RuFYym9qilZh8fOckpwvvLUVzpdRQzHM3O0rkh6zAHsBDP2djAXhg48dQedOSQ0fGrqywUQVBBMFoy7V44Psj776MW7kX6JXXvqD0oGH1LMJeeIiBl5VGiUUN_YwOoIqDZK6rjs1PDgUDlmQELxuW6qUIWf_a192w_WoanIxhXckfq3UqS9HZoV6jed6Ipc6-uD_VFv-wkcI1wEUzwnBP3tfBoHMar6q-klMysFntL0";

const sections = [
  {
    title: "1. Platform Usage",
    text: "Relux Hub is a curated marketplace for clothes. Users can buy, sell, and rent pre-loved clothing items. We facilitate a circular economy and strictly prohibit any misuse of the platform, including fraudulent listings or automated bot activity.",
    icon: ShoppingBag,
    iconClass: "terms-icon--mint",
  },
  {
    title: "2. Seller Responsibilities",
    text: "As a seller, you agree to provide 100% accurate information regarding item condition, sizing, and brand. Only genuine clothing is allowed. You are legally responsible for the items you list and must ensure they match the description provided.",
    icon: Tag,
    iconClass: "terms-icon--teal",
  },
  {
    title: "3. Buyer Responsibilities",
    text: 'Buyers must read all product details before purchasing or renting. For rentals, you must respect return timelines and maintain the garment\'s condition. Fake orders or "wardrobing" (buying/renting to use once and return dishonestly) are strictly prohibited.',
    icon: UserCheck,
    iconClass: "terms-icon--mint",
  },
  {
    title: "4. Payments",
    text: "All transactions are processed securely via Stripe. Relux Hub does not store your credit card information. Seller payouts are also handled via Stripe according to our standard processing schedule after order confirmation.",
    icon: CreditCard,
    iconClass: "terms-icon--gray",
  },
  {
    title: "5. Identity Verification",
    text: "To ensure a safe marketplace, we require identity verification for all sellers. You must provide a clear photo of your CNIC (front and back) before your listings can go live. Your data is encrypted and handled according to our Privacy Policy.",
    icon: ShieldCheck,
    iconClass: "terms-icon--green",
    highlight: true,
  },
  {
    title: "6. Listings & Content",
    text: "Our platform is strictly for clothing and fashion accessories. No fake brands, inappropriate imagery, or non-apparel items are allowed. We reserve the right to remove any content that violates our community standards.",
    icon: Package,
    iconClass: "terms-icon--teal",
  },
  {
    title: "7. Account Safety",
    text: "You are responsible for maintaining the security of your account credentials. Please report any suspicious activity to our support team immediately. Relux Hub is not liable for losses resulting from shared passwords.",
    icon: Shield,
    iconClass: "terms-icon--red",
  },
  {
    title: "8. Changes to Terms",
    text: "We may update these terms periodically to reflect platform changes. While major updates will be communicated via email or app notifications, we encourage you to review this page occasionally.",
    icon: RefreshCw,
    iconClass: "terms-icon--gray",
  },
];

function Terms() {
  return (
    <div className="terms-page">
      <header className="terms-brand-header">
        <Link to="/home" className="terms-logo">
          Relux Hub
        </Link>
      </header>

      <main className="terms-main">
        <h1 className="terms-page-title">Terms of Service</h1>

        <header className="terms-header">
          <h2 className="terms-header-title">Agreement Overview</h2>
          <p className="terms-header-desc">
            These terms explain how Relux Hub works and how users can safely use
            our clothing resale and rental platform. We aim to foster a community
            of sustainable fashion enthusiasts built on trust.
          </p>
        </header>

        <div className="terms-sections">
          {sections.slice(0, 2).map((item) => (
            <TermsSectionCard key={item.title} {...item} />
          ))}

          <div className="terms-image-wrap">
            <div className="terms-image-gradient" />
            <img
              className="terms-image"
              src={FASHION_IMAGE}
              alt="Pre-loved garments on a wooden rack"
            />
          </div>

          {sections.slice(2).map((item) => (
            <TermsSectionCard key={item.title} {...item} />
          ))}
        </div>

        <div className="terms-cta">
          <h4 className="terms-cta-title">Have questions about these terms?</h4>
          <p className="terms-cta-desc">
            Our legal and support teams are here to help you understand your
            rights and responsibilities.
          </p>
          <div className="terms-cta-buttons">
            <Button asChild variant="default">
              <Link to="/contactUs">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/help">View FAQ</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function TermsSectionCard({ title, text, icon: Icon, iconClass, highlight }) {
  return (
    <Card className={`terms-card ${highlight ? "terms-card--highlight" : ""}`}>
      <div className="terms-card-row">
        <div className={`terms-icon ${iconClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="terms-card-title">{title}</h3>
          <p className="terms-card-text">{text}</p>
        </div>
      </div>
    </Card>
  );
}

export default Terms;
