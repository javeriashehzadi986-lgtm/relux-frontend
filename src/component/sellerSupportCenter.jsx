import React, { useEffect, useRef, useState } from "react";
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
import api from "@/services/api";
import { uploadSupportImage } from "@/utils/imageUpload";
import "./sellerSupportCenter.css";

const SELLER_ISSUE_TYPES = ["Listing", "Order", "Payment", "Other"];
const BUYER_ISSUE_TYPES = ["Order", "Rental", "Payment", "Return", "Other"];
const BUYER_ORDER_ISSUE_TYPES = new Set(["Order", "Rental", "Return"]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function formatOrderOption(order) {
  const shortId = String(order.id || "").slice(-6).toUpperCase();
  const product = order.productTitle || "Product";
  const seller = order.sellerName || "Seller";
  const type = order.typeLabel || order.type || "Order";
  return `${product} · ${seller} · #${shortId} (${type})`;
}

const SELLER_FAQS = [
  {
    id: "add-listing",
    question: "How to add listing?",
    answer:
      "To add a listing, go to My Listings and click Add Listing. Upload clear photos, select a brand, describe the condition, and set your price.",
    link: { label: "Add a listing", to: "/addListing" },
  },
  {
    id: "dispute",
    question: "What if a buyer opens a dispute?",
    answer:
      "If admin asks for your response, it appears under My Requests. Open it, write your side of the story, and submit. Admin will then decide.",
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
      "Open Support Center, choose Order/Rental/Return, select the related order, and describe the issue. Admin will contact the seller and resolve the dispute.",
  },
];

const SellerSupportCenter = ({ variant = "buyer" }) => {
  const faqs = variant === "seller" ? SELLER_FAQS : BUYER_FAQS;
  const issueTypes = variant === "seller" ? SELLER_ISSUE_TYPES : BUYER_ISSUE_TYPES;
  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [listError, setListError] = useState("");
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [sellerReplyDrafts, setSellerReplyDrafts] = useState({});
  const [sellerReplyLoadingId, setSellerReplyLoadingId] = useState("");
  const [sellerReplyError, setSellerReplyError] = useState("");
  const fileInputRef = useRef(null);

  const showOrderPicker =
    variant === "buyer" && BUYER_ORDER_ISSUE_TYPES.has(issueType);

  const selectedOrder = orders.find((order) => order.id === orderId) || null;

  const loadReports = async () => {
    setLoadingRequests(true);
    setListError("");
    try {
      const data = await api.getMyReports();
      setRequests(data.reports || []);
    } catch (error) {
      setListError(error.message || "Could not load your requests");
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      await loadReports();
      if (variant === "buyer") {
        try {
          const data = await api.getMyBuyerOrders();
          if (!cancelled) setOrders(data.orders || []);
        } catch {
          if (!cancelled) setOrders([]);
        }
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [variant]);

  useEffect(() => {
    if (!showOrderPicker) setOrderId("");
  }, [showOrderPicker]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim() || submitting) return;

    if (showOrderPicker && !orderId) {
      setSubmitError("Select the related order so admin can contact the seller.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    try {
      const images = [];
      if (imageFile) {
        if (imageFile.size > MAX_IMAGE_BYTES) {
          throw new Error("Image must be under 4MB");
        }
        images.push(await uploadSupportImage(imageFile));
      }

      const payload = {
        issueType,
        subject: subject.trim(),
        message: message.trim(),
        images,
      };
      if (showOrderPicker && orderId) {
        payload.orderId = orderId;
      }

      const data = await api.createReport(payload);

      if (data.report) {
        setRequests((current) => [data.report, ...current]);
      }

      setSubject("");
      setMessage("");
      setIssueType(issueTypes[0]);
      setOrderId("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSubmitted(true);
      window.setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setSubmitError(error.message || "Could not submit your request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSellerResponse = async (request) => {
    const draft = sellerReplyDrafts[request.mongoId]?.trim() || "";
    if (!draft) {
      setSellerReplyError("Write your response before submitting.");
      return;
    }

    setSellerReplyLoadingId(request.mongoId);
    setSellerReplyError("");
    try {
      const data = await api.submitSellerDisputeResponse(request.mongoId, {
        response: draft,
      });
      setRequests((current) =>
        current.map((item) =>
          item.mongoId === request.mongoId ? data.report : item,
        ),
      );
      setSellerReplyDrafts((current) => {
        const next = { ...current };
        delete next[request.mongoId];
        return next;
      });
    } catch (error) {
      setSellerReplyError(error.message || "Could not send your response");
    } finally {
      setSellerReplyLoadingId("");
    }
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
              {showOrderPicker
                ? "Dispute submitted. Admin can now contact the seller."
                : "Your request has been submitted. We will respond within 24 hours."}
            </p>
          )}
          {submitError && (
            <p className="support-center-error" role="alert">
              {submitError}
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
                  disabled={submitting}
                >
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              {showOrderPicker && (
                <Field className="support-center-field">
                  <FieldLabel htmlFor="support-order">
                    Link Product &amp; Seller (select order)
                  </FieldLabel>
                  <select
                    id="support-order"
                    className="support-center-select"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    disabled={submitting}
                    required
                  >
                    <option value="">Select order to link product &amp; seller…</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {formatOrderOption(order)}
                      </option>
                    ))}
                  </select>
                  {orders.length === 0 && (
                    <p className="support-center-field-hint">
                      Abhi koi order nahi. Pehle product rent/buy karo, phir yahan
                      se dispute open kar sakte ho.
                    </p>
                  )}
                  {selectedOrder && (
                    <div className="support-center-link-preview">
                      <p>
                        <strong>Linked product:</strong>{" "}
                        {selectedOrder.productTitle || "Unknown product"}
                      </p>
                      <p>
                        <strong>Linked seller:</strong>{" "}
                        {selectedOrder.sellerName || "Unknown seller"}
                      </p>
                    </div>
                  )}
                </Field>
              )}

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
                  disabled={submitting}
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
                  disabled={submitting}
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
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  setSubmitted(false);
                  setSubmitError("");
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="support-center-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
              >
                <Upload size={18} />
                {imageFile ? imageFile.name : "Upload Image"}
              </Button>
              <Button
                type="submit"
                className="support-center-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="support-center-section">
        <h2 className="support-center-section-title">My Requests</h2>
        {listError && (
          <p className="support-center-error" role="alert">
            {listError}
          </p>
        )}
        {sellerReplyError && (
          <p className="support-center-error" role="alert">
            {sellerReplyError}
          </p>
        )}
        {loadingRequests ? (
          <p className="support-center-empty">Loading your requests...</p>
        ) : requests.length === 0 ? (
          <p className="support-center-empty">
            No support requests yet. Submit one above and it will appear here.
          </p>
        ) : (
          <div className="support-center-requests">
            {requests.map((request) => {
              const key = request.mongoId || request.id;
              const expanded = expandedRequestId === key;

              return (
                <Card key={key} className="support-center-request-card">
                  <CardContent className="support-center-request-content">
                    <div className="support-center-request-top">
                      <div>
                        <p className="support-center-request-id">
                          #{request.id}
                          {request.isDispute ? " · Dispute" : ""}
                          {request.needsSellerResponse ? " · Action needed" : ""}
                        </p>
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

                    {expanded && (
                      <div className="support-center-request-expanded">
                        <p className="support-center-request-detail">
                          {request.detail}
                        </p>

                        {request.needsSellerResponse && (
                          <div className="support-center-seller-reply">
                            <p className="support-center-seller-reply-label">
                              Admin asked for your response
                            </p>
                            <textarea
                              rows={3}
                              className="support-center-textarea"
                              placeholder="Explain your side of the story..."
                              value={sellerReplyDrafts[request.mongoId] || ""}
                              onChange={(e) =>
                                setSellerReplyDrafts((current) => ({
                                  ...current,
                                  [request.mongoId]: e.target.value,
                                }))
                              }
                              disabled={sellerReplyLoadingId === request.mongoId}
                            />
                            <Button
                              type="button"
                              className="support-center-submit-btn"
                              onClick={() => handleSellerResponse(request)}
                              disabled={sellerReplyLoadingId === request.mongoId}
                            >
                              {sellerReplyLoadingId === request.mongoId
                                ? "Sending..."
                                : "Send Response to Admin"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="support-center-request-bottom">
                      <p className="support-center-request-date">{request.date}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        className="support-center-view-btn"
                        onClick={() =>
                          setExpandedRequestId((current) =>
                            current === key ? null : key,
                          )
                        }
                      >
                        {expanded ? "Hide" : "View"}
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
