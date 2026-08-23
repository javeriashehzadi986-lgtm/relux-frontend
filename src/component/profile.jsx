import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ShoppingBag,
  HandCoins,
  HelpCircle,
  User,
  LogOut,
  Lock,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import "./profile.css";
import ProfileMyBids from "./profileMyBids";
import ProfileMyOrders from "./profileMyOrders";
import ProfileWishlist from "./profileWishlist";
import ProfileSupportCenter from "./profileSupportCenter";
import { useAuth } from "@/context/AuthContext";

const SIDEBAR_ITEMS = [
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "bids", label: "My Bids", icon: HandCoins },
  { id: "support", label: "Support Center", icon: HelpCircle },
  { id: "profile", label: "My Profile", icon: User },
];

function userToProfile(user) {
  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    address: user?.address ?? "",
  };
}

function formatFieldValue(value) {
  const text = value?.trim();
  return text || "—";
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "B";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const VALID_SECTIONS = new Set([
  "orders",
  "bids",
  "wishlist",
  "support",
  "profile",
]);

const resolveSection = (sectionProp, sectionFromQuery) => {
  if (sectionProp && VALID_SECTIONS.has(sectionProp)) return sectionProp;
  if (sectionFromQuery && VALID_SECTIONS.has(sectionFromQuery)) {
    return sectionFromQuery;
  }
  return "profile";
};

const Profile = ({ section: sectionProp }) => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const sectionFromQuery = searchParams.get("section");
  const [activeSection, setActiveSection] = useState(() =>
    resolveSection(sectionProp, sectionFromQuery),
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const profile = useMemo(() => userToProfile(user), [user]);
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const sidebarInitials = useMemo(() => getInitials(user?.name ?? ""), [user?.name]);

  useEffect(() => {
    setActiveSection(resolveSection(sectionProp, sectionFromQuery));
  }, [sectionProp, sectionFromQuery]);

  useEffect(() => {
    if (!isEditing) {
      setDraft(profile);
    }
  }, [profile, isEditing]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === "profile") {
      navigate("/profile", { replace: true });
      return;
    }
    navigate(`/profile?section=${sectionId}`, { replace: true });
  };

  const handleEditProfile = () => {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
  };

  const handleCancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
    setSaved(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      await updateProfile({
        name: draft.fullName.trim(),
        phone: draft.phone.trim(),
        city: draft.city.trim(),
        address: draft.address.trim(),
      });
      setIsEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(error.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const updateDraft = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login");
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
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
    if (activeSection === "orders") {
      return <ProfileMyOrders />;
    }

    if (activeSection === "bids") {
      return <ProfileMyBids />;
    }

    if (activeSection === "wishlist") {
      return <ProfileWishlist />;
    }

    if (activeSection === "support") {
      return <ProfileSupportCenter />;
    }

    if (activeSection === "profile") {
      return (
        <>
          <Card className="profile-card">
            <CardHeader className="profile-card-header">
            <div className="profile-card-header-row">
              <div>
                <CardTitle className="profile-card-title">My Profile</CardTitle>
                <CardDescription className="profile-card-description">
                  {isEditing
                    ? "Update your personal details and delivery information."
                    : "View and manage your account details."}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  type="button"
                  className="profile-edit-btn"
                  onClick={handleEditProfile}
                >
                  <Pencil size={16} aria-hidden="true" />
                  Edit Profile
                </Button>
              )}
            </div>
            {saved && !isEditing && (
              <p className="profile-saved-message">Your profile has been updated.</p>
            )}
          </CardHeader>
          <CardContent className="profile-card-content">
            <div className="profile-account-intro">
              <p className="profile-avatar-name">
                {isEditing ? draft.fullName : profile.fullName}
              </p>
              <p className="profile-avatar-meta">Buyer account</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave}>
                <FieldGroup className="profile-field-group">
                  <div className="profile-form-grid">
                    <Field className="profile-field">
                      <FieldLabel htmlFor="profile-name" className="profile-label">
                        Full Name
                      </FieldLabel>
                      <Input
                        id="profile-name"
                        className="profile-input"
                        value={draft.fullName}
                        onChange={updateDraft("fullName")}
                      />
                    </Field>
                    <Field className="profile-field">
                      <FieldLabel htmlFor="profile-email" className="profile-label">
                        Email Address
                      </FieldLabel>
                      <Input
                        id="profile-email"
                        type="email"
                        className="profile-input"
                        value={draft.email}
                        readOnly
                        disabled
                      />
                    </Field>
                    <Field className="profile-field">
                      <FieldLabel htmlFor="profile-phone" className="profile-label">
                        Phone Number
                      </FieldLabel>
                      <Input
                        id="profile-phone"
                        type="tel"
                        className="profile-input"
                        value={draft.phone}
                        onChange={updateDraft("phone")}
                      />
                    </Field>
                    <Field className="profile-field">
                      <FieldLabel htmlFor="profile-city" className="profile-label">
                        City
                      </FieldLabel>
                      <Input
                        id="profile-city"
                        className="profile-input"
                        value={draft.city}
                        onChange={updateDraft("city")}
                      />
                    </Field>
                  </div>
                  <Field className="profile-field">
                    <FieldLabel htmlFor="profile-address" className="profile-label">
                      Address
                    </FieldLabel>
                    <Input
                      id="profile-address"
                      className="profile-input"
                      value={draft.address}
                      onChange={updateDraft("address")}
                    />
                  </Field>
                  <div className="profile-form-actions">
                    {saveError ? (
                      <p className="profile-saved-message" style={{ color: "#b42318" }}>
                        {saveError}
                      </p>
                    ) : null}
                    <Button type="submit" size="lg" className="profile-save-btn" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="profile-cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            ) : (
              <dl className="profile-details">
                <div className="profile-detail">
                  <dt className="profile-label">Full Name</dt>
                  <dd className="profile-detail-value">{formatFieldValue(profile.fullName)}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">Email Address</dt>
                  <dd className="profile-detail-value">{formatFieldValue(profile.email)}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">Phone Number</dt>
                  <dd className="profile-detail-value">{formatFieldValue(profile.phone)}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">City</dt>
                  <dd className="profile-detail-value">{formatFieldValue(profile.city)}</dd>
                </div>
                <div className="profile-detail profile-detail--full">
                  <dt className="profile-label">Address</dt>
                  <dd className="profile-detail-value">{formatFieldValue(profile.address)}</dd>
                </div>
              </dl>
            )}

            <div className="profile-settings">
              <h3 className="profile-settings-title">Account Settings</h3>
              <div className="profile-settings-actions">
                <Button
                  type="button"
                  variant="ghost"
                  className="profile-settings-btn"
                  asChild
                >
                  <Link to="/forgot-password">
                    <Lock size={18} aria-hidden="true" />
                    Change Password
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="profile-card profile-card--danger">
          <CardHeader className="profile-card-header">
            <div className="profile-danger-heading">
              <AlertTriangle
                size={22}
                strokeWidth={1.75}
                className="profile-danger-icon"
                aria-hidden="true"
              />
              <CardTitle className="profile-card-title profile-card-title--danger">
                Account Status
              </CardTitle>
            </div>
            <CardDescription className="profile-danger-desc">
              Deleting your account permanently removes your profile, orders, bids,
              and wishlist data from Relux Hub.
            </CardDescription>
          </CardHeader>
          <CardContent className="profile-card-content">
            <Button
              type="button"
              className="profile-delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
            <p className="profile-danger-footnote">
              By deleting your account, you agree that Relux Hub may retain
              transaction records for tax and legal purposes as per the Privacy
              Policy.
            </p>
          </CardContent>
        </Card>
        </>
      );
    }

    return null;
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar" aria-label="Account navigation">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {user ? (
          <div className="profile-sidebar-user">
            <div className="profile-sidebar-avatar" aria-hidden="true">
              {sidebarInitials}
            </div>
            <div>
              <p className="profile-sidebar-name">{user.name}</p>
              <p className="profile-sidebar-email">{user.email}</p>
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

      <div className="profile-mobile-nav">
        <h2 className="profile-sidebar-heading">Dashboard</h2>
        {renderSidebarNav("profile-sidebar-nav--mobile")}
      </div>

      <main
        className={`profile-main ${
          activeSection === "bids" ||
          activeSection === "orders" ||
          activeSection === "wishlist" ||
          activeSection === "support"
            ? "profile-main--wide"
            : ""
        }`.trim()}
      >
        {renderMainContent()}
      </main>

      {showLogoutConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-logout-title"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle id="profile-logout-title" className="profile-logout-modal-title">
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

      {showDeleteConfirm && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-delete-account-title"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <Card
            className="profile-logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle
                id="profile-delete-account-title"
                className="profile-logout-modal-title"
              >
                Delete account permanently?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                This action cannot be undone. Your buyer account and saved data will
                be removed.
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
                className="profile-delete-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
