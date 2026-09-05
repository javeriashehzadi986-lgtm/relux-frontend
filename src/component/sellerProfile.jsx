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
import { useAuth } from "@/context/AuthContext";
import { useSellerReviews } from "@/hooks/useSellerReviews";
import api from "@/services/api";
import { SellerMyListingsContent } from "./sellerMyListings";
import { SellerOrdersRequestsContent } from "./sellerOrdersRequests";
import SellerSupportCenter from "./sellerSupportCenter";
import "./profile.css";
import "./sellerDashboard.css";
import "./sellerProfile.css";
import "./sellerMyListings.css";
import "./sellerOrdersRequests.css";
import "./sellerSupportCenter.css";
import DashboardMobileNav from "./DashboardMobileNav";

const SIDEBAR_ITEMS = [
  { id: "listings", label: "My Listings", icon: ClipboardList },
  { id: "orders", label: "Orders & Requests", icon: ShoppingBag },
  { id: "support", label: "Support Center", icon: HelpCircle },
  { id: "profile", label: "My Profile", icon: User },
];

function getMobileNavTitle(activeSection) {
  const match = SIDEBAR_ITEMS.find((item) => item.id === activeSection);
  return match?.label ?? "Dashboard";
}

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
  fullName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  returnContactName: "",
  returnPhone: "",
  returnCity: "",
  returnAddress: "",
};

function userToProfile(user) {
  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    address: user?.address ?? "",
    returnContactName: user?.returnContactName ?? user?.name ?? "",
    returnPhone: user?.returnPhone ?? user?.phone ?? "",
    returnCity: user?.returnCity ?? user?.city ?? "",
    returnAddress: user?.returnAddress ?? "",
  };
}

