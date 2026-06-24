import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Shirt,
  HandCoins,
  Heart,
  User,
  LogOut,
  Lock,
  Pencil,
  Shield,
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
import ProfileMyRentals from "./profileMyRentals";
import ProfileMyBids from "./profileMyBids";
import ProfileMyOrders from "./profileMyOrders";
import ProfileWishlist from "./profileWishlist";

const SIDEBAR_ITEMS = [
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "rentals", label: "My Rentals", icon: Shirt },
  { id: "bids", label: "My Bids", icon: HandCoins },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "My Profile", icon: User },
];

const INITIAL_PROFILE = {
  fullName: "Ayesha Khan",
  email: "ayesha@example.com",
  phone: "+92 300 1234567",
  city: "Lahore",
  address: "Gulberg III, Lahore",
};

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = (event) => {
    event.preventDefault();
    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const updateDraft = (field) => (event) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
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
            onClick={() => setActiveSection(item.id)}
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
    if (activeSection === "rentals") {
      return <ProfileMyRentals />;
    }

    if (activeSection === "orders") {
      return <ProfileMyOrders />;
    }

    if (activeSection === "bids") {
      return <ProfileMyBids />;
    }

    if (activeSection === "wishlist") {
      return <ProfileWishlist />;
    }

    if (activeSection === "profile") {
      return (
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
            <div className="profile-avatar-row">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials(isEditing ? draft.fullName : profile.fullName)}
              </div>
              <div>
                <p className="profile-avatar-name">
                  {isEditing ? draft.fullName : profile.fullName}
                </p>
                <p className="profile-avatar-meta">Buyer account</p>
              </div>
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
                        onChange={updateDraft("email")}
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
                      Delivery Address
                    </FieldLabel>
                    <Input
                      id="profile-address"
                      className="profile-input"
                      value={draft.address}
                      onChange={updateDraft("address")}
                    />
                  </Field>
                  <div className="profile-form-actions">
                    <Button type="submit" size="lg" className="profile-save-btn">
                      Save Changes
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
                  <dd className="profile-detail-value">{profile.fullName}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">Email Address</dt>
                  <dd className="profile-detail-value">{profile.email}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">Phone Number</dt>
                  <dd className="profile-detail-value">{profile.phone}</dd>
                </div>
                <div className="profile-detail">
                  <dt className="profile-label">City</dt>
                  <dd className="profile-detail-value">{profile.city}</dd>
                </div>
                <div className="profile-detail profile-detail--full">
                  <dt className="profile-label">Delivery Address</dt>
                  <dd className="profile-detail-value">{profile.address}</dd>
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
                <Button
                  type="button"
                  variant="ghost"
                  className="profile-settings-btn"
                  asChild
                >
                  <Link to="/privacy">
                    <Shield size={18} aria-hidden="true" />
                    Privacy Settings
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar" aria-label="Account navigation">
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
          activeSection === "rentals" ||
          activeSection === "bids" ||
          activeSection === "orders" ||
          activeSection === "wishlist"
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
    </div>
  );
};

export default Profile;
