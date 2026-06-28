import React, { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addSellerReport,
  addSellerReview,
  getSellerKey,
  getSellerRatingStats,
  getSellerReviews,
} from "@/data/sellerReviewsStore";
import "./rentalDressDetails.css";

const REPORT_REASONS = [
  { value: "", label: "Select a reason (optional)" },
  { value: "misleading", label: "Misleading listing" },
  { value: "condition", label: "Item not as described" },
  { value: "communication", label: "Poor communication" },
  { value: "delivery", label: "Delivery or timing issue" },
  { value: "other", label: "Other" },
];

function StarRating({ rating, size = 18, interactive = false, onChange }) {
  return (
    <div
      className={`rental-details-review-stars ${
        interactive ? "rental-details-review-stars--interactive" : ""
      }`}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Select rating" : `${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= rating;

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              className="rental-details-star-btn"
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              onClick={() => onChange(starValue)}
            >
              <Star size={size} fill={filled ? "currentColor" : "none"} />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            size={size}
            fill={filled ? "currentColor" : "none"}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export function SellerReviewsSection({
  dress,
  defaultAuthor = "Verified Buyer",
  reviewPlaceholder = "Share your experience with this seller...",
}) {
  const sellerKey = getSellerKey(dress);
  const sellerName = dress.sellerName ?? dress.seller ?? dress.brand;
  const sellerMemberSince = dress.sellerMemberSince ?? "2022";

  const [reviews, setReviews] = useState(() => getSellerReviews(sellerKey));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [submitNotice, setSubmitNotice] = useState("");

  const sellerStats = useMemo(() => getSellerRatingStats(reviews), [reviews]);

  const handleSubmitReview = (event) => {
    event.preventDefault();
    if (!reviewRating || !reviewText.trim()) return;

    const author = reviewAuthor.trim() || defaultAuthor;

    addSellerReview(sellerKey, {
      rating: reviewRating,
      quote: reviewText.trim(),
      author,
    });

    let notice = "Thank you! Your review has been submitted.";

    if (reportReason || reportDetails.trim()) {
      addSellerReport({
        sellerKey,
        dressId: dress.id,
        reason: reportReason || "other",
        details: reportDetails.trim() || "No additional details provided.",
        author,
      });
      notice = "Thank you! Your review and report have been submitted to our team.";
    }

    setReviews(getSellerReviews(sellerKey));
    setReviewRating(0);
    setReviewText("");
    setReviewAuthor("");
    setReportReason("");
    setReportDetails("");
    setSubmitNotice(notice);
    setShowReviewForm(false);
  };

  return (
    <>
      <section className="rental-details-seller">
        <div className="rental-details-seller-profile">
          <div>
            <div className="rental-details-seller-name-row">
              <h4 className="rental-details-seller-name">{sellerName}</h4>
              <span className="rental-details-elite-badge">Elite Member</span>
            </div>
            <div className="rental-details-seller-meta">
              <span className="rental-details-seller-rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {sellerStats.average.toFixed(1)}{" "}
                <span className="rental-details-deposit">
                  ({sellerStats.count} Review{sellerStats.count === 1 ? "" : "s"})
                </span>
              </span>
              <span aria-hidden="true">•</span>
              <span>Member since {sellerMemberSince}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rental-details-reviews">
        <div className="rental-details-reviews-header">
          <h2>Client Experiences</h2>
          <Button
            type="button"
            variant="ghost"
            className="rental-details-write-review"
            onClick={() => {
              setShowReviewForm((open) => !open);
              if (showReviewForm) setSubmitNotice("");
            }}
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {showReviewForm && (
          <form className="rental-details-review-form" onSubmit={handleSubmitReview}>
            <p className="rental-details-review-form-label">Rate this seller</p>
            <StarRating
              rating={reviewRating}
              size={24}
              interactive
              onChange={setReviewRating}
            />
            <label className="rental-details-review-form-label" htmlFor="review-author">
              Your name
            </label>
            <Input
              id="review-author"
              className="rental-details-review-input"
              placeholder="e.g. Ayesha K., Lahore"
              value={reviewAuthor}
              onChange={(event) => setReviewAuthor(event.target.value)}
            />
            <label className="rental-details-review-form-label" htmlFor="review-text">
              Your review
            </label>
            <textarea
              id="review-text"
              className="rental-details-review-textarea"
              placeholder={reviewPlaceholder}
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={4}
              required
            />

            <div className="rental-details-report-section">
              <p className="rental-details-review-form-label">Report an issue</p>
              <p className="rental-details-report-hint">
                Optional — tell our team if something went wrong with this seller or listing.
              </p>
              <label className="rental-details-review-form-label" htmlFor="report-reason">
                Report reason
              </label>
              <select
                id="report-reason"
                className="rental-details-report-select"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
              >
                {REPORT_REASONS.map((option) => (
                  <option key={option.value || "default"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label className="rental-details-review-form-label" htmlFor="report-details">
                Report details
              </label>
              <textarea
                id="report-details"
                className="rental-details-review-textarea"
                placeholder="Describe the issue you want to report..."
                value={reportDetails}
                onChange={(event) => setReportDetails(event.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="rental-details-review-submit"
              disabled={!reviewRating || !reviewText.trim()}
            >
              Submit Review
            </Button>
          </form>
        )}

        {submitNotice && !showReviewForm ? (
          <p className="rental-details-review-notice" role="status">
            {submitNotice}
          </p>
        ) : null}

        <div className="rental-details-reviews-grid">
          {reviews.map((review) => (
            <article key={review.id} className="rental-details-review-card">
              <StarRating rating={review.rating} />
              <p className="rental-details-review-quote">&ldquo;{review.quote}&rdquo;</p>
              <p className="rental-details-review-author">{review.author}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
