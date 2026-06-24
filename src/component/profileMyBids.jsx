import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Mail,
  Search,
  SlidersHorizontal,
  Star,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "./profileMyBids.css";

const FILTER_TABS = [
  { id: "all", label: "All Bids" },
  { id: "active", label: "Active" },
  { id: "winning", label: "Winning" },
  { id: "outbid", label: "Outbid" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
  { id: "expired", label: "Expired" },
];

const BIDS = [
  {
    id: "bid-1",
    title: "Zari Embroidered Ivory Nikkah Ensemble",
    seller: "Sana Safinaz Couture",
    status: "winning",
    statusLabel: "Winning",
    timeRemaining: "4h 12m",
    timeUrgent: false,
    bannerType: "winning",
    bannerText: "You are currently the highest bidder.",
    originalPrice: "Rs. 120,000",
    currentHighest: "Rs. 85,000",
    myBid: "Rs. 85,000",
    bidDelta: null,
    primaryAction: "Increase Bid",
    secondaryAction: "View Details",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uo8SvBmBlPi1CK0pD8FzJwaUl-XzyYSD0cicdieAa2kuAzB1hezTlJAB5FgTX9UigTIEvKHgM5eKvee0eTfiIAjOpd4QsEqdCmlNV44EJdt0UcG22KxmaYlkNkWPONiIFl1n-jsYFFRXbhgYp8GlvRdxHAZ6POggtyL7GRtJ9ejDS4bWtmpGynvX5HGagbuNi7k4GFHZ22Pvs_ONwujGzi8nR909gFGwL596DGXwGumE7Olr3lHOC44_DtYCXD8apeYdyaMMCm-3",
    dimmed: false,
  },
  {
    id: "bid-2",
    title: "Emerald Velvet Tilla Work Pishwas",
    seller: "Elan Official",
    status: "outbid",
    statusLabel: "Outbid",
    timeRemaining: "1h 05m",
    timeUrgent: true,
    bannerType: "outbid",
    bannerText: "You have been outbid. Increase your bid to win!",
    originalPrice: "Rs. 95,000",
    currentHighest: "Rs. 45,000",
    myBid: "Rs. 40,000",
    bidDelta: "-5k",
    primaryAction: "Place Higher Bid",
    secondaryAction: "View Product",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjGPz_EnIiL9nMHb7C5FTbcu7qoqv9KdAkoNClUgoIirKV-vGvm9iHkPqBuM8ELI2MhWyNUSe0xqxWIy3s7Ghde_2kWgEJWHuzlU0zzChwjSvAyrbwVJsd4__Gs-aooGVVoedYrcvrUt-heoukEvi4sX8911aHl9NhZvu5Rw2hm85oR6ntAcAoVDzWFTFgKkC2Yhs50v0xEztOzjbk0C3AqZvWoee9M-ie08X6yYkdSXW2RETlNvKA5sOAqZPiSv9BotCYpxWcHzri",
    dimmed: true,
  },
];

const ProfileMyBids = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBids = useMemo(() => {
    return BIDS.filter((bid) => {
      const matchesFilter =
        activeFilter === "all" ||
        bid.status === activeFilter ||
        (activeFilter === "active" &&
          (bid.status === "winning" || bid.status === "outbid"));
      const matchesSearch =
        bid.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        bid.seller.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="profile-bids">
      <header className="profile-bids-header">
        <div className="profile-bids-header-top">
          <div>
            <h1 className="profile-bids-title">My Active Bids</h1>
            <p className="profile-bids-subtitle">
              Manage your ongoing auctions for luxury Pakistani couture.
            </p>
          </div>

          <div className="profile-bids-toolbar">
            <div className="profile-bids-search-wrap">
              <Search
                className="profile-bids-search-icon"
                size={18}
                aria-hidden="true"
              />
              <Input
                type="search"
                className="profile-bids-search"
                placeholder="Search bids..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="profile-bids-filter-btn"
              aria-label="Filter bids"
            >
              <SlidersHorizontal size={20} />
            </Button>
            <Button type="button" className="profile-bids-explore-btn">
              <Compass size={16} aria-hidden="true" />
              Explore Auctions
            </Button>
          </div>
        </div>

        <div className="profile-bids-tabs">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              className={`profile-bids-tab ${
                activeFilter === tab.id ? "profile-bids-tab--active" : ""
              }`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </header>

      <div className="profile-bids-list">
        {filteredBids.length > 0 ? (
          filteredBids.map((bid) => (
            <Card
              key={bid.id}
              className={`profile-bid-card ${
                bid.dimmed ? "profile-bid-card--dimmed" : ""
              }`}
            >
              <div
                className={`profile-bid-image-wrap ${
                  bid.dimmed ? "profile-bid-image-wrap--dimmed" : ""
                }`}
              >
                <img alt={bid.title} src={bid.image} />
                <span
                  className={`profile-bid-badge profile-bid-badge--${bid.status}`}
                >
                  {bid.statusLabel}
                </span>
              </div>

              <CardContent className="profile-bid-content">
                <div className="profile-bid-content-header">
                  <div>
                    <h3 className="profile-bid-title">{bid.title}</h3>
                    <p className="profile-bid-seller">
                      <Store size={16} aria-hidden="true" />
                      By {bid.seller}
                    </p>
                  </div>
                  <div className="profile-bid-time">
                    <p className="profile-bid-time-label">Time Remaining</p>
                    <p
                      className={`profile-bid-time-value ${
                        bid.timeUrgent
                          ? "profile-bid-time-value--urgent"
                          : "profile-bid-time-value--active"
                      }`}
                    >
                      <Clock size={14} aria-hidden="true" />
                      {bid.timeRemaining}
                    </p>
                  </div>
                </div>

                <div
                  className={`profile-bid-banner profile-bid-banner--${bid.bannerType}`}
                >
                  {bid.bannerType === "winning" ? (
                    <Star size={18} aria-hidden="true" fill="currentColor" />
                  ) : (
                    <AlertTriangle size={18} aria-hidden="true" />
                  )}
                  <span>{bid.bannerText}</span>
                </div>

                <div className="profile-bid-stats">
                  <div className="profile-bid-stat">
                    <p className="profile-bid-stat-label">Original Price</p>
                    <p className="profile-bid-stat-value">{bid.originalPrice}</p>
                  </div>
                  <div className="profile-bid-stat profile-bid-stat--bordered">
                    <p className="profile-bid-stat-label">Current Highest</p>
                    <p
                      className={`profile-bid-stat-value profile-bid-stat-value--${
                        bid.status === "winning" ? "primary" : "default"
                      }`}
                    >
                      {bid.currentHighest}
                    </p>
                  </div>
                  <div className="profile-bid-stat profile-bid-stat--bordered">
                    <p className="profile-bid-stat-label">My Bid</p>
                    {bid.bidDelta ? (
                      <div className="profile-bid-my-row">
                        <p className="profile-bid-stat-value profile-bid-stat-value--error">
                          {bid.myBid}
                        </p>
                        <span className="profile-bid-delta">{bid.bidDelta}</span>
                      </div>
                    ) : (
                      <p className="profile-bid-stat-value profile-bid-stat-value--primary">
                        {bid.myBid}
                      </p>
                    )}
                  </div>
                </div>

                <div className="profile-bid-actions">
                  <Button type="button" className="profile-bid-primary-btn">
                    {bid.primaryAction}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="profile-bid-secondary-btn"
                  >
                    {bid.secondaryAction}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="profile-bid-mail-btn"
                    aria-label="Contact seller"
                  >
                    <Mail size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="profile-bids-empty">
            <CardContent className="profile-bids-empty-content">
              <p>No bids match your search or filter.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="profile-bids-footer">
        <p className="profile-bids-footer-count">
          Showing {filteredBids.length} of 12 active bids
        </p>
        <div className="profile-bids-pagination">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="profile-bids-page-btn profile-bids-page-btn--nav"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="profile-bids-page-numbers">
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                type="button"
                variant="ghost"
                className={`profile-bids-page-btn ${
                  currentPage === page ? "profile-bids-page-btn--active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="profile-bids-page-btn profile-bids-page-btn--nav"
            aria-label="Next page"
            disabled={currentPage === 3}
            onClick={() => setCurrentPage((page) => Math.min(3, page + 1))}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </footer>
    </section>
  );
};

export default ProfileMyBids;
