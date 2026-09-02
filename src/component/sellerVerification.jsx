import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  IdCard,
  CloudUpload,
  Info,
  Wallet,
  ShieldCheck,
  Check,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSellerSignupState } from "@/utils/authRedirect";
import api from "@/services/api";
import { uploadVerificationImage } from "@/utils/imageUpload";
import "./sellerVerification.css";

const verificationSteps = [
  "Identity verification is mandatory before you can create your first listing.",
  "Our team typically reviews and approves applications within 24 to 48 business hours.",
  "You will receive an email and a push notification as soon as your account is approved.",
];

function FileUploadZone({ id, label, file, onFileChange, error }) {
  return (
    <div className="seller-upload-field">
      <Label htmlFor={id} className="seller-field-label">
        {label}
      </Label>
      <div
        className={`seller-upload-zone ${
          file ? "seller-upload-zone--selected" : ""
        }`}
      >
        <CloudUpload className="seller-upload-icon" size={40} strokeWidth={1.5} />
        <p className="seller-upload-text">
          {file ? `Selected: ${file.name}` : "Click to upload or drag & drop"}
        </p>
        <p className="seller-upload-hint">JPG, PNG up to 5MB</p>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="seller-upload-input"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </div>
      {error ? <p className="seller-field-error">{error}</p> : null}
    </div>
  );
}

function SellerVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, isAuthenticated, isSeller, isAdmin, submitSellerVerification, logout } =
    useAuth();
  const isUpdateMode = location.state?.updateDocuments === true;

  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cnicFrontError, setCnicFrontError] = useState("");
  const [cnicBackError, setCnicBackError] = useState("");
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeError, setStripeError] = useState("");

  useEffect(() => {
    if (user?.role !== "seller") return undefined;
    let cancelled = false;
    api
      .getSellerStripeStatus()
      .then((data) => {
        if (!cancelled) setStripeConnected(Boolean(data.stripeConnected));
      })
      .catch(() => {
        if (!cancelled) setStripeConnected(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  const handleConnectStripe = async () => {
    setStripeError("");
    setStripeConnecting(true);
    try {
      const data = await api.createSellerStripeConnect();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setStripeError("Stripe Connect URL was not returned.");
    } catch (err) {
      setStripeError(err.message || "Could not start Stripe Connect");
    } finally {
      setStripeConnecting(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (isUpdateMode) {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: "/sellerVerification" }, replace: true });
        return;
      }
      if (!isSeller) {
        navigate("/home", { replace: true });
      }
      return;
    }

    if (!isAuthenticated) {
      navigate("/signup", { state: getSellerSignupState(), replace: true });
      return;
    }

    if (isAdmin) {
      return;
    }

    if (user?.role === "seller") {
      if (user.status === "active") {
        navigate("/sellerProfile", { replace: true });
      } else if (user.status === "pending") {
        navigate("/seller-pending", { replace: true });
      }
    }
  }, [loading, isUpdateMode, isAuthenticated, isSeller, isAdmin, user, navigate]);

  const validateFiles = () => {
    let valid = true;
    if (!cnicFront) {
      setCnicFrontError("CNIC front image is required");
      valid = false;
    } else {
      setCnicFrontError("");
    }
    if (!cnicBack) {
      setCnicBackError("CNIC back image is required");
      valid = false;
    } else {
      setCnicBackError("");
    }
    return valid;
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validateFiles()) return;

    setSubmitting(true);
    try {
      const [cnicFrontData, cnicBackData] = await Promise.all([
        uploadVerificationImage(cnicFront),
        uploadVerificationImage(cnicBack),
      ]);

      await api.updateSellerDocuments({
        cnicFront: cnicFrontData,
        cnicBack: cnicBackData,
      });

      navigate("/seller-pending", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Failed to update documents");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplySubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validateFiles()) return;

    const formData = new FormData(event.currentTarget);
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const city = formData.get("city")?.toString().trim() ?? "";
    const returnContactName = formData.get("returnContactName")?.toString().trim() ?? "";
    const returnPhone = formData.get("returnPhone")?.toString().trim() ?? "";
    const returnCity = formData.get("returnCity")?.toString().trim() ?? "";
    const returnAddress = formData.get("returnAddress")?.toString().trim() ?? "";

    if (!phone || !city) {
      setSubmitError("Phone and city are required");
      return;
    }

    if (!returnContactName || !returnPhone || !returnCity || !returnAddress) {
      setSubmitError("Return contact name, phone, city, and address are required");
      return;
    }

    setSubmitting(true);
    try {
      const [cnicFrontData, cnicBackData] = await Promise.all([
        uploadVerificationImage(cnicFront),
        uploadVerificationImage(cnicBack),
      ]);

      if (isAuthenticated && user?.role === "buyer") {
        await submitSellerVerification({
          phone,
          city,
          returnContactName,
          returnPhone,
          returnCity,
          returnAddress,
          cnicFront: cnicFrontData,
          cnicBack: cnicBackData,
        });
      } else if (isAuthenticated && user?.role === "seller" && user?.status === "rejected") {
        await submitSellerVerification({
          phone,
          city,
          returnContactName,
          returnPhone,
          returnCity,
          returnAddress,
          cnicFront: cnicFrontData,
          cnicBack: cnicBackData,
        });
      } else {
        setSubmitError("You must create an account and log in before applying as a seller.");
        setSubmitting(false);
        return;
      }

      navigate("/seller-pending", { replace: true });
    } catch (error) {
      setSubmitError(error.message || "Verification submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (isUpdateMode && !isSeller) || !isAuthenticated) {
    return (
      <div className="seller-verification-page">
        <main className="seller-main">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="seller-verification-page">
        <main className="seller-main">
          <div className="seller-intro">
            <h1 className="seller-title">Become a Verified Seller</h1>
            <div className="seller-auth-notice seller-auth-notice--buyer">
              <p>
                You are logged in as <strong>admin</strong> ({user?.email}). Admin
                accounts cannot apply as sellers.
              </p>
              <p>
                To open the seller verification form, log out first, then click
                Become a Seller again (or use a buyer account).
              </p>
            </div>
            <div className="seller-submit-wrap" style={{ marginTop: "1.5rem" }}>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/profile">Back to Admin</Link>
              </Button>
              <Button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/signup", { state: getSellerSignupState(), replace: true });
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const identityCard = (
    <Card className="seller-card">
      <div className="seller-card-heading">
        <span className="seller-card-icon">
          <IdCard size={22} strokeWidth={1.75} />
        </span>
        <h2 className="seller-card-title">Identity Verification</h2>
      </div>
      <div className="seller-upload-grid">
        <FileUploadZone
          id="cnic-front"
          label="Upload CNIC Front Side"
          file={cnicFront}
          onFileChange={setCnicFront}
          error={cnicFrontError}
        />
        <FileUploadZone
          id="cnic-back"
          label="Upload CNIC Back Side"
          file={cnicBack}
          onFileChange={setCnicBack}
          error={cnicBackError}
        />
      </div>
      <div className="seller-info-banner">
        <Info size={20} strokeWidth={1.75} />
        <p>
          Your CNIC images are used only for seller verification and are not
          publicly displayed.
        </p>
      </div>
    </Card>
  );

  if (isUpdateMode) {
    return (
      <div className="seller-verification-page">
        <main className="seller-main">
          <div className="seller-intro">
            <h1 className="seller-title">Update Identity Documents</h1>
            <p className="seller-desc">
              Upload new CNIC front and back images. Our team will review your
              updated documents within 24 to 48 business hours.
            </p>
          </div>

          <form className="seller-form" onSubmit={handleUpdateSubmit}>
            {identityCard}
            {submitError ? <p className="seller-field-error">{submitError}</p> : null}

            <div className="seller-submit-wrap">
              <Button
                type="submit"
                variant="default"
                className="seller-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Updated Documents"}
                <Send size={18} strokeWidth={1.75} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="seller-back-link"
                asChild
              >
                <Link to={user?.status === "rejected" ? "/seller-rejected" : "/seller-pending"}>
                  Back to Application Status
                </Link>
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  const isLoggedInBuyer = isAuthenticated && user?.role === "buyer";
  const isLoggedInRejectedSeller =
    isAuthenticated && user?.role === "seller" && user?.status === "rejected";

  return (
    <div className="seller-verification-page">
      <main className="seller-main">
        <div className="seller-intro">
          <h1 className="seller-title">
            {isLoggedInRejectedSeller ? "Re-apply as Seller" : "Become a Verified Seller"}
          </h1>
          <p className="seller-desc">
            {isLoggedInRejectedSeller
              ? "Update your details and CNIC documents below to submit a new seller application."
              : "Complete your information below to start selling and renting clothes on Relux Hub. Join our community of conscious fashion enthusiasts."}
          </p>
          {isLoggedInRejectedSeller ? (
            <div className="seller-auth-notice seller-auth-notice--rejected">
              <p>
                Your previous application was not approved. Please review your information and
                upload clear CNIC images before submitting again.
              </p>
              <p>
                <Link to="/seller-rejected">View rejection details</Link>
              </p>
            </div>
          ) : isLoggedInBuyer ? (
            <div className="seller-auth-notice seller-auth-notice--buyer">
              <p>
                You are logged in as buyer <strong>{user.email}</strong>. Complete phone, city,
                return address, and CNIC below to apply as a seller.
              </p>
            </div>
          ) : null}
        </div>

        <form className="seller-form" onSubmit={handleApplySubmit}>
          <Card className="seller-card">
            <div className="seller-card-heading">
              <span className="seller-card-icon">
                <User size={22} strokeWidth={1.75} />
              </span>
              <h2 className="seller-card-title">Personal Information</h2>
            </div>
            <div className="seller-form-grid">
              <div className="seller-field">
                <Label htmlFor="phone" className="seller-field-label">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  className="seller-input"
                  defaultValue={user?.phone ?? ""}
                  required
                />
              </div>
              <div className="seller-field">
                <Label htmlFor="city" className="seller-field-label">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  className="seller-input"
                  defaultValue={user?.city ?? ""}
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="seller-card">
            <div className="seller-card-heading">
              <span className="seller-card-icon">
                <User size={22} strokeWidth={1.75} />
              </span>
              <h2 className="seller-card-title">Return Address (for renters)</h2>
            </div>
            <p className="seller-stripe-desc">
              Renters will use this name, phone, and address to ship dresses back to you after the
              rental period.
            </p>
            <div className="seller-form-grid">
              <div className="seller-field seller-field--full">
                <Label htmlFor="returnContactName" className="seller-field-label">
                  Contact Name
                </Label>
                <Input
                  id="returnContactName"
                  name="returnContactName"
                  type="text"
                  placeholder="Name shown to renters for returns"
                  className="seller-input"
                  defaultValue={user?.returnContactName ?? user?.name ?? ""}
                  required
                />
              </div>
              <div className="seller-field">
                <Label htmlFor="returnPhone" className="seller-field-label">
                  Return Phone
                </Label>
                <Input
                  id="returnPhone"
                  name="returnPhone"
                  type="tel"
                  placeholder="Phone for return shipments"
                  className="seller-input"
                  defaultValue={user?.returnPhone ?? user?.phone ?? ""}
                  required
                />
              </div>
              <div className="seller-field">
                <Label htmlFor="returnCity" className="seller-field-label">
                  Return City
                </Label>
                <Input
                  id="returnCity"
                  name="returnCity"
                  type="text"
                  placeholder="City for returns"
                  className="seller-input"
                  defaultValue={user?.returnCity ?? user?.city ?? ""}
                  required
                />
              </div>
              <div className="seller-field seller-field--full">
                <Label htmlFor="returnAddress" className="seller-field-label">
                  Return Address
                </Label>
                <Input
                  id="returnAddress"
                  name="returnAddress"
                  type="text"
                  placeholder="Full address where renters should send items back"
                  className="seller-input"
                  defaultValue={user?.returnAddress ?? ""}
                  required
                />
              </div>
            </div>
          </Card>

          {identityCard}

          <Card className="seller-card">
            <div className="seller-stripe-row">
              <div>
                <div className="seller-card-heading seller-card-heading--compact">
                  <span className="seller-card-icon">
                    <Wallet size={22} strokeWidth={1.75} />
                  </span>
                  <h2 className="seller-card-title">Stripe Account Setup</h2>
                </div>
                <p className="seller-stripe-desc">
                  {stripeConnected
                    ? "Your Stripe Connect account is linked."
                    : "Connect Stripe after you become a seller to enable payouts for sales and rentals."}
                </p>
                {stripeError ? (
                  <p className="seller-stripe-desc" role="alert" style={{ color: "#b42318" }}>
                    {stripeError}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                className="seller-stripe-btn"
                onClick={handleConnectStripe}
                disabled={stripeConnecting || user?.role !== "seller"}
              >
                <Wallet size={18} strokeWidth={1.75} />
                {stripeConnecting
                  ? "Opening Stripe…"
                  : stripeConnected
                    ? "Manage Stripe"
                    : "Connect Stripe Account"}
              </Button>
            </div>
          </Card>

          <Card className="seller-card seller-card--notice">
            <h3 className="seller-notice-title">
              <ShieldCheck size={22} strokeWidth={1.75} />
              Verification Process
            </h3>
            <ul className="seller-notice-list">
              {verificationSteps.map((step) => (
                <li key={step}>
                  <span className="seller-notice-check">
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <p>{step}</p>
                </li>
              ))}
            </ul>
          </Card>

          {submitError ? <p className="seller-field-error">{submitError}</p> : null}

          <div className="seller-submit-wrap">
            <Button
              type="submit"
              variant="default"
              className="seller-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : isLoggedInRejectedSeller ? "Submit New Application" : "Submit Verification Request"}
              <Send size={18} strokeWidth={1.75} />
            </Button>
            <p className="seller-terms-note">
              By submitting, you agree to Relux Hub&apos;s{" "}
              <Link to="/terms">Seller Terms &amp; Conditions</Link>.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SellerVerification;
