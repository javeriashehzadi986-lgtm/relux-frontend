import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { isMongoListingId } from "@/data/dressCatalog";
import {
  connectChatSocket,
  disconnectChatSocket,
  emitConversationRead,
  emitTypingStart,
  emitTypingStop,
  joinConversation,
  leaveConversation,
  sendChatMessage,
} from "@/services/chatSocket";

function mapIncomingMessage(message, userId) {
  if (!message) return null;
  if (message.type) return message;

  const isSent = String(message.senderId) === String(userId);
  return {
    id: message.id,
    type: isSent ? "sent" : "received",
    text: message.text,
    time: message.time,
    status: isSent ? "Sent" : undefined,
    image: message.image,
  };
}

function mergeConversationPreview(conversation, preview, isSeller) {
  if (!conversation || conversation.id !== preview.id) return conversation;

  return {
    ...conversation,
    preview: preview.preview,
    timeLabel: preview.timeLabel,
    unread: preview.unread,
    ...(isSeller ? { buyerName: preview.partnerName ?? conversation.buyerName } : {}),
    ...(!isSeller ? { sellerName: preview.partnerName ?? conversation.sellerName } : {}),
  };
}

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
  const [typingUser, setTypingUser] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const activeIdRef = useRef(null);
  const typingTimerRef = useRef(null);

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
    emitConversationRead(id);
    return data;
  }, []);

  const openListingConversation = useCallback(async (listingKey, state = {}) => {
    const payload = {
      listingKey,
      productId: isMongoListingId(listingKey) ? listingKey : state.productId,
      sellerId: state.sellerId,
      buyerId: state.buyerId,
      listingTitle: state.listingTitle,
      listingImage: state.listingImage,
      dressId: listingKey,
    };
    return api.openConversation(payload);
  }, []);

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
      await Promise.all([loadConversation(conversationParam), loadConversations()]);
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

  useEffect(() => {
    if (!user) {
      disconnectChatSocket();
      setSocketConnected(false);
      return undefined;
    }

    const socket = connectChatSocket();
    if (!socket) return undefined;

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    const onMessageNew = ({ conversationId, message }) => {
      const mapped = mapIncomingMessage(message, user.id);
      if (!mapped) return;

      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          const isActive = activeIdRef.current === conversationId;
          return {
            ...conversation,
            preview: mapped.text,
            timeLabel: "Just now",
            unread: isActive ? 0 : (conversation.unread ?? 0) + (mapped.type === "received" ? 1 : 0),
          };
        }),
      );

      if (activeIdRef.current !== conversationId) return;

      setThread((current) => {
        if (!current) return current;
        const exists = current.messages.some((item) => item.id === mapped.id);
        if (exists) return current;
        return {
          ...current,
          messages: [...current.messages, mapped],
        };
      });

      if (mapped.type === "received") {
        emitConversationRead(conversationId);
      }
    };

    const onConversationUpdated = ({ conversationId, preview }) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId
            ? mergeConversationPreview(conversation, preview, isSeller)
            : conversation,
        ),
      );

      if (activeIdRef.current === conversationId) {
        setActiveConversation((current) =>
          current ? mergeConversationPreview(current, preview, isSeller) : current,
        );
      }
    };

    const onMessagesRead = ({ conversationId }) => {
      if (activeIdRef.current !== conversationId) return;
      setThread((current) => {
        if (!current) return current;
        return {
          ...current,
          messages: current.messages.map((item) =>
            item.type === "sent" ? { ...item, status: "Read" } : item,
          ),
        };
      });
    };

    const onTypingUpdate = ({ conversationId, userName, isTyping }) => {
      if (activeIdRef.current !== conversationId) return;
      setTypingUser(isTyping ? userName : "");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message:new", onMessageNew);
    socket.on("conversation:updated", onConversationUpdated);
    socket.on("messages:read", onMessagesRead);
    socket.on("typing:update", onTypingUpdate);

    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message:new", onMessageNew);
      socket.off("conversation:updated", onConversationUpdated);
      socket.off("messages:read", onMessagesRead);
      socket.off("typing:update", onTypingUpdate);
    };
  }, [user, isSeller]);

  const activeId = conversationParam ?? activeConversation?.id ?? conversations[0]?.id;

  useEffect(() => {
    activeIdRef.current = activeId ?? null;
    if (!activeId) return undefined;

    joinConversation(activeId);
    emitConversationRead(activeId);

    return () => {
      leaveConversation(activeId);
      emitTypingStop(activeId);
      setTypingUser("");
    };
  }, [activeId]);

  const refreshActive = useCallback(async () => {
    if (!activeId) return;
    await Promise.all([loadConversation(activeId), loadConversations()]);
  }, [activeId, loadConversation, loadConversations]);

  const sendMessage = useCallback(
    async (text, image = "") => {
      if (!activeId || !text.trim()) return;

      emitTypingStop(activeId);

      try {
        await sendChatMessage(activeId, text.trim(), image);
      } catch {
        await api.sendMessage(activeId, {
          text: text.trim(),
          ...(image ? { image } : {}),
        });
        await refreshActive();
      }
    },
    [activeId, refreshActive],
  );

  const notifyTyping = useCallback(() => {
    if (!activeId) return;
    emitTypingStart(activeId);

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      emitTypingStop(activeId);
    }, 1200);
  }, [activeId]);

  const markConversationRead = useCallback(
    async (id) => {
      emitConversationRead(id);
      await api.markConversationRead(id);
      await loadConversations();
    },
    [loadConversations],
  );

  const markAllRead = useCallback(async () => {
    await api.markAllConversationsRead();
    await Promise.all([
      loadConversations(),
      ...(activeId ? [loadConversation(activeId)] : []),
    ]);
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

  const deleteConversation = useCallback(async () => {
    if (!activeId) return;
    await api.deleteConversation(activeId);
    await loadConversations();
    navigate("/messages");
  }, [activeId, loadConversations, navigate]);

  const selectConversation = useCallback(
    (id) => {
      navigate(`/messages/${id}`);
    },
    [navigate],
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
    typingUser,
    socketConnected,
    sendMessage,
    notifyTyping,
    markAllRead,
    toggleMute,
    clearHistory,
    blockConversation,
    deleteConversation,
    selectConversation,
    markConversationRead,
    refreshActive,
  };
}
