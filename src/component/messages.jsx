import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMessaging } from "@/hooks/useMessaging";
import api from "@/services/api";
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

const CHAT_FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
];

const filterConversations = (conversations, filter, searchQuery, isSeller) => {
  let list = conversations;

  if (filter === "unread") {
    list = list.filter((conversation) => conversation.unread > 0);
  }

  const query = searchQuery.trim().toLowerCase();
  if (!query) return list;

  return list.filter((conversation) => {
    const name = isSeller ? conversation.buyerName : conversation.sellerName;
    const title = isSeller ? conversation.listingTitle : conversation.dressTitle;
    return (
      name?.toLowerCase().includes(query) ||
      title?.toLowerCase().includes(query) ||
      conversation.preview?.toLowerCase().includes(query)
    );
  });
};

const getChatMenuOptions = ({ listingId, isMuted, hasUnread, isSeller }) =>
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
      label: isSeller ? "View my listing" : "View dress listing",
      icon: isSeller ? "inventory_2" : "visibility",
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
      id: "report",
      label: "Report conversation",
      icon: "flag",
      show: !isSeller,
      action: "report",
    },
    {
      id: "block",
      label: isSeller ? "Block buyer" : "Block seller",
      icon: "block",
      show: true,
      action: "block",
      danger: true,
    },
  ].filter((option) => option.show);

