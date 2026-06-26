import React, { useState } from "react";
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

const issueTypes = ["Listing", "Order", "Payment", "Other"];

const requests = [
  {
    id: "RH-8921",
    title: "Payment Issue",
    date: "Oct 24, 2023",
    status: "Open",
    statusVariant: "open",
  },
  {
    id: "RH-8810",
    title: "Listing Delay",
    date: "Oct 20, 2023",
    status: "Resolved",
    statusVariant: "resolved",
  },
];

const SELLER_FAQS = [
  {
    id: "add-listing",
    question: "How to add listing?",
    answer:
      'To add a listing, navigate to the "Sell" tab and click the plus icon. You will be prompted to upload clear photos, select a brand, describe the condition, and set your price.',
  },
  {
    id: "bidding",
    question: "How bidding works?",
    answer:
      "Auctions start at a base price. Sellers can set a duration. The highest bidder at the end of the countdown wins the item, provided it meets any reserve price set.",
  },
  {
    id: "stripe",
    question: "Stripe payment issues?",
    answer:
      "Ensure your bank details are verified in the Stripe Connect dashboard. If payments are delayed, it may be due to verification requirements or hold periods for new sellers.",
  },
];

const BUYER_FAQS = [
  {
    id: "place-order",
    question: "How do I place a rental or resale order?",
    answer:
      "Browse products, select your preferred item, and proceed to checkout. Complete the payment process to confirm your order.",
  },
  {
    id: "damaged-item",
    question: "What should I do if I receive a damaged or incorrect item?",
    answer:
      "Report the issue through Support Center within 24 hours of delivery. Our team will review your request and assist with a replacement or refund.",
  },
  {
    id: "track-order",
    question: "How can I track my order or rental delivery?",
    answer:
      'You can view the current status of your order in the "My Orders" section. Delivery updates are also sent through notifications.',
  },
];

const SellerSupportCenter = ({ variant = "buyer" }) => {
  const faqs = variant === "seller" ? SELLER_FAQS : BUYER_FAQS;
  const [issueType, setIssueType] = useState("Listing");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubject("");
    setMessage("");
    setIssueType("Listing");
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
                />
              </Field>
            </FieldGroup>
            <div className="support-center-form-actions">
              <Button
                type="button"
                variant="outline"
                className="support-center-upload-btn"
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
                <div className="support-center-request-bottom">
                  <p className="support-center-request-date">{request.date}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="support-center-view-btn"
                  >
                    View
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
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default SellerSupportCenter;
