import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAllConversations,
  getChatThread,
  getConversationById,
} from "@/data/sellerChatData";
import {
  getSellerInboxConversation,
  getSellerInboxConversations,
  getSellerInboxThread,
} from "@/data/sellerInboxData";
import "./messages.css";

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => setIsDesktop(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
};

const filterConversations = (conversations, filter, searchQuery) => {
  let list = conversations;

  if (filter === "unread") {
    list = list.filter((conversation) => conversation.unread > 0);
  }

  const query = searchQuery.trim().toLowerCase();
  if (!query) return list;

  return list.filter(
    (conversation) =>
      conversation.sellerName.toLowerCase().includes(query) ||
      conversation.dressTitle.toLowerCase().includes(query) ||
      conversation.preview.toLowerCase().includes(query),
  );
};

const CHAT_FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

const getChatMenuOptions = ({ dressId, isMuted, hasUnread }) =>
  [
    {
      id: "mark-read",
      label: "Mark as read",
      icon: "done_all",
      show: hasUnread,
      action: "markRead",
    },
    {
      id: "view-dress",
      label: "View dress listing",
      icon: "visibility",
      show: Boolean(dressId),
      action: "viewDress",
    },
    {
      id: "mute",
      label: isMuted ? "Unmute notifications" : "Mute notifications",
      icon: isMuted ? "notifications" : "notifications_off",
      show: true,
      action: "toggleMute",
    },
    {
      id: "clear",
      label: "Clear chat history",
      icon: "delete_sweep",
      show: true,
      action: "clearHistory",
    },
    {
      id: "report",
      label: "Report conversation",
      icon: "flag",
      show: true,
      action: "report",
    },
    {
      id: "block",
      label: "Block seller",
      icon: "block",
      show: true,
      action: "block",
      danger: true,
    },
  ].filter((option) => option.show);

const filterSellerInbox = (conversations, filter, searchQuery) => {
  let list = conversations;

  if (filter === "unread") {
    list = list.filter((conversation) => conversation.unread > 0);
  }

  const query = searchQuery.trim().toLowerCase();
  if (!query) return list;

  return list.filter(
    (conversation) =>
      conversation.buyerName.toLowerCase().includes(query) ||
      conversation.listingTitle.toLowerCase().includes(query) ||
      conversation.preview.toLowerCase().includes(query),
  );
};

const getSellerChatMenuOptions = ({ listingId, isMuted, hasUnread }) =>
  [
    {
      id: "mark-read",
      label: "Mark as read",
      icon: "done_all",
      show: hasUnread,
      action: "markRead",
    },
    {
      id: "view-listing",
      label: "View my listing",
      icon: "inventory_2",
      show: Boolean(listingId),
      action: "viewListing",
    },
    {
      id: "mute",
      label: isMuted ? "Unmute notifications" : "Mute notifications",
      icon: isMuted ? "notifications" : "notifications_off",
      show: true,
      action: "toggleMute",
    },
    {
      id: "clear",
      label: "Clear chat history",
      icon: "delete_sweep",
      show: true,
      action: "clearHistory",
    },
    {
      id: "block",
      label: "Block buyer",
      icon: "block",
      show: true,
      action: "block",
      danger: true,
    },
  ].filter((option) => option.show);

