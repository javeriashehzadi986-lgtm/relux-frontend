import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Gavel, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { applyAuctionApiData, isMongoListingId, mapApiListingToDress } from "@/data/dressCatalog";
import api from "@/services/api";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { useWishlist } from "@/hooks/useWishlist";
import { getListingAvailability } from "@/utils/productAvailability";
import RentalDressDetails from "./rentalDressDetails";
import { DressDetailsBreadcrumb } from "./dressDetailsBreadcrumb";
import { DressFitConditionSection } from "./dressFitCondition";
import { SellerReviewsSection } from "./sellerReviewsSection";
import "./dressDetails.css";

const formatCountdown = ({ hours, minutes, seconds }) =>
  `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

const DressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidError, setBidError] = useState("");
  const { isSaved, toggle: toggleWishlist } = useWishlist();
  const requireLogin = useRequireLogin();

  const handleChatWithSeller = () => {
    const chatPath = `/messages/${id}`;
    if (!requireLogin(chatPath)) return;

    navigate(chatPath, {
      state: {
        listingTitle: dress.title,
        listingImage: dress.mainImage ?? dress.image,
        productId: isMongoListingId(id) ? id : undefined,
        sellerId: dress.sellerId,
      },
    });
  };

  useEffect(() => {
    if (!isMongoListingId(id)) {
      setDress(null);
      setLoadError("This listing is no longer available.");
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError("");

    api
      .getPublicListing(id)
      .then(({ listing }) => {
        if (!cancelled) {
          setDress(mapApiListingToDress(listing));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDress(null);
          setLoadError(
            err.message?.includes("Listing not found")
              ? "This listing is not publicly available. Sign in with the buyer or seller account linked to this order to view it."
              : err.message || "Could not load this listing.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const favorited = dress ? isSaved(dress.id) : false;
  const [hasWonAuction, setHasWonAuction] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 14, minutes: 22, seconds: 8 });

  useEffect(() => {
    if (!dress) return;
    setHasWonAuction(Boolean(dress.auctionWon));
    setCountdown(dress.countdown ?? { hours: 14, minutes: 22, seconds: 8 });
  }, [dress]);

  useEffect(() => {
    if (!dress || dress.listingType !== "resale" || !isMongoListingId(id)) return undefined;

    let cancelled = false;

    api
      .getProductBids(id)
      .then((data) => {
        if (cancelled) return;
        setDress((current) => applyAuctionApiData(current, data));
        setHasWonAuction(Boolean(data.viewer?.hasWon));
        setCountdown(data.summary?.countdown ?? { hours: 0, minutes: 0, seconds: 0 });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [dress?.id, dress?.listingType, id]);

  const handleRealtimeAuctionUpdate = useCallback((updater) => {
    setDress((current) => {
      if (!current) return current;
      const next = updater(current);
      if (next?.auctionWon !== undefined) {
        setHasWonAuction(Boolean(next.auctionWon));
      }
      if (next?.countdown) {
        setCountdown(next.countdown);
      }
      return next;
    });
  }, []);

  useAuctionSocket({
    productId: id,
    enabled: Boolean(
      dress?.listingType === "resale" &&
        isMongoListingId(id) &&
        !dress?.auctionEnded,
    ),
    onUpdate: handleRealtimeAuctionUpdate,
  });

  const proceedToCheckout = () => navigate(`/dress/${id}/checkout`);

  const handlePlaceBid = async () => {
    setBidError("");

    if (!requireLogin()) return;

    const amount = Number(String(bidAmount).replace(/[^\d.]/g, ""));

    if (!amount) {
      setBidError("Enter a valid bid amount.");
      return;
    }

    if (!isMongoListingId(id)) {
      setBidError("This listing is not available for bidding.");
      return;
    }

    if (amount < dress.minimumNextBid) {
      setBidError(`Your bid must be at least ${dress.minimumNextBidFormatted}.`);
      return;
    }

    setBidSubmitting(true);
    try {
      const data = await api.placeBid({ productId: id, amount });
      setDress((current) => applyAuctionApiData(current, data));
      setHasWonAuction(Boolean(data.viewer?.hasWon));
      setCountdown(data.summary?.countdown ?? countdown);
      setBidAmount("");
    } catch (error) {
      setBidError(error.message || "Could not place bid");
    } finally {
      setBidSubmitting(false);
    }
  };

  useEffect(() => {
    if (!dress || dress.listingType !== "resale") return undefined;
    if (dress.auctionEnded) return undefined;

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        let { hours, minutes, seconds } = current;
        if (seconds > 0) seconds -= 1;
        else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [dress?.listingType, dress?.auctionEnded, dress]);

  if (loading) {
    return (
      <div className="dress-details-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>Loading dress details...</p>
      </div>
    );
  }

  if (!dress || loadError) {
    return (
      <div className="dress-details-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>
          {loadError || "This listing could not be found."}
        </p>
      </div>
    );
  }

  if (dress.listingType !== "resale") {
    return <RentalDressDetails dress={dress} />;
  }

  const availability = dress.availability ?? getListingAvailability(dress);
  const canBid = availability.canPurchase && !dress.auctionEnded;
  const gallery = dress.gallery ?? [dress.mainImage];

  return (
    <div className="dress-details-page">
      <DressDetailsBreadcrumb dress={dress} listingType="resale" />

      <div className="dress-details-hero-grid">
        <div className="dress-details-gallery">
          <div className="dress-details-main-image">
            <img alt={dress.title} src={gallery[activeImage]} />
            <span className="dress-details-condition-badge">{dress.listingCondition}</span>
            <span
              className={`dress-details-live-badge dress-details-live-badge--${availability.key} ${
                hasWonAuction ? "dress-details-live-badge--won" : ""
              }`}
            >
              {hasWonAuction ? "Auction Won" : availability.key === "sold" ? "Sold" : availability.label}
            </span>
          </div>
          <div className="dress-details-thumbs">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`dress-details-thumb ${
                  activeImage === index ? "dress-details-thumb--active" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img alt="" src={image} />
              </button>
            ))}
          </div>
        </div>

        <div className="dress-details-info">
          <section className="dress-details-header">
            <div className="dress-details-header-top">
              <div>
                <h1>{dress.title}</h1>
                <p className="dress-details-designer">by {dress.brand}</p>
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
            <div className="dress-details-meta">
              <span className="dress-details-sale-price">
                Sale Price: <strong>{dress.salePriceFormatted ?? dress.priceFormatted}</strong>
              </span>
              {dress.estimatedValueFormatted ? (
                <span className="dress-details-est-value">
                  Est. Val. <s>{dress.estimatedValueFormatted}</s>
                </span>
              ) : null}
            </div>
          </section>

          <DressFitConditionSection dress={dress} allowSizeSelect={false} />

          <section className="dress-details-auction-highlight">
            <div className="dress-details-auction-row">
              <div>
                <p className="dress-details-auction-label">
                  {hasWonAuction ? "Your Winning Bid" : "Current Highest Bid"}
                </p>
                <p className="dress-details-auction-bid">{dress.currentBidFormatted}</p>
              </div>
              {!hasWonAuction && (
                <div className="dress-details-auction-timer-wrap">
                  <p className="dress-details-auction-label dress-details-auction-label--end">
                    Ends in
                  </p>
                  <p className="dress-details-auction-timer">{formatCountdown(countdown)}</p>
                </div>
              )}
            </div>
            {hasWonAuction ? (
              <p className="dress-details-competing">
                Congratulations! You won this auction. Proceed to checkout to complete your
                purchase within 24 hours.
              </p>
            ) : (
              <>
                <p className="dress-details-min-bid">
                  Minimum Next Bid: <strong>{dress.minimumNextBidFormatted}</strong>
                </p>
                <p className="dress-details-competing">
                  <strong>{dress.bidderCount}</strong>{" "}
                  {dress.bidderCount === 1 ? "bidder has" : "bidders have"} placed offers on this
                  item
                </p>
              </>
            )}
          </section>

          <section className="dress-details-bid-form">
            {hasWonAuction ? (
              <>
                <Button
                  type="button"
                  className="dress-details-place-bid-btn"
                  onClick={proceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="dress-details-chat-btn"
                  onClick={handleChatWithSeller}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Chat with Seller
                </Button>
                <div className="dress-details-bid-stats">
                  <div>
                    <p>Winning Bid</p>
                    <span>{dress.currentBidFormatted}</span>
                  </div>
                  <div>
                    <p>Total Bids</p>
                    <span>{dress.bidderCount}</span>
                  </div>
                  <div>
                    <p>Status</p>
                    <span className="dress-details-bid-status dress-details-bid-status--won">
                      Won
                    </span>
                  </div>
                </div>
              </>
            ) : !canBid ? (
              <>
                <p className="dress-details-competing">
                  This item is {availability.label.toLowerCase()} and is not accepting new bids.
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
            ) : dress.auctionEnded ? (
              <>
                <p className="dress-details-competing">
                  This auction has ended and is no longer accepting bids.
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
              <>
                <div className="dress-details-bid-field">
                  <label htmlFor="bid-amount">Your Bid Amount</label>
                  <div className="dress-details-bid-input-wrap">
                    <span className="dress-details-bid-prefix">Rs.</span>
                    <Input
                      id="bid-amount"
                      type="number"
                      className="dress-details-bid-input"
                      placeholder={dress.minimumNextBid.toLocaleString("en-PK")}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <p className="dress-details-bid-hint">
                    Your bid must be higher than the current highest bid (
                    {dress.currentBidFormatted}).
                  </p>
                </div>

                <label className="dress-details-terms">
                  <Checkbox
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <span>
                    I agree to the Relux Hub Auction Terms and understand that placing a bid is a
                    binding commitment to purchase.
                  </span>
                </label>

                <Button
                  type="button"
                  className="dress-details-place-bid-btn"
                  disabled={!termsAccepted || bidSubmitting}
                  onClick={handlePlaceBid}
                >
                  {bidSubmitting ? "Placing Bid..." : "Place Bid"}
                </Button>

                {bidError && <p className="dress-details-bid-error">{bidError}</p>}

                <Button
                  type="button"
                  variant="outline"
                  className="dress-details-chat-btn"
                  onClick={handleChatWithSeller}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Chat with Seller
                </Button>

                <div className="dress-details-bid-stats">
                  <div>
                    <p>Your Highest</p>
                    <span>{dress.yourHighestBid ?? "—"}</span>
                  </div>
                  <div>
                    <p>Total Bids</p>
                    <span>{dress.bidderCount}</span>
                  </div>
                  <div>
                    <p>Status</p>
                    <span
                      className={`dress-details-bid-status dress-details-bid-status--${dress.bidStatus.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {dress.bidStatus}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="dress-details-rules">
            <h3>
              <Gavel size={20} aria-hidden="true" />
              Auction Rules
            </h3>
            <ul>
              {dress.auctionRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="dress-details-history">
        <div className="dress-details-history-header">
          <h2>Bid History</h2>
          <span>Latest activity for this item</span>
        </div>
        <div className="dress-details-history-table-wrap">
          <table className="dress-details-history-table">
            <thead>
              <tr>
                <th>Bidder</th>
                <th>Amount</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dress.bidHistory.length > 0 ? (
                dress.bidHistory.map((bid) => (
                  <tr
                    key={bid.id ?? `${bid.name}-${bid.timestamp}`}
                    className={bid.isWinner ? "dress-details-history-row--winner" : ""}
                  >
                    <td>
                      <div className="dress-details-bidder-cell">
                        <span
                          className={`dress-details-bidder-avatar ${
                            bid.isWinner ? "dress-details-bidder-avatar--winner" : ""
                          }`}
                        >
                          {bid.initial}
                        </span>
                        <span className="dress-details-bidder-name">{bid.name}</span>
                        {bid.isWinner && (
                          <span className="dress-details-winner-badge">Current Winner</span>
                        )}
                      </div>
                    </td>
                    <td className={bid.isWinner ? "dress-details-amount--winner" : ""}>
                      {bid.amountFormatted}
                    </td>
                    <td>{bid.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="dress-details-history-empty">
                    No bids yet. Be the first to place an offer on this dress.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {dress.bidderCount > dress.bidHistory.length && (
          <div className="dress-details-history-more">
            <button type="button">View all {dress.bidderCount} bids</button>
          </div>
        )}
      </section>

      <SellerReviewsSection
        dress={dress}
        defaultAuthor="Verified Buyer"
        reviewPlaceholder="Share your experience buying from this seller..."
      />
    </div>
  );
};

export default DressDetails;
