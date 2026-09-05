import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { syncLocalWishlistToServer } from "@/data/wishlistStore";
import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
} from "@/services/realtimeSocket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!api.getToken()) {
      return null;
    }
    return api.getStoredUser();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      api.setStoredUser(null);
      setUser(null);
      setLoading(false);
      disconnectRealtimeSocket();
      return;
    }

    api
      .getMe()
      .then(async (data) => {
        setUser(data.user);
        api.setStoredUser(data.user);
        connectRealtimeSocket();
        await syncLocalWishlistToServer(api).catch(() => {});
      })
      .catch(() => {
        api.setToken(null);
        api.setStoredUser(null);
        setUser(null);
        disconnectRealtimeSocket();
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && api.getToken()) {
      connectRealtimeSocket();
      return undefined;
    }
    disconnectRealtimeSocket();
    return undefined;
  }, [user]);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    connectRealtimeSocket();
    await syncLocalWishlistToServer(api).catch(() => {});
    return data.user;
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const data = await api.googleAuth({ credential });
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    connectRealtimeSocket();
    await syncLocalWishlistToServer(api).catch(() => {});
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.register(payload);
    if (data.token && data.user) {
      api.setToken(data.token);
      api.setStoredUser(data.user);
      setUser(data.user);
      connectRealtimeSocket();
      await syncLocalWishlistToServer(api).catch(() => {});
    }
    return data;
  }, []);

  const loginWithToken = useCallback(async (token, userData) => {
    api.setToken(token);
    api.setStoredUser(userData);
    setUser(userData);
    connectRealtimeSocket();
    await syncLocalWishlistToServer(api).catch(() => {});
    return userData;
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

  const updateEmail = useCallback(async (payload) => {
    const data = await api.updateEmail(payload);
    setUser(data.user);
    api.setStoredUser(data.user);
    return data.user;
  }, []);

  const changePassword = useCallback(async (payload) => {
    const data = await api.changePassword(payload);
    if (data?.user) {
      setUser(data.user);
      api.setStoredUser(data.user);
    }
    return data;
  }, []);

  const deactivateAccount = useCallback(async (payload) => {
    await api.deactivateAccount(payload);
    api.setToken(null);
    api.setStoredUser(null);
    setUser(null);
    disconnectRealtimeSocket();
  }, []);

  const submitSellerVerification = useCallback(async (payload) => {
    const data = await api.submitSellerVerification(payload);
    api.setToken(data.token);
    api.setStoredUser(data.user);
    setUser(data.user);
    connectRealtimeSocket();
    await syncLocalWishlistToServer(api).catch(() => {});
    return data;
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    api.setStoredUser(null);
    setUser(null);
    disconnectRealtimeSocket();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && api.getToken()),
      isAdmin: user?.role === "admin",
      isSeller: user?.role === "seller",
      isSellerActive: user?.role === "seller" && user?.status === "active",
      login,
      loginWithGoogle,
      loginWithToken,
      register,
      refreshUser,
      updateProfile,
      updateEmail,
      changePassword,
      deactivateAccount,
      submitSellerVerification,
      logout,
    }),
    [user, loading, login, loginWithGoogle, loginWithToken, register, refreshUser, updateProfile, updateEmail, changePassword, deactivateAccount, submitSellerVerification, logout],
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
