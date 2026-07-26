import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { isMongoListingId } from "@/data/dressCatalog";

export function useMessaging(conversationParam) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isSeller = user?.role === "seller";

  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [muted, setMuted] = useState(false);

  const loadConversations = useCallback(async () => {
    const data = await api.getConversations();
    setConversations(data.conversations ?? []);
    return data.conversations ?? [];
  }, []);

  const loadConversation = useCallback(async (id) => {
    const data = await api.getConversation(id);
    setActiveConversation(data.conversation);
    setThread(data.thread);
    setMuted(Boolean(data.muted));
    return data;
  }, []);

  const openListingConversation = useCallback(
    async (listingKey, state = {}) => {
      const payload = {
        listingKey,
        productId: isMongoListingId(listingKey) ? listingKey : state.productId,
        sellerId: state.sellerId,
        listingTitle: state.listingTitle,
        listingImage: state.listingImage,
        dressId: listingKey,
      };
      const data = await api.openConversation(payload);
      return data;
    },
    [],
  );

  const resolveConversation = useCallback(async () => {
    if (!conversationParam) {
      const list = await loadConversations();
      if (list[0]) {
        setActiveConversation(list[0]);
        await loadConversation(list[0].id);
      } else {
        setActiveConversation(null);
        setThread(null);
      }
      return;
    }

    try {
      await loadConversation(conversationParam);
      await loadConversations();
    } catch {
      const data = await openListingConversation(conversationParam, location.state ?? {});
      if (data.conversation?.id !== conversationParam) {
        navigate(`/messages/${data.conversation.id}`, { replace: true });
        return;
      }
      setActiveConversation(data.conversation);
      setThread(data.thread);
      setMuted(Boolean(data.muted));
      await loadConversations();
    }
  }, [
    conversationParam,
    loadConversation,
    loadConversations,
    location.state,
    navigate,
    openListingConversation,
  ]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    resolveConversation()
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load messages");
          setActiveConversation(null);
          setThread(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, resolveConversation]);

  const activeId = conversationParam ?? activeConversation?.id ?? conversations[0]?.id;

  const refreshActive = useCallback(async () => {
    if (!activeId) return;
    await loadConversation(activeId);
    await loadConversations();
  }, [activeId, loadConversation, loadConversations]);

  const sendMessage = useCallback(
    async (text) => {
      if (!activeId || !text.trim()) return;
      await api.sendMessage(activeId, { text: text.trim() });
      await refreshActive();
    },
    [activeId, refreshActive],
  );

  const markConversationRead = useCallback(
    async (id) => {
      await api.markConversationRead(id);
      await loadConversations();
    },
    [loadConversations],
  );

  const markAllRead = useCallback(async () => {
    await api.markAllConversationsRead();
    await loadConversations();
    if (activeId) await loadConversation(activeId);
  }, [activeId, loadConversation, loadConversations]);

  const toggleMute = useCallback(async () => {
    if (!activeId) return;
    const data = await api.toggleConversationMute(activeId);
    setMuted(Boolean(data.muted));
  }, [activeId]);

  const clearHistory = useCallback(async () => {
    if (!activeId) return;
    await api.clearConversationMessages(activeId);
    await refreshActive();
  }, [activeId, refreshActive]);

  const blockConversation = useCallback(async () => {
    if (!activeId) return;
    await api.blockConversation(activeId);
    await loadConversations();
    navigate("/messages");
  }, [activeId, loadConversations, navigate]);

  const selectConversation = useCallback(
    async (id) => {
      await markConversationRead(id);
      navigate(`/messages/${id}`);
    },
    [markConversationRead, navigate],
  );

  return {
    user,
    isSeller,
    conversations,
    thread,
    activeConversation,
    activeId,
    loading,
    error,
    muted,
    sendMessage,
    markAllRead,
    toggleMute,
    clearHistory,
    blockConversation,
    selectConversation,
    refreshActive,
  };
}
