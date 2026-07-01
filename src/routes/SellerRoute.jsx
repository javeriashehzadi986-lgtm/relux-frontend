import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
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

  if (user.status === "suspended") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
