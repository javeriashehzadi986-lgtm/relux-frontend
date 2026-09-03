import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  RotateCcw,
  Repeat,
  ShoppingBasket,
  Tag,
  User,
  CreditCard,
  Headphones,
} from "lucide-react";
import "./help.css";

function matchesQuery(text, query) {
  return String(text || "")
    .toLowerCase()
    .includes(query);
}

const categories = [
  {
    label: "Returns",
    icon: RotateCcw,
    description:
      "Return items within the allowed time. Your payment is released or refunded after seller confirmation.",
  },
  {
    label: "Rentals",
    icon: Repeat,
    description:
      "Pay rental fee with a refundable deposit. Deposit is returned after item is returned and verified by seller.",
  },
  {
    label: "Buying",
    icon: ShoppingBasket,
    description:
      "Your payment is securely held by Relux Hub and released to the seller only after you confirm the order. If not received, refund is issued.",
  },
  {
    label: "Selling",
    icon: Tag,
    description:
      "Sell your items safely. Payment is held until buyer confirms delivery, then released to your account.",
  },
  {
    label: "Account",
    icon: User,
    description:
      "Manage your profile, orders, and account settings for a smooth experience on Relux Hub.",
  },
  {
    label: "Payments",
    icon: CreditCard,
    description:
      "All transactions are securely held in the system. Buyers get refunds and sellers are paid after confirmation.",
  },
];

const faqs = [
  {
    question: "How does the circular rental model work?",
    answer:
      "Relux Hub allows you to rent designer pieces for the number of days you choose. Each item is professionally sanitized and inspected before and after every rental to ensure the highest quality. Simply choose your dates, enjoy the item, and return it using our pre-paid sustainable packaging.",
  },
  {
    question: "What if I accidentally damage a rental item?",
    answer:
      "We include a standard Rental Coverage fee with every order that covers minor stains and wear-and-tear. For significant damage or loss, please refer to our full Terms of Service. We recommend checking items upon arrival.",
  },
  {
    question: "How do I list my items for sale or rent?",
    answer:
      "Navigate to the 'Sell' tab in the app or website. Upload high-quality photos, provide brand details, and set your price or rental daily rate. Our team reviews every listing within 24 hours to maintain the premium nature of the marketplace.",
  },
  {
    question: "What is your sustainability report?",
    answer:
      "Every year, we publish a comprehensive report on the carbon emissions saved by our community through circular fashion. You can find this in our footer. We track garment lifecycles, packaging efficiency, and logistics optimization.",
  },
];

function Help() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filteredCategories = useMemo(() => {
    if (!isSearching) return categories;
    return categories.filter(
      (item) =>
        matchesQuery(item.label, normalizedQuery) ||
        matchesQuery(item.description, normalizedQuery),
    );
  }, [isSearching, normalizedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!isSearching) return faqs;
    return faqs.filter(
      (item) =>
        matchesQuery(item.question, normalizedQuery) ||
        matchesQuery(item.answer, normalizedQuery),
    );
  }, [isSearching, normalizedQuery]);

  const noResults =
    isSearching && filteredCategories.length === 0 && filteredFaqs.length === 0;

  return (
    <div className="help-page">
      <header className="help-brand-header">
        <Link to="/home" className="help-logo">
          Relux Hub
        </Link>
      </header>

      <main className="help-main">
        <section className="help-hero">
          <div className="help-hero-gradient" />
          <h1 className="help-hero-title">How can we help?</h1>
          <div
            className={`help-search-wrap ${searchFocused ? "help-search-wrap--focused" : ""}`}
          >
            <Search className="help-search-icon" size={22} strokeWidth={1.75} />
            <Input
              className="help-search-input"
              type="search"
              placeholder="Search for questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search help articles"
            />
          </div>
        </section>

        {noResults ? (
          <section className="help-empty" aria-live="polite">
            <p className="help-empty-title">No results for “{query.trim()}”</p>
            <p className="help-empty-desc">
              Try another word, or contact support below.
            </p>
          </section>
        ) : (
          <>
            {filteredCategories.length > 0 && (
              <section className="help-categories">
                <div className="help-categories-grid">
                  {filteredCategories.map(({ label, description, icon: Icon }) => (
                    <Card
                      key={label}
                      className="help-category-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => setQuery(label)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setQuery(label);
                        }
                      }}
                    >
                      <div className="help-category-icon">
                        <Icon size={28} strokeWidth={1.75} />
                      </div>
                      <h3 className="help-category-label">{label}</h3>
                      <p className="help-category-desc">{description}</p>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {filteredFaqs.length > 0 && (
              <section className="help-faq">
                <h2 className="help-faq-title">Frequently Asked Questions</h2>
                <Accordion
                  key={isSearching ? `search-${normalizedQuery}` : "all"}
                  type="single"
                  collapsible
                  className="help-faq-accordion"
                  defaultValue={isSearching ? filteredFaqs[0]?.question : undefined}
                >
                  {filteredFaqs.map((faq) => (
                    <AccordionItem
                      key={faq.question}
                      value={faq.question}
                      className="help-faq-item"
                    >
                      <AccordionTrigger className="help-faq-trigger">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="help-faq-content">
                        <p className="help-faq-answer">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </>
        )}

        <section className="help-cta">
          <h2 className="help-cta-title">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="help-cta-desc">
            Our specialist support team is available 24/7 to help you with your
            sustainable fashion journey.
          </p>
          <Button asChild variant="default" className="help-cta-btn">
            <Link to="/contactUs">
              <Headphones size={20} strokeWidth={1.75} />
              Contact Support
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
}

export default Help;
