import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { syncLocalWishlistToServer } from "@/data/wishlistStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then(async (data) => {
        setUser(data.user);
        api.setStoredUser(data.user);
        await syncLocalWishlistToServer(api).catch(() => {});
      })
      .catch(() => {
        api.setToken(null);
        api.setStoredUser(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    await syncLocalWishlistToServer(api).catch(() => {});
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.register(payload);
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    await syncLocalWishlistToServer(api).catch(() => {});
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api.getMe();
    setUser(data.user);
    api.setStoredUser(data.user);
    return data.user;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await api.updateProfile(payload);
    setUser(data.user);
    api.setStoredUser(data.user);
    return data.user;
  }, []);

  const applyAsSeller = useCallback(async (payload) => {
    const data = await api.applyAsSeller(payload);
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    await syncLocalWishlistToServer(api).catch(() => {});
    return data;
  }, []);

  const submitSellerVerification = useCallback(async (payload) => {
    const data = await api.submitSellerVerification(payload);
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    await syncLocalWishlistToServer(api).catch(() => {});
    return data;
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    api.setStoredUser(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isSeller: user?.role === "seller",
      isSellerActive: user?.role === "seller" && user?.status === "active",
      login,
      register,
      refreshUser,
      updateProfile,
      applyAsSeller,
      submitSellerVerification,
      logout,
    }),
    [user, loading, login, register, refreshUser, updateProfile, applyAsSeller, submitSellerVerification, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
