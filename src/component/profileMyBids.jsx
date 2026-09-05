import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { useMyBids } from "@/hooks/useMyBids";
import "./profileMyBids.css";

const FILTER_TABS = [
  { id: "all", label: "All Bids" },
  { id: "active", label: "Active" },
  { id: "winning", label: "Winning" },
  { id: "won", label: "Won" },
  { id: "outbid", label: "Outbid" },
  { id: "expired", label: "Expired" },
];

const BIDS_PER_PAGE = 6;

const matchesBidFilter = (bid, filter) => {
  if (filter === "all") return true;
  if (filter === "active") {
    // Live auctions only (still open)
    return bid.status === "winning" || bid.status === "outbid";
  }
  if (filter === "winning") {
    // Currently highest bidder — auction still running
    return bid.status === "winning";
  }
  if (filter === "won") {
    return bid.status === "won";
  }
  if (filter === "outbid") {
    // Outbid on a live auction (not ended losses — those are Expired)
    return bid.status === "outbid";
  }
  if (filter === "expired") {
    return bid.status === "expired";
  }
  return bid.status === filter;
};

const ProfileMyBids = () => {
  const { bids, loading, error, refresh } = useMyBids();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBids = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return bids.filter((bid) => {
      const matchesFilter = matchesBidFilter(bid, activeFilter);
      if (!matchesFilter) return false;
      if (!query) return true;
      const title = String(bid.title || "").toLowerCase();
      const seller = String(bid.seller || "").toLowerCase();
      return title.includes(query) || seller.includes(query);
    });
  }, [activeFilter, searchQuery, bids]);

  const totalPages = Math.max(1, Math.ceil(filteredBids.length / BIDS_PER_PAGE));

  const paginatedBids = useMemo(() => {
    const start = (currentPage - 1) * BIDS_PER_PAGE;
    return filteredBids.slice(start, start + BIDS_PER_PAGE);
  }, [currentPage, filteredBids]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section className="profile-bids">
      <header className="profile-bids-header">
        <div className="profile-bids-header-top">
          <div>
            <h1 className="profile-bids-title">My Bids</h1>
            <p className="profile-bids-subtitle">
              Track active auctions, winning bids, and completed wins.
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
              aria-label="Show active bids only"
              onClick={() => setActiveFilter("active")}
            >
              <SlidersHorizontal size={20} />
            </Button>
            <Button type="button" className="profile-bids-explore-btn" asChild>
              <Link to="/femaleFashion?type=resale">
                <Compass size={16} aria-hidden="true" />
                Explore Auctions
              </Link>
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
        {loading && <p className="profile-bids-status">Loading your bids...</p>}

        {error && (
          <Card className="profile-bids-empty">
            <CardContent className="profile-bids-empty-content">
              <p>{error}</p>
              <Button type="button" variant="outline" onClick={refresh}>
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && paginatedBids.length > 0 ? (
          paginatedBids.map((bid) => (
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
                <Link to={`/dress/${bid.dressId}`} aria-label={`View ${bid.title}`}>
                  <img alt={bid.title} src={bid.image} />
                </Link>
                <span
                  className={`profile-bid-badge profile-bid-badge--${bid.status}`}
                >
                  {bid.statusLabel}
                </span>
              </div>

              <CardContent className="profile-bid-content">
                <div className="profile-bid-content-header">
                  <div>
                    <h3 className="profile-bid-title">
                      <Link to={`/dress/${bid.dressId}`}>{bid.title}</Link>
                    </h3>
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
                        bid.status === "winning" || bid.status === "won"
                          ? "primary"
                          : "default"
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
                  <Button type="button" className="profile-bid-primary-btn" asChild>
                    <Link
                      to={
                        bid.hasWon
                          ? `/dress/${bid.dressId}/checkout`
                          : `/dress/${bid.dressId}`
                      }
                    >
                      {bid.primaryAction}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="profile-bid-secondary-btn"
                    asChild
                  >
                    <Link to={`/dress/${bid.dressId}`}>{bid.secondaryAction}</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="profile-bid-mail-btn"
                    aria-label="Contact seller"
                    asChild
                  >
                    <Link to={`/dress/${bid.dressId}/chat`}>
                      <Mail size={20} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !loading && !error ? (
          <Card className="profile-bids-empty">
            <CardContent className="profile-bids-empty-content">
              <p>No bids match your search or filter.</p>
              <Button type="button" className="profile-bids-explore-btn" asChild>
                <Link to="/femaleFashion?type=resale">Explore Auctions</Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <footer className="profile-bids-footer">
        <p className="profile-bids-footer-count">
          Showing {filteredBids.length} of {bids.length} bids
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
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </footer>
    </section>
  );
};

export default ProfileMyBids;