const BuyerMessages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const conversations = useMemo(
    () => getAllConversations(conversationId),
    [conversationId],
  );

  const activeId = conversationId ?? conversations[0]?.id;
  const activeConversation = useMemo(
    () => (activeId ? getConversationById(activeId) : null),
    [activeId],
  );

  const thread = useMemo(() => (activeId ? getChatThread(activeId) : null), [activeId]);

  const [message, setMessage] = useState("");
  const [messagesByChat, setMessagesByChat] = useState({});
  const [chatFilter, setChatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadById, setUnreadById] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [mutedById, setMutedById] = useState({});
  const [actionNotice, setActionNotice] = useState("");
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  const conversationsWithUnread = useMemo(
    () =>
      conversations.map((conversation) => ({
        ...conversation,
        unread: unreadById[conversation.id] ?? conversation.unread ?? 0,
      })),
    [conversations, unreadById],
  );

  const filteredConversations = useMemo(
    () => filterConversations(conversationsWithUnread, chatFilter, searchQuery),
    [conversationsWithUnread, chatFilter, searchQuery],
  );

  const hasUnread = conversationsWithUnread.some((conversation) => conversation.unread > 0);
  const currentUnread = activeId
    ? (conversationsWithUnread.find((conversation) => conversation.id === activeId)?.unread ?? 0) >
      0
    : false;
  const isMuted = Boolean(activeId && mutedById[activeId]);

  const chatMenuOptions = useMemo(
    () =>
      getChatMenuOptions({
        dressId: thread?.dressId,
        isMuted,
        hasUnread: Boolean(currentUnread),
      }),
    [thread?.dressId, isMuted, currentUnread],
  );

  const showChatContent = Boolean(conversationId) || isDesktop;
  const hideSidebar = Boolean(conversationId) && !isDesktop;

  const messages = activeId ? messagesByChat[activeId] ?? thread?.messages ?? [] : [];

  useEffect(() => {
    if (!activeId || !thread) return;
    setMessagesByChat((current) => {
      if (current[activeId]) return current;
      return { ...current, [activeId]: thread.messages };
    });
  }, [activeId, thread]);

  useEffect(() => {
    setMessage("");
    setMenuOpen(false);
  }, [activeId]);

  useEffect(() => {
    if (!actionNotice) return undefined;
    const timer = window.setTimeout(() => setActionNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [actionNotice]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSelectConversation = (id) => {
    setUnreadById((current) => ({ ...current, [id]: 0 }));
    navigate(`/messages/${id}`);
  };

  const handleMarkAllAsRead = () => {
    const cleared = {};
    conversations.forEach((conversation) => {
      cleared[conversation.id] = 0;
    });
    setUnreadById(cleared);
    if (chatFilter === "unread") {
      setChatFilter("all");
    }
  };

  const handleMenuAction = (action) => {
    if (!activeId) return;

    switch (action) {
      case "markRead":
        setUnreadById((current) => ({ ...current, [activeId]: 0 }));
        setActionNotice("Conversation marked as read.");
        break;
      case "viewDress":
        if (thread?.dressId) {
          navigate(`/dress/${thread.dressId}`);
        }
        break;
      case "toggleMute":
        setMutedById((current) => ({
          ...current,
          [activeId]: !current[activeId],
        }));
        setActionNotice(isMuted ? "Notifications unmuted." : "Notifications muted for this chat.");
        break;
      case "clearHistory":
        setMessagesByChat((current) => ({ ...current, [activeId]: [] }));
        setActionNotice("Chat history cleared.");
        break;
      case "report":
        setActionNotice("Report submitted. Our concierge team will review this conversation.");
        break;
      case "block":
        setMutedById((current) => ({ ...current, [activeId]: true }));
        setActionNotice(`${thread?.sellerName ?? "Seller"} has been blocked.`);
        navigate("/messages");
        break;
      default:
        break;
    }

    setMenuOpen(false);
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || !activeId) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setMessagesByChat((current) => ({
      ...current,
      [activeId]: [
        ...(current[activeId] ?? thread?.messages ?? []),
        {
          id: `sent-${Date.now()}`,
          type: "sent",
          text: trimmed,
          time,
          status: "Sent",
        },
      ],
    }));
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInput = (event) => {
    setMessage(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 80)}px`;
  };

  if (!activeConversation || !thread) {
    return (
      <div className="seller-chat-page" style={{ padding: "3rem 1.5rem", margin: 0 }}>
        <p>No conversations yet.</p>
        <Link to="/categories">Browse pre-owned dresses</Link>
      </div>
    );
  }

  return (
    <div className="seller-chat-page">
      <div className="seller-chat-layout">
        <section
          className={`seller-chat-sidebar ${
            hideSidebar ? "seller-chat-sidebar--hidden" : ""
          }`}
        >
          <div className="seller-chat-sidebar-header">
            <h2>Concierge Messages</h2>
            <div className="seller-chat-search-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input
                className="seller-chat-search"
                type="search"
                placeholder="Search chats..."
                aria-label="Search chats"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="seller-chat-toolbar">
              <div className="seller-chat-filters" role="tablist" aria-label="Filter conversations">
                {CHAT_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={chatFilter === filter.id}
                    className={`seller-chat-filter ${
                      chatFilter === filter.id ? "seller-chat-filter--active" : ""
                    }`}
                    onClick={() => setChatFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="seller-chat-mark-read"
                onClick={handleMarkAllAsRead}
                disabled={!hasUnread}
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="seller-chat-conversation-list custom-scrollbar">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                className={`seller-chat-conversation ${
                  conversation.id === activeId ? "seller-chat-conversation--active" : ""
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="seller-chat-conversation-body">
                  <div className="seller-chat-conversation-top">
                    <h3>{conversation.sellerName}</h3>
                    <span
                      className={`seller-chat-conversation-time ${
                        conversation.id !== activeId
                          ? "seller-chat-conversation-time--muted"
                          : ""
                      }`}
                    >
                      {conversation.timeLabel}
                    </span>
                  </div>
                  <p className="seller-chat-conversation-preview">{conversation.preview}</p>
                  <div className="seller-chat-conversation-dress">
                    <img src={conversation.dressImage} alt="" />
                    <span>{conversation.dressTitle}</span>
                  </div>
                </div>
                {conversation.unread ? (
                  <span className="seller-chat-unread" aria-label={`${conversation.unread} unread`}>
                    {conversation.unread}
                  </span>
                ) : null}
              </button>
              ))
            ) : (
              <div className="seller-chat-filter-empty">
                <span className="material-symbols-outlined" aria-hidden="true">
                  chat_bubble_outline
                </span>
                <p>
                  {searchQuery.trim()
                    ? "No chats match your search."
                    : chatFilter === "unread"
                      ? "You're all caught up — no unread messages."
                      : "No conversations found."}
                </p>
                {(searchQuery.trim() || chatFilter !== "all") && (
                  <button
                    type="button"
                    className="seller-chat-filter-reset"
                    onClick={() => {
                      setChatFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    Show all chats
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section
          className={`seller-chat-panel ${
            showChatContent ? "seller-chat-panel--mobile" : ""
          }`}
        >
          {!showChatContent ? (
            <div className="seller-chat-empty-panel">
              <span className="material-symbols-outlined" aria-hidden="true">
                forum
              </span>
              <h3>Select a conversation</h3>
              <p>Choose a chat from the list to view messages with a seller.</p>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="seller-chat-back-mobile"
                onClick={() => navigate("/messages")}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                All chats
              </button>

              <header className="seller-chat-header">
                <div className="seller-chat-header-left">
                  <div className="seller-chat-header-info">
                    <h2>{thread.sellerName}</h2>
                    <span>{thread.online ? "Online" : "Offline"} • Responds in 5 mins</span>
                  </div>
                </div>
                <div className="seller-chat-header-right">
                  <div className="seller-chat-discussing">
                    <span className="seller-chat-discussing-label">Discussing</span>
                    <span className="seller-chat-discussing-title">{thread.dressTitle}</span>
                  </div>
                  {thread.dressId ? (
                    <Link to={`/dress/${thread.dressId}`} className="seller-chat-view-dress-btn">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        visibility
                      </span>
                      View Dress
                    </Link>
                  ) : null}
                  <div className="seller-chat-more-wrap" ref={menuRef}>
                    <button
                      type="button"
                      className={`seller-chat-more-btn ${menuOpen ? "seller-chat-more-btn--open" : ""}`}
                      aria-label="More options"
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                      onClick={() => setMenuOpen((open) => !open)}
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                    {menuOpen ? (
                      <div className="seller-chat-menu" role="menu" aria-label="Chat options">
                        {chatMenuOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            role="menuitem"
                            className={`seller-chat-menu-item ${
                              option.danger ? "seller-chat-menu-item--danger" : ""
                            }`}
                            onClick={() => handleMenuAction(option.action)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {option.icon}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </header>

              {actionNotice ? (
                <div className="seller-chat-notice" role="status">
                  {actionNotice}
                </div>
              ) : null}

              {isMuted ? (
                <div className="seller-chat-muted-banner">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    notifications_off
                  </span>
                  Notifications are muted for this conversation.
                </div>
              ) : null}

              <div className="seller-chat-messages custom-scrollbar">
                <div className="seller-chat-date-separator">
                  <span>{thread.dateLabel}</span>
                </div>

                {messages.map((item) =>
                  item.type === "received" ? (
                    <div key={item.id} className="seller-chat-message">
                      <div className="seller-chat-message-content">
                        <div className="seller-chat-bubble seller-chat-bubble--received">
                          {item.text}
                        </div>
                        {item.image ? (
                          <div className="seller-chat-message-image">
                            <img src={item.image} alt="Dress detail" />
                            <div className="seller-chat-message-image-overlay">
                              <span className="material-symbols-outlined" aria-hidden="true">
                                zoom_in
                              </span>
                            </div>
                          </div>
                        ) : null}
                        <span className="seller-chat-message-time">{item.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} className="seller-chat-message seller-chat-message--sent">
                      <div className="seller-chat-message-content">
                        <div className="seller-chat-bubble seller-chat-bubble--sent">{item.text}</div>
                        <span className="seller-chat-message-time">
                          {item.time}
                          {item.status ? ` • ${item.status}` : ""}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <footer className="seller-chat-footer">
                <div className="seller-chat-footer-inner">
                  <div className="seller-chat-footer-actions">
                    <button type="button" className="seller-chat-icon-btn" aria-label="Add attachment">
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <button type="button" className="seller-chat-icon-btn" aria-label="Send image">
                      <span className="material-symbols-outlined">image</span>
                    </button>
                    <button type="button" className="seller-chat-icon-btn" aria-label="Add emoji">
                      <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </button>
                  </div>
                  <div className="seller-chat-input-wrap">
                    <textarea
                      ref={textareaRef}
                      className="seller-chat-input custom-scrollbar"
                      rows={1}
                      placeholder={`Type your message to ${thread.sellerFirstName}...`}
                      value={message}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      aria-label={`Message ${thread.sellerName}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="seller-chat-send-btn"
                    aria-label="Send message"
                    onClick={handleSend}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="seller-chat-protection">
                  All payments are secured by Relux Hub Concierge Protection.
                </p>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const SellerInbox = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const conversations = useMemo(
    () => getSellerInboxConversations(conversationId),
    [conversationId],
  );

  const activeId = conversationId ?? conversations[0]?.id;
  const activeConversation = useMemo(
    () => (activeId ? getSellerInboxConversation(activeId) : null),
    [activeId],
  );
  const thread = useMemo(
    () => (activeId ? getSellerInboxThread(activeId) : null),
    [activeId],
  );

  const [message, setMessage] = useState("");
  const [messagesByChat, setMessagesByChat] = useState({});
  const [chatFilter, setChatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadById, setUnreadById] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [mutedById, setMutedById] = useState({});
  const [actionNotice, setActionNotice] = useState("");
  const textareaRef = useRef(null);
  const menuRef = useRef(null);

  const conversationsWithUnread = useMemo(
    () =>
      conversations.map((conversation) => ({
        ...conversation,
        unread: unreadById[conversation.id] ?? conversation.unread ?? 0,
      })),
    [conversations, unreadById],
  );

  const filteredConversations = useMemo(
    () => filterSellerInbox(conversationsWithUnread, chatFilter, searchQuery),
    [conversationsWithUnread, chatFilter, searchQuery],
  );

  const hasUnread = conversationsWithUnread.some(
    (conversation) => conversation.unread > 0,
  );
  const currentUnread = activeId
    ? (conversationsWithUnread.find((conversation) => conversation.id === activeId)
        ?.unread ?? 0) > 0
    : false;
  const isMuted = Boolean(activeId && mutedById[activeId]);

  const chatMenuOptions = useMemo(
    () =>
      getSellerChatMenuOptions({
        listingId: thread?.listingId,
        isMuted,
        hasUnread: Boolean(currentUnread),
      }),
    [thread?.listingId, isMuted, currentUnread],
  );

  const showChatContent = Boolean(conversationId) || isDesktop;
  const hideSidebar = Boolean(conversationId) && !isDesktop;
  const messages = activeId ? messagesByChat[activeId] ?? thread?.messages ?? [] : [];

  useEffect(() => {
    if (!activeId || !thread) return;
    setMessagesByChat((current) => {
      if (current[activeId]) return current;
      return { ...current, [activeId]: thread.messages };
    });
  }, [activeId, thread]);

  useEffect(() => {
    setMessage("");
    setMenuOpen(false);
  }, [activeId]);

  useEffect(() => {
    if (!actionNotice) return undefined;
    const timer = window.setTimeout(() => setActionNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [actionNotice]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleSelectConversation = (id) => {
    setUnreadById((current) => ({ ...current, [id]: 0 }));
    navigate(`/messages/${id}`);
  };

  const handleMarkAllAsRead = () => {
    const cleared = {};
    conversations.forEach((conversation) => {
      cleared[conversation.id] = 0;
    });
    setUnreadById(cleared);
    if (chatFilter === "unread") {
      setChatFilter("all");
    }
  };

  const handleMenuAction = (action) => {
    if (!activeId) return;

    switch (action) {
      case "markRead":
        setUnreadById((current) => ({ ...current, [activeId]: 0 }));
        setActionNotice("Conversation marked as read.");
        break;
      case "viewListing":
        navigate("/sellerProfile?section=listings");
        break;
      case "toggleMute":
        setMutedById((current) => ({
          ...current,
          [activeId]: !current[activeId],
        }));
        setActionNotice(
          isMuted ? "Notifications unmuted." : "Notifications muted for this chat.",
        );
        break;
      case "clearHistory":
        setMessagesByChat((current) => ({ ...current, [activeId]: [] }));
        setActionNotice("Chat history cleared.");
        break;
      case "block":
        setMutedById((current) => ({ ...current, [activeId]: true }));
        setActionNotice(`${thread?.buyerName ?? "Buyer"} has been blocked.`);
        navigate("/messages");
        break;
      default:
        break;
    }

    setMenuOpen(false);
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || !activeId) return;

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setMessagesByChat((current) => ({
      ...current,
      [activeId]: [
        ...(current[activeId] ?? thread?.messages ?? []),
        {
          id: `sent-${Date.now()}`,
          type: "sent",
          text: trimmed,
          time,
          status: "Sent",
        },
      ],
    }));
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleInput = (event) => {
    setMessage(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 80)}px`;
  };

  if (!activeConversation || !thread) {
    return (
      <div className="seller-chat-page" style={{ padding: "3rem 1.5rem", margin: 0 }}>
        <p>No buyer inquiries yet.</p>
        <Link to="/sellerProfile">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="seller-chat-page">
      <div className="seller-chat-layout">
        <section
          className={`seller-chat-sidebar ${
            hideSidebar ? "seller-chat-sidebar--hidden" : ""
          }`}
        >
          <div className="seller-chat-sidebar-header">
            <h2>Buyer Inquiries</h2>
            <div className="seller-chat-search-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input
                className="seller-chat-search"
                type="search"
                placeholder="Search buyers or listings..."
                aria-label="Search buyer messages"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <div className="seller-chat-toolbar">
              <div
                className="seller-chat-filters"
                role="tablist"
                aria-label="Filter conversations"
              >
                {CHAT_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={chatFilter === filter.id}
                    className={`seller-chat-filter ${
                      chatFilter === filter.id ? "seller-chat-filter--active" : ""
                    }`}
                    onClick={() => setChatFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="seller-chat-mark-read"
                onClick={handleMarkAllAsRead}
                disabled={!hasUnread}
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="seller-chat-conversation-list custom-scrollbar">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className={`seller-chat-conversation ${
                    conversation.id === activeId
                      ? "seller-chat-conversation--active"
                      : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="seller-chat-conversation-body">
                    <div className="seller-chat-conversation-top">
                      <h3>{conversation.buyerName}</h3>
                      <span
                        className={`seller-chat-conversation-time ${
                          conversation.id !== activeId
                            ? "seller-chat-conversation-time--muted"
                            : ""
                        }`}
                      >
                        {conversation.timeLabel}
                      </span>
                    </div>
                    <p className="seller-chat-conversation-preview">
                      {conversation.preview}
                    </p>
                    <div className="seller-chat-conversation-dress">
                      <img src={conversation.listingImage} alt="" />
                      <span>{conversation.listingTitle}</span>
                    </div>
                  </div>
                  {conversation.unread ? (
                    <span
                      className="seller-chat-unread"
                      aria-label={`${conversation.unread} unread`}
                    >
                      {conversation.unread}
                    </span>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="seller-chat-filter-empty">
                <span className="material-symbols-outlined" aria-hidden="true">
                  chat_bubble_outline
                </span>
                <p>
                  {searchQuery.trim()
                    ? "No chats match your search."
                    : chatFilter === "unread"
                      ? "You're all caught up — no unread messages."
                      : "No conversations found."}
                </p>
                {(searchQuery.trim() || chatFilter !== "all") && (
                  <button
                    type="button"
                    className="seller-chat-filter-reset"
                    onClick={() => {
                      setChatFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    Show all chats
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section
          className={`seller-chat-panel ${
            showChatContent ? "seller-chat-panel--mobile" : ""
          }`}
        >
          {!showChatContent ? (
            <div className="seller-chat-empty-panel">
              <span className="material-symbols-outlined" aria-hidden="true">
                forum
              </span>
              <h3>Select a buyer chat</h3>
              <p>Choose an inquiry to reply about your listing.</p>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="seller-chat-back-mobile"
                onClick={() => navigate("/messages")}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                All chats
              </button>

              <header className="seller-chat-header">
                <div className="seller-chat-header-left">
                  <div className="seller-chat-header-info">
                    <h2>{thread.buyerName}</h2>
                    <span>
                      {thread.online ? "Online" : "Offline"} • Buyer inquiry
                    </span>
                  </div>
                </div>
                <div className="seller-chat-header-right">
                  <div className="seller-chat-discussing">
                    <span className="seller-chat-discussing-label">Listing</span>
                    <span className="seller-chat-discussing-title">
                      {thread.listingTitle}
                    </span>
                  </div>
                  <Link
                    to="/sellerProfile?section=listings"
                    className="seller-chat-view-dress-btn"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      inventory_2
                    </span>
                    My Listing
                  </Link>
                  <div className="seller-chat-more-wrap" ref={menuRef}>
                    <button
                      type="button"
                      className={`seller-chat-more-btn ${
                        menuOpen ? "seller-chat-more-btn--open" : ""
                      }`}
                      aria-label="More options"
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                      onClick={() => setMenuOpen((open) => !open)}
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                    {menuOpen ? (
                      <div className="seller-chat-menu" role="menu" aria-label="Chat options">
                        {chatMenuOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            role="menuitem"
                            className={`seller-chat-menu-item ${
                              option.danger ? "seller-chat-menu-item--danger" : ""
                            }`}
                            onClick={() => handleMenuAction(option.action)}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {option.icon}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </header>

              {actionNotice ? (
                <div className="seller-chat-notice" role="status">
                  {actionNotice}
                </div>
              ) : null}

              {isMuted ? (
                <div className="seller-chat-muted-banner">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    notifications_off
                  </span>
                  Notifications are muted for this conversation.
                </div>
              ) : null}

              <div className="seller-chat-messages custom-scrollbar">
                <div className="seller-chat-date-separator">
                  <span>{thread.dateLabel}</span>
                </div>

                {messages.map((item) =>
                  item.type === "received" ? (
                    <div key={item.id} className="seller-chat-message">
                      <div className="seller-chat-message-content">
                        <div className="seller-chat-bubble seller-chat-bubble--received">
                          {item.text}
                        </div>
                        <span className="seller-chat-message-time">{item.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className="seller-chat-message seller-chat-message--sent"
                    >
                      <div className="seller-chat-message-content">
                        <div className="seller-chat-bubble seller-chat-bubble--sent">
                          {item.text}
                        </div>
                        <span className="seller-chat-message-time">
                          {item.time}
                          {item.status ? ` • ${item.status}` : ""}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <footer className="seller-chat-footer">
                <div className="seller-chat-footer-inner">
                  <div className="seller-chat-footer-actions">
                    <button
                      type="button"
                      className="seller-chat-icon-btn"
                      aria-label="Add attachment"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <button
                      type="button"
                      className="seller-chat-icon-btn"
                      aria-label="Send image"
                    >
                      <span className="material-symbols-outlined">image</span>
                    </button>
                  </div>
                  <div className="seller-chat-input-wrap">
                    <textarea
                      ref={textareaRef}
                      className="seller-chat-input custom-scrollbar"
                      rows={1}
                      placeholder={`Reply to ${thread.buyerFirstName}...`}
                      value={message}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      aria-label={`Message ${thread.buyerName}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="seller-chat-send-btn"
                    aria-label="Send message"
                    onClick={handleSend}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="seller-chat-protection">
                  Keep all payments and agreements inside Relux Hub for your protection.
                </p>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const Messages = () => {
  const isSeller = sessionStorage.getItem("userType") === "seller";
  if (isSeller) return <SellerInbox />;
  return <BuyerMessages />;
};

export default Messages;
