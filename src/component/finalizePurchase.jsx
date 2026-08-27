import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BadgeCheck, ShieldCheck, Truck, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDressConditionLabel, isMongoListingId, mapApiListingToDress } from "@/data/dressCatalog";
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
  const { user } = useAuth();
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
      .getSaleCheckoutListing(id)
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
      const data = await api.createSaleCheckout({
        productId: id,
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

  return (
    <div className="finalize-purchase-page">
      <header className="finalize-purchase-header">
        <h1>Finalize Purchase</h1>
        <p>
          Complete your order for this curated heritage piece. Secure payment is handled by
          Stripe.
        </p>
      </header>

      <div className="finalize-purchase-layout">
        <section className="finalize-purchase-main">
          <div className="finalize-purchase-panel">
            <div className="finalize-purchase-panel-heading">
              <span className="finalize-purchase-step">1</span>
              <h2>Shipping Information</h2>
            </div>

            <form className="finalize-purchase-form" onSubmit={handlePayWithStripe}>
              <div className="finalize-purchase-field finalize-purchase-field--full">
                <label htmlFor="checkout-full-name">Full Name</label>
                <input
                  id="checkout-full-name"
                  className="finalize-purchase-input"
                  type="text"
                  placeholder="e.g. Ayesha Khan"
                  value={form.fullName}
                  onChange={updateField("fullName")}
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>

              <div className="finalize-purchase-field">
                <label htmlFor="checkout-city">City</label>
                <select
                  id="checkout-city"
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
                  <label htmlFor="checkout-custom-city">Your City</label>
                  <input
                    id="checkout-custom-city"
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
                  <span>Your winning bid</span>
                  <span>{formatPkr(winningBid)}</span>
                </div>
                <div className="finalize-purchase-summary-row">
                  <span>Delivery charges (Pakistan)</span>
                  <span>{formatPkr(deliveryCharges)}</span>
                </div>
                <div className="finalize-purchase-summary-total">
                  <span>Total to pay</span>
                  <span>{formatPkr(totalAmount)}</span>
                </div>
              </div>
              <p className="finalize-purchase-breakdown-note">
                You pay <strong>{formatPkr(winningBid)}</strong> for the item (your winning bid)
                plus <strong>{formatPkr(deliveryCharges)}</strong> delivery.
                Stripe will show both lines before you confirm.
              </p>
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

            {payError ? (
              <p style={{ color: "#b42318", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                {payError}
              </p>
            ) : null}

            <Button
              type="button"
              className="finalize-purchase-confirm-btn"
              onClick={handlePayWithStripe}
              disabled={paying}
            >
              {paying
                ? "Redirecting to Stripe…"
                : `Pay ${formatPkr(totalAmount)} with Stripe`}
            </Button>

            <p className="finalize-purchase-legal">
              By paying, you agree to Relux Hub&apos;s{" "}
              <Link to="/terms">Terms of Service</Link> and Resell Authenticity
              Policies. Total includes your winning bid and delivery.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FinalizePurchase;
