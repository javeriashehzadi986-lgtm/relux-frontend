import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  IdCard,
  AlertTriangle,
  CheckCircle2,
  Star,
  StarHalf,
  Lock,
  Shield,
  Pencil,
  ClipboardList,
  ShoppingBag,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SellerMyListingsContent } from "./sellerMyListings";
import { SellerOrdersRequestsContent } from "./sellerOrdersRequests";
import SellerSupportCenter from "./sellerSupportCenter";
import "./profile.css";
import "./sellerDashboard.css";
import "./sellerProfile.css";
import "./sellerMyListings.css";
import "./sellerOrdersRequests.css";
import "./sellerSupportCenter.css";

const SIDEBAR_ITEMS = [
  { id: "listings", label: "My Listings", icon: ClipboardList },
  { id: "orders", label: "Orders & Requests", icon: ShoppingBag },
  { id: "support", label: "Support Center", icon: HelpCircle },
  { id: "profile", label: "My Profile", icon: User },
];

const SECTION_IDS = SIDEBAR_ITEMS.map((item) => item.id);
const WIDE_SECTIONS = ["listings", "orders", "support"];

const resolveSection = (sectionFromQuery, stateSection) => {
  const section =
    sectionFromQuery === "settings" ? "profile" : sectionFromQuery;
  const state =
    stateSection === "settings" ? "profile" : stateSection;

  if (section && SECTION_IDS.includes(section)) {
    return section;
  }
  if (state && SECTION_IDS.includes(state)) {
    return state;
  }
  return "profile";
};

const defaultProfile = {
  fullName: "Zarish",
  email: "zarish@example.com",
  phone: "+92 300 1234567",
  city: "Lahore",
  address: "Gulberg III, Lahore",
};

const accountSettings = [
  { id: "password", label: "Change Password", icon: Lock, to: "/forgot-password" },
  { id: "privacy", label: "Privacy Settings", icon: Shield, to: "/privacy" },
];

const verificationDocs = [
  { id: "cnic-front", label: "CNIC Front", icon: IdCard },
  { id: "cnic-back", label: "CNIC Back", icon: IdCard },
];

const reviews = [
  {
    id: "review-1",
    stars: 5,
    text: '"The quality was even better than described. Zarish is a fantastic seller..."',
  },
  {
    id: "review-2",
    stars: 4.5,
    text: '"Beautifully packaged and shipped very fast. Will definitely buy again!"',
  },
  {
    id: "review-3",
    stars: 5,
    text: '"Accurate sizing and the dress looked exactly like the photos. Highly recommend!"',
  },
  {
    id: "review-4",
    stars: 4,
    text: '"Great communication throughout the rental period. Would rent again."',
  },
];

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Z";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="seller-profile-stars" aria-hidden="true">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} size={14} fill="currentColor" />
      ))}
      {hasHalf && <StarHalf size={14} fill="currentColor" />}
    </div>
  );
}

