import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Gavel, Heart, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { getDressById } from "@/data/dressCatalog";
import RentalDressDetails from "./rentalDressDetails";
import "./dressDetails.css";

const formatCountdown = ({ hours, minutes, seconds }) =>
  `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

const DressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dress = useMemo(() => getDressById(id), [id]);
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [hasWonAuction, setHasWonAuction] = useState(Boolean(dress.auctionWon));
  const [countdown, setCountdown] = useState(dress.countdown ?? { hours: 14, minutes: 22, seconds: 8 });

  const proceedToCheckout = () => navigate(`/dress/${id}/checkout`);

  const handlePlaceBid = () => {
    setHasWonAuction(true);
    proceedToCheckout();
  };

  useEffect(() => {
    setHasWonAuction(Boolean(dress.auctionWon));
  }, [dress.id, dress.auctionWon]);

  useEffect(() => {
    if (dress.listingType !== "resale") return undefined;
    setCountdown(dress.countdown ?? { hours: 14, minutes: 22, seconds: 8 });
  }, [dress]);

  useEffect(() => {
    if (dress.listingType !== "resale") return undefined;

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
  }, [dress.listingType]);

  if (dress.listingType !== "resale") {
    return <RentalDressDetails dress={dress} />;
  }

  const gallery = dress.gallery ?? [dress.mainImage];

  return (
    <div className="dress-details-page">
      <div className="dress-details-hero-grid">
        <div className="dress-details-gallery">
          <div className="dress-details-main-image">
            <img alt={dress.title} src={gallery[activeImage]} />
            <span
              className={`dress-details-live-badge ${
                hasWonAuction ? "dress-details-live-badge--won" : ""
              }`}
            >
              {hasWonAuction ? "Auction Won" : "Live Auction"}
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
                onClick={() => setFavorited((value) => !value)}
              >
                <Heart size={20} fill={favorited ? "currentColor" : "none"} />
              </Button>
            </div>
            <div className="dress-details-meta">
              <div className="dress-details-stars" aria-label={`${dress.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
                <span>{dress.rating.toFixed(1)}</span>
              </div>
              <span className="dress-details-meta-dot" aria-hidden="true" />
              <span className="dress-details-condition-pill">{dress.conditionStatus}</span>
              <span className="dress-details-meta-dot" aria-hidden="true" />
              <span className="dress-details-est-value">
                Est. Val. <s>{dress.estimatedValueFormatted}</s>
              </span>
            </div>
          </section>

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
                  onClick={() => navigate(`/messages/${id}`)}
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
                  disabled={!termsAccepted}
                  onClick={handlePlaceBid}
                >
                  Place Bid
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="dress-details-chat-btn"
                  onClick={() => navigate(`/messages/${id}`)}
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
                    key={`${bid.name}-${bid.timestamp}`}
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
    </div>
  );
};

export default DressDetails;
