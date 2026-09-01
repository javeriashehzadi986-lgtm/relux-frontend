import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getPostAuthPath } from "@/utils/authRedirect";

export default function ProtectedRoute({ children, roles, redirectTo = "/login" }) {
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
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={getPostAuthPath(user)} replace />;
  }

  return children;
}
