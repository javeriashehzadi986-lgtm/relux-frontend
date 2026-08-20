import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function useRequireLogin() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (returnTo) => {
      if (isAuthenticated) return true;
      navigate("/signup", {
        state: { from: returnTo ?? location.pathname },
      });
      return false;
    },
    [isAuthenticated, location.pathname, navigate],
  );
}
