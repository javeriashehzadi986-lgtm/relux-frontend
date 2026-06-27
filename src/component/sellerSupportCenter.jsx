import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "./sellerSupportCenter.css";

const SELLER_ISSUE_TYPES = ["Listing", "Order", "Payment", "Other"];
const BUYER_ISSUE_TYPES = ["Order", "Rental", "Payment", "Return", "Other"];

const requests = [
  {
    id: "RH-8921",
    title: "Payment Issue",
    date: "Oct 24, 2023",
    status: "Open",
    statusVariant: "open",
    detail:
      "Deposit refund for order RLX-10294 is pending review. Our team will update you within 24 hours.",
  },
  {
    id: "RH-8810",
    title: "Listing Delay",
    date: "Oct 20, 2023",
    status: "Resolved",
    statusVariant: "resolved",
    detail:
      "Your rental return was confirmed and the remaining deposit has been refunded to your wallet.",
  },
];

const SELLER_FAQS = [
  {
    id: "add-listing",
    question: "How to add listing?",
    answer:
      'To add a listing, go to My Listings and click Add Listing. Upload clear photos, select a brand, describe the condition, and set your price.',
    link: { label: "Add a listing", to: "/addListing" },
  },
  {
    id: "bidding",
    question: "How bidding works?",
    answer:
      "Auctions start at a base price. Sellers can set a duration. The highest bidder at the end of the countdown wins the item, provided it meets any reserve price set.",
    link: { label: "View my listings", to: "/sellerProfile?section=listings" },
  },
  {
    id: "stripe",
    question: "Stripe payment issues?",
    answer:
      "Ensure your bank details are verified in the Stripe Connect dashboard. If payments are delayed, it may be due to verification requirements or hold periods for new sellers.",
    link: {
      label: "Payment settings",
      to: "/sellerProfile#seller-profile-stripe",
    },
  },
];

const BUYER_FAQS = [
  {
    id: "place-order",
    question: "How do I place a rental or resale order?",
    answer:
      "Browse products, select your preferred item, and proceed to checkout. Complete the payment process to confirm your order.",
    link: { label: "Browse categories", to: "/categories" },
  },
  {
    id: "damaged-item",
    question: "What should I do if I receive a damaged or incorrect item?",
    answer:
      "Report the issue through Support Center within 24 hours of delivery. Our team will review your request and assist with a replacement or refund.",
    link: { label: "Contact us", to: "/contactUs" },
  },
  {
    id: "track-order",
    question: "How can I track my order or rental delivery?",
    answer:
      'You can view the current status of your order in the "My Orders" section. Delivery updates are also sent through notifications.',
    link: { label: "Go to My Orders", to: "/profile?section=orders" },
  },
];

const SellerSupportCenter = ({ variant = "buyer" }) => {
  const faqs = variant === "seller" ? SELLER_FAQS : BUYER_FAQS;
  const issueTypes = variant === "seller" ? SELLER_ISSUE_TYPES : BUYER_ISSUE_TYPES;
  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubject("");
    setMessage("");
    setIssueType(issueTypes[0]);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="support-center-page">
      <Card className="support-center-form-card">
        <CardHeader className="support-center-form-header">
          <CardTitle className="support-center-section-title">
            Submit a Request
          </CardTitle>
        </CardHeader>
        <CardContent className="support-center-form-content">
          {submitted && (
            <p className="support-center-success" role="status">
              Your request has been submitted. We will respond within 24 hours.
            </p>
          )}
          <form className="support-center-form" onSubmit={handleSubmit}>
            <FieldGroup className="support-center-fields">
              <Field className="support-center-field">
                <FieldLabel htmlFor="issue-type">Issue Type</FieldLabel>
                <select
                  id="issue-type"
                  className="support-center-select"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field className="support-center-field">
                <FieldLabel htmlFor="support-subject">Subject</FieldLabel>
                <Input
                  id="support-subject"
                  type="text"
                  placeholder="Brief summary of the issue"
                  className="support-center-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </Field>
              <Field className="support-center-field">
                <FieldLabel htmlFor="support-message">Message</FieldLabel>
                <textarea
                  id="support-message"
                  rows={4}
                  placeholder="Please describe your problem in detail..."
                  className="support-center-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
            <div className="support-center-form-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="support-center-file-input"
                hidden
                onChange={() => {
                  setSubmitted(false);
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="support-center-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                Upload Image
              </Button>
              <Button type="submit" className="support-center-submit-btn">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="support-center-section">
        <h2 className="support-center-section-title">My Requests</h2>
        <div className="support-center-requests">
          {requests.map((request) => (
            <Card key={request.id} className="support-center-request-card">
              <CardContent className="support-center-request-content">
                <div className="support-center-request-top">
                  <div>
                    <p className="support-center-request-id">#{request.id}</p>
                    <h3 className="support-center-request-title">
                      {request.title}
                    </h3>
                  </div>
                  <span
                    className={`support-center-status support-center-status--${request.statusVariant}`}
                  >
                    {request.status}
                  </span>
                </div>
                {expandedRequestId === request.id && (
                  <p className="support-center-request-detail">{request.detail}</p>
                )}
                <div className="support-center-request-bottom">
                  <p className="support-center-request-date">{request.date}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="support-center-view-btn"
                    onClick={() =>
                      setExpandedRequestId((current) =>
                        current === request.id ? null : request.id,
                      )
                    }
                  >
                    {expandedRequestId === request.id ? "Hide" : "View"}
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="support-center-section">
        <h2 className="support-center-section-title">Quick FAQs</h2>
        <Accordion type="single" collapsible className="support-center-faqs">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="support-center-faq-item"
            >
              <AccordionTrigger className="support-center-faq-trigger">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="support-center-faq-content">
                <p>{faq.answer}</p>
                {faq.link && (
                  <Link to={faq.link.to} className="support-center-faq-link">
                    {faq.link.label}
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default SellerSupportCenter;
