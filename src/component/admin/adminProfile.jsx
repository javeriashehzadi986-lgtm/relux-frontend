import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BellRing,
  ChevronRight,
  LogOut,
  Mail,
  Pencil,
  Shield,
  ShieldCheck,
  Smartphone,
  Ticket,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Switch } from "@/components/ui/switch";
import "./adminProfile.css";
import "../profile.css";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDGwkedp3jbJaCNOxJHzXx3Pw6FC-QoWyG5hGRCoiUooqfYIhIZKnM5SDbYVb2LYAwv23KngCHu4sFFCW6nuYEBCchhu7VmlxK-7RAqsiOTRm3LqU-urvWlV7YFrlyMpfZ9cv52dftcSjMT2Dd2aFvZ2wDlDh54lRcC6pW4LHjOseDw6VzBXZKySayazQSGamntSmIbujTYpqpy3N5MBZTBPskPSLrnwFQfh0x3piKkvD4Uq8GqP1XnJug0pECiNNTrq54GoHWjuQY";

const NOTIFICATION_PREFS = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive global system updates and weekly summaries.",
    icon: Mail,
    defaultChecked: true,
  },
  {
    id: "sellerVerification",
    label: "Seller Verification Alerts",
    description: "Get notified when a new seller submits documentation.",
    icon: UserCheck,
    defaultChecked: true,
  },
  {
    id: "reports",
    label: "Reports & Complaints Alerts",
    description: "Immediate alerts for high-priority user complaints.",
    icon: AlertTriangle,
    defaultChecked: false,
  },
  {
    id: "support",
    label: "Support Ticket Alerts",
    description: "Notifications for new and escalated support tickets.",
    icon: Ticket,
    defaultChecked: true,
  },
];

const AdminProfile = () => {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState(() =>
    NOTIFICATION_PREFS.reduce(
      (acc, pref) => ({ ...acc, [pref.id]: pref.defaultChecked }),
      {},
    ),
  );

  const handleNotificationChange = (id, checked) => {
    setNotificationPrefs((current) => ({ ...current, [id]: checked }));
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const handleDeactivateConfirm = () => {
    setShowDeactivateConfirm(false);
    navigate("/login");
  };

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-page-header">
        <h1>Admin Profile &amp; Settings</h1>
        <p>Manage your profile, account security, and preferences.</p>
      </div>

      <div className="admin-profile-grid">
        <div className="admin-profile-column">
          <Card className="admin-profile-card admin-profile-card--profile">
            <CardContent className="admin-profile-card-content">
            <div className="admin-profile-avatar-wrap">
              <img src={ADMIN_AVATAR} alt="Elena Vance profile" />
              <Button type="button" variant="ghost" size="icon" className="admin-profile-avatar-edit" aria-label="Edit photo">
                <Pencil size={14} />
              </Button>
            </div>
            <h2>Elena Vance</h2>
            <p className="admin-profile-email">admin@reluxhub.com</p>

            <dl className="admin-profile-details">
              <div>
                <dt>Phone Number</dt>
                <dd>+1 (555) 012-3456</dd>
              </div>
              <div>
                <dt>Time Zone</dt>
                <dd>EST (UTC-5)</dd>
              </div>
            </dl>

            <Button type="button" className="admin-profile-edit-btn">
              Edit Profile
            </Button>
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
                <Badge className="admin-profile-role-badge">Super Admin</Badge>
              </div>
              <div className="admin-profile-info-row">
                <span>Last Login</span>
                <strong>2 hours ago</strong>
              </div>
              <div className="admin-profile-info-row">
                <span>Status</span>
                <span className="admin-profile-status">
                  <span className="admin-profile-status-dot" aria-hidden="true" />
                  Active
                </span>
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
                  onClick={() => navigate("/forgot-password")}
                >
                  Change Password
                  <ChevronRight size={16} />
                </Button>
              </div>
              <div className="admin-profile-security-item">
                <p className="admin-profile-security-label">Email Address</p>
                <p className="admin-profile-security-desc">
                  Currently linked: admin@reluxhub.com
                </p>
                <Button type="button" variant="ghost" className="admin-profile-secondary-btn">
                  Update Email
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            <div className="admin-profile-2fa-row">
              <div className="admin-profile-2fa-copy">
                <span className="admin-profile-2fa-icon">
                  <Smartphone size={20} />
                </span>
                <div>
                  <p>Two-Factor Authentication (2FA)</p>
                  <span>Add an extra layer of security to your account.</span>
                </div>
              </div>
              <Switch
                id="admin-2fa"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
                aria-label="Two-factor authentication"
              />
            </div>
            </CardContent>
          </Card>

          <Card className="admin-profile-card">
            <CardHeader className="admin-profile-card-title admin-profile-card-title--spaced">
              <div className="admin-profile-icon-badge admin-profile-icon-badge--secondary">
                <BellRing size={20} />
              </div>
              <CardTitle className="admin-profile-card-heading">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>

            <div className="admin-profile-notification-list">
              {NOTIFICATION_PREFS.map((pref) => {
                const Icon = pref.icon;
                return (
                  <div key={pref.id} className="admin-profile-notification-row">
                    <div className="admin-profile-notification-copy">
                      <Icon size={20} aria-hidden="true" />
                      <div>
                        <p>{pref.label}</p>
                        <span>{pref.description}</span>
                      </div>
                    </div>
                    <Switch
                      id={`admin-notif-${pref.id}`}
                      checked={notificationPrefs[pref.id]}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(pref.id, checked)
                      }
                      aria-label={pref.label}
                    />
                  </div>
                );
              })}
            </div>
            </CardContent>
          </Card>

          <Card className="admin-profile-card admin-profile-card--danger">
            <CardContent className="admin-profile-danger-content">
            <div className="admin-profile-danger-copy">
              <h3>Account Management</h3>
              <p>Log out of your session or permanently deactivate your account.</p>
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
              <Button
                type="button"
                className="admin-profile-deactivate-btn"
                onClick={() => setShowDeactivateConfirm(true)}
              >
                <UserX size={18} />
                Deactivate
              </Button>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
            <Button
              type="button"
              className="profile-logout-confirm-btn"
              onClick={handleLogoutConfirm}
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
        <DialogContent className="profile-logout-modal" showCloseButton={false}>
          <DialogHeader className="profile-logout-modal-header">
            <DialogTitle id="admin-deactivate-title" className="profile-logout-modal-title">
              Deactivate account?
            </DialogTitle>
            <DialogDescription className="profile-logout-modal-description">
              This will permanently deactivate your admin account. You will lose access
              until an administrator restores it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="profile-logout-modal-actions">
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
              className="profile-delete-confirm-btn"
              onClick={handleDeactivateConfirm}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfile;
