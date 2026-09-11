import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CalendarDays, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDressConditionLabel,
  isMongoListingId,
  mapApiListingToDress,
} from "@/data/dressCatalog";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import "./finalizePurchase.css";

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Sukkur",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Mardan",
  "Gujrat",
  "Sahiwal",
  "Okara",
  "Sheikhupura",
];

const OTHER_CITY = "__other__";
const DELIVERY_CHARGES_PKR = 300;
/** Must match Backend STRIPE_PKR_TO_CURRENCY — shown so buyers can verify Stripe USD. */
const PKR_TO_USD_RATE = 280;

const formatPkr = (amount) => `PKR ${Math.round(Number(amount) || 0).toLocaleString("en-PK")}`;
const formatUsdFromPkr = (amount) => {
  const usd = Math.max(0, Number(amount) || 0) / PKR_TO_USD_RATE;
  return `$${usd.toFixed(2)}`;
};

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
    city: "",
    customCity: "",
    specialInstructions: "",
  });
  const [cityChoice, setCityChoice] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm((current) => {
      const next = {
        ...current,
        fullName: current.fullName || user.name || "",
        email: current.email || user.email || "",
        phone: current.phone || user.phone || "",
      };

      const userCity = String(user.city || "").trim();
      if (!current.city && userCity) {
        if (CITIES.includes(userCity)) {
          next.city = userCity;
        } else {
          next.city = userCity;
          next.customCity = userCity;
        }
      }
      return next;
    });

    const userCity = String(user.city || "").trim();
    if (userCity) {
      setCityChoice((current) => {
        if (current) return current;
        return CITIES.includes(userCity) ? userCity : OTHER_CITY;
      });
    }
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
  const deliveryCharges =
    Number(order.deliveryChargesPkr) > 0
      ? Number(order.deliveryChargesPkr)
      : DELIVERY_CHARGES_PKR;
  const depositDue = Number(order.itemAmountPkr) > 0 ? Number(order.itemAmountPkr) : deposit;
  const totalAmount =
    Number(order.amountPkr) > 0
      ? Number(order.amountPkr)
      : Number(depositDue || 0) + deliveryCharges;
  const summaryImage = dress.image ?? dress.mainImage ?? dress.gallery?.[0];
  const conditionLabel = getDressConditionLabel(dress);

  const resolvedCity =
    cityChoice === OTHER_CITY
      ? form.customCity.trim()
      : (cityChoice || form.city).trim();

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setPayError("");
  };

  const handleCityChoice = (event) => {
    const value = event.target.value;
    setCityChoice(value);
    setPayError("");
    if (value === OTHER_CITY) {
      setForm((current) => ({
        ...current,
        city: current.customCity.trim() || "",
      }));
      return;
    }
    setForm((current) => ({
      ...current,
      city: value,
      customCity: "",
    }));
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.address.trim()) return "Delivery address is required";
    if (!resolvedCity) {
      return cityChoice === OTHER_CITY
        ? "Please type your city"
        : "City is required";
    }
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
        city: resolvedCity,
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
          Your rental was approved. Confirm delivery details and pay the full dress amount
          plus delivery. You can verify the same totals on Stripe before paying.
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
                  value={cityChoice}
                  onChange={handleCityChoice}
                  required
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                  <option value={OTHER_CITY}>Other — type your city</option>
                </select>
              </div>

              {cityChoice === OTHER_CITY ? (
                <div className="finalize-purchase-field">
                  <label htmlFor="rental-checkout-custom-city">Your City</label>
                  <input
                    id="rental-checkout-custom-city"
                    className="finalize-purchase-input"
                    type="text"
                    placeholder="e.g. Jhelum, Mingora, Gwadar"
                    value={form.customCity}
                    onChange={updateField("customCity")}
                    required
                  />
                </div>
              ) : null}

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
                <div className="finalize-purchase-summary-row">
                  <span>Full dress payment (refundable escrow)</span>
                  <span>{formatPkr(depositDue || deposit)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Delivery charges</span>
                  <span>{formatPkr(deliveryCharges)}</span>
                </div>
                {rentSubtotal > 0 ? (
                  <div className="finalize-purchase-summary-row finalize-purchase-summary-row--muted">
                    <span>
                      Rental charges for {rentalDays} day{rentalDays === 1 ? "" : "s"}{" "}
                      (deducted after return — not an extra charge today)
                    </span>
                    <span>{formatPkr(rentSubtotal)}</span>
                  </div>
                ) : null}
                <div className="finalize-purchase-summary-total">
                  <span>Total due today</span>
                  <span>{formatPkr(totalAmount)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Stripe will charge (USD equivalent)</span>
                  <span>{formatUsdFromPkr(totalAmount)}</span>
                </div>
              </div>
              <p className="finalize-purchase-breakdown-note">
                You pay <strong>{formatPkr(depositDue || deposit)}</strong> for the dress
                (held in escrow) plus <strong>{formatPkr(deliveryCharges)}</strong> delivery.
                Total <strong>{formatPkr(totalAmount)}</strong>
                {rentSubtotal > 0 ? (
                  <>
                    . After return, about <strong>{formatPkr(rentSubtotal)}</strong> for your
                    rental days is kept and the rest of the dress payment is refunded.
                  </>
                ) : (
                  <>.</>
                )}{" "}
                Confirm the same dress + delivery lines on the Stripe page before paying.
              </p>
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
                <strong>
                  Pay today — {formatPkr(totalAmount)} ({formatUsdFromPkr(totalAmount)})
                </strong>
                <p>
                  Full dress payment {formatPkr(depositDue || deposit)} + delivery{" "}
                  {formatPkr(deliveryCharges)}. Stripe shows the USD equivalent of these same
                  amounts. After return, rental charges for your selected days are deducted
                  from the dress payment and the rest is refunded.
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
              {paying
                ? "Redirecting to Stripe…"
                : `Pay ${formatPkr(totalAmount)} with Stripe`}
            </Button>

            <p className="finalize-purchase-legal">
              By continuing you agree to Relux Hub rental and refund policies. Verify the
              dress payment and delivery lines on Stripe match {formatPkr(depositDue || deposit)}{" "}
              + {formatPkr(deliveryCharges)}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FinalizeRentalCheckout;
