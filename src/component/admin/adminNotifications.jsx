import React, { useCallback, useEffect, useState } from "react";
import {
  Filter,
  History,
  Megaphone,
  Send,
} from "lucide-react";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toggleAdminSidebar } from "@/utils/adminSidebar";
import "./adminNotifications.css";

const DEFAULT_COUNTS = { all: 0, buyers: 0, sellers: 0 };

function PriorityBadge({ priority }) {
  const label =
    priority === "urgent" ? "Urgent" : priority === "important" ? "Important" : "Normal";
  const tone = priority === "urgent" ? "important" : priority;
  return (
    <Badge variant="outline" className={`admin-notifications-priority admin-notifications-priority--${tone}`}>
      {label}
    </Badge>
  );
}

const AdminNotifications = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [recipients, setRecipients] = useState("all");
  const [submitState, setSubmitState] = useState("idle");
  const [history, setHistory] = useState([]);
  const [counts, setCounts] = useState(DEFAULT_COUNTS);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [historyData, recipientData] = await Promise.all([
        api.getAdminBroadcasts(),
        api.getAdminNotificationRecipients(),
      ]);
      setHistory(historyData.broadcasts ?? []);
      setCounts(recipientData.counts ?? DEFAULT_COUNTS);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const recipientOptions = [
    { id: "all", label: "All Users", count: counts.all },
    { id: "buyers", label: "Buyers Only", count: counts.buyers },
    { id: "sellers", label: "Sellers Only", count: counts.sellers },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !message.trim() || submitState !== "idle") return;

    setSubmitState("sending");
    setError("");
    setSuccess("");
    try {
      const data = await api.sendAdminBroadcast({
        title: title.trim(),
        message: message.trim(),
        recipients,
        priority,
      });
      setSubmitState("sent");
      setSuccess(data.message || "Notification sent");
      setTitle("");
      setMessage("");
      setPriority("normal");
      setRecipients("all");
      await loadData();
      window.setTimeout(() => setSubmitState("idle"), 2000);
    } catch (err) {
      setSubmitState("idle");
      setError(err.message || "Could not send notification");
    }
  };

  const totalReached = history.reduce((sum, item) => sum + (item.sentCount || 0), 0);

  return (
    <div className="admin-notifications-page">
      <section className="admin-notifications-header">
        <div className="admin-notifications-header-left">
          <button
            type="button"
            className="admin-notifications-menu-btn"
            aria-label="Open menu"
            onClick={toggleAdminSidebar}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div>
            <h1>Notifications</h1>
            <p>Create and send announcements to users on Relux Hub.</p>
          </div>
        </div>
        <Button type="button" variant="ghost" className="admin-notifications-outline-btn" onClick={loadData}>
          Refresh
        </Button>
      </section>

      {error && (
        <p className="admin-notifications-banner admin-notifications-banner--error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="admin-notifications-banner admin-notifications-banner--success" role="status">
          {success}
        </p>
      )}

      <div className="admin-notifications-grid">
        <div className="admin-notifications-form-column">
          <Card className="admin-notifications-card">
            <CardHeader className="admin-notifications-card-title">
              <Megaphone size={20} fill="currentColor" aria-hidden="true" />
              <CardTitle>New Announcement</CardTitle>
            </CardHeader>
            <CardContent>
            <form className="admin-notifications-form" onSubmit={handleSubmit}>
              <Field className="admin-notifications-field">
                <FieldLabel htmlFor="notification-title">Notification Title</FieldLabel>
                <Input
                  id="notification-title"
                  type="text"
                  placeholder="e.g. Seasonal Sale Starting Soon!"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </Field>

              <Field className="admin-notifications-field">
                <FieldLabel htmlFor="notification-message">Message Content</FieldLabel>
                <Textarea
                  id="notification-message"
                  placeholder="Craft your message for the community..."
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </Field>

              <div className="admin-notifications-field-row">
                <Field className="admin-notifications-field admin-notifications-priority-field">
                  <FieldLabel>Priority Level</FieldLabel>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="admin-notifications-filter-select" aria-label="Priority level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={6}
                      className="admin-notifications-priority-menu"
                    >
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <fieldset className="admin-notifications-recipients">
                <legend>Target Recipients</legend>
                <RadioGroup value={recipients} onValueChange={setRecipients}>
                  {recipientOptions.map((option) => (
                    <Label key={option.id} className="admin-notifications-recipient" htmlFor={`recipient-${option.id}`}>
                      <RadioGroupItem value={option.id} id={`recipient-${option.id}`} />
                      <span>
                        {option.label} <em>({option.count})</em>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              <Button
                type="submit"
                className={`admin-notifications-send-btn ${
                  submitState === "sent" ? "admin-notifications-send-btn--success" : ""
                }`}
                disabled={submitState === "sending" || !title.trim() || !message.trim()}
              >
                <Send size={18} aria-hidden="true" />
                {submitState === "sending"
                  ? "Sending..."
                  : submitState === "sent"
                    ? "Sent Successfully"
                    : "Send Notification"}
              </Button>
            </form>
            </CardContent>
          </Card>
        </div>

        <div className="admin-notifications-history-column">
          <Card className="admin-notifications-card admin-notifications-card--table">
            <CardHeader className="admin-notifications-history-header">
              <div className="admin-notifications-card-title">
                <History size={20} aria-hidden="true" />
                <CardTitle>Recent History</CardTitle>
              </div>
              <Button type="button" variant="ghost" size="icon" className="admin-notifications-filter-btn" aria-label="Refresh history" onClick={loadData}>
                <Filter size={18} />
              </Button>
            </CardHeader>

            <div className="admin-notifications-table-wrap">
              <Table className="admin-notifications-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sent To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>Loading history...</TableCell>
                    </TableRow>
                  ) : history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>No announcements sent yet.</TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className="admin-notifications-history-title">{item.title}</span>
                          <span className="admin-notifications-history-preview">{item.preview}</span>
                        </TableCell>
                        <TableCell>
                          <span className="admin-notifications-audience">
                            {item.sentTo} ({item.sentCount})
                          </span>
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={item.priority} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="admin-notifications-status">
                            <span aria-hidden="true" />
                            Sent
                          </Badge>
                        </TableCell>
                        <TableCell className="admin-notifications-time">{item.time}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="admin-notifications-metrics">
            <CardContent>
            <h3>Reach</h3>
            <p>
              Total in-app notifications delivered from this panel.
            </p>
            <div className="admin-notifications-metrics-stats">
              <div>
                <strong>{totalReached}</strong>
                <span>Delivered</span>
              </div>
              <div aria-hidden="true" />
              <div>
                <strong>{history.length}</strong>
                <span>Announcements</span>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
