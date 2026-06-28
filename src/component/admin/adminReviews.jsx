import React, { useMemo, useState } from "react";
import { Filter, Search, Star, UserSearch } from "lucide-react";
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

const ADMIN_REVIEW_STATS = {
  totalReviews: 12842,
  totalChange: "+4.2%",
  averageRating: 4.8,
  flaggedCount: 24,
  todayNew: 156,
};

const ADMIN_REVIEWS = [
  {
    id: "rev-1",
    reviewerName: "Marcus Bennett",
    reviewerInitials: "MB",
    date: "Oct 12, 2023",
    product: "Vintage Gucci Silk Scarf",
    seller: "Luxe_Vintage",
    rating: 5,
    status: "active",
    quote:
      "Absolutely pristine condition. The scarf matched the listing photos perfectly and arrived beautifully packaged.",
  },
  {
    id: "rev-2",
    reviewerName: "Sara M.",
    reviewerInitials: "SM",
    date: "Oct 11, 2023",
    product: "Crimson Anarkali Gown",
    seller: "Ahmed Raza",
    rating: 5,
    status: "active",
    quote:
      "The dress arrived in pristine condition and fit beautifully for my sister's nikkah.",
  },
  {
    id: "rev-3",
    reviewerName: "Hina A.",
    reviewerInitials: "HA",
    date: "Oct 10, 2023",
    product: "Midnight Velvet Lehenga",
    seller: "Sana Tariq",
    rating: 5,
    status: "active",
    quote:
      "Absolutely stunning craftsmanship. The security deposit was refunded promptly after inspection.",
  },
  {
    id: "rev-4",
    reviewerName: "Ali Rehman",
    reviewerInitials: "AR",
    date: "Oct 9, 2023",
    product: "Charcoal Italian Wool Suit",
    seller: "Ahmed Raza",
    rating: 2,
    status: "flagged",
    quote: "Item had undisclosed wear on the collar. Seller was slow to respond to messages.",
  },
  {
    id: "rev-5",
    reviewerName: "Fatima Noor",
    reviewerInitials: "FN",
    date: "Oct 8, 2023",
    product: "Royal Jamawar Sherwani",
    seller: "Omar Siddiqui",
    rating: 4,
    status: "active",
    quote: "Beautiful piece and fast shipping. Slight delay in pickup coordination.",
  },
  {
    id: "rev-6",
    reviewerName: "Zainab Malik",
    reviewerInitials: "ZM",
    date: "Oct 7, 2023",
    product: "Ethereal Lace Abaya",
    seller: "Sana Tariq",
    rating: 1,
    status: "flagged",
    quote: "Listing photos did not reflect the actual fabric quality. Reported to support.",
  },
  {
    id: "rev-7",
    reviewerName: "Hassan Ali",
    reviewerInitials: "HA",
    date: "Oct 6, 2023",
    product: "Black Raw Silk Prince Coat",
    seller: "Hassan Ali",
    rating: 3,
    status: "hidden",
    quote: "Good fit but sizing ran smaller than the size guide suggested.",
  },
  {
    id: "rev-8",
    reviewerName: "Maryam Shah",
    reviewerInitials: "MS",
    date: "Oct 5, 2023",
    product: "Velvet Heritage Kalidar",
    seller: "Zainab Malik",
    rating: 5,
    status: "active",
    quote: "Exceeded expectations. Would rent again for the next family wedding.",
  },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedRating, setAppliedRating] = useState("all");
  const [appliedStatus, setAppliedStatus] = useState("all");
  const [selectedReviewId, setSelectedReviewId] = useState(ADMIN_REVIEWS[0]?.id ?? null);

  const filteredReviews = useMemo(() => {
    const query = appliedSearch.trim().toLowerCase();

    return ADMIN_REVIEWS.filter((review) => {
      if (appliedRating !== "all" && review.rating !== Number(appliedRating)) {
        return false;
      }
      if (appliedStatus !== "all" && review.status !== appliedStatus) {
        return false;
      }
      if (
        query &&
        !review.reviewerName.toLowerCase().includes(query) &&
        !review.seller.toLowerCase().includes(query) &&
        !review.product.toLowerCase().includes(query)
      ) {
        return false;
      }
      return true;
    });
  }, [appliedSearch, appliedRating, appliedStatus]);

  const selectedReview =
    filteredReviews.find((review) => review.id === selectedReviewId) ??
    filteredReviews[0] ??
    null;

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedRating(ratingFilter);
    setAppliedStatus(statusFilter);
  };

  return (
    <div className="admin-reviews-page">
      <div className="admin-reviews-header">
        <h1>Reviews Management</h1>
        <p>Monitor and manage customer reviews on Relux Hub marketplace.</p>
      </div>

      <div className="admin-reviews-metrics">
        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Total Reviews</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {ADMIN_REVIEW_STATS.totalReviews.toLocaleString()}
            </span>
            <span className="admin-reviews-metric-trend admin-reviews-metric-trend--positive">
              {ADMIN_REVIEW_STATS.totalChange}
            </span>
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Avg. Rating</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {ADMIN_REVIEW_STATS.averageRating}
            </span>
            <StarRating rating={5} size={14} />
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Flagged Content</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value admin-reviews-metric-value--error">
              {ADMIN_REVIEW_STATS.flaggedCount}
            </span>
            <span className="admin-reviews-metric-trend admin-reviews-metric-trend--error">
              Action Required
            </span>
          </div>
          </CardContent>
        </Card>

        <Card className="admin-reviews-metric-card">
          <CardContent>
          <p className="admin-reviews-metric-label">Today&apos;s New</p>
          <div className="admin-reviews-metric-value-row">
            <span className="admin-reviews-metric-value">
              {ADMIN_REVIEW_STATS.todayNew}
            </span>
            <span className="admin-reviews-metric-trend admin-reviews-metric-trend--positive">
              Trending
            </span>
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
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
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

            <div className="admin-reviews-detail-actions">
              <Button type="button" className="admin-reviews-action-btn admin-reviews-action-btn--primary">
                Keep Active
              </Button>
              <Button type="button" variant="ghost" className="admin-reviews-action-btn">
                Hide Review
              </Button>
              <Button type="button" variant="ghost" className="admin-reviews-action-btn admin-reviews-action-btn--danger">
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
