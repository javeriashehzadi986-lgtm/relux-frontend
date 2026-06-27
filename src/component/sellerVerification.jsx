import React, { useState } from "react";
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
import "./sellerVerification.css";

const verificationSteps = [
  "Identity verification is mandatory before you can create your first listing.",
  "Our team typically reviews and approves applications within 24 to 48 business hours.",
  "You will receive an email and a push notification as soon as your account is approved.",
];

function FileUploadZone({ id, label, file, onFileChange }) {
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
    </div>
  );
}

function SellerVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdateMode = location.state?.updateDocuments === true;
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    sessionStorage.setItem("userType", "seller");
    navigate(
      isUpdateMode
        ? "/sellerProfile?section=profile"
        : "/sellerProfile?section=listings",
    );
  };

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
        />
        <FileUploadZone
          id="cnic-back"
          label="Upload CNIC Back Side"
          file={cnicBack}
          onFileChange={setCnicBack}
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

          <form className="seller-form" onSubmit={handleSubmit}>
            {identityCard}

            <div className="seller-submit-wrap">
              <Button type="submit" variant="default" className="seller-submit-btn">
                Submit Updated Documents
                <Send size={18} strokeWidth={1.75} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="seller-back-link"
                asChild
              >
                <Link to="/sellerProfile">
                  Back to Profile
                </Link>
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }

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
    </div>
  );
}

export default SellerVerification;
