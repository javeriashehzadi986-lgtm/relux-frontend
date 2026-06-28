import React, { useState } from "react";
import {
  Calendar,
  Filter,
  History,
  Lightbulb,
  Megaphone,
  Plus,
  Send,
} from "lucide-react";
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
import "./adminNotifications.css";

const NOTIFICATION_HISTORY = [
  {
    id: "hist-1",
    title: "Fall Collection Launch",
    preview: "The new sustainable knits are here...",
    sentTo: "All Users",
    priority: "normal",
    status: "sent",
    time: "Oct 12, 10:30 AM",
  },
  {
    id: "hist-2",
    title: "Shipping Delay Update",
    preview: "Regional logistics disruption in Central Europe...",
    sentTo: "Buyers Only",
    priority: "important",
    status: "sent",
    time: "Oct 11, 04:15 PM",
  },
  {
    id: "hist-3",
    title: "Inventory Policy Change",
    preview: "Updated guidelines for vintage item listing...",
    sentTo: "Sellers Only",
    priority: "normal",
    status: "sent",
    time: "Oct 09, 11:00 AM",
  },
  {
    id: "hist-4",
    title: "Payout System Maintenance",
    preview: "Brief outage expected on Sunday morning...",
    sentTo: "Sellers Only",
    priority: "important",
    status: "sent",
    time: "Oct 08, 02:00 PM",
  },
];

const RECIPIENT_OPTIONS = [
  { id: "all", label: "All Users", count: "12.4k" },
  { id: "buyers", label: "Buyers Only", count: "8.1k" },
  { id: "sellers", label: "Sellers Only", count: "4.3k" },
];

function PriorityBadge({ priority }) {
  const label = priority === "important" ? "Important" : "Normal";
  return (
    <Badge variant="outline" className={`admin-notifications-priority admin-notifications-priority--${priority}`}>
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !message.trim() || submitState !== "idle") return;

    setSubmitState("sending");
    window.setTimeout(() => {
      setSubmitState("sent");
      window.setTimeout(() => {
        setTitle("");
        setMessage("");
        setPriority("normal");
        setRecipients("all");
        setSubmitState("idle");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="admin-notifications-page">
      <section className="admin-notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Create and send announcements to users on Relux Hub.</p>
        </div>
        <div className="admin-notifications-header-actions">
          <Button type="button" variant="ghost" className="admin-notifications-outline-btn">
            View Analytics
          </Button>
          <Button type="button" className="admin-notifications-primary-btn">
            <Plus size={18} aria-hidden="true" />
            Draft Template
          </Button>
        </div>
      </section>

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
                <Field className="admin-notifications-field">
                  <FieldLabel>Priority Level</FieldLabel>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="admin-notifications-filter-select" aria-label="Priority level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="admin-notifications-field">
                  <FieldLabel htmlFor="notification-schedule">Schedule</FieldLabel>
                  <div className="admin-notifications-schedule">
                    <Input id="notification-schedule" type="text" value="Now" readOnly aria-label="Schedule" />
                    <Calendar size={18} aria-hidden="true" />
                  </div>
                </Field>
              </div>

              <fieldset className="admin-notifications-recipients">
                <legend>Target Recipients</legend>
                <RadioGroup value={recipients} onValueChange={setRecipients}>
                  {RECIPIENT_OPTIONS.map((option) => (
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

          <Card className="admin-notifications-tip">
            <CardContent className="admin-notifications-tip-content">
            <div className="admin-notifications-tip-icon">
              <Lightbulb size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Design Tip</h3>
              <p>
                High-priority notifications trigger push alerts immediately. Use
                &quot;Urgent&quot; sparingly for service disruptions or security updates only.
              </p>
            </div>
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
              <Button type="button" variant="ghost" size="icon" className="admin-notifications-filter-btn" aria-label="Filter history">
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
                  {NOTIFICATION_HISTORY.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className="admin-notifications-history-title">{item.title}</span>
                        <span className="admin-notifications-history-preview">{item.preview}</span>
                      </TableCell>
                      <TableCell>
                        <span className="admin-notifications-audience">{item.sentTo}</span>
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
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="admin-notifications-archive">
              <Button type="button" variant="ghost">View Full Notification Archive</Button>
            </div>
          </Card>

          <Card className="admin-notifications-metrics">
            <CardContent>
            <h3>Reach Metrics</h3>
            <p>
              In the last 30 days, your announcements have reached over 45,000 unique users
              with a 12% average click-through rate.
            </p>
            <div className="admin-notifications-metrics-stats">
              <div>
                <strong>88.4%</strong>
                <span>Open Rate</span>
              </div>
              <div aria-hidden="true" />
              <div>
                <strong>+1.2m</strong>
                <span>Total Impressions</span>
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
