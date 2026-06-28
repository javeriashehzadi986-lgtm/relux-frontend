import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  Lock,
  Sparkles,
  Star,
  Verified,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPkr } from "@/data/dressCatalog";
import { useBuyerOrders } from "@/hooks/useBuyerOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { DressDetailsBreadcrumb } from "./dressDetailsBreadcrumb";
import { DressFitConditionSection } from "./dressFitCondition";
import "./rentalDressDetails.css";

const REVIEWS = [
  {
    id: "review-1",
    quote:
      "The dress arrived in pristine condition and fit beautifully for my sister's nikkah. The rental process was seamless from booking to return.",
    author: "Sara M., Lahore",
  },
  {
    id: "review-2",
    quote:
      "Absolutely stunning craftsmanship. The security deposit was refunded promptly after inspection. Will definitely rent again for the next event.",
    author: "Hina A., Karachi",
  },
];

const toInputDate = (date) => date.toISOString().split("T")[0];

const getDefaultDates = () => {
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  return { start: toInputDate(start), end: toInputDate(end) };
};

const getRentalDays = (start, end) => {
  if (!start || !end) return 3;
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

const RentalDressDetails = ({ dress }) => {
  const navigate = useNavigate();
  const defaults = useMemo(() => getDefaultDates(), []);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(dress.listingSize ?? "M");
  const [rentStart, setRentStart] = useState(defaults.start);
  const [rentEnd, setRentEnd] = useState(defaults.end);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const { requestRental } = useBuyerOrders();
  const favorited = isSaved(dress.id);

  const gallery = dress.gallery ?? [dress.mainImage];
  const rentalDays = getRentalDays(rentStart, rentEnd);
  const rentalCharges = dress.dailyRate * rentalDays;
  const securityDeposit = dress.securityDeposit ?? dress.fullDressPrice;
  const totalPaidToday = securityDeposit;
  const estimatedRefund = Math.max(0, securityDeposit - rentalCharges);

  const scrollToSizeGuide = () => {
    document.getElementById("rental-size-guide")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRentRequest = () => {
    requestRental({
      dressId: dress.id,
      size: selectedSize,
      rentStart,
      rentEnd,
      rentalDays,
    });
    navigate("/profile?section=orders");
  };

  return (
    <div className="rental-details-page">
      <DressDetailsBreadcrumb dress={dress} listingType="rent" />

      <div className="rental-details-hero">
        <div className="rental-details-gallery">
          <div className="rental-details-main-image">
            <img alt={dress.title} src={gallery[activeImage]} />
            <span className="rental-details-condition-badge">{dress.listingCondition}</span>
            <span className="rental-details-rent-badge">Available for Rent</span>
          </div>
          <div className="rental-details-thumbs">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`rental-details-thumb ${
                  activeImage === index ? "rental-details-thumb--active" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img alt="" src={image} />
              </button>
            ))}
          </div>
        </div>

        <div className="rental-details-info">
          <div className="rental-details-brand-row">
            <span className="rental-details-brand">{dress.brand}</span>
            <span className="rental-details-verified">
              <Verified size={14} fill="currentColor" aria-hidden="true" />
              Verified Seller
            </span>
          </div>

          <h1 className="rental-details-title">{dress.title}</h1>

          <div className="rental-details-pricing">
            <p className="rental-details-daily-rate">
              {dress.dailyRateFormatted} <span>/day</span>
            </p>
            <span className="rental-details-pricing-divider" aria-hidden="true" />
            <p className="rental-details-deposit">
              Refundable Security Deposit (Full Dress Price):{" "}
              <strong>{dress.securityDepositFormatted ?? dress.fullDressPriceFormatted}</strong>
            </p>
          </div>

          <DressFitConditionSection
            dress={dress}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            allowSizeSelect
            onSizeGuideClick={scrollToSizeGuide}
          />

          <div className="rental-details-booking">
            <div className="rental-details-dates">
              <div className="rental-details-date-field">
                <label htmlFor="rent-start">Rent Start</label>
                <input
                  id="rent-start"
                  type="date"
                  value={rentStart}
                  onChange={(e) => setRentStart(e.target.value)}
                />
              </div>
              <div className="rental-details-date-field">
                <label htmlFor="rent-end">Rent End</label>
                <input
                  id="rent-end"
                  type="date"
                  value={rentEnd}
                  min={rentStart}
                  onChange={(e) => setRentEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="rental-details-summary">
              <p className="rental-details-summary-title">Payment Summary</p>
              <div className="rental-details-summary-row">
                <span>Refundable Security Deposit (Paid Today)</span>
                <span>{formatPkr(securityDeposit)}</span>
              </div>
              <div className="rental-details-summary-row rental-details-summary-row--muted">
                <span>
                  Rental Charges ({dress.dailyRateFormatted} x {rentalDays}{" "}
                  {rentalDays === 1 ? "Day" : "Days"}) — deducted after return
                </span>
                <span>{formatPkr(rentalCharges)}</span>
              </div>
              <div className="rental-details-summary-total">
                <span>Total Paid Today</span>
                <span>{formatPkr(totalPaidToday)}</span>
              </div>
              <div className="rental-details-summary-row rental-details-summary-row--refund">
                <span>Estimated Refund After Return</span>
                <span>{formatPkr(estimatedRefund)}</span>
              </div>
            </div>

            <p className="rental-details-deposit-note">
              The security deposit is paid upfront when you request a rental. After the dress is
              returned and inspected, rental charges are deducted from the deposit and the remaining
              balance is refunded to you via your original payment method or wallet.
            </p>
          </div>

          <div className="rental-details-actions">
            <Button
              type="button"
              className="rental-details-rent-btn"
              onClick={handleRentRequest}
            >
              Request for Rent
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`rental-details-wishlist-btn ${
                favorited ? "rental-details-wishlist-btn--active" : ""
              }`.trim()}
              onClick={() => toggleWishlist(dress.id)}
            >
              <Heart size={18} fill={favorited ? "currentColor" : "none"} aria-hidden="true" />
              {favorited ? "Saved to Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="rental-details-trust">
            <div className="rental-details-trust-item">
              <BadgeCheck size={22} aria-hidden="true" />
              <span>Verified</span>
            </div>
            <div className="rental-details-trust-item">
              <Lock size={22} aria-hidden="true" />
              <span>Secure</span>
            </div>
            <div className="rental-details-trust-item">
              <Sparkles size={22} aria-hidden="true" />
              <span>Quality</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rental-details-grid">
        <div className="rental-details-card">
          <h3>Dress Information</h3>
          <dl>
            <div>
              <dt>Fabric</dt>
              <dd>{dress.fabric}</dd>
            </div>
            <div>
              <dt>Occasion</dt>
              <dd>{dress.occasion}</dd>
            </div>
            <div>
              <dt>Care Instructions</dt>
              <dd>{dress.careInstructions}</dd>
            </div>
          </dl>
        </div>

        <div className="rental-details-card" id="rental-size-guide">
          <h3>Size Guide ({selectedSize})</h3>
          <div>
            {Object.entries(dress.sizeGuide).map(([label, value]) => (
              <div key={label} className="rental-details-measure-row">
                <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rental-details-card rental-details-policy-card">
          <h3>Rental Policy &amp; Instructions</h3>
          <ul className="rental-details-policy-list">
            {dress.rentalPolicy.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link to="/terms" className="rental-details-terms-link">
            Full Terms
          </Link>
        </div>
      </div>

      <section className="rental-details-seller">
        <div className="rental-details-seller-profile">
          <div className="rental-details-seller-avatar">
            <img alt={dress.sellerName} src={dress.sellerAvatar} />
          </div>
          <div>
            <div className="rental-details-seller-name-row">
              <h4 className="rental-details-seller-name">{dress.sellerName}</h4>
              <span className="rental-details-elite-badge">Elite Member</span>
            </div>
            <div className="rental-details-seller-meta">
              <span className="rental-details-seller-rating">
                <Star size={14} fill="currentColor" aria-hidden="true" />
                {dress.sellerRating.toFixed(1)}{" "}
                <span className="rental-details-deposit">
                  ({dress.sellerReviews} Reviews)
                </span>
              </span>
              <span aria-hidden="true">•</span>
              <span>Member since {dress.sellerMemberSince}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rental-details-reviews">
        <div className="rental-details-reviews-header">
          <h2>Client Experiences</h2>
          <button type="button" className="rental-details-write-review">
            Write a Review
          </button>
        </div>
        <div className="rental-details-reviews-grid">
          {REVIEWS.map((review) => (
            <article key={review.id} className="rental-details-review-card">
              <div className="rental-details-review-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="rental-details-review-quote">&ldquo;{review.quote}&rdquo;</p>
              <p className="rental-details-review-author">{review.author}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RentalDressDetails;
