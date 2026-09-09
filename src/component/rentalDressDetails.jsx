import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  Lock,
  MessageCircle,
  Sparkles,
  Verified,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPkr, isMongoListingId } from "@/data/dressCatalog";
import { useAuth } from "@/context/AuthContext";
import { useBuyerOrders } from "@/hooks/useBuyerOrders";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useWishlist } from "@/hooks/useWishlist";
import { getListingAvailability } from "@/utils/productAvailability";
import { DressDetailsBreadcrumb } from "./dressDetailsBreadcrumb";
import { DressFitConditionSection } from "./dressFitCondition";
import { SellerReviewsSection } from "./sellerReviewsSection";
import "./dressDetails.css";
import "./rentalDressDetails.css";

const toInputDate = (date) => date.toISOString().split("T")[0];

const getRentalDays = (start, end) => {
  if (!start || !end) return 0;
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

const RentalDressDetails = ({ dress }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(dress.listingSize ?? "M");
  const [rentStart, setRentStart] = useState("");
  const [rentEnd, setRentEnd] = useState("");
  const minRentStart = useMemo(() => toInputDate(new Date()), []);
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const requireLogin = useRequireLogin();
  const { orders, requestRental, cancelOrder } = useBuyerOrders();
  const favorited = isSaved(dress.id);
  const [requestError, setRequestError] = useState("");
  const [dateError, setDateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const activeRequests = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.type === "rental" &&
          order.dressId === dress.id &&
          (order.status === "processing" || order.status === "awaiting-payment"),
      ),
    [orders, dress.id],
  );
  const activeRequest =
    activeRequests.find((order) => order.status === "awaiting-payment") ||
    activeRequests[0] ||
    null;
  const isApprovedAwaitingPay = activeRequest?.status === "awaiting-payment";

  useEffect(() => {
    if (!activeRequest) return;
    if (activeRequest.size) setSelectedSize(activeRequest.size);
    if (activeRequest.rentStart) setRentStart(activeRequest.rentStart);
    if (activeRequest.rentEnd) setRentEnd(activeRequest.rentEnd);
  }, [activeRequest]);

  const handleRentStartChange = (value) => {
    setRentStart(value);
    if (rentEnd && value && rentEnd < value) {
      setRentEnd("");
    }
    setDateError(false);
    setRequestError("");
  };

  const handleRentEndChange = (value) => {
    if (rentStart && value && value < rentStart) {
      setDateError(true);
      setRequestError("Please select an end date on or after the start date.");
      return;
    }
    setRentEnd(value);
    setDateError(false);
    setRequestError("");
  };

  const gallery = dress.gallery ?? [dress.mainImage];
  const datesSelected = Boolean(rentStart && rentEnd);
  const rentalDays = getRentalDays(rentStart, rentEnd);
  const rentalCharges = datesSelected ? dress.dailyRate * rentalDays : 0;
  const securityDeposit = dress.securityDeposit ?? dress.fullDressPrice;
  const deliveryCharges = dress.deliveryCharges ?? 300;
  const totalPaidToday = Number(securityDeposit || 0) + Number(deliveryCharges || 0);
  const estimatedRefund = datesSelected
    ? Math.max(0, Number(securityDeposit || 0) - rentalCharges)
    : Number(securityDeposit || 0);

  const availability = dress.availability ?? getListingAvailability(dress);
  const canRent = availability.canPurchase;

  const handleRentRequest = async () => {
    const returnPath = `/dress/${dress.id}`;
    if (!requireLogin(returnPath)) {
      return;
    }

    if (user?.role !== "buyer") {
      setRequestError("Only buyer accounts can request rentals.");
      return;
    }

    setRequestError("");
    setDateError(false);

    if (!rentStart || !rentEnd) {
      setDateError(true);
      setRequestError("Please select rental start and end dates before placing your order.");
      return;
    }
    if (rentEnd < rentStart) {
      setDateError(true);
      setRequestError("Please select an end date on or after the start date.");
      return;
    }

    setSubmitting(true);
    try {
      await requestRental({
        dressId: dress.id,
        size: selectedSize,
        rentStart,
        rentEnd,
        rentalDays: getRentalDays(rentStart, rentEnd),
        sellerId: dress.sellerId,
        customerName: user.name,
      });
      navigate("/profile?section=orders");
    } catch (error) {
      setRequestError(error.message || "Failed to submit rental request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    if (!requireLogin(`/dress/${dress.id}`)) return;

    try {
      await cancelOrder(activeRequest.id);
      setShowCancelModal(false);
      setRentStart("");
      setRentEnd("");
      setRequestError("");
      setDateError(false);
    } catch (error) {
      setRequestError(error.message || "Failed to cancel request");
      setShowCancelModal(false);
    }
  };

  const handleChatWithSeller = () => {
    const chatPath = `/messages/${dress.id}`;
    if (!requireLogin(chatPath)) return;

    navigate(chatPath, {
      state: {
        listingTitle: dress.title,
        listingImage: dress.mainImage ?? dress.image,
        productId: isMongoListingId(dress.id) ? dress.id : undefined,
        sellerId: dress.sellerId,
      },
    });
  };

  return (
    <div className="rental-details-page">
      <DressDetailsBreadcrumb dress={dress} listingType="rent" />

      <div className="rental-details-hero">
        <div className="rental-details-gallery">
          <div className="rental-details-main-image">
            <img alt={dress.title} src={gallery[activeImage]} />
            <span className="rental-details-condition-badge">{dress.listingCondition}</span>
            <span
              className={`rental-details-rent-badge rental-details-rent-badge--${availability.key}`}
            >
              {availability.label}
            </span>
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
          <div className="rental-details-header-top">
            <div>
              <div className="rental-details-brand-row">
                <span className="rental-details-brand">{dress.brand}</span>
                <span className="rental-details-verified">
                  <Verified size={14} fill="currentColor" aria-hidden="true" />
                  Verified Seller
                </span>
              </div>
              <h1 className="rental-details-title">{dress.title}</h1>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`dress-details-favorite ${favorited ? "dress-details-favorite--active" : ""}`}
              aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
              onClick={() => toggleWishlist(dress)}
            >
              <Heart size={20} fill={favorited ? "currentColor" : "none"} />
            </Button>
          </div>

          <div className="rental-details-pricing">
            <p className="rental-details-daily-rate">
              Rent per day:{" "}
              <strong>{dress.dailyRateFormatted ?? formatPkr(dress.dailyRate)}</strong>
            </p>
            <p className="rental-details-deposit">
              Full dress payment (refundable deposit):{" "}
              <strong>{dress.securityDepositFormatted ?? dress.fullDressPriceFormatted}</strong>
            </p>
          </div>

          <DressFitConditionSection
            dress={dress}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            allowSizeSelect
          />

          <div className="rental-details-booking">
            <div className={`rental-details-dates${dateError ? " is-invalid" : ""}`}>
              <div className="rental-details-date-field">
                <label htmlFor="rent-start">Rent Start *</label>
                <input
                  id="rent-start"
                  type="date"
                  value={rentStart}
                  min={minRentStart}
                  required
                  aria-invalid={dateError && !rentStart}
                  onChange={(e) => handleRentStartChange(e.target.value)}
                />
              </div>
              <div className="rental-details-date-field">
                <label htmlFor="rent-end">Rent End *</label>
                <input
                  id="rent-end"
                  type="date"
                  value={rentEnd}
                  min={rentStart || minRentStart}
                  required
                  aria-invalid={dateError && !rentEnd}
                  onChange={(e) => handleRentEndChange(e.target.value)}
                />
              </div>
            </div>
            {dateError && requestError ? (
              <p className="rental-details-date-error" role="alert">
                {requestError}
              </p>
            ) : null}

            <div className="rental-details-summary">
              <p className="rental-details-summary-title">Payment Summary</p>
              <div className="rental-details-summary-row">
                <span>Refundable Security Deposit</span>
                <span>{formatPkr(securityDeposit)}</span>
              </div>
              <div className="rental-details-summary-row">
                <span>Delivery charges</span>
                <span>{formatPkr(deliveryCharges)}</span>
              </div>
              <div className="rental-details-summary-row rental-details-summary-row--muted">
                <span>
                  {datesSelected
                    ? `Rental charges for ${rentalDays} ${
                        rentalDays === 1 ? "day" : "days"
                      } — deducted from your payment after return`
                    : "Rental charges — select start and end dates"}
                </span>
                <span>{datesSelected ? formatPkr(rentalCharges) : "—"}</span>
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
              After approval you pay the full dress amount as a refundable security deposit,
              plus {formatPkr(deliveryCharges)} delivery via Stripe. That deposit is held in
              escrow. After return, the rental charges for your selected days are deducted
              from the same payment and the remaining balance is refunded. Delivery is
              separate from the dress payment.
            </p>
          </div>

            <div className="rental-details-actions">
            {requestError ? (
              <p
                className={`rental-details-pending-note${
                  dateError || /date/i.test(requestError)
                    ? " rental-details-pending-note--error"
                    : ""
                }`}
                role="alert"
              >
                {requestError}
              </p>
            ) : null}
            {activeRequest ? (
              <>
                <p className="rental-details-pending-note">
                  {isApprovedAwaitingPay ? (
                    <>
                      This rental was approved (Order <strong>{activeRequest.orderId || activeRequest.id}</strong>).
                      Cancel it to request new dates, or proceed to checkout from My Orders.
                    </>
                  ) : (
                    <>
                      You have a pending rental request for this dress (Order{" "}
                      <strong>{activeRequest.orderId || activeRequest.id}</strong>).
                      Cancel it before placing a new request with different dates.
                    </>
                  )}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rental-details-cancel-btn"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Request
                </Button>
              </>
            ) : !canRent ? (
              <>
                <p className="rental-details-pending-note">
                  This dress is {availability.label.toLowerCase()} right now.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="dress-details-chat-btn"
                  onClick={handleChatWithSeller}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Chat with Seller
                </Button>
              </>
            ) : (
              <Button
                type="button"
                className="rental-details-rent-btn"
                onClick={handleRentRequest}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Request for Rent"}
                <ArrowRight size={20} aria-hidden="true" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="dress-details-chat-btn"
              onClick={handleChatWithSeller}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat with Seller
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

      <SellerReviewsSection
        dress={dress}
        defaultAuthor="Verified Renter"
        reviewPlaceholder="Share your experience renting from this seller..."
      />

      {showCancelModal && activeRequest && (
        <div
          className="rental-details-cancel-overlay"
          role="presentation"
          onClick={() => setShowCancelModal(false)}
        >
          <Card
            className="rental-details-cancel-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardContent className="rental-details-cancel-modal-body">
              <h2 id="rental-cancel-title" className="rental-details-cancel-modal-title">
                Cancel this rental request?
              </h2>
              <p className="rental-details-cancel-modal-description">
                {isApprovedAwaitingPay
                  ? "This will cancel your approved rental. You can then request the same dress again with new dates."
                  : "This will withdraw your pending rental request. You can request again anytime with new dates."}
              </p>
            </CardContent>
            <CardContent className="rental-details-cancel-modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Request
              </Button>
              <Button type="button" className="rental-details-cancel-confirm-btn" onClick={handleCancelRequest}>
                Cancel Request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RentalDressDetails;
