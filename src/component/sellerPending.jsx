import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, ShieldCheck, Mail, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import "./sellerPending.css";

export default function SellerPending() {
  const navigate = useNavigate();
  const { user, loading, logout, refreshUser } = useAuth();
  const [verification, setVerification] = useState(null);

  const loadVerification = async () => {
    try {
      const data = await api.getSellerVerification();
      setVerification(data?.verification ?? null);
    } catch {
      setVerification(null);
    }
  };

  useEffect(() => {
    loadVerification();
  }, [user?.id]);

  useEffect(() => {
    if (loading) return;

    const checkStatus = async () => {
      const freshUser = await refreshUser();
      if (!freshUser) {
        navigate("/login", { replace: true });
        return;
      }
      if (freshUser.role !== "seller") {
        navigate("/home", { replace: true });
        return;
      }
      if (freshUser.status === "active") {
        navigate("/sellerProfile", { replace: true });
        return;
      }
      if (freshUser.status === "rejected") {
        navigate("/seller-rejected", { replace: true });
      }
    };

    checkStatus();
  }, [loading, navigate, refreshUser]);

  useEffect(() => {
    if (loading || !user || user.role !== "seller" || user.status !== "pending") {
      return undefined;
    }

    const checkApproval = async () => {
      try {
        const freshUser = await refreshUser();
        await loadVerification();
        if (freshUser.status === "active") {
          navigate("/sellerProfile", { replace: true });
        } else if (freshUser.status === "rejected") {
          navigate("/seller-rejected", { replace: true });
        }
      } catch {
        // ignore polling errors
      }
    };

    checkApproval();
    const interval = window.setInterval(checkApproval, 10000);
    window.addEventListener("focus", checkApproval);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", checkApproval);
    };
  }, [loading, user, refreshUser, navigate]);

  if (loading || !user || user.role !== "seller" || user.status !== "pending") {
    return (
      <div className="seller-pending-page">
        <p>Loading...</p>
      </div>
    );
  }

  const needsMoreInfo = verification?.verificationStatus === "info_requested";
  const adminNote = verification?.adminNote?.trim() || "";

  return (
    <div className="seller-pending-page">
      <Card className="seller-pending-card py-0 gap-0">
        <CardHeader className="seller-pending-header px-0">
          <span className="seller-pending-icon" aria-hidden="true">
            <Clock size={28} strokeWidth={1.75} />
          </span>
          <CardTitle className="seller-pending-title">Application Under Review</CardTitle>
        </CardHeader>
        <CardContent className="seller-pending-content px-0">
          <p className="seller-pending-lead">
            Thank you, <strong>{user.name}</strong>. Your seller verification has been submitted
            successfully.
          </p>

          <div className="seller-pending-status-box">
            <p className="seller-pending-status-label">Current status</p>
            <span
              className={`seller-pending-status-badge ${
                needsMoreInfo ? "seller-pending-status-badge--info" : ""
              }`.trim()}
            >
              {needsMoreInfo ? "More information needed" : "Pending approval"}
            </span>
          </div>

          {needsMoreInfo && adminNote ? (
            <div className="seller-pending-info-box" role="alert">
              <div className="seller-pending-info-heading">
                <AlertCircle size={18} strokeWidth={1.75} />
                <strong>Admin request</strong>
              </div>
              <p>{adminNote}</p>
              <p className="seller-pending-info-help">
                Upload updated documents below so our team can continue reviewing your application.
              </p>
            </div>
          ) : null}

          <ul className="seller-pending-list">
            <li>
              <ShieldCheck size={18} strokeWidth={1.75} />
              Our team usually reviews applications within 24 to 48 business hours.
            </li>
            <li>
              <Mail size={18} strokeWidth={1.75} />
              You will get an update at <strong>{user.email}</strong> once approved.
            </li>
          </ul>

          <p className="seller-pending-note">
            Once admin approves your account, you will be redirected to the seller dashboard
            automatically. Then you can add listings and manage your shop.
          </p>

          <div className="seller-pending-actions">
            {needsMoreInfo ? (
              <Button
                type="button"
                variant="default"
                onClick={() =>
                  navigate("/sellerVerification", { state: { updateDocuments: true } })
                }
              >
                <Upload size={18} strokeWidth={1.75} />
                Update Documents
              </Button>
            ) : null}
            <Button type="button" variant="default" asChild>
              <Link to="/home">Back to Home</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
