import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import "./adminProfile.css";
import "../profile.css";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatFieldValue(value) {
  const text = value?.trim?.() ?? String(value ?? "").trim();
  return text || "—";
}

function formatAddressValue(value) {
  const text = value?.trim?.() ?? String(value ?? "").trim();
  return text || "Not provided";
}

function formatRole(role) {
  if (role === "admin") return "Admin";
  if (role === "seller") return "Seller";
  return "Buyer";
}

function formatStatus(status) {
  if (status === "active") return "Active";
  if (status === "suspended") return "Suspended";
  if (status === "pending") return "Pending";
  if (status === "rejected") return "Rejected";
  return status || "—";
}

function userToProfile(user) {
  return {
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    city: user?.city ?? "",
    address: user?.address ?? "",
  };
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    refreshUser,
    updateProfile,
    updateEmail,
    changePassword,
  } = useAuth();

  const profile = useMemo(() => userToProfile(user), [user]);
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const initials = useMemo(() => getInitials(user?.name ?? ""), [user?.name]);
  const hasPassword =
    user?.authProvider === "google"
      ? user?.hasPassword === true
      : Boolean(user?.hasPassword);

  useEffect(() => {
    refreshUser().catch(() => {});
  }, [refreshUser]);

  useEffect(() => {
    if (!isEditing) {
      setDraft(profile);
    }
  }, [profile, isEditing]);

  const handleEditProfile = () => {
    setDraft(profile);
    setIsEditing(true);
    setSaved(false);
    setSaveError("");
  };

  const handleCancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
    setSaved(false);
    setSaveError("");
  };

  const handleSaveProfile = async (event) => {
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
      await refreshUser();
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

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setEmailError("");
    setEmailSaving(true);
    try {
      await updateEmail({
        email: emailDraft.trim(),
        password: emailPassword,
      });
      setShowEmailDialog(false);
      setEmailDraft("");
      setEmailPassword("");
    } catch (error) {
      setEmailError(error.message || "Could not update email");
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordSaving(true);
    try {
      const payload = hasPassword
        ? { currentPassword, newPassword }
        : { newPassword };
      await changePassword(payload);
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(error.message || "Could not update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="admin-profile-page">
        <p className="admin-profile-message">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-page-header">
        <h1>Admin Profile &amp; Settings</h1>
        <p>Manage your profile and account security.</p>
      </div>

      <div className="admin-profile-grid">
        <div className="admin-profile-column">
          <Card className="admin-profile-card admin-profile-card--profile">
            <CardContent className="admin-profile-card-content">
              <div className="admin-profile-avatar-wrap">
                <div className="admin-profile-avatar-initials" aria-hidden="true">
                  {initials}
                </div>
              </div>

              {!isEditing ? (
                <>
                  <h2>{formatFieldValue(user.name)}</h2>
                  <p className="admin-profile-email">{user.email}</p>

                  <dl className="admin-profile-details">
                    <div>
                      <dt>Phone Number</dt>
                      <dd>{formatFieldValue(profile.phone)}</dd>
                    </div>
                    <div>
                      <dt>City</dt>
                      <dd>{formatFieldValue(profile.city)}</dd>
                    </div>
                    <div>
                      <dt>Address</dt>
                      <dd>{formatAddressValue(profile.address)}</dd>
                    </div>
                  </dl>

                  {saved ? (
                    <p className="admin-profile-saved-message">Your profile has been updated.</p>
                  ) : null}

                  <Button type="button" className="admin-profile-edit-btn" onClick={handleEditProfile}>
                    Edit Profile
                  </Button>
                </>
              ) : (
                <form className="admin-profile-edit-form" onSubmit={handleSaveProfile}>
                  <label className="admin-profile-form-label" htmlFor="admin-profile-name">
                    Full Name
                  </label>
                  <Input
                    id="admin-profile-name"
                    value={draft.fullName}
                    onChange={updateDraft("fullName")}
                    required
                  />

                  <label className="admin-profile-form-label" htmlFor="admin-profile-email-readonly">
                    Email Address
                  </label>
                  <Input
                    id="admin-profile-email-readonly"
                    value={draft.email}
                    readOnly
                    disabled
                  />

                  <label className="admin-profile-form-label" htmlFor="admin-profile-phone">
                    Phone Number
                  </label>
                  <Input
                    id="admin-profile-phone"
                    value={draft.phone}
                    onChange={updateDraft("phone")}
                  />

                  <label className="admin-profile-form-label" htmlFor="admin-profile-city">
                    City
                  </label>
                  <Input
                    id="admin-profile-city"
                    value={draft.city}
                    onChange={updateDraft("city")}
                  />

                  <label className="admin-profile-form-label" htmlFor="admin-profile-address">
                    Address
                  </label>
                  <Input
                    id="admin-profile-address"
                    value={draft.address}
                    onChange={updateDraft("address")}
                  />

                  {saveError ? (
                    <p className="admin-profile-message admin-profile-message--error" role="alert">
                      {saveError}
                    </p>
                  ) : null}

                  <div className="admin-profile-form-actions">
                    <Button type="submit" className="admin-profile-edit-btn" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="admin-profile-card">
            <CardHeader className="admin-profile-card-title">
              <ShieldCheck size={20} />
              <CardTitle className="admin-profile-card-heading">Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="admin-profile-info-rows">
                <div className="admin-profile-info-row">
                  <span>Role</span>
                  <Badge className="admin-profile-role-badge">{formatRole(user.role)}</Badge>
                </div>
                <div className="admin-profile-info-row">
                  <span>Status</span>
                  <span className="admin-profile-status">
                    <span className="admin-profile-status-dot" aria-hidden="true" />
                    {formatStatus(user.status)}
                  </span>
                </div>
                <div className="admin-profile-info-row">
                  <span>Address</span>
                  <span>{formatAddressValue(profile.address)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="admin-profile-column admin-profile-column--wide">
          <Card className="admin-profile-card">
            <CardHeader className="admin-profile-card-title admin-profile-card-title--spaced">
              <div className="admin-profile-icon-badge">
                <Shield size={20} fill="currentColor" />
              </div>
              <CardTitle className="admin-profile-card-heading">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="admin-profile-security-grid">
                <div className="admin-profile-security-item">
                  <p className="admin-profile-security-label">Password Management</p>
                  <p className="admin-profile-security-desc">
                    Keep your account safe with a strong password.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="admin-profile-secondary-btn"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setPasswordError("");
                      setShowPasswordDialog(true);
                    }}
                  >
                    {hasPassword ? "Change Password" : "Set Password"}
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="admin-profile-security-item">
                  <p className="admin-profile-security-label">Email Address</p>
                  <p className="admin-profile-security-desc">Currently linked: {user.email}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="admin-profile-secondary-btn"
                    onClick={() => {
                      setEmailDraft(user.email);
                      setEmailPassword("");
                      setEmailError("");
                      setShowEmailDialog(true);
                    }}
                  >
                    Update Email
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-profile-card admin-profile-card--danger">
            <CardContent className="admin-profile-danger-content">
              <div className="admin-profile-danger-copy">
                <h3>Account Management</h3>
                <p>Log out of your admin session when you are finished.</p>
              </div>
              <div className="admin-profile-danger-actions">
                <Button
                  type="button"
                  variant="ghost"
                  className="admin-profile-logout-btn"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="profile-logout-modal" showCloseButton={false}>
          <form onSubmit={handleEmailSubmit}>
            <DialogHeader className="profile-logout-modal-header">
              <DialogTitle className="profile-logout-modal-title">Update email</DialogTitle>
              <DialogDescription className="profile-logout-modal-description">
                Enter your new email address and current password to confirm the change.
              </DialogDescription>
            </DialogHeader>
            <div className="admin-profile-dialog-fields">
              <label className="admin-profile-form-label" htmlFor="admin-new-email">
                New Email
              </label>
              <Input
                id="admin-new-email"
                type="email"
                value={emailDraft}
                onChange={(event) => setEmailDraft(event.target.value)}
                required
              />
              <label className="admin-profile-form-label" htmlFor="admin-email-password">
                Current Password
              </label>
              <Input
                id="admin-email-password"
                type="password"
                value={emailPassword}
                onChange={(event) => setEmailPassword(event.target.value)}
                required
              />
              {emailError ? (
                <p className="admin-profile-message admin-profile-message--error" role="alert">
                  {emailError}
                </p>
              ) : null}
            </div>
            <DialogFooter className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowEmailDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="profile-logout-confirm-btn" disabled={emailSaving}>
                {emailSaving ? "Saving..." : "Update Email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="profile-logout-modal" showCloseButton={false}>
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader className="profile-logout-modal-header">
              <DialogTitle className="profile-logout-modal-title">
                {hasPassword ? "Change password" : "Set password"}
              </DialogTitle>
              <DialogDescription className="profile-logout-modal-description">
                {hasPassword
                  ? "Enter your current password and choose a new one. A confirmation email will be sent."
                  : "You signed in with Google. Set a Relux password to also use email login."}
              </DialogDescription>
            </DialogHeader>
            <div className="admin-profile-dialog-fields">
              {hasPassword ? (
                <>
                  <label className="admin-profile-form-label" htmlFor="admin-current-password">
                    Current Password
                  </label>
                  <Input
                    id="admin-current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </>
              ) : null}
              <label className="admin-profile-form-label" htmlFor="admin-new-password">
                {hasPassword ? "New Password" : "Password"}
              </label>
              <Input
                id="admin-new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                autoComplete="new-password"
              />
              <label className="admin-profile-form-label" htmlFor="admin-confirm-password">
                Confirm Password
              </label>
              <Input
                id="admin-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
              />
              {passwordError ? (
                <p className="admin-profile-message admin-profile-message--error" role="alert">
                  {passwordError}
                </p>
              ) : null}
            </div>
            <DialogFooter className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="profile-logout-confirm-btn" disabled={passwordSaving}>
                {passwordSaving ? "Saving..." : hasPassword ? "Update Password" : "Set Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="profile-logout-modal" showCloseButton={false}>
          <DialogHeader className="profile-logout-modal-header">
            <DialogTitle id="admin-logout-title" className="profile-logout-modal-title">
              Log out?
            </DialogTitle>
            <DialogDescription className="profile-logout-modal-description">
              Are you sure you want to log out of your admin account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="profile-logout-modal-actions">
            <Button
              type="button"
              variant="ghost"
              className="profile-logout-cancel-btn"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button type="button" className="profile-logout-confirm-btn" onClick={handleLogoutConfirm}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfile;
