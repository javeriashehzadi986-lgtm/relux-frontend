import React, { useMemo, useState } from "react";
import {
  Bold,
  ChevronRight,
  Filter,
  History,
  Italic,
  Paperclip,
  Search,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./adminSupportCenter.css";

const ADMIN_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCvDi-gEeNpn10OS21zufJFuKcH60wcnF-5cuuOvQROCS3xWLuCQMksv_TlaLsqs48J-rRz68yzYFGHuQ2Et-KJA84w6FQ_pvj__OuK8UgP8XrJYvqYWRpzH5yJh8MHNghSKGUpi0Kvrvy-dTznTyXigp7Obj88nKoPAcy6hZpwCUN3Rx9_Rt4MXpYZjN0LP_0THYWug-LB2Ct2Ei114pRi3JmnRf-ITDImIU9nuWJEtTNoahzCVu3Cc514dT6NgvrbHVBw00WAZdk",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBrFc9m4FK5UGQJ36plHiw2NUjOBhSII3o-FsU9JyUbcfKNABSenfCZ88fX5x2epbToxKO1ct5DjOoEHKbNu2zNI0lp1Yc9-6sUATo5vdkq_8MfuN_LGi7Pl_NN_l1a01JN5S9ZudWpeSBJU3JUlMj4bhQ31WtjUJ0HQaTKL0fxPLlc1a7GL9EmveGgF9x1Q_BWj7iPp0NvimflUlzZoCWFhUrrIcEyTLfY9jt2vQoGe2cRGqPfPIec44ILwPghnakqmA5UKhqDKWc",
];

const SUPPORT_TICKETS = [
  {
    id: "TKT-8291",
    status: "open",
    subject: "Issue with payment processing",
    userName: "Sarah Jenkins",
    userInitials: "SJ",
    userEmail: "sarah.j@example.com",
    userId: "USR-9201",
    userType: "buyer",
    timestamp: "Oct 24, 10:45 AM",
    originalMessage:
      "Hello support team, I tried to purchase a dress today but the transaction failed three times even though my bank says the payment went through. Could you please check if the order #ORD-4452 is confirmed?",
    conversation: [
      {
        type: "admin",
        text: "Hi Sarah, we've received your inquiry. I'm currently looking into the transaction logs for ORD-4452. Please allow me 15-20 minutes to verify this with our payment gateway.",
        time: "10:52 AM",
        author: "Admin (Me)",
      },
      {
        type: "system",
        text: "Admin took ownership of the ticket",
        time: "10:48 AM",
      },
      {
        type: "user",
        text: "Hello support team, I tried to purchase a dress today but the transaction failed three times even though my bank says the payment went through. Could you please check if the order #ORD-4452 is confirmed?",
        time: "10:45 AM",
        author: "Sarah Jenkins",
      },
    ],
  },
  {
    id: "TKT-8288",
    status: "in_progress",
    subject: "Shipping delay for vintage blazer",
    userName: "Michael Chen",
    userInitials: "MC",
    userEmail: "michael.chen@example.com",
    userId: "USR-8842",
    userType: "seller",
    timestamp: "Oct 23, 03:20 PM",
    originalMessage:
      "The buyer is asking for an update on shipping. The blazer was dropped off with the courier two days ago but has not arrived yet.",
    conversation: [
      {
        type: "admin",
        text: "Thanks Michael. I've contacted the courier partner and will update you once we have a delivery update.",
        time: "03:35 PM",
        author: "Admin (Me)",
      },
      {
        type: "user",
        text: "The buyer is asking for an update on shipping. The blazer was dropped off with the courier two days ago but has not arrived yet.",
        time: "03:20 PM",
        author: "Michael Chen",
      },
    ],
  },
  {
    id: "TKT-8285",
    status: "closed",
    subject: "How to update bank details?",
    userName: "Jessica Park",
    userInitials: "JP",
    userEmail: "jessica.park@example.com",
    userId: "USR-7710",
    userType: "seller",
    timestamp: "Oct 23, 09:12 AM",
    originalMessage:
      "I need to change my payout bank account before my next sale settles. Where can I update this in my seller settings?",
    conversation: [
      {
        type: "admin",
        text: "You can update payout details under Seller Profile → Payments. I've sent a step-by-step guide to your email as well.",
        time: "09:30 AM",
        author: "Admin (Me)",
      },
      {
        type: "user",
        text: "I need to change my payout bank account before my next sale settles. Where can I update this in my seller settings?",
        time: "09:12 AM",
        author: "Jessica Park",
      },
    ],
  },
  {
    id: "TKT-8282",
    status: "open",
    subject: "Return request: Item not as described",
    userName: "David Miller",
    userInitials: "DM",
    userEmail: "david.miller@example.com",
    userId: "USR-6533",
    userType: "buyer",
    timestamp: "Oct 22, 11:00 AM",
    originalMessage:
      "The listing said the lehenga was in like-new condition, but there are visible stains on the inner lining. I'd like to initiate a return.",
    conversation: [
      {
        type: "user",
        text: "The listing said the lehenga was in like-new condition, but there are visible stains on the inner lining. I'd like to initiate a return.",
        time: "11:00 AM",
        author: "David Miller",
      },
    ],
  },
];

