import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import "./sellerVerification.css";

const verificationSteps = [
  "Identity verification is mandatory before you can create your first listing.",
  "Our team typically reviews and approves applications within 24 to 48 business hours.",
  "You will receive an email and a push notification as soon as your account is approved.",
];

function FileUploadZone({ id, label, file, error, onFileChange }) {
  return (
    <div className="seller-upload-field">
      <Label htmlFor={id} className="seller-field-label">
        {label}
      </Label>
      <div
        className={`seller-upload-zone ${
          file ? "seller-upload-zone--selected" : ""
        } ${error ? "seller-upload-zone--error" : ""}`}
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
          aria-invalid={!!error}
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="seller-upload-error">{error}</p>}
    </div>
  );
}

function SellerVerification() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [cnicFrontError, setCnicFrontError] = useState("");
  const [cnicBackError, setCnicBackError] = useState("");

  const handleCnicFrontChange = (file) => {
    setCnicFront(file);
    if (file) setCnicFrontError("");
  };

  const handleCnicBackChange = (file) => {
    setCnicBack(file);
    if (file) setCnicBackError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const frontError = cnicFront ? "" : "CNIC front image is required.";
    const backError = cnicBack ? "" : "CNIC back image is required.";

    setCnicFrontError(frontError);
    setCnicBackError(backError);

    if (frontError || backError) return;

    setShowSuccess(true);
  };

  return (
    <div className="seller-verification-page">
      <main className="seller-main">
        <div className="seller-intro">
          <h1 className="seller-title">Become a Verified Seller</h1>
          <p className="seller-desc">
            Complete your information below to start selling and renting clothes
            on Relux Hub. Join our community of conscious fashion enthusiasts.
          </p>
        </div>

        <form className="seller-form" onSubmit={handleSubmit}>
          <Card className="seller-card">
            <div className="seller-card-heading">
              <span className="seller-card-icon">
                <User size={22} strokeWidth={1.75} />
              </span>
              <h2 className="seller-card-title">Personal Information</h2>
            </div>
            <div className="seller-form-grid">
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
                <Label htmlFor="phone" className="seller-field-label">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder=" enter phone number"
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
                <Label htmlFor="city" className="seller-field-label">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  className="seller-input"
                  required
                />
              </div>
            </div>
          </Card>

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
                error={cnicFrontError}
                onFileChange={handleCnicFrontChange}
              />
              <FileUploadZone
                id="cnic-back"
                label="Upload CNIC Back Side"
                file={cnicBack}
                error={cnicBackError}
                onFileChange={handleCnicBackChange}
              />
            </div>
            <div className="seller-info-banner">
              <Info size={20} strokeWidth={1.75} />
              <p>
                Your CNIC images are used only for seller verification and are
                not publicly displayed.
              </p>
            </div>
          </Card>

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

          <div className="seller-submit-wrap">
            <Button type="submit" variant="default" className="seller-submit-btn">
              Submit Verification Request
              <Send size={18} strokeWidth={1.75} />
            </Button>
            <p className="seller-terms-note">
              By submitting, you agree to Relux Hub&apos;s{" "}
              <Link to="/terms">Seller Terms &amp; Conditions</Link>.
            </p>
          </div>
        </form>
      </main>

      {showSuccess && (
        <div className="seller-modal-overlay" role="dialog" aria-modal="true">
          <Card className="seller-modal">
            <h3 className="seller-modal-title">Request Submitted!</h3>
            <p className="seller-modal-desc">
              Your verification request has been received. Our team will review
              your documents and notify you via email shortly.
            </p>
            <Button asChild variant="default" className="seller-modal-btn">
              <Link to="/home">Back to Marketplace</Link>
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SellerVerification;
