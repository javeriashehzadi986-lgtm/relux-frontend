import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { resolveWishlistPayload } from "@/data/wishlistStore";
import { useRequireLogin } from "@/hooks/useRequireLogin";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const requireLogin = useRequireLogin();
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(null);

  const showNotice = useCallback((message) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 4000);
  }, []);

  useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setApiItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getWishlist();
      setApiItems(data.items ?? []);
    } catch {
      setApiItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const items = isAuthenticated ? apiItems : [];
  const ids = useMemo(
    () => new Set(apiItems.map((item) => item.id)),
    [apiItems],
  );

  const isSaved = useCallback(
    (id) => (isAuthenticated ? ids.has(id) : false),
    [ids, isAuthenticated],
  );

  const isInWishlist = useCallback(
    (id) => (isAuthenticated ? ids.has(id) : false),
    [ids, isAuthenticated],
  );

  const add = useCallback(
    async (productOrId) => {
      if (!requireLogin()) return false;

      const payload = resolveWishlistPayload(productOrId);
      try {
        await api.addWishlistItem(payload);
        await loadWishlist();
        return true;
      } catch (error) {
        showNotice(error.message || "Could not save to wishlist");
        return false;
      }
    },
    [loadWishlist, requireLogin, showNotice],
  );

  const remove = useCallback(
    async (id) => {
      if (!requireLogin()) return;

      await api.removeWishlistItem(id);
      await loadWishlist();
    },
    [loadWishlist, requireLogin],
  );

  const toggle = useCallback(
    async (productOrId) => {
      if (!requireLogin()) return false;

      const payload = resolveWishlistPayload(productOrId);
      try {
        const data = await api.toggleWishlistItem(payload);
        await loadWishlist();
        return Boolean(data.saved);
      } catch (error) {
        showNotice(error.message || "Could not update wishlist");
        return isSaved(
          typeof productOrId === "string" ? productOrId : productOrId.id,
        );
      }
    },
    [loadWishlist, requireLogin, isSaved, showNotice],
  );

  const value = useMemo(
    () => ({
      items,
      ids,
      loading,
      isSaved,
      isInWishlist,
      add,
      remove,
      toggle,
      refresh: loadWishlist,
    }),
    [items, ids, loading, isSaved, isInWishlist, add, remove, toggle, loadWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {notice ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "1.5rem",
            transform: "translateX(-50%)",
            zIndex: 60,
            maxWidth: "90vw",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            background: "#303333",
            color: "#fff",
            fontSize: "0.875rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          {notice}
        </div>
      ) : null}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
