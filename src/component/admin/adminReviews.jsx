import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Search, Star, UserSearch } from "lucide-react";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./adminReviews.css";

const DEFAULT_STATS = {
  totalReviews: 0,
  totalChange: "",
  averageRating: 0,
  flaggedCount: 0,
  todayNew: 0,
};

const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "hidden", label: "Hidden" },
  { value: "flagged", label: "Flagged" },
];

function StarRating({ rating, size = 16 }) {
  return (
    <div className="admin-reviews-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const label =
    status === "active" ? "Active" : status === "hidden" ? "Hidden" : "Flagged";

  return (
    <Badge variant="outline" className={`admin-reviews-status admin-reviews-status--${status}`}>
      {label}
    </Badge>
  );
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedRating, setAppliedRating] = useState("all");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.getAdminReviews({
        q: appliedSearch,
        rating: appliedRating,
        status: appliedStatus,
      });
      setReviews(data.reviews ?? []);
      setStats(data.stats ?? DEFAULT_STATS);
    } catch (error) {
      setLoadError(error.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, appliedRating, appliedStatus]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? reviews[0] ?? null,
    [reviews, selectedReviewId],
  );

  useEffect(() => {
    if (reviews.length > 0 && !reviews.some((review) => review.id === selectedReviewId)) {
      setSelectedReviewId(reviews[0].id);
    }
  }, [reviews, selectedReviewId]);

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedRating(ratingFilter);
    setAppliedStatus(statusFilter);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedReview) return;
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.updateAdminReviewStatus(selectedReview.id, { status });
      setReviews((current) =>
        current.map((review) =>
          review.id === selectedReview.id ? data.review : review,
        ),
      );
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      setActionError(error.message || "Failed to update review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    if (!window.confirm("Permanently delete this review? This cannot be undone.")) {
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      const data = await api.deleteAdminReview(selectedReview.id);
      setReviews((current) => current.filter((review) => review.id !== selectedReview.id));
      setSelectedReviewId(null);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      setActionError(error.message || "Failed to delete review");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-reviews-page">
      <div className="admin-reviews-header">
        <h1>Reviews Management</h1>
        <p>Monitor and manage customer reviews on Relux Hub marketplace.</p>
      </div>

      {loadError && (
        <p className="admin-reviews-error" role="alert">
          {loadError}
        </p>
      )}

      <div className="admin-reviews-metrics">
        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Total Reviews</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {stats.totalReviews.toLocaleString()}
            </span>
            {stats.totalChange ? (
              <span className="admin-reviews-metric-trend admin-reviews-metric-trend--positive">
                {stats.totalChange}
              </span>
            ) : null}
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Avg. Rating</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {stats.averageRating}
            </span>
            <StarRating rating={Math.round(stats.averageRating) || 0} size={14} />
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Flagged Content</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value admin-reviews-metric-value--error">
              {stats.flaggedCount}
            </span>
            {stats.flaggedCount > 0 ? (
              <span className="admin-reviews-metric-trend admin-reviews-metric-trend--error">
                Action Required
              </span>
            ) : null}
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Today&apos;s New</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {stats.todayNew}
            </span>
            {stats.todayNew > 0 ? (
              <span className="admin-reviews-metric-trend admin-reviews-metric-trend--positive">
                Trending
              </span>
            ) : null}
          </div>
          </CardContent>
        </Card>
      </div>

      <div className="admin-reviews-filters">
        <div className="admin-reviews-filter-search">
          <UserSearch size={18} aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search by Buyer or Seller name..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleApplyFilters();
            }}
            aria-label="Search by buyer or seller name"
          />
        </div>

        <label className="admin-reviews-filter-field">
          <span>Rating:</span>
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="admin-reviews-filter-select" aria-label="Filter by rating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="admin-reviews-filter-field">
          <span>Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="admin-reviews-filter-select" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <Button type="button" className="admin-reviews-apply-btn" onClick={handleApplyFilters}>
          <Filter size={18} aria-hidden="true" />
          Apply Filters
        </Button>
      </div>

      <div className="admin-reviews-layout">
        <Card className="admin-reviews-table-panel">
          <div className="admin-reviews-table-wrap">
            {loading ? (
              <p className="admin-reviews-empty">Loading reviews...</p>
            ) : (
              <Table className="admin-reviews-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer / Date</TableHead>
                    <TableHead>Product &amp; Seller</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead aria-hidden="true" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <TableRow
                        key={review.id}
                        className={
                          selectedReview?.id === review.id
                            ? "admin-reviews-row admin-reviews-row--selected"
                            : "admin-reviews-row"
                        }
                        onClick={() => setSelectedReviewId(review.id)}
                      >
                        <TableCell>
                          <div className="admin-reviews-reviewer">
                            <span className="admin-reviews-avatar">{review.reviewerInitials}</span>
                            <div>
                              <p>{review.reviewerName}</p>
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="admin-reviews-product">
                            <p>{review.product}</p>
                            <span>Sold by: {review.seller}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StarRating rating={review.rating} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={review.status} />
                        </TableCell>
                        <TableCell>
                          <Search size={16} className="admin-reviews-row-icon" aria-hidden="true" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="admin-reviews-empty">
                        No reviews match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        {selectedReview && (
          <Card className="admin-reviews-detail-panel">
            <div className="admin-reviews-detail-header">
              <div className="admin-reviews-reviewer">
                <span className="admin-reviews-avatar admin-reviews-avatar--large">
                  {selectedReview.reviewerInitials}
                </span>
                <div>
                  <p>{selectedReview.reviewerName}</p>
                  <span>{selectedReview.date}</span>
                </div>
              </div>
              <StatusBadge status={selectedReview.status} />
            </div>

            <div className="admin-reviews-detail-block">
              <p className="admin-reviews-detail-label">Product</p>
              <p className="admin-reviews-detail-value">{selectedReview.product}</p>
              <p className="admin-reviews-detail-meta">Sold by: {selectedReview.seller}</p>
            </div>

            <div className="admin-reviews-detail-block">
              <p className="admin-reviews-detail-label">Rating</p>
              <StarRating rating={selectedReview.rating} size={18} />
            </div>

            <div className="admin-reviews-detail-block">
              <p className="admin-reviews-detail-label">Review</p>
              <blockquote className="admin-reviews-quote">
                &ldquo;{selectedReview.quote}&rdquo;
              </blockquote>
            </div>

            {selectedReview.hasReport && (
              <div className="admin-reviews-detail-block">
                <p className="admin-reviews-detail-label">Report</p>
                {selectedReview.reportReason ? (
                  <p className="admin-reviews-detail-value">{selectedReview.reportReason}</p>
                ) : null}
                {selectedReview.reportDetails ? (
                  <p className="admin-reviews-detail-meta">{selectedReview.reportDetails}</p>
                ) : null}
              </div>
            )}

            {actionError && (
              <p className="admin-reviews-error" role="alert">
                {actionError}
              </p>
            )}

            <div className="admin-reviews-detail-actions">
              <Button
                type="button"
                className="admin-reviews-action-btn admin-reviews-action-btn--primary"
                disabled={actionLoading || selectedReview.status === "active"}
                onClick={() => handleStatusUpdate("active")}
              >
                Keep Active
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="admin-reviews-action-btn"
                disabled={actionLoading || selectedReview.status === "hidden"}
                onClick={() => handleStatusUpdate("hidden")}
              >
                Hide Review
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="admin-reviews-action-btn admin-reviews-action-btn--danger"
                disabled={actionLoading}
                onClick={handleDeleteReview}
              >
                Remove
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
