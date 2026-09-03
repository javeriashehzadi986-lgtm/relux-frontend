import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Clock, ShieldCheck, Mail, AlertCircle, Upload, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import "./sellerPending.css";

export default function SellerPending() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, logout, refreshUser } = useAuth();
  const [verification, setVerification] = useState(null);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeConnecting, setStripeConnecting] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [stripeMessage, setStripeMessage] = useState("");

  const loadVerification = async () => {
    try {
      const data = await api.getSellerVerification();
      setVerification(data?.verification ?? null);
      if (data?.verification?.stripeConnected) {
        setStripeConnected(true);
      }
    } catch {
      setVerification(null);
    }
  };

  const refreshStripeStatus = async () => {
    try {
      const data = await api.getSellerStripeStatus();
      const connected = Boolean(data.stripeConnected || data.detailsSubmitted);
      setStripeConnected(connected);
      return connected;
    } catch {
      setStripeConnected(false);
      return false;
    }
  };

  useEffect(() => {
    loadVerification();
  }, [user?.id]);

  useEffect(() => {
    if (loading || user?.role !== "seller") return undefined;

    const stripeParam = searchParams.get("stripe");
    let cancelled = false;

    (async () => {
      const connected = await refreshStripeStatus();
      if (cancelled) return;

      if (stripeParam === "return") {
        setStripeMessage(
          connected
            ? "Stripe Connect completed. Our team can now finish reviewing your application."
            : "Stripe setup is still incomplete. Please continue Connect to finish payout details.",
        );
        setSearchParams({}, { replace: true });
      } else if (stripeParam === "refresh") {
        setStripeMessage("Your Stripe session expired. Click Connect Stripe to continue setup.");
        setSearchParams({}, { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, user?.role, searchParams, setSearchParams]);

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
        await refreshStripeStatus();
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

  const handleConnectStripe = async () => {
    setStripeError("");
    setStripeConnecting(true);
    try {
      const data = await api.createSellerStripeConnect({ returnTo: "pending" });
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setStripeError("Stripe Connect URL was not returned.");
    } catch (err) {
      setStripeError(err.message || "Could not start Stripe Connect");
    } finally {
      setStripeConnecting(false);
    }
  };

  if (loading || !user || user.role !== "seller" || user.status !== "pending") {
    return (
      <div className="seller-pending-page">
        <p>Loading...</p>
      </div>
    );
  }

  const needsMoreInfo = verification?.verificationStatus === "info_requested";
  const adminNote = verification?.adminNote?.trim() || "";
  const needsStripe = !stripeConnected;

  return (
    <div className="seller-pending-page">
      <Card className="seller-pending-card py-0 gap-0">
        <CardHeader className="seller-pending-header px-0">
          <span className="seller-pending-icon" aria-hidden="true">
            <Clock size={28} strokeWidth={1.75} />
          </span>
          <CardTitle className="seller-pending-title">
            {needsStripe ? "Complete Stripe Setup" : "Application Under Review"}
          </CardTitle>
        </CardHeader>
        <CardContent className="seller-pending-content px-0">
          <p className="seller-pending-lead">
            Thank you, <strong>{user.name}</strong>. Your CNIC and seller details were submitted
            successfully.
            {needsStripe
              ? " Finish Stripe Connect so you can receive payouts — admin review continues after that."
              : null}
          </p>

          <div className="seller-pending-status-box">
            <p className="seller-pending-status-label">Current status</p>
            <span
              className={`seller-pending-status-badge ${
                needsStripe
                  ? "seller-pending-status-badge--stripe"
                  : needsMoreInfo
                    ? "seller-pending-status-badge--info"
                    : ""
              }`.trim()}
            >
              {needsStripe
                ? "Stripe Connect required"
                : needsMoreInfo
                  ? "More information needed"
                  : "Pending approval"}
            </span>
          </div>

          {stripeMessage ? (
            <div className="seller-pending-stripe-box" role="status">
              <p>{stripeMessage}</p>
            </div>
          ) : null}

          {needsStripe ? (
            <div className="seller-pending-stripe-box">
              <div className="seller-pending-info-heading">
                <Wallet size={18} strokeWidth={1.75} />
                <strong>Connect Stripe (required)</strong>
              </div>
              <p>
                Enter your payout and identity information on Stripe. This is part of seller
                verification along with your CNIC.
              </p>
              {stripeError ? (
                <p className="seller-pending-stripe-error" role="alert">
                  {stripeError}
                </p>
              ) : null}
              <Button
                type="button"
                className="seller-pending-stripe-btn"
                onClick={handleConnectStripe}
                disabled={stripeConnecting}
              >
                <Wallet size={18} strokeWidth={1.75} />
                {stripeConnecting ? "Opening Stripe…" : "Connect Stripe Account"}
              </Button>
            </div>
          ) : (
            <div className="seller-pending-stripe-box seller-pending-stripe-box--ok">
              <div className="seller-pending-info-heading">
                <Wallet size={18} strokeWidth={1.75} />
                <strong>Stripe Connect complete</strong>
              </div>
              <p>Your payout account is linked. Our team can now review your application.</p>
            </div>
          )}

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
              Our team usually reviews applications within 24 to 48 business hours after Stripe is
              connected.
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
