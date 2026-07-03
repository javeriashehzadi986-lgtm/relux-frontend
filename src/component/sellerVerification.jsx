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
import api from "@/services/api";
import "./sellerVerification.css";

const verificationSteps = [
  "Identity verification is mandatory before you can create your first listing.",
  "Our team typically reviews and approves applications within 24 to 48 business hours.",
  "You will receive an email and a push notification as soon as your account is approved.",
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

async function prepareImageForUpload(file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size <= MAX_IMAGE_BYTES) {
    return readFileAsDataUrl(file);
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = originalDataUrl;
  });

  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let compressed = canvas.toDataURL("image/jpeg", quality);
  while (compressed.length > MAX_IMAGE_BYTES * 1.37 && quality > 0.45) {
    quality -= 0.1;
    compressed = canvas.toDataURL("image/jpeg", quality);
  }

  if (compressed.length > MAX_IMAGE_BYTES * 1.37) {
    throw new Error("Image is too large even after compression. Try a smaller photo.");
  }

  return compressed;
}

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
  const { user, loading, isAuthenticated, isSeller, isAdmin, applyAsSeller, submitSellerVerification, logout } =
    useAuth();
  const isUpdateMode = location.state?.updateDocuments === true;

  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cnicFrontError, setCnicFrontError] = useState("");
  const [cnicBackError, setCnicBackError] = useState("");

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

    if (!loading && isAuthenticated && user?.role === "seller") {
      if (user.status === "active") {
        navigate("/sellerProfile", { replace: true });
      } else if (user.status === "pending") {
        navigate("/seller-pending", { replace: true });
      }
      return;
    }

    if (isAdmin) {
      navigate("/admin", { replace: true });
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
        prepareImageForUpload(cnicFront),
        prepareImageForUpload(cnicBack),
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

    if (!phone || !city) {
      setSubmitError("Phone and city are required");
      return;
    }

    setSubmitting(true);
    try {
      const [cnicFrontData, cnicBackData] = await Promise.all([
        prepareImageForUpload(cnicFront),
        prepareImageForUpload(cnicBack),
      ]);

      if (isAuthenticated && user?.role === "buyer") {
        await submitSellerVerification({
          phone,
          city,
          cnicFront: cnicFrontData,
          cnicBack: cnicBackData,
        });
      } else if (isAuthenticated && user?.role === "seller" && user?.status === "rejected") {
        await submitSellerVerification({
          phone,
          city,
          cnicFront: cnicFrontData,
          cnicBack: cnicBackData,
        });
      } else if (!isAuthenticated) {
        const name = formData.get("fullName")?.toString().trim() ?? "";
        const email = formData.get("email")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        if (!name || !email || !password) {
          setSubmitError("Name, email, and password are required");
          setSubmitting(false);
          return;
        }

        await applyAsSeller({
          name,
          email,
          password,
          phone,
          city,
          cnicFront: cnicFrontData,
          cnicBack: cnicBackData,
        });
      } else {
        setSubmitError("You are already registered as a seller");
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

  if (loading || (isUpdateMode && !isSeller)) {
    return (
      <div className="seller-verification-page">
        <main className="seller-main">
          <p>Loading...</p>
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
                You are logged in as buyer <strong>{user.email}</strong>. Only phone, city,
                and CNIC are needed to upgrade your account to seller.
              </p>
              <p>
                Want to create a <strong>brand new</strong> seller account instead?{" "}
                <button
                  type="button"
                  className="seller-auth-notice-link"
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                >
                  Log out first
                </button>{" "}
                to see the full registration form.
              </p>
            </div>
          ) : !isAuthenticated ? (
            <p className="seller-desc seller-desc--highlight">
              New seller? Fill in all fields below to create your account and submit
              verification in one step.
            </p>
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
              {!isLoggedInBuyer && !isLoggedInRejectedSeller ? (
                <>
                  <div className="seller-field">
                    <Label htmlFor="fullName" className="seller-field-label">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      className="seller-input"
                      required
                    />
                  </div>
                  <div className="seller-field">
                    <Label htmlFor="email" className="seller-field-label">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      className="seller-input"
                      required
                    />
                  </div>
                  <div className="seller-field">
                    <Label htmlFor="password" className="seller-field-label">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="seller-input"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>
                </>
              ) : null}
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
                  A connected Stripe account is required to receive payments
                  from sales and rentals.
                </p>
              </div>
              <Button type="button" variant="outline" className="seller-stripe-btn">
                <Wallet size={18} strokeWidth={1.75} />
                Connect Stripe Account
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
            {!isAuthenticated ? (
              <p className="seller-terms-note">
                Already have an account? <Link to="/login">Login</Link> first, then apply as seller.
              </p>
            ) : null}
          </div>
        </form>
      </main>
    </div>
  );
}

export default SellerVerification;
