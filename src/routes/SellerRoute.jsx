import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SellerRoute({ children }) {
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "seller" || user.status !== "pending") {
      setStatusChecked(true);
      return;
    }

    let cancelled = false;
    setStatusChecked(false);

    refreshUser()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setStatusChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loading, user, refreshUser]);

  if (loading || (user?.role === "seller" && user?.status === "pending" && !statusChecked)) {
    return (
      <div className="auth-loading" style={{ padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  if (user.status === "pending") {
    return <Navigate to="/seller-pending" replace />;
  }

  if (user.status === "rejected") {
    return <Navigate to="/seller-rejected" replace />;
  }

  if (user.status === "suspended") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
