import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import "./adminContactMessages.css";

const STATUS_LABELS = {
  new: "New",
  read: "Read",
  resolved: "Resolved",
};

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getAdminContactMessages();
      setMessages(data.messages ?? []);
      setStats(data.stats ?? { total: 0, unread: 0 });
    } catch (err) {
      setError(err.message || "Failed to load contact messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return messages;
    return messages.filter((item) => item.status === statusFilter);
  }, [messages, statusFilter]);

  const selected = messages.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected && filtered[0]) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selected]);

  useEffect(() => {
    if (!selected) {
      setReplyText("");
      return;
    }
    setReplyText(selected.adminReply || "");
    setSuccess("");
  }, [selected?.id]);

  const updateStatus = async (status) => {
    if (!selected) return;
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.updateAdminContactMessage(selected.id, { status });
      setMessages((current) =>
        current.map((item) => (item.id === selected.id ? data.contact : item)),
      );
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to update message");
    } finally {
      setActionLoading(false);
    }
  };

  const sendReply = async () => {
    if (!selected) return;
    const trimmed = replyText.trim();
    if (!trimmed) {
      setError("Type a reply before sending.");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.replyAdminContactMessage(selected.id, {
        reply: trimmed,
      });
      setMessages((current) =>
        current.map((item) => (item.id === selected.id ? data.contact : item)),
      );
      setReplyText(data.contact?.adminReply || trimmed);
      setSuccess(
        data.emailSent
          ? "Reply emailed to the user successfully."
          : data.message || "Reply saved.",
      );
      await loadMessages();
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-contact-page">
      <header className="admin-contact-header">
        <div className="admin-contact-header-left">
          <div>
            <h1>Contact Messages</h1>
            <p>Messages submitted from the website Contact Us form.</p>
          </div>
        </div>
        <button type="button" className="admin-contact-refresh" onClick={loadMessages}>
          Refresh
        </button>
      </header>

      {error && (
        <p className="admin-contact-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="admin-contact-success" role="status">
          {success}
        </p>
      )}

      <div className="admin-contact-stats">
        <article>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>New / Unread</span>
          <strong>{stats.unread}</strong>
        </article>
      </div>

      <div className="admin-contact-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="admin-contact-layout">
        <div className="admin-contact-list">
          {loading ? (
            <p className="admin-contact-empty">Loading messages...</p>
          ) : filtered.length === 0 ? (
            <p className="admin-contact-empty">No contact messages yet.</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-contact-item ${
                  selectedId === item.id ? "admin-contact-item--active" : ""
                }`}
                onClick={() => {
                  setSelectedId(item.id);
                  if (item.status === "new") {
                    api
                      .updateAdminContactMessage(item.id, { status: "read" })
                      .then((data) => {
                        setMessages((current) =>
                          current.map((row) =>
                            row.id === item.id ? data.contact : row,
                          ),
                        );
                      })
                      .catch(() => {});
                  }
                }}
              >
                <div className="admin-contact-item-top">
                  <strong>{item.name}</strong>
                  <span className={`admin-contact-badge admin-contact-badge--${item.status}`}>
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                </div>
                <p>{item.email}</p>
                <small>{item.date}</small>
              </button>
            ))
          )}
        </div>

        {selected && (
          <aside className="admin-contact-detail">
            <h2>{selected.name}</h2>
            <p className="admin-contact-email">{selected.email}</p>
            <p className="admin-contact-date">{selected.date}</p>
            <blockquote>{selected.message}</blockquote>

            <section className="admin-contact-reply-section">
              <h3>Reply by email</h3>
              <textarea
                className="admin-contact-reply-input"
                rows={5}
                placeholder="Type your reply to the user..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={actionLoading}
              />
              {selected.adminReply ? (
                <p className="admin-contact-reply-saved">
                  Last reply saved
                  {selected.repliedDate ? ` on ${selected.repliedDate}` : ""}.
                </p>
              ) : null}
              <button
                type="button"
                className="admin-contact-reply-btn"
                disabled={actionLoading || !replyText.trim()}
                onClick={sendReply}
              >
                {actionLoading ? "Saving..." : "Send Reply via Email"}
              </button>
            </section>

            <div className="admin-contact-actions">
              <button
                type="button"
                disabled={actionLoading || selected.status === "resolved"}
                onClick={() => updateStatus("resolved")}
              >
                Mark Resolved
              </button>
              <button
                type="button"
                disabled={actionLoading || selected.status === "new"}
                onClick={() => updateStatus("new")}
              >
                Mark as New
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