function SellerProfileSection() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [draft, setDraft] = useState(defaultProfile);

  useEffect(() => {
    if (window.location.hash !== "#seller-profile-stripe") return;
    document
      .getElementById("seller-profile-stripe")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const initials = useMemo(() => getInitials(profile.fullName), [profile.fullName]);
  const draftInitials = useMemo(() => getInitials(draft.fullName), [draft.fullName]);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  const viewFields = [
    { id: "fullName", label: "Full Name", value: profile.fullName },
    { id: "email", label: "Email Address", value: profile.email },
    { id: "phone", label: "Phone Number", value: profile.phone },
    { id: "city", label: "City", value: profile.city },
    {
      id: "address",
      label: "Delivery Address",
      value: profile.address,
      fullWidth: true,
    },
  ];

  const handleEditClick = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleDraftChange = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setProfile(draft);
    setIsEditing(false);
  };

  return (
    <div className="seller-profile-page">
        {isEditing ? (
          <section className="seller-profile-top seller-profile-edit">
            <div className="seller-profile-hero-copy seller-profile-edit-heading">
              <h1 className="seller-dashboard-page-title">My Profile</h1>
              <p className="seller-profile-subtitle">
                Update your personal details and delivery information.
              </p>
            </div>

            <div className="seller-dashboard-user seller-profile-user">
              <div className="seller-dashboard-avatar">{draftInitials}</div>
              <div>
                <h2 className="seller-profile-user-name">{draft.fullName}</h2>
                <p className="seller-dashboard-account-type">Seller account</p>
              </div>
            </div>

            <form className="seller-profile-edit-form" onSubmit={handleSave}>
              <FieldGroup className="seller-dashboard-form-grid seller-profile-edit-grid">
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-fullName">Full Name</FieldLabel>
                  <Input
                    id="edit-fullName"
                    value={draft.fullName}
                    onChange={handleDraftChange("fullName")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-email">Email Address</FieldLabel>
                  <Input
                    id="edit-email"
                    type="email"
                    value={draft.email}
                    onChange={handleDraftChange("email")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-phone">Phone Number</FieldLabel>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={draft.phone}
                    onChange={handleDraftChange("phone")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-city">City</FieldLabel>
                  <Input
                    id="edit-city"
                    value={draft.city}
                    onChange={handleDraftChange("city")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field seller-dashboard-field--full">
                  <FieldLabel htmlFor="edit-address">Delivery Address</FieldLabel>
                  <Input
                    id="edit-address"
                    value={draft.address}
                    onChange={handleDraftChange("address")}
                    className="seller-dashboard-input"
                  />
                </Field>
              </FieldGroup>

              <Button type="submit" className="seller-dashboard-save-btn">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="profile-cancel-btn"
                onClick={() => {
                  setDraft(profile);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </form>
          </section>
        ) : (
          <>
            <section className="seller-profile-top">
              <div className="seller-profile-hero-top">
                <div className="seller-profile-hero-copy">
                  <h1 className="seller-dashboard-page-title">My Profile</h1>
                  <p className="seller-profile-subtitle">
                    View and manage your account details.
                  </p>
                </div>
                <Button
                  type="button"
                  className="seller-profile-edit-top-btn"
                  onClick={handleEditClick}
                >
                  <Pencil size={16} strokeWidth={1.75} />
                  Edit Profile
                </Button>
              </div>

              <div className="seller-dashboard-user seller-profile-user">
                <div className="seller-dashboard-avatar">{initials}</div>
                <div>
                  <h2 className="seller-profile-user-name">{profile.fullName}</h2>
                  <p className="seller-dashboard-account-type">Seller account</p>
                </div>
              </div>

              <div className="seller-dashboard-form-grid seller-profile-details-grid">
                {viewFields.map((field) => (
                  <div
                    key={field.id}
                    className={`seller-dashboard-field seller-profile-detail-field ${
                      field.fullWidth ? "seller-dashboard-field--full" : ""
                    }`}
                  >
                    <span className="seller-profile-detail-label">{field.label}</span>
                    <p className="seller-profile-detail-value">{field.value}</p>
                  </div>
                ))}
              </div>

              <Separator className="seller-profile-top-divider" />

              <div className="seller-profile-account-settings">
                <h3 className="seller-profile-account-settings-label">
                  Account Settings
                </h3>
                <div className="seller-profile-account-settings-list">
                  {accountSettings.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={item.to}
                        className="seller-profile-account-settings-row"
                      >
                        <Icon size={20} strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            <Card className="seller-profile-card">
              <CardHeader className="seller-profile-section-header">
                <div>
                  <CardTitle className="seller-profile-section-title">
                    Identity Verification
                  </CardTitle>
                  <CardDescription className="seller-profile-section-desc">
                    Required to earn your trust badge.
                  </CardDescription>
                </div>
                <span className="seller-profile-status-badge seller-profile-status-badge--verified">
                  Verified
                </span>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                <div className="seller-profile-docs-grid">
                  {verificationDocs.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div key={doc.id} className="seller-profile-doc-slot">
                        <Icon
                          size={22}
                          strokeWidth={1.75}
                          className="seller-profile-doc-icon"
                        />
                        <span className="seller-profile-doc-label">{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="seller-profile-outline-btn seller-profile-outline-btn--full"
                  asChild
                >
                  <Link
                    to="/sellerVerification"
                    state={{ updateDocuments: true }}
                  >
                    Update Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card id="seller-profile-stripe" className="seller-profile-card">
              <CardHeader className="seller-profile-section-header seller-profile-section-header--inline">
                <CardTitle className="seller-profile-section-title">
                  Stripe Payments
                </CardTitle>
                <div className="seller-profile-connected">
                  <CheckCircle2 size={16} fill="currentColor" strokeWidth={0} />
                  <span>Connected</span>
                </div>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                <div className="seller-profile-payout-box">
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-label">Last Payout</span>
                    <span className="seller-profile-payout-amount">$120.00</span>
                  </div>
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-date">Oct 20, 2023</span>
                    <span className="seller-profile-payout-status">Completed</span>
                  </div>
                </div>
                <p className="seller-profile-stripe-note">
                  &ldquo;Payments are securely processed via Stripe and sent to your bank
                  account.&rdquo;
                </p>
                <Button
                  type="button"
                  className="seller-profile-primary-btn seller-profile-primary-btn--full"
                  asChild
                >
                  <Link to="/sellerProfile#seller-profile-stripe">
                    Manage Stripe Account
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="seller-profile-card seller-profile-card--danger">
              <CardHeader className="seller-profile-section-header">
                <div className="seller-profile-danger-heading">
                  <AlertTriangle
                    size={22}
                    strokeWidth={1.75}
                    className="seller-profile-danger-icon"
                    aria-hidden="true"
                  />
                  <CardTitle className="seller-profile-section-title seller-profile-section-title--danger">
                    Account Status
                  </CardTitle>
                </div>
                <CardDescription className="seller-profile-danger-desc">
                  Deactivating hides your listings until you sign in again. Deleting
                  permanently removes your seller account and listings.
                </CardDescription>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                <div className="seller-profile-danger-actions">
                  <Button
                    type="button"
                    variant="outline"
                    className="seller-profile-deactivate-btn"
                    onClick={() => setShowDeactivateConfirm(true)}
                  >
                    Deactivate Account
                  </Button>
                  <Button
                    type="button"
                    className="seller-profile-delete-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </Button>
                </div>
                <p className="seller-profile-danger-footnote">
                  By deleting your account, you agree that Relux Hub may retain
                  transaction records for tax and legal purposes as per the Privacy
                  Policy.
                </p>
              </CardContent>
            </Card>

            <Card id="seller-profile-reviews" className="seller-profile-card">
              <CardHeader className="seller-profile-section-header seller-profile-section-header--inline">
                <CardTitle className="seller-profile-section-title">
                  Seller Reviews
                </CardTitle>
                <div className="seller-profile-rating-summary">
                  <div className="seller-profile-rating-score">
                    <span>4.8</span>
                    <Star size={20} fill="currentColor" strokeWidth={0} />
                  </div>
                  <span className="seller-profile-rating-count">(124 reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                <div className="seller-profile-reviews">
                  {visibleReviews.map((review) => (
                    <div key={review.id} className="seller-profile-review">
                      <StarRating rating={review.stars} />
                      <p className="seller-profile-review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="seller-profile-reviews-link"
                  onClick={() => setShowAllReviews((current) => !current)}
                >
                  {showAllReviews ? "Show fewer reviews" : "View all reviews"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

      {showDeactivateConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seller-deactivate-account-title"
          onClick={() => setShowDeactivateConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle
                id="seller-deactivate-account-title"
                className="profile-logout-modal-title"
              >
                Deactivate account?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                Your listings will be hidden until you sign in and reactivate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowDeactivateConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="profile-logout-confirm-btn"
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  navigate("/login");
                }}
              >
                Deactivate
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seller-delete-account-title"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle
                id="seller-delete-account-title"
                className="profile-logout-modal-title"
              >
                Delete account permanently?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                This action cannot be undone. Your listings and seller data will be removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="seller-profile-delete-confirm-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  navigate("/login");
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
  );
}

const SellerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sectionFromQuery = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(() =>
    resolveSection(sectionFromQuery, location.state?.section),
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setActiveSection(resolveSection(sectionFromQuery, location.state?.section));
  }, [sectionFromQuery, location.state]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === "profile") {
      navigate("/sellerProfile", { replace: true });
      return;
    }
    navigate(`/sellerProfile?section=${sectionId}`, { replace: true });
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const renderSidebarNav = (className = "") => (
    <nav className={`profile-sidebar-nav ${className}`.trim()}>
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            className={`profile-sidebar-link ${
              isActive ? "profile-sidebar-link--active" : ""
            }`}
            onClick={() => handleSectionChange(item.id)}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.25 : 1.75}
              fill={item.id === "profile" && isActive ? "currentColor" : "none"}
            />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );

  const renderMainContent = () => {
    if (activeSection === "listings") {
      return <SellerMyListingsContent />;
    }

    if (activeSection === "orders") {
      return <SellerOrdersRequestsContent />;
    }

    if (activeSection === "support") {
      return (
        <>
          <CardHeader className="seller-dashboard-heading px-0">
            <CardTitle className="seller-dashboard-page-title">
              Support Center
            </CardTitle>
            <CardDescription>
              Get help or report issues related to your clothing listings.
            </CardDescription>
          </CardHeader>
          <SellerSupportCenter variant="seller" />
        </>
      );
    }

    if (activeSection === "profile") {
      return <SellerProfileSection />;
    }

    return null;
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar" aria-label="Seller navigation">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {renderSidebarNav()}
        <div className="profile-sidebar-footer">
          <Button
            type="button"
            variant="ghost"
            className="profile-sidebar-link profile-sidebar-link--logout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <div className="profile-mobile-nav">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {renderSidebarNav("profile-sidebar-nav--mobile")}
      </div>

      <main
        className={`profile-main ${
          WIDE_SECTIONS.includes(activeSection) ? "profile-main--wide" : ""
        }`.trim()}
      >
        {renderMainContent()}
      </main>

      {showLogoutConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="seller-logout-title"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle id="seller-logout-title" className="profile-logout-modal-title">
                Log out?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                Are you sure you want to log out of your account?
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="profile-logout-confirm-btn"
                onClick={handleLogoutConfirm}
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;