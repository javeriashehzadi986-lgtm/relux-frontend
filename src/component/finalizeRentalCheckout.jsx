import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BadgeCheck, CalendarDays, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDressConditionLabel,
  isMongoListingId,
  mapApiListingToDress,
} from "@/data/dressCatalog";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import "./finalizePurchase.css";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad"];

const formatPkr = (amount) => `PKR ${Math.round(amount).toLocaleString("en-PK")}`;

const formatRentalPeriod = (start, end) => {
  if (!start || !end) return "Dates to be confirmed";
  const format = (iso) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("en-PK", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  return `${format(start)} – ${format(end)}`;
};

const FinalizeRentalCheckout = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Lahore",
    specialInstructions: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function loadCheckout() {
      setLoading(true);
      setLoadError("");

      try {
        const { order: buyerOrder } = await api.getBuyerOrder(orderId);
        if (cancelled) return;

        if (buyerOrder.type !== "rental") {
          setLoadError("This checkout is only for rental orders.");
          setOrder(null);
          setDress(null);
          return;
        }

        if (buyerOrder.status !== "awaiting-payment") {
          setLoadError("This rental is not ready for checkout yet.");
          setOrder(buyerOrder);
          setDress(null);
          return;
        }

        if (buyerOrder.paymentStatus === "paid") {
          setLoadError("This rental has already been paid.");
          setOrder(buyerOrder);
          setDress(null);
          return;
        }

        setOrder(buyerOrder);

        if (!isMongoListingId(buyerOrder.dressId)) {
          setLoadError("Listing not found for this order.");
          return;
        }

        const { listing } = await api.getPublicListing(buyerOrder.dressId);
        if (!cancelled) {
          setDress(mapApiListingToDress(listing));
        }
      } catch (err) {
        if (!cancelled) {
          setOrder(null);
          setDress(null);
          setLoadError(err.message || "Could not load checkout.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCheckout();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="finalize-purchase-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>Loading checkout...</p>
      </div>
    );
  }

  if (!order || !dress || loadError) {
    return (
      <div className="finalize-purchase-page">
        <p style={{ padding: "2rem", textAlign: "center" }}>
          {loadError || "This rental checkout could not be loaded."}
        </p>
        <p style={{ textAlign: "center" }}>
          <Button asChild variant="outline">
            <Link to="/profile?section=orders">Back to My Orders</Link>
          </Button>
        </p>
      </div>
    );
  }

  const deposit = dress.fullDressPrice ?? dress.securityDeposit ?? dress.itemPrice ?? 0;
  const dailyRate = dress.dailyRate ?? dress.rentPrice ?? 0;
  const rentalDays = order.rentalDays || 1;
  const rentSubtotal = dailyRate * rentalDays;
  const totalAmount = order.amountPkr > 0 ? order.amountPkr : deposit || rentSubtotal;
  const summaryImage = dress.image ?? dress.mainImage ?? dress.gallery?.[0];
  const conditionLabel = getDressConditionLabel(dress);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setPayError("");
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.address.trim()) return "Delivery address is required";
    if (!form.city.trim()) return "City is required";
    return "";
  };

  const handlePayWithStripe = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setPayError(validationError);
      return;
    }

    setPaying(true);
    setPayError("");
    try {
      const data = await api.createRentalCheckout({
        orderId: order.id,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        specialInstructions: form.specialInstructions.trim(),
      });

      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setPayError("Stripe checkout URL was not returned.");
      setPaying(false);
    } catch (err) {
      setPayError(err.message || "Could not start Stripe checkout.");
      setPaying(false);
    }
  };

  if (dress.listingType !== "rent") {
    return <Navigate to={`/dress/${dress.id}`} replace />;
  }

  return (
    <div className="finalize-purchase-page">
      <header className="finalize-purchase-header">
        <h1>Finalize Rental</h1>
        <p>
          Your rental request was approved. Confirm delivery details and pay the security
          deposit securely via Stripe.
        </p>
      </header>

      <div className="finalize-purchase-layout">
        <section className="finalize-purchase-main">
          <div className="finalize-purchase-panel">
            <div className="finalize-purchase-panel-heading">
              <span className="finalize-purchase-step">1</span>
              <h2>Delivery Information</h2>
            </div>

            <form className="finalize-purchase-form" onSubmit={handlePayWithStripe}>
              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="rental-checkout-full-name">Full Name</label>
                <input
                  id="rental-checkout-full-name"
                  className="finalize-purchase-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  required
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="rental-checkout-phone">Phone Number</label>
                <input
                  id="rental-checkout-phone"
                  className="finalize-purchase-input"
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={updateField("phone")}
                  required
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="rental-checkout-email">Email Address</label>
                <input
                  id="rental-checkout-email"
                  className="finalize-purchase-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
              </div>

              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="rental-checkout-address">Delivery Address</label>
                <input
                  id="rental-checkout-address"
                  className="finalize-purchase-input"
                  type="text"
                  placeholder="Street, apartment, landmark"
                  value={form.address}
                  onChange={updateField("address")}
                  required
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="rental-checkout-city">City</label>
                <select
                  id="rental-checkout-city"
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
                <label htmlFor="rental-checkout-notes">Special Instructions</label>
                <textarea
                  id="rental-checkout-notes"
                  className="finalize-purchase-textarea"
                  placeholder="Notes for delivery or pickup..."
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
              {summaryImage ? <img alt={dress.title} src={summaryImage} /> : null}
              <span className="finalize-purchase-won-badge">RENTAL APPROVED</span>
            </div>
            <div className="finalize-purchase-summary-body">
              <p className="finalize-purchase-summary-eyebrow">Approved Rental</p>
              <h3 className="finalize-purchase-summary-title">{dress.title}</h3>
              <p className="finalize-purchase-summary-brand">by {dress.brand}</p>

              <div className="finalize-purchase-summary-tags">
                <span className="finalize-purchase-summary-tag">Size {order.size || "M"}</span>
                <span className="finalize-purchase-summary-tag">{conditionLabel}</span>
              </div>

              <div className="finalize-purchase-summary-rows">
                <div className="finalize-purchase-summary-row">
                  <span>Rental period</span>
                  <span>{formatRentalPeriod(order.rentStart, order.rentEnd)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Duration</span>
                  <span>{rentalDays} day{rentalDays === 1 ? "" : "s"}</span>
                </div>
                {dailyRate > 0 ? (
                  <div className="finalize-purchase-summary-row">
                    <span>Rent ({formatPkr(dailyRate)}/day)</span>
                    <span>{formatPkr(rentSubtotal)}</span>
                  </div>
                ) : null}
                <div className="finalize-purchase-summary-row">
                  <span>Security deposit (due now)</span>
                  <span>{formatPkr(deposit || totalAmount)}</span>
                </div>
                <div className="finalize-purchase-summary-total">
                  <span>Due today</span>
                  <span>{formatPkr(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="finalize-purchase-checkout-card">
            <div className="finalize-purchase-trust-grid">
              <div className="finalize-purchase-trust-item">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Secure Stripe payment</span>
              </div>
              <div className="finalize-purchase-trust-item">
                <Truck size={18} aria-hidden="true" />
                <span>Delivery after payment</span>
              </div>
            </div>

            <div className="finalize-purchase-delivery-note">
              <CalendarDays size={18} aria-hidden="true" />
              <div>
                <strong>Rental approved</strong>
                <p>
                  Pay the security deposit to activate your rental. The deposit is refunded
                  after the item is returned in good condition.
                </p>
              </div>
            </div>

            {payError ? (
              <p className="finalize-purchase-legal" role="alert" style={{ color: "#b42318" }}>
                {payError}
              </p>
            ) : null}

            <Button
              type="button"
              className="finalize-purchase-confirm-btn"
              disabled={paying}
              onClick={handlePayWithStripe}
            >
              {paying ? "Redirecting to Stripe…" : "Pay with Stripe"}
            </Button>

            <p className="finalize-purchase-legal">
              By continuing you agree to Relux Hub rental and refund policies. Amounts are
              shown in PKR; Stripe may display a converted total at checkout.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FinalizeRentalCheckout;
