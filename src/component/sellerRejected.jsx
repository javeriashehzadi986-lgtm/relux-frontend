import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import "./sellerRejected.css";

export default function SellerRejected() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [adminNote, setAdminNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role !== "seller") {
      navigate("/home", { replace: true });
      return;
    }
    if (user.status === "active") {
      navigate("/sellerProfile", { replace: true });
      return;
    }
    if (user.status === "pending") {
      navigate("/seller-pending", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadVerification() {
      try {
        const data = await api.getSellerVerification();
        if (!cancelled) {
          setAdminNote(data?.verification?.adminNote || "");
        }
      } catch {
        if (!cancelled) {
          setAdminNote("");
        }
      } finally {
        if (!cancelled) {
          setNoteLoading(false);
        }
      }
    }

    loadVerification();
    return () => {
      cancelled = true;
    };
  }, [user?.status]);

  if (loading || !user || user.role !== "seller" || user.status !== "rejected") {
    return (
      <div className="seller-rejected-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="seller-rejected-page">
      <Card className="seller-rejected-card">
        <CardHeader className="seller-rejected-header">
          <span className="seller-rejected-icon" aria-hidden="true">
            <XCircle size={28} strokeWidth={1.75} />
          </span>
          <CardTitle className="seller-rejected-title">Application Not Approved</CardTitle>
        </CardHeader>

        <CardContent className="seller-rejected-content">
          <p className="seller-rejected-lead">
            Hi <strong>{user?.name || "there"}</strong>, your seller application was reviewed and
            could not be approved at this time.
          </p>

          <div className="seller-rejected-status-box">
            <p className="seller-rejected-status-label">Status</p>
            <span className="seller-rejected-status-badge">Rejected</span>
          </div>

          {!noteLoading && adminNote ? (
            <div className="seller-rejected-reason">
              <p className="seller-rejected-reason-label">Reason from admin</p>
              <p className="seller-rejected-reason-text">{adminNote}</p>
            </div>
          ) : null}

          <ul className="seller-rejected-list">
            <li>
              <span aria-hidden="true">•</span>
              <span>You can update your documents and submit a new application.</span>
            </li>
            <li>
              <span aria-hidden="true">•</span>
              <span>Make sure your CNIC images are clear and match your profile details.</span>
            </li>
          </ul>

          <div className="seller-rejected-actions">
            <Button type="button" variant="default" asChild>
              <Link to="/sellerVerification">Re-apply as Seller</Link>
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/home">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