const MessagesContent = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const {
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
    selectConversation,
    markConversationRead,
    refreshActive,
  } = useMessaging(conversationId);

  const [message, setMessage] = useState("");
  const [chatFilter, setChatFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [attachError, setAttachError] = useState("");
  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const filteredConversations = useMemo(
    () => filterConversations(conversations, chatFilter, searchQuery, isSeller),
    [conversations, chatFilter, searchQuery, isSeller],
  );

  const hasUnread = conversations.some((conversation) => conversation.unread > 0);
  const currentUnread =
    (conversations.find((conversation) => conversation.id === activeId)?.unread ?? 0) > 0;

  const listingId = isSeller ? thread?.listingId : thread?.dressId;
  const chatMenuOptions = useMemo(
    () =>
      getChatMenuOptions({
        listingId,
        isMuted: muted,
        hasUnread: currentUnread,
        isSeller,
      }),
    [listingId, muted, currentUnread, isSeller],
  );

  const showChatContent = Boolean(conversationId) || isDesktop;
  const hideSidebar = Boolean(conversationId) && !isDesktop;
  const messages = thread?.messages ?? [];

  const partnerName = isSeller ? thread?.buyerName : thread?.sellerName;
  const partnerFirstName = isSeller ? thread?.buyerFirstName : thread?.sellerFirstName;
  const listingTitle = isSeller ? thread?.listingTitle : thread?.dressTitle;

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

  const handleMenuAction = async (action) => {
    if (!activeId) return;

    try {
    switch (action) {
      case "markRead":
          if (activeId) {
            await markConversationRead(activeId);
            await refreshActive();
          }
        setActionNotice("Conversation marked as read.");
        break;
        case "viewListing":
          if (listingId) {
            navigate(isSeller ? "/sellerProfile?section=listings" : `/dress/${listingId}`);
        }
        break;
      case "toggleMute":
          await toggleMute();
          setActionNotice(
            muted ? "Notifications unmuted." : "Notifications muted for this chat.",
          );
        break;
      case "clearHistory":
          await clearHistory();
        setActionNotice("Chat history cleared.");
        break;
      case "report":
          await api.createReport({
            issueType: "Other",
            subject: `Report conversation with ${partnerName ?? "user"}`,
            message: [
              `Conversation ID: ${activeId}`,
              listingTitle ? `Listing: ${listingTitle}` : null,
              `Reported by: ${isSeller ? "seller" : "buyer"}`,
              "",
              "This report was submitted from the messages screen.",
            ]
              .filter(Boolean)
              .join("\n"),
          });
          setActionNotice("Report submitted. Our support team will review this conversation.");
        break;
      case "block":
          await blockConversation();
          setActionNotice(`${partnerName ?? "User"} has been blocked.`);
        break;
      default:
        break;
      }
    } catch (err) {
      setActionNotice(err.message || "Action failed.");
    }

    setMenuOpen(false);
  };

  const handleSend = async (image = "") => {
    const trimmed = message.trim();
    if (!trimmed || !activeId || sending) return;

    setSending(true);
    setAttachError("");
    try {
      await sendMessage(trimmed, image);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    } catch (err) {
      setActionNotice(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleAttachImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activeId) return;

    if (!file.type.startsWith("image/")) {
      setAttachError("Please choose an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAttachError("Image must be under 2MB.");
      return;
    }

    setAttachError("");
    setSending(true);

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(file);
      });

      const caption = message.trim() || "Shared an image";
      await sendMessage(caption, String(dataUrl));
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      }
    } catch (err) {
      setActionNotice(err.message || "Failed to send image.");
    } finally {
      setSending(false);
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
    notifyTyping();
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 80)}px`;
  };

  if (loading) {
    return (
      <div className="seller-chat-page" style={{ padding: "3rem 1.5rem", margin: 0 }}>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <div className="seller-chat-page" style={{ padding: "3rem 1.5rem", margin: 0 }}>
        <p>{error}</p>
        <Link to={isSeller ? "/sellerProfile" : "/categories"}>
          {isSeller ? "Back to dashboard" : "Browse pre-owned dresses"}
        </Link>
      </div>
    );
  }

  if (!activeConversation || !thread) {
    return (
      <div className="seller-chat-page" style={{ padding: "3rem 1.5rem", margin: 0 }}>
        <p>{isSeller ? "No buyer inquiries yet." : "No conversations yet."}</p>
        <Link to={isSeller ? "/sellerProfile" : "/categories"}>
          {isSeller ? "Back to dashboard" : "Browse pre-owned dresses"}
        </Link>
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
            <h2>{isSeller ? "Buyer Inquiries" : "Concierge Messages"}</h2>
            <div className="seller-chat-search-wrap">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
              <input
                className="seller-chat-search"
                type="search"
                placeholder={isSeller ? "Search buyers or listings..." : "Search chats..."}
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
                onClick={() => markAllRead().catch(() => {})}
                disabled={!hasUnread}
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="seller-chat-conversation-list custom-scrollbar">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const name = isSeller ? conversation.buyerName : conversation.sellerName;
                const title = isSeller ? conversation.listingTitle : conversation.dressTitle;
                const image = isSeller ? conversation.listingImage : conversation.dressImage;

                return (
                <button
                  key={conversation.id}
                  type="button"
                  className={`seller-chat-conversation ${
                      conversation.id === activeId ? "seller-chat-conversation--active" : ""
                  }`}
                    onClick={() => selectConversation(conversation.id)}
                >
                  <div className="seller-chat-conversation-body">
                    <div className="seller-chat-conversation-top">
                        <h3>{name}</h3>
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
                        <img src={image} alt="" />
                        <span>{title}</span>
                    </div>
                  </div>
                  {conversation.unread ? (
                      <span className="seller-chat-unread" aria-label={`${conversation.unread} unread`}>
                      {conversation.unread}
                    </span>
                  ) : null}
                </button>
                );
              })
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
              <p>
                {isSeller
                  ? "Choose an inquiry to reply about your listing."
                  : "Choose a chat from the list to view messages with a seller."}
              </p>
            </div>
          ) : (
            <>
              {!isDesktop && conversationId ? (
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
              ) : null}

              <header className="seller-chat-header">
                <div className="seller-chat-header-left">
                  <div className="seller-chat-header-info">
                    <h2>{partnerName}</h2>
                    <span>
                      {typingUser
                        ? `${typingUser} is typing...`
                        : socketConnected
                          ? "Live chat connected"
                          : "Connecting..."}{" "}
                      • {isSeller ? "Buyer inquiry" : "Seller chat"}
                    </span>
                  </div>
                </div>
                <div className="seller-chat-header-right">
                  <div className="seller-chat-discussing">
                    <span className="seller-chat-discussing-label">
                      {isSeller ? "Listing" : "Discussing"}
                    </span>
                    <span className="seller-chat-discussing-title">{listingTitle}</span>
                  </div>
                  {listingId ? (
                  <Link
                      to={
                        isSeller
                          ? "/sellerProfile?section=listings"
                          : `/dress/${listingId}`
                      }
                    className="seller-chat-view-dress-btn"
                    aria-label={isSeller ? "View my listing" : "View dress listing"}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                        {isSeller ? "inventory_2" : "visibility"}
                    </span>
                    <span className="seller-chat-view-dress-label">
                      {isSeller ? "My Listing" : "View Dress"}
                    </span>
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

              {muted ? (
                <div className="seller-chat-muted-banner">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    notifications_off
                  </span>
                  Notifications are muted for this conversation.
                </div>
              ) : null}

              <div className="seller-chat-safety-banner" role="note">
                <span className="material-symbols-outlined" aria-hidden="true">
                  gpp_maybe
                </span>
                <p>
                  Keep deals and payments inside Relux Hub. If you contact each other
                  outside this chat or complete a deal off the platform, Relux Hub is
                  not responsible for any fraud, loss, or dispute.
                </p>
              </div>

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
                            <img src={item.image} alt="Attachment" />
                          </div>
                        ) : null}
                        <span className="seller-chat-message-time">{item.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} className="seller-chat-message seller-chat-message--sent">
                      <div className="seller-chat-message-content">
                        <div className="seller-chat-bubble seller-chat-bubble--sent">{item.text}</div>
                        {item.image ? (
                          <div className="seller-chat-message-image">
                            <img src={item.image} alt="Attachment" />
                        </div>
                        ) : null}
                        <span className="seller-chat-message-time">
                          {item.time}
                          {item.status ? ` • ${item.status}` : ""}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {typingUser ? (
                <p className="seller-chat-typing-indicator" aria-live="polite">
                  {typingUser} is typing...
                </p>
              ) : null}

              <footer className="seller-chat-footer">
                <div className="seller-chat-footer-inner">
                  <div className="seller-chat-footer-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageSelected}
                    />
                    <button
                      type="button"
                      className="seller-chat-icon-btn"
                      aria-label="Attach image"
                      onClick={handleAttachImage}
                      disabled={sending || !activeId}
                    >
                      <span className="material-symbols-outlined">attach_file</span>
                    </button>
                  </div>
                  <div className="seller-chat-input-wrap">
                    <textarea
                      ref={textareaRef}
                      className="seller-chat-input custom-scrollbar"
                      rows={1}
                      placeholder={`Type your message to ${partnerFirstName}...`}
                      value={message}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      aria-label={`Message ${partnerName}`}
                    />
                  </div>
                  <button
                    type="button"
                    className="seller-chat-send-btn"
                    aria-label="Send message"
                    onClick={() => handleSend()}
                    disabled={sending || !message.trim()}
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                {attachError ? (
                  <p className="seller-chat-attach-error" role="alert">
                    {attachError}
                  </p>
                ) : null}
                <p className="seller-chat-protection">
                  Off-platform deals (WhatsApp, calls, outside payment) are at your own
                  risk. Relux Hub is not liable for fraud or loss outside the system.
                </p>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const Messages = () => <MessagesContent />;

export default Messages;