const STATUS_LABELS = {
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
};

function TicketStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={`admin-support-status admin-support-status--${status}`}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function UserTypeBadge({ userType }) {
  return (
    <Badge variant="outline" className={`admin-support-user-type admin-support-user-type--${userType}`}>
      {userType === "buyer" ? "Buyer" : "Seller"}
    </Badge>
  );
}

const AdminSupportCenter = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(SUPPORT_TICKETS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [notifyViaEmail, setNotifyViaEmail] = useState(true);
  const [ticketStatuses, setTicketStatuses] = useState(() =>
    SUPPORT_TICKETS.reduce((acc, ticket) => {
      acc[ticket.id] = ticket.status;
      return acc;
    }, {}),
  );
  const [extraMessages, setExtraMessages] = useState({});

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return SUPPORT_TICKETS.filter((ticket) => {
      const status = ticketStatuses[ticket.id];
      if (userTypeFilter !== "all" && ticket.userType !== userTypeFilter) return false;
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (
        query &&
        !ticket.id.toLowerCase().includes(query) &&
        !ticket.userName.toLowerCase().includes(query) &&
        !ticket.subject.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [searchQuery, userTypeFilter, statusFilter, ticketStatuses]);

  const selectedTicket =
    filteredTickets.find((ticket) => ticket.id === selectedTicketId) ??
    filteredTickets[0] ??
    SUPPORT_TICKETS.find((ticket) => ticket.id === selectedTicketId) ??
    SUPPORT_TICKETS[0];

  const selectedStatus = ticketStatuses[selectedTicket.id] ?? selectedTicket.status;
  const conversation = [
    ...(extraMessages[selectedTicket.id] ?? []),
    ...selectedTicket.conversation,
  ];

  const updateTicketStatus = (status) => {
    setTicketStatuses((current) => ({ ...current, [selectedTicket.id]: status }));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    setExtraMessages((current) => ({
      ...current,
      [selectedTicket.id]: [
        {
          type: "admin",
          text: replyText.trim(),
          time: "Just now",
          author: "Admin (Me)",
        },
        ...(current[selectedTicket.id] ?? []),
      ],
    }));
    setReplyText("");
  };

  return (
    <div className="admin-support-page">
      <div className="admin-support-header">
        <div>
          <h1>Support Center</h1>
          <p>Manage and respond to customer support requests.</p>
        </div>
        <div className="admin-support-online">
          <div className="admin-support-online-avatars">
            {ADMIN_AVATARS.map((avatar) => (
              <img key={avatar} src={avatar} alt="" />
            ))}
          </div>
          <span>2 Admins Online</span>
        </div>
      </div>

      <div className="admin-support-filters">
        <div className="admin-support-search">
          <Search size={18} aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search by Ticket ID, User Name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search support tickets"
          />
        </div>

        <label className="admin-support-filter-field">
          <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
            <SelectTrigger className="admin-support-filter-select" aria-label="Filter by user type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">User Type: All</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <label className="admin-support-filter-field">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="admin-support-filter-select" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <Button type="button" variant="ghost" className="admin-support-more-filters">
          <Filter size={16} aria-hidden="true" />
          More Filters
        </Button>
      </div>

      <div className="admin-support-layout">
        <aside className="admin-support-ticket-list">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => {
              const status = ticketStatuses[ticket.id] ?? ticket.status;
              const isSelected = selectedTicket.id === ticket.id;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  className={`admin-support-ticket-item ${
                    isSelected ? "admin-support-ticket-item--active" : ""
                  }`}
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <div className="admin-support-ticket-item-top">
                    <span>#{ticket.id}</span>
                    <TicketStatusBadge status={status} />
                  </div>
                  <h3>{ticket.subject}</h3>
                  <div className="admin-support-ticket-item-user">
                    <span>{ticket.userName}</span>
                    <UserTypeBadge userType={ticket.userType} />
                  </div>
                  <div className="admin-support-ticket-item-footer">
                    <span>{ticket.timestamp}</span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </div>
                </button>
              );
            })
          ) : (
            <p className="admin-support-empty">No tickets match your filters.</p>
          )}
        </aside>

        <article className="admin-support-detail">
          <div className="admin-support-detail-header">
            <div className="admin-support-detail-user">
              <span className="admin-support-user-avatar">{selectedTicket.userInitials}</span>
              <div>
                <h2>{selectedTicket.userName}</h2>
                <p>
                  {selectedTicket.userEmail} • ID: {selectedTicket.userId}
                </p>
              </div>
            </div>
            <div className="admin-support-detail-actions">
              <Button
                type="button"
                variant="ghost"
                className="admin-support-outline-btn"
                onClick={() => updateTicketStatus("in_progress")}
              >
                Mark as In Progress
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="admin-support-close-btn"
                onClick={() => updateTicketStatus("closed")}
              >
                Close Ticket
              </Button>
            </div>
          </div>

          <div className="admin-support-detail-body">
            <div className="admin-support-detail-block">
              <p className="admin-support-detail-label">Subject</p>
              <p className="admin-support-detail-subject">{selectedTicket.subject}</p>
            </div>

            <div className="admin-support-detail-block">
              <p className="admin-support-detail-label">Original Message</p>
              <div className="admin-support-original-message">
                {selectedTicket.originalMessage}
              </div>
            </div>
          </div>

          <section className="admin-support-conversation">
            <h3>
              <History size={16} aria-hidden="true" />
              Conversation History
            </h3>

            <div className="admin-support-messages">
              {conversation.map((message, index) => {
                if (message.type === "system") {
                  return (
                    <div key={`${message.time}-${index}`} className="admin-support-system-message">
                      {message.text} • {message.time}
                    </div>
                  );
                }

                const isAdmin = message.type === "admin";

                return (
                  <div
                    key={`${message.time}-${index}`}
                    className={`admin-support-message-row ${
                      isAdmin ? "admin-support-message-row--admin" : ""
                    }`}
                  >
                    <div>
                      <div
                        className={`admin-support-message-bubble ${
                          isAdmin
                            ? "admin-support-message-bubble--admin"
                            : "admin-support-message-bubble--user"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                      <p className="admin-support-message-meta">
                        {message.author} • {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <footer className="admin-support-reply">
            <div className="admin-support-reply-box">
              <div className="admin-support-reply-toolbar">
                <Button type="button" variant="ghost" size="icon" aria-label="Bold">
                  <Bold size={16} />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Italic">
                  <Italic size={16} />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Attach file">
                  <Paperclip size={16} />
                </Button>
                <span>Typing as Admin...</span>
              </div>

              <Textarea
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                rows={5}
              />

              <div className="admin-support-reply-footer">
                <label className="admin-support-notify">
                  <Checkbox
                    checked={notifyViaEmail}
                    onCheckedChange={(checked) => setNotifyViaEmail(checked === true)}
                  />
                  <span>Notify user via email</span>
                </label>
                <Button
                  type="button"
                  className="admin-support-send-btn"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || selectedStatus === "closed"}
                >
                  <Send size={16} aria-hidden="true" />
                  Send Reply
                </Button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default AdminSupportCenter;
