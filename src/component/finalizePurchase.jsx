import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ShieldCheck, Truck, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDressConditionLabel, isMongoListingId, mapApiListingToDress } from "@/data/dressCatalog";
import api from "@/services/api";
import "./finalizePurchase.css";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad"];

const formatPkr = (amount) => `PKR ${amount.toLocaleString("en-PK")}`;

const getEstimatedDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return `Expected by ${date.toLocaleDateString("en-PK", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;
};

const FinalizePurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
          setLoadError(err.message || "Could not load this listing.");
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

  const [form, setForm] = useState({
    fullName: "Ayesha Khan",
    phone: "+92 300 1234567",
    email: "ayesha@example.com",
    address: "Gulberg III, Lahore",
    city: "Lahore",
    specialInstructions: "",
  });

  if (loading) {
    return (
      <div className="finalize-purchase-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>Loading checkout...</p>
      </div>
    );
  }

  if (!dress || loadError) {
    return (
      <div className="finalize-purchase-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>
          {loadError || "This listing could not be found."}
        </p>
      </div>
    );
  }

  if (dress.listingType !== "resale") {
    return <Navigate to={`/dress/${id}`} replace />;
  }

  const deliveryCharges = dress.deliveryCharges ?? 1500;
  const winningBid = dress.currentBid ?? dress.startingBid ?? dress.salePrice ?? dress.price;
  const originalRetail =
    dress.originalRetailPrice ?? dress.estimatedValue ?? dress.salePrice ?? dress.price;
  const totalAmount = winningBid + deliveryCharges;
  const summaryImage = dress.image ?? dress.mainImage ?? dress.gallery?.[0];

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleConfirm = (event) => {
    event.preventDefault();
    navigate("/profile?section=orders");
  };

  return (
    <div className="finalize-purchase-page">
      <header className="finalize-purchase-header">
        <h1>Finalize Purchase</h1>
        <p>
          Complete your order for this curated heritage piece. Your luxury find is
          just a step away from being delivered to your doorstep.
        </p>
      </header>

      <div className="finalize-purchase-layout">
        <section className="finalize-purchase-main">
          <div className="finalize-purchase-panel">
            <div className="finalize-purchase-panel-heading">
              <span className="finalize-purchase-step">1</span>
              <h2>Shipping Information</h2>
            </div>

            <form className="finalize-purchase-form" onSubmit={handleConfirm}>
              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="checkout-full-name">Full Name</label>
                <input
                  id="checkout-full-name"
                  className="finalize-purchase-input"
                  type="text"
                  placeholder="e.g. Ayesha Khan"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="checkout-phone">Phone Number</label>
                <input
                  id="checkout-phone"
                  className="finalize-purchase-input"
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={updateField("phone")}
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="checkout-email">Email Address</label>
                <input
                  id="checkout-email"
                  className="finalize-purchase-input"
                  type="email"
                  placeholder="ayesha@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                />
              </div>

              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="checkout-address">Delivery Address</label>
                <input
                  id="checkout-address"
                  className="finalize-purchase-input"
                  type="text"
                  placeholder="Street, Apartment, Landmark"
                  value={form.address}
                  onChange={updateField("address")}
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="checkout-city">City</label>
                <select
                  id="checkout-city"
                  className="finalize-purchase-select"
                  value={form.city}
                  onChange={updateField("city")}
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="checkout-notes">Special Instructions</label>
                <textarea
                  id="checkout-notes"
                  className="finalize-purchase-textarea"
                  placeholder="Any specific notes for the courier..."
                  rows={3}
                  value={form.specialInstructions}
                  onChange={updateField("specialInstructions")}
                />
              </div>
            </form>
          </div>
        </section>

        <aside className="finalize-purchase-aside">
          <div className="finalize-purchase-summary-card">
            <div className="finalize-purchase-summary-image">
              <img alt={dress.title} src={summaryImage} />
              <span className="finalize-purchase-won-badge">AUCTION WON</span>
            </div>
            <div className="finalize-purchase-summary-body">
              <p className="finalize-purchase-summary-eyebrow">Resell Selection</p>
              <h3 className="finalize-purchase-summary-title">{dress.title}</h3>
              <p className="finalize-purchase-summary-brand">by {dress.brand}</p>

              <div className="finalize-purchase-summary-tags">
                {dress.seller && (
                  <span className="finalize-purchase-summary-tag">
                    <Verified size={14} aria-hidden="true" />
                    {dress.seller}
                  </span>
                )}
                <span className="finalize-purchase-summary-tag">
                  {getDressConditionLabel(dress)}
                </span>
              </div>

              <div className="finalize-purchase-summary-rows">
                <div className="finalize-purchase-summary-row finalize-purchase-summary-row--strike">
                  <span>Original Retail Price</span>
                  <span>{formatPkr(originalRetail)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Winning Bid Amount</span>
                  <span>{formatPkr(winningBid)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Delivery Charges</span>
                  <span>{formatPkr(deliveryCharges)}</span>
                </div>
                <div className="finalize-purchase-summary-total">
                  <span>Total Amount</span>
                  <span>{formatPkr(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="finalize-purchase-checkout-card">
            <div className="finalize-purchase-trust-grid">
              <div className="finalize-purchase-trust-item">
                <BadgeCheck size={22} fill="currentColor" aria-hidden="true" />
                <span>Authenticity Guarantee</span>
              </div>
              <div className="finalize-purchase-trust-item">
                <ShieldCheck size={22} fill="currentColor" aria-hidden="true" />
                <span>Secure Payment</span>
              </div>
            </div>

            <div className="finalize-purchase-delivery-note">
              <Truck size={20} aria-hidden="true" />
              <div>
                <strong>Estimated Delivery</strong>
                <p>{getEstimatedDelivery()}</p>
              </div>
            </div>

            <Button
              type="button"
              className="finalize-purchase-confirm-btn"
              onClick={handleConfirm}
            >
              Confirm Purchase
            </Button>

            <p className="finalize-purchase-legal">
              By clicking Confirm Purchase, you agree to Relux Hub&apos;s{" "}
              <Link to="/terms">Terms of Service</Link> and Resell Authenticity
              Policies.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FinalizePurchase;
