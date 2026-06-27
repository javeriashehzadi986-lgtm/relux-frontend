import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  Lock,
  Settings,
  Shield,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./sellerSettings.css";

const SELLER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCRUuoGuw-p3mvUYjxNVpSI2xDXgxCsmNPPZ7Xu3WBbeQQV-eiwD76JAyP0XbfKLsfkyQblldLEQP8gVX6MfR67N8ZXLb0Om2yCSSMhqT3HyDXCKebftxW2QeKCW-rS2DZ9c4Nsc3my7bx2zX8ivaOZb81kIDjESJK-zAnUrhjQRUN_QCF_n-_v_c7cb91Dgn3M8ySA6TD7wPgGqoe-XtvtFw-f3VNzKF7ltVw3wjCiWw5OaAxhGZIVtD_ZLKI8q7-PKSg_WBiSoyC8";

const SETTINGS_NAV = [
  { id: "account", label: "Account Settings", icon: Settings },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const PRIVACY_TOGGLES = [
  {
    id: "profileVisibility",
    label: "Profile Visibility",
    description: "Make your storefront searchable and visible to everyone.",
    defaultChecked: true,
  },
  {
    id: "showReviews",
    label: "Show Seller Reviews",
    description: "Display feedback from past buyers on your profile page.",
    defaultChecked: true,
  },
  {
    id: "allowContact",
    label: "Allow Buyers to Contact Me",
    description: "Enable the chat button for direct inquiries about listings.",
    defaultChecked: false,
  },
];

const SECURITY_ACTIONS = [
  {
    id: "password",
    label: "Change Password",
    meta: "Updated 3 months ago",
    to: "/forgot-password",
  },
  {
    id: "email",
    label: "Update Email",
    meta: "s***@relux.com",
    to: null,
  },
  {
    id: "phone",
    label: "Phone Number",
    meta: "+1 ••• ••• 44",
    to: null,
  },
];

const NOTIFICATION_TOGGLES = [
  {
    id: "orderNotifications",
    label: "Order Notifications",
    description: "Real-time alerts for new sales.",
    defaultChecked: true,
  },
  {
    id: "rentalRequests",
    label: "Rental Requests",
    description: "When a customer wants to rent an item.",
    defaultChecked: true,
  },
  {
    id: "auctionAlerts",
    label: "Auction/Bid Alerts",
    description: "Updates on active auctions.",
    defaultChecked: false,
  },
  {
    id: "emailNewsletter",
    label: "Email Newsletter",
    description: "Weekly marketplace insights.",
    defaultChecked: false,
  },
];

function SettingsToggle({ id, checked, onChange }) {
  return (
    <div className="seller-settings-toggle">
      <input
        id={id}
        type="checkbox"
        className="seller-settings-toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className="seller-settings-toggle-track" aria-hidden="true" />
    </div>
  );
}

function ToggleRow({ id, label, description, checked, onChange, isLast }) {
  return (
    <div
      className={`seller-settings-toggle-row ${
        isLast ? "seller-settings-toggle-row--last" : ""
      }`.trim()}
    >
      <div>
        <h4 className="seller-settings-row-title">{label}</h4>
        <p className="seller-settings-row-desc">{description}</p>
      </div>
      <SettingsToggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

export function SellerSettingsContent() {
  const [activeNav, setActiveNav] = useState("account");
  const [privacy, setPrivacy] = useState(() =>
    Object.fromEntries(PRIVACY_TOGGLES.map((item) => [item.id, item.defaultChecked])),
  );
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(
      NOTIFICATION_TOGGLES.map((item) => [item.id, item.defaultChecked]),
    ),
  );

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    const target = document.getElementById(`seller-settings-${sectionId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="seller-settings">
      <header className="seller-settings-hero">
        <h1 className="seller-settings-hero-title">Privacy &amp; Settings</h1>
        <p className="seller-settings-hero-desc">
          Manage your account preferences, maintain your security standards, and
          customize your circular fashion marketplace experience.
        </p>
      </header>

      <div className="seller-settings-layout">
        <aside className="seller-settings-aside" aria-label="Settings navigation">
          <nav className="seller-settings-aside-nav">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`seller-settings-aside-link ${
                    isActive ? "is-active" : ""
                  }`.trim()}
                  onClick={() => scrollToSection(item.id)}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="seller-settings-aside-card">
            <div className="seller-settings-aside-user">
              <div className="seller-settings-aside-avatar">
                <img src={SELLER_AVATAR} alt="Store owner" />
              </div>
              <div>
                <p className="seller-settings-aside-name">Store Owner</p>
                <p className="seller-settings-aside-badge">Verified Seller</p>
              </div>
            </div>
            <p className="seller-settings-aside-member">Member since Jan 2023</p>
          </div>
        </aside>

        <div className="seller-settings-main">
          <section
            id="seller-settings-account"
            className="seller-settings-panel seller-settings-panel--shadow"
          >
            <div className="seller-settings-panel-header">
              <Eye size={22} className="seller-settings-panel-icon" />
              <h2 className="seller-settings-panel-title">Privacy Settings</h2>
            </div>
            <div className="seller-settings-toggle-list">
              {PRIVACY_TOGGLES.map((item, index) => (
                <ToggleRow
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  description={item.description}
                  checked={privacy[item.id]}
                  onChange={(value) =>
                    setPrivacy((current) => ({ ...current, [item.id]: value }))
                  }
                  isLast={index === PRIVACY_TOGGLES.length - 1}
                />
              ))}
            </div>
          </section>

          <section
            id="seller-settings-security"
            className="seller-settings-panel seller-settings-panel--shadow"
          >
            <div className="seller-settings-panel-header">
              <Shield size={22} className="seller-settings-panel-icon" />
              <h2 className="seller-settings-panel-title">Security Settings</h2>
            </div>
            <div className="seller-settings-security-grid">
              {SECURITY_ACTIONS.map((item) => {
                const content = (
                  <>
                    <div className="seller-settings-security-copy">
                      <p className="seller-settings-row-title">{item.label}</p>
                      <p className="seller-settings-security-meta">{item.meta}</p>
                    </div>
                    <ChevronRight size={20} className="seller-settings-chevron" />
                  </>
                );

                if (item.to) {
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      className="seller-settings-security-btn"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className="seller-settings-security-btn"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </section>

          <div
            id="seller-settings-personal"
            className="seller-settings-bento"
          >
            <section className="seller-settings-panel seller-settings-panel--shadow seller-settings-panel--stretch">
              <div className="seller-settings-panel-header">
                <ShieldCheck size={22} className="seller-settings-panel-icon" />
                <h2 className="seller-settings-panel-title">Verification</h2>
              </div>
              <div className="seller-settings-verified-banner">
                <CheckCircle2 size={22} className="seller-settings-verified-icon" />
                <div>
                  <p className="seller-settings-verified-title">Status: Verified</p>
                  <p className="seller-settings-verified-desc">
                    CNIC Verification Completed
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="seller-settings-outline-btn"
                asChild
              >
                <Link to="/sellerProfile?section=profile">View Verification Details</Link>
              </Button>
            </section>

            <section
              id="seller-settings-payments"
              className="seller-settings-panel seller-settings-panel--shadow seller-settings-panel--stretch"
            >
              <div className="seller-settings-panel-header">
                <Wallet size={22} className="seller-settings-panel-icon" />
                <h2 className="seller-settings-panel-title">Payment Settings</h2>
              </div>
              <div className="seller-settings-payment-card">
                <div className="seller-settings-payment-row">
                  <span className="seller-settings-stripe-badge">Stripe</span>
                  <p className="seller-settings-row-title">Connected</p>
                </div>
                <p className="seller-settings-payment-desc">Automatic payouts enabled.</p>
              </div>
              <Button type="button" className="seller-settings-primary-btn">
                Manage Stripe Account
              </Button>
            </section>
          </div>

          <section
            id="seller-settings-notifications"
            className="seller-settings-panel seller-settings-panel--shadow"
          >
            <div className="seller-settings-panel-header">
              <BellRing size={22} className="seller-settings-panel-icon" />
              <h2 className="seller-settings-panel-title">
                Notification Preferences
              </h2>
            </div>
            <div className="seller-settings-notify-grid">
              {NOTIFICATION_TOGGLES.map((item) => (
                <div key={item.id} className="seller-settings-notify-item">
                  <div>
                    <p className="seller-settings-row-title">{item.label}</p>
                    <p className="seller-settings-notify-desc">{item.description}</p>
                  </div>
                  <SettingsToggle
                    id={item.id}
                    checked={notifications[item.id]}
                    onChange={(value) =>
                      setNotifications((current) => ({
                        ...current,
                        [item.id]: value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="seller-settings-panel seller-settings-panel--danger">
            <div className="seller-settings-panel-header">
              <AlertTriangle size={22} className="seller-settings-panel-icon seller-settings-panel-icon--danger" />
              <h2 className="seller-settings-panel-title seller-settings-panel-title--danger">
                Danger Zone
              </h2>
            </div>
            <p className="seller-settings-danger-desc">
              Once you deactivate or delete your account, your active listings and
              rental contracts may be permanently affected. Please proceed with
              caution.
            </p>
            <div className="seller-settings-danger-actions">
              <Button
                type="button"
                variant="outline"
                className="seller-settings-danger-outline-btn"
              >
                Deactivate Account
              </Button>
              <Button type="button" className="seller-settings-danger-btn">
                Delete Account
              </Button>
            </div>
            <p className="seller-settings-danger-footnote">
              By deleting your account, you agree that Relux Hub may retain
              transaction records for tax and legal purposes as per the Privacy
              Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SellerSettingsContent;