const verificationDocs = [
  { id: "cnic-front", label: "CNIC Front", icon: IdCard },
  { id: "cnic-back", label: "CNIC Back", icon: IdCard },
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

function formatFieldValue(value) {
  const text = value?.trim();
  return text || "—";
}

function SellerProfileSection({ onLogoutClick }) {
  const navigate = useNavigate();
  const { user, updateProfile, deactivateAccount, changePassword } = useAuth();
  const profile = useMemo(() => userToProfile(user), [user]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deactivateError, setDeactivateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [verificationStatus, setVerificationStatus] = useState(() =>
    user?.status === "active" ? "approved" : "pending",
  );
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [stripeDashboardLoading, setStripeDashboardLoading] = useState(false);
  const [stripeMessage, setStripeMessage] = useState("");
  const [stripePayouts, setStripePayouts] = useState(null);
  const [retryingPayouts, setRetryingPayouts] = useState(false);
  const [searchParams] = useSearchParams();
  const {
    reviews,
    stats,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSellerReviews(user?.id);

  const loadStripePayouts = async () => {
    try {
      const data = await api.getSellerStripePayouts();
      setStripePayouts(data);
      setStripeConnected(Boolean(data.stripeConnected));
    } catch {
      setStripePayouts(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    api
      .getSellerStripeStatus()
      .then((data) => {
        if (!cancelled) {
          setStripeConnected(Boolean(data.stripeConnected));
        }
      })
      .catch(() => {
        if (!cancelled) setStripeConnected(false);
      });
    loadStripePayouts().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stripeFlag = searchParams.get("stripe");
    if (stripeFlag !== "return" && stripeFlag !== "refresh") return undefined;

    let cancelled = false;
    setStripeMessage(
      stripeFlag === "refresh"
        ? "Stripe onboarding was interrupted. You can continue below."
        : "Checking Stripe Connect status…",
    );

    api
      .getSellerStripeStatus()
      .then((data) => {
        if (cancelled) return;
        setStripeConnected(Boolean(data.stripeConnected));
        setStripeMessage(
          data.stripeConnected
            ? "Stripe Connect is linked to your seller account."
            : "Finish Stripe onboarding to enable payouts.",
        );
        return loadStripePayouts();
      })
      .catch((err) => {
        if (!cancelled) {
          setStripeMessage(err.message || "Could not refresh Stripe status");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleConnectStripe = async () => {
    setStripeConnecting(true);
    setStripeMessage("");
    try {
      const data = await api.createSellerStripeConnect();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setStripeMessage("Stripe Connect URL was not returned.");
    } catch (err) {
      setStripeMessage(err.message || "Could not start Stripe Connect");
    } finally {
      setStripeConnecting(false);
    }
  };

  const handleOpenStripeDashboard = async () => {
    setStripeDashboardLoading(true);
    setStripeMessage("");
    try {
      const data = await api.openSellerStripeDashboard();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setStripeMessage("Stripe dashboard URL was not returned.");
    } catch (err) {
      setStripeMessage(err.message || "Could not open Stripe dashboard");
    } finally {
      setStripeDashboardLoading(false);
    }
  };

  const pendingStripePayoutCount =
    stripePayouts?.recentPayouts?.filter((payout) =>
      ["ledger_only", "failed", "none", ""].includes(payout.payoutStatus || ""),
    ).length || 0;

  const handleRetryStripePayouts = async () => {
    setRetryingPayouts(true);
    setStripeMessage("");
    try {
      const data = await api.retrySellerStripePayouts();
      setStripeMessage(data.message || "Payout retry finished.");
      await loadStripePayouts();
    } catch (err) {
      setStripeMessage(err.message || "Could not retry Stripe payouts");
    } finally {
      setRetryingPayouts(false);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setDraft(profile);
    }
  }, [profile, isEditing]);

  useEffect(() => {
    let active = true;

    api
      .getSellerVerification()
      .then((data) => {
        if (active) {
          setVerificationStatus(data.verification?.verificationStatus ?? "pending");
        }
      })
      .catch(() => {
        if (active && user?.status === "active") {
          setVerificationStatus("approved");
        }
      });

    return () => {
      active = false;
    };
  }, [user?.status]);

  useEffect(() => {
    if (window.location.hash !== "#seller-profile-stripe") return;
    document
      .getElementById("seller-profile-stripe")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isVerified = user?.status === "active" && verificationStatus === "approved";

  const initials = useMemo(() => getInitials(profile.fullName), [profile.fullName]);
  const draftInitials = useMemo(() => getInitials(draft.fullName), [draft.fullName]);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);
  const averageRating = Number(stats?.average || 0);
  const reviewCount = Number(stats?.count || 0);
  const hasPassword =
    user?.authProvider === "google"
      ? user?.hasPassword === true
      : Boolean(user?.hasPassword);

  const handleAccountDeactivate = async () => {
    setDeactivateError("");
    setDeactivating(true);
    try {
      if (hasPassword) {
        await deactivateAccount({ password: deactivatePassword });
      } else {
        await deactivateAccount({ confirm: true });
      }
      setShowDeactivateConfirm(false);
      setDeactivatePassword("");
      navigate("/login", { replace: true });
    } catch (error) {
      setDeactivateError(error.message || "Could not deactivate account");
    } finally {
      setDeactivating(false);
    }
  };

  const handleAccountDelete = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      if (hasPassword) {
        await deactivateAccount({ password: deletePassword });
      } else {
        await deactivateAccount({ confirm: true });
      }
      setShowDeleteConfirm(false);
      setDeletePassword("");
      navigate("/login", { replace: true });
    } catch (error) {
      setDeleteError(error.message || "Could not delete account");
    } finally {
      setDeleting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const payload = hasPassword
        ? { currentPassword, newPassword }
        : { newPassword };
      await changePassword(payload);
      setPasswordSuccess(
        hasPassword
          ? "Password updated. A confirmation email was sent."
          : "Password set. You can now also log in with email and password.",
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError(error.message || "Could not update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const openDeactivateConfirm = () => {
    setDeactivatePassword("");
    setDeactivateError("");
    setShowDeactivateConfirm(true);
  };

  const openDeleteConfirm = () => {
    setDeletePassword("");
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const viewFields = [
    { id: "fullName", label: "Full Name", value: formatFieldValue(profile.fullName) },
    { id: "email", label: "Email Address", value: formatFieldValue(profile.email) },
    { id: "phone", label: "Phone Number", value: formatFieldValue(profile.phone) },
    { id: "city", label: "City", value: formatFieldValue(profile.city) },
    {
      id: "address",
      label: "Address",
      value: formatFieldValue(profile.address),
      fullWidth: true,
    },
  ];

  const returnViewFields = [
    {
      id: "returnContactName",
      label: "Contact Name",
      value: formatFieldValue(profile.returnContactName),
    },
    {
      id: "returnPhone",
      label: "Return Phone",
      value: formatFieldValue(profile.returnPhone),
    },
    {
      id: "returnCity",
      label: "Return City",
      value: formatFieldValue(profile.returnCity),
    },
    {
      id: "returnAddress",
      label: "Return Address",
      value: formatFieldValue(profile.returnAddress),
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

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const updatedUser = await updateProfile({
        name: draft.fullName.trim(),
        phone: draft.phone.trim(),
        city: draft.city.trim(),
        address: draft.address.trim(),
        returnContactName: draft.returnContactName.trim(),
        returnPhone: draft.returnPhone.trim(),
        returnCity: draft.returnCity.trim(),
        returnAddress: draft.returnAddress.trim(),
      });
      setDraft(userToProfile(updatedUser));
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="seller-profile-page">
        {isEditing ? (
          <section className="seller-profile-top seller-profile-edit">
            <div className="seller-profile-hero-copy seller-profile-edit-heading">
              <h1 className="seller-dashboard-page-title">My Profile</h1>
              <p className="seller-profile-subtitle">
                Update your personal details and return contact for renters.
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
                    readOnly
                    disabled
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
                  <FieldLabel htmlFor="edit-address">Address</FieldLabel>
                  <Input
                    id="edit-address"
                    value={draft.address}
                    onChange={handleDraftChange("address")}
                    className="seller-dashboard-input"
                  />
                </Field>
              </FieldGroup>

              <div className="seller-profile-return-heading">
                <h3 className="seller-profile-account-settings-label">
                  Return address (for renters)
                </h3>
                <p className="seller-profile-subtitle">
                  Renters use these details to ship the dress back to you after the rental period.
                </p>
              </div>

              <FieldGroup className="seller-dashboard-form-grid seller-profile-edit-grid">
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-returnContactName">Contact Name</FieldLabel>
                  <Input
                    id="edit-returnContactName"
                    value={draft.returnContactName}
                    onChange={handleDraftChange("returnContactName")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-returnPhone">Return Phone</FieldLabel>
                  <Input
                    id="edit-returnPhone"
                    type="tel"
                    value={draft.returnPhone}
                    onChange={handleDraftChange("returnPhone")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field">
                  <FieldLabel htmlFor="edit-returnCity">Return City</FieldLabel>
                  <Input
                    id="edit-returnCity"
                    value={draft.returnCity}
                    onChange={handleDraftChange("returnCity")}
                    className="seller-dashboard-input"
                  />
                </Field>
                <Field className="seller-dashboard-field seller-dashboard-field--full">
                  <FieldLabel htmlFor="edit-returnAddress">Return Address</FieldLabel>
                  <Input
                    id="edit-returnAddress"
                    value={draft.returnAddress}
                    onChange={handleDraftChange("returnAddress")}
                    className="seller-dashboard-input"
                  />
                </Field>
              </FieldGroup>

              {saveError ? (
                <p className="seller-profile-subtitle" style={{ color: "#b42318" }}>
                  {saveError}
                </p>
              ) : null}

              <Button type="submit" className="seller-dashboard-save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
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

              <div className="seller-profile-return-section">
                <h3 className="seller-profile-account-settings-label">
                  Return address (for renters)
                </h3>
                <p className="seller-profile-subtitle">
                  Shown to renters in My Orders so they can return items to you.
                </p>
                <div className="seller-dashboard-form-grid seller-profile-details-grid">
                  {returnViewFields.map((field) => (
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
              </div>

              <Separator className="seller-profile-top-divider" />

              <div className="seller-profile-account-settings">
                <h3 className="seller-profile-account-settings-label">
                  Account Settings
                </h3>
                <div className="seller-profile-account-settings-list">
                  <button
                    type="button"
                    className="seller-profile-account-settings-row"
                    onClick={() => {
                      setShowPasswordForm((open) => !open);
                      setPasswordError("");
                      setPasswordSuccess("");
                    }}
                  >
                    <Lock size={20} strokeWidth={1.75} />
                    <span>{hasPassword ? "Change Password" : "Set Password"}</span>
                  </button>
                </div>
                {passwordSuccess ? (
                  <p className="seller-profile-save-success" role="status">
                    {passwordSuccess}
                  </p>
                ) : null}
                {showPasswordForm ? (
                  <form className="seller-profile-password-form profile-password-form" onSubmit={handleChangePassword}>
                    <FieldGroup className="profile-password-fields">
                      {hasPassword ? (
                        <Field className="profile-password-field">
                          <div className="profile-password-header">
                            <FieldLabel htmlFor="seller-current-password">
                              Current Password
                            </FieldLabel>
                            <Link to="/forgot-password" className="profile-forgot-link">
                              Forgot Password?
                            </Link>
                          </div>
                          <Input
                            id="seller-current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                          />
                        </Field>
                      ) : (
                        <p className="profile-password-hint">
                          You signed in with Google. Set a Relux Hub password to also log in
                          with email, or to confirm sensitive actions.
                        </p>
                      )}
                      <Field className="profile-password-field">
                        <FieldLabel htmlFor="seller-new-password">
                          {hasPassword ? "New Password" : "Password"}
                        </FieldLabel>
                        <Input
                          id="seller-new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                      </Field>
                      <Field className="profile-password-field">
                        <FieldLabel htmlFor="seller-confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="seller-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                      </Field>
                    </FieldGroup>
                    {passwordError ? (
                      <p className="seller-profile-save-error" role="alert">
                        {passwordError}
                      </p>
                    ) : null}
                    <div className="profile-password-actions">
                      <Button
                        type="submit"
                        disabled={
                          changingPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          (hasPassword && !currentPassword)
                        }
                      >
                        {changingPassword
                          ? "Saving..."
                          : hasPassword
                            ? "Update Password"
                            : "Set Password"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="profile-cancel-btn"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : null}
                <div className="seller-profile-account-settings-list">
                  <Link to="/privacy" className="seller-profile-account-settings-row">
                    <Shield size={20} strokeWidth={1.75} />
                    <span>Privacy Settings</span>
                  </Link>
                  <button
                    type="button"
                    className="seller-profile-account-settings-row seller-profile-account-settings-row--logout"
                    onClick={onLogoutClick}
                  >
                    <LogOut size={20} strokeWidth={1.75} />
                    <span>Logout</span>
                  </button>
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
                <span
                  className={`seller-profile-status-badge ${
                    isVerified
                      ? "seller-profile-status-badge--verified"
                      : "seller-profile-status-badge--pending"
                  }`}
                >
                  {isVerified ? "Verified" : "Pending"}
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
                <div
                  className={
                    stripeConnected
                      ? "seller-profile-connected"
                      : "seller-profile-connected seller-profile-connected--muted"
                  }
                >
                  {stripeConnected ? (
                    <>
                      <CheckCircle2 size={16} fill="currentColor" strokeWidth={0} />
                      <span>Connected</span>
                    </>
                  ) : (
                    <span>Not connected</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                <div className="seller-profile-payout-box">
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-label">Total earned (Relux)</span>
                    <span className="seller-profile-payout-amount">
                      {stripePayouts?.totalEarnedLabel || "PKR 0"}
                    </span>
                  </div>
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-date">Stripe available</span>
                    <span className="seller-profile-payout-status">
                      {stripePayouts?.stripeBalance?.availableLabel || "—"}
                    </span>
                  </div>
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-date">Stripe pending</span>
                    <span className="seller-profile-payout-status">
                      {stripePayouts?.stripeBalance?.pendingLabel || "—"}
                    </span>
                  </div>
                  <div className="seller-profile-payout-row">
                    <span className="seller-profile-payout-date">Connect status</span>
                    <span className="seller-profile-payout-status">
                      {stripeConnected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>

                {stripePayouts?.recentPayouts?.length ? (
                  <div className="seller-profile-payout-list">
                    <p className="seller-profile-payout-list-title">Recent payouts</p>
                    {stripePayouts.recentPayouts.map((payout) => (
                      <div key={payout.id} className="seller-profile-payout-item">
                        <div>
                          <p className="seller-profile-payout-item-title">{payout.title}</p>
                          <p className="seller-profile-payout-item-meta">
                            Order {payout.orderId}
                            {payout.payoutStatus === "transferred"
                              ? " · Sent to Stripe"
                              : payout.payoutStatus === "ledger_only"
                                ? " · Not sent to Stripe yet"
                                : payout.payoutStatus === "failed"
                                  ? " · Transfer failed"
                                  : ""}
                            {payout.releasedAt
                              ? ` · ${new Date(payout.releasedAt).toLocaleDateString()}`
                              : ""}
                          </p>
                        </div>
                        <strong>{payout.amountLabel}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="seller-profile-stripe-note">
                    Payouts appear here after escrow releases on completed orders.
                  </p>
                )}

                <p className="seller-profile-stripe-note">
                  Buyers pay Relux Hub at checkout (USD via Stripe). When you confirm a
                  rental return — or a sale escrow releases — your share is sent to Stripe
                  Connect automatically. No extra payout button needed.
                </p>
                {stripeMessage ? (
                  <p className="seller-profile-stripe-note" role="status">
                    {stripeMessage}
                  </p>
                ) : null}
                <div className="seller-profile-stripe-actions">
                  {!stripeConnected ? (
                    <Button
                      type="button"
                      className="seller-profile-primary-btn seller-profile-primary-btn--full"
                      onClick={handleConnectStripe}
                      disabled={stripeConnecting}
                    >
                      {stripeConnecting ? "Opening Stripe…" : "Connect Stripe Account"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        className="seller-profile-primary-btn seller-profile-primary-btn--full"
                        onClick={handleOpenStripeDashboard}
                        disabled={stripeDashboardLoading}
                      >
                        {stripeDashboardLoading
                          ? "Opening dashboard…"
                          : "View Stripe Balance & Bank"}
                      </Button>
                      {pendingStripePayoutCount > 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="seller-profile-primary-btn--full"
                          onClick={handleRetryStripePayouts}
                          disabled={retryingPayouts}
                        >
                          {retryingPayouts
                            ? "Sending to Stripe…"
                            : `Send ${pendingStripePayoutCount} pending payout(s) to Stripe`}
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        className="seller-profile-primary-btn--full"
                        onClick={handleConnectStripe}
                        disabled={stripeConnecting}
                      >
                        {stripeConnecting ? "Opening Stripe…" : "Update Stripe Details"}
                      </Button>
                    </>
                  )}
                </div>
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
                    onClick={openDeactivateConfirm}
                  >
                    Deactivate Account
                  </Button>
                  <Button
                    type="button"
                    className="seller-profile-delete-btn"
                    onClick={openDeleteConfirm}
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
                    <span>{reviewCount > 0 ? averageRating.toFixed(1) : "—"}</span>
                    <Star size={20} fill="currentColor" strokeWidth={0} />
                  </div>
                  <span className="seller-profile-rating-count">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </CardHeader>
              <CardContent className="seller-profile-section-content">
                {reviewsLoading ? (
                  <p className="seller-profile-reviews-empty">Loading reviews...</p>
                ) : reviewsError ? (
                  <p className="seller-profile-reviews-empty">{reviewsError}</p>
                ) : reviews.length === 0 ? (
                  <p className="seller-profile-reviews-empty">
                    No reviews yet. Reviews from buyers will appear here.
                  </p>
                ) : (
                  <>
                    <div className="seller-profile-reviews">
                      {visibleReviews.map((review) => (
                        <div key={review.id} className="seller-profile-review">
                          <div className="seller-profile-review-meta">
                            <StarRating rating={Number(review.rating) || 0} />
                            <span className="seller-profile-review-author">
                              {review.author || "Verified Buyer"}
                            </span>
                          </div>
                          <p className="seller-profile-review-text">
                            &ldquo;{review.quote}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                    {reviews.length > 2 && (
                      <Button
                        type="button"
                        variant="link"
                        className="seller-profile-reviews-link"
                        onClick={() => setShowAllReviews((current) => !current)}
                      >
                        {showAllReviews ? "Show fewer reviews" : "View all reviews"}
                      </Button>
                    )}
                  </>
                )}
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
                {hasPassword
                  ? "Your seller account will be deactivated and your active listings will be hidden. Enter your password to confirm."
                  : "Your seller account will be deactivated and your active listings will be hidden. Confirm below — no Relux password needed for Google accounts."}
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-body">
              {hasPassword ? (
                <Field className="profile-delete-password-field profile-password-field">
                  <div className="profile-password-header">
                    <FieldLabel htmlFor="seller-deactivate-password">Current Password</FieldLabel>
                    <Link
                      to="/forgot-password"
                      className="profile-forgot-link"
                      onClick={() => setShowDeactivateConfirm(false)}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="seller-deactivate-password"
                    type="password"
                    value={deactivatePassword}
                    onChange={(event) => setDeactivatePassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </Field>
              ) : null}
              {deactivateError ? (
                <p className="profile-delete-error" role="alert">
                  {deactivateError}
                </p>
              ) : null}
            </CardContent>
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
                disabled={deactivating || (hasPassword && !deactivatePassword)}
                onClick={handleAccountDeactivate}
              >
                {deactivating ? "Deactivating..." : "Deactivate"}
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
                {hasPassword
                  ? "This action cannot be undone. Your seller account and active listings will be removed. Enter your password to confirm."
                  : "This action cannot be undone. Confirm below to delete — no Relux password needed for Google accounts."}
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-body">
              {hasPassword ? (
                <Field className="profile-delete-password-field profile-password-field">
                  <div className="profile-password-header">
                    <FieldLabel htmlFor="seller-delete-password">Current Password</FieldLabel>
                    <Link
                      to="/forgot-password"
                      className="profile-forgot-link"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="seller-delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </Field>
              ) : null}
              {deleteError ? (
                <p className="profile-delete-error" role="alert">
                  {deleteError}
                </p>
              ) : null}
            </CardContent>
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
                disabled={deleting || (hasPassword && !deletePassword)}
                onClick={handleAccountDelete}
              >
                {deleting ? "Deleting..." : "Delete Account"}
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
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const sectionFromQuery = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(() =>
    resolveSection(sectionFromQuery, location.state?.section),
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setActiveSection(resolveSection(sectionFromQuery, location.state?.section));
  }, [sectionFromQuery, location.state]);

  const sidebarInitials = useMemo(() => getInitials(user?.name ?? ""), [user?.name]);

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
    logout();
    navigate("/login", { replace: true });
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
      return (
        <SellerProfileSection onLogoutClick={() => setShowLogoutConfirm(true)} />
      );
    }

    return null;
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar" aria-label="Seller navigation">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {user ? (
          <div className="seller-dashboard-user seller-profile-sidebar-user">
            <div className="seller-dashboard-avatar">{sidebarInitials}</div>
            <div>
              <p className="seller-profile-user-name">{user.name}</p>
              <p className="seller-dashboard-account-type">{user.email}</p>
            </div>
          </div>
        ) : null}
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

      <DashboardMobileNav
        title={getMobileNavTitle(activeSection)}
        items={SIDEBAR_ITEMS}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        getIconFill={(item, isActive) =>
          item.id === "profile" && isActive ? "currentColor" : "none"
        }
      />

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