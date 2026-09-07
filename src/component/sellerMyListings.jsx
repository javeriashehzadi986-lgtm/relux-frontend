import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Plus,
  Pencil,
  Eye,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";
import { getListingAvailability } from "@/utils/productAvailability";
import "./sellerMyListings.css";

const filterChips = ["All", "Active", "Pending", "Rejected", "Rent", "Auctions"];

function formatListingPrice(listing) {
  if (listing.listingType === "rent") {
    return listing.rentPrice ? `$${listing.rentPrice} / day` : "—";
  }
  return listing.salePrice ? `Rs. ${Number(listing.salePrice).toLocaleString("en-PK")}` : "—";
}

function formatListingDetail(listing) {
  if (listing.listingType === "sale" && listing.startingBid) {
    return `Starting bid $${listing.startingBid}`;
  }
  return listing.listingCondition || "";
}

function mapApiListing(listing) {
  const isSale = listing.listingType === "sale";
  let status = "Active";
  let statusVariant = "active";

  if (listing.verificationStatus === "pending") {
    status = "Pending Review";
    statusVariant = "pending";
  } else if (listing.verificationStatus === "rejected") {
    status = "Rejected";
    statusVariant = "rejected";
  } else if (listing.status === "sold") {
    status = "Sold";
    statusVariant = "sold";
  } else if (listing.status === "rented") {
    status = "Rented";
    statusVariant = "sold";
  } else if (listing.status === "active") {
    status = "Active";
    statusVariant = "active";
  }

  const availability = getListingAvailability(listing);

  return {
    id: listing.id,
    title: listing.title,
    brand: listing.brand || "—",
    image: listing.mainImage,
    type: isSale ? "Auction" : "Rent",
    typeVariant: isSale ? "auction" : "rent",
    size: listing.listingSize || "—",
    price: formatListingPrice(listing),
    detail: formatListingDetail(listing),
    status,
    statusVariant,
    verificationStatus: listing.verificationStatus,
    listingStatus: listing.status,
    listingType: listing.listingType,
    isAvailable: listing.isAvailable !== false,
    availabilityKey: availability.key,
    availabilityLabel: availability.label,
    canToggleAvailability:
      listing.verificationStatus === "approved" &&
      listing.status === "active" &&
      listing.status !== "sold" &&
      listing.status !== "rented",
    adminNote: listing.adminNote || "",
  };
}

function canManageListing(item) {
  return item.listingStatus !== "sold" && item.listingStatus !== "rented";
}

function ListingActionsMenu({ item, isOpen, onToggle, onClose, onDelete, deleting }) {
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(null);
  const canManage = canManageListing(item);

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 184;
    const gap = 6;
    const padding = 12;
    const estimatedHeight = canManage ? 168 : 56;

    let left = rect.right - menuWidth;
    left = Math.max(padding, Math.min(left, window.innerWidth - menuWidth - padding));

    const openDown = rect.bottom + gap + estimatedHeight <= window.innerHeight - padding;
    const top = openDown
      ? rect.bottom + gap
      : Math.max(padding, rect.top - gap - estimatedHeight);

    setMenuStyle({
      position: "fixed",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      right: "auto",
      minWidth: `${menuWidth}px`,
    });
  }, [canManage]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuStyle(null);
      return undefined;
    }
    updateMenuPosition();
    return undefined;
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, updateMenuPosition]);

  return (
    <div className={`my-listing-menu-wrap${isOpen ? " is-open" : ""}`} ref={menuRef}>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        className="my-listing-more-btn"
        aria-label={`More options for ${item.title}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        <MoreVertical size={18} />
      </Button>

      {isOpen && (
        <ul
          className="my-listing-menu"
          role="menu"
          aria-label={`Actions for ${item.title}`}
          style={menuStyle || undefined}
        >
          <li role="none">
            <Link
              to={`/dress/${item.id}`}
              className="my-listing-menu-item"
              role="menuitem"
              onClick={onClose}
            >
              <Eye size={16} />
              View Details
            </Link>
          </li>
          {canManage ? (
            <li role="none">
              <Link
                to="/addListing"
                state={{ editListingId: item.id }}
                className="my-listing-menu-item"
                role="menuitem"
                onClick={onClose}
              >
                <Pencil size={16} />
                {item.verificationStatus === "rejected" ? "Edit & Resubmit" : "Edit Listing"}
              </Link>
            </li>
          ) : null}
          {canManage ? (
            <>
              <li className="my-listing-menu-divider" role="separator" />
              <li role="none">
                <button
                  type="button"
                  className="my-listing-menu-item my-listing-menu-item--danger"
                  role="menuitem"
                  disabled={deleting}
                  onClick={() => {
                    onClose();
                    onDelete(item);
                  }}
                >
                  <Trash2 size={16} />
                  {deleting ? "Deleting..." : "Delete Listing"}
                </button>
              </li>
            </>
          ) : null}
        </ul>
      )}
    </div>
  );
}

export function SellerMyListingsContent() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const loadListings = useCallback(async () => {
    setLoadError("");
    try {
      const data = await api.getMyListings();
      setListings((data.listings ?? []).map(mapApiListing));
    } catch (error) {
      const message = error.message || "Failed to load listings";
      if (message.includes("do not have access")) {
        setLoadError(
          "Access denied. Log in with an approved seller account to view your listings.",
        );
      } else if (message.includes("Session expired") || message.includes("Not authorized")) {
        setLoadError("Please log out and sign in again as a seller.");
      } else {
        setLoadError(message);
      }
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    const handleFocus = () => {
      loadListings();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadListings]);

  const handleDeleteListing = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This removes the listing from Relux Hub.`,
    );
    if (!confirmed) return;

    setActionError("");
    setDeletingId(item.id);
    try {
      await api.deleteListing(item.id);
      setListings((current) => current.filter((listing) => listing.id !== item.id));
      setOpenMenuId(null);
    } catch (error) {
      setActionError(error.message || "Could not delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (item) => {
    setActionError("");
    setTogglingId(item.id);
    try {
      const nextAvailable = !item.isAvailable;
      const data = await api.updateListingAvailability(item.id, nextAvailable);
      const mapped = mapApiListing(data.listing);
      setListings((current) =>
        current.map((listing) => (listing.id === item.id ? mapped : listing)),
      );
    } catch (error) {
      setActionError(error.message || "Could not update availability");
    } finally {
      setTogglingId(null);
    }
  };

  const summaryCards = useMemo(() => {
    const active = listings.filter(
      (item) =>
        item.verificationStatus === "approved" && item.listingStatus === "active",
    ).length;
    const pending = listings.filter((item) => item.verificationStatus === "pending").length;
    const rejected = listings.filter((item) => item.verificationStatus === "rejected").length;
    const rent = listings.filter((item) => item.listingType === "rent").length;
    const auctions = listings.filter((item) => item.listingType === "sale").length;

    return [
      { label: "Active", value: String(active), variant: "primary", filter: "Active" },
      { label: "Pending", value: String(pending), variant: "secondary", filter: "Pending" },
      { label: "Rejected", value: String(rejected), variant: "tertiary", filter: "Rejected" },
      { label: "Rent", value: String(rent), variant: "secondary", filter: "Rent" },
      { label: "Auctions", value: String(auctions), variant: "tertiary", filter: "Auctions" },
    ];
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (activeFilter === "Active") {
        if (item.verificationStatus !== "approved" || item.listingStatus !== "active") {
          return false;
        }
      } else if (activeFilter === "Pending") {
        if (item.verificationStatus !== "pending") return false;
      } else if (activeFilter === "Rejected") {
        if (item.verificationStatus !== "rejected") return false;
      } else if (activeFilter === "Rent") {
        if (item.listingType !== "rent") return false;
      } else if (activeFilter === "Auctions") {
        if (item.listingType !== "sale") return false;
      }

      return item.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    });
  }, [activeFilter, listings, searchQuery]);

  return (
    <>
      <CardHeader className="seller-dashboard-heading seller-dashboard-heading--with-action px-0">
        <div className="my-listing-header-text">
          <CardTitle className="seller-dashboard-page-title">My Listings</CardTitle>
          <CardDescription>
            Manage your pre-loved clothing listings.
          </CardDescription>
        </div>
        <Button asChild className="my-listing-add-btn">
          <Link to="/addListing">
            <Plus size={18} />
            Add Listing
          </Link>
        </Button>
      </CardHeader>

      {loadError ? (
        <p className="my-listing-load-error" role="alert">
          {loadError}
        </p>
      ) : null}

      {actionError ? (
        <p className="my-listing-load-error" role="alert">
          {actionError}
        </p>
      ) : null}

      <section className="my-listing-summary">
        <div className="my-listing-summary-track">
          {summaryCards.map((card) => (
            <button
              key={card.label}
              type="button"
              className={`my-listing-summary-card-btn ${
                activeFilter === card.filter ? "is-active" : ""
              }`}
              onClick={() => setActiveFilter(card.filter)}
            >
              <Card
                className={`my-listing-summary-card my-listing-summary-card--${card.variant} py-0 gap-0 ring-0 shadow-none`}
              >
                <CardContent className="my-listing-summary-content">
                  <CardDescription className="my-listing-summary-label">
                    {card.label}
                  </CardDescription>
                  <CardTitle className="my-listing-summary-value">
                    {card.value}
                  </CardTitle>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="my-listing-filters">
        <Field className="my-listing-search-field">
          <Label htmlFor="listing-search" className="sr-only">
            Search listings
          </Label>
          <div className="my-listing-search-wrap">
            <Search className="my-listing-search-icon" size={20} />
            <Input
              id="listing-search"
              type="search"
              placeholder="Search your listings..."
              className="my-listing-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </Field>
        <div className="my-listing-chips">
          {filterChips.map((chip) => (
            <Button
              key={chip}
              type="button"
              variant={activeFilter === chip ? "default" : "outline"}
              className={`my-listing-chip ${
                activeFilter === chip ? "is-active" : ""
              }`}
              onClick={() => setActiveFilter(chip)}
            >
              {chip}
            </Button>
          ))}
        </div>
      </section>

      <Separator className="my-listing-divider" />

      <section className="my-listing-cards">
        {loading ? (
          <Card className="my-listing-empty">
            <CardContent className="my-listing-empty-content">
              <p>Loading your listings...</p>
            </CardContent>
          </Card>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((item) => (
            <Card
              key={item.id}
              className={`my-listing-card py-0 gap-0 ring-0 shadow-none ${
                item.verificationStatus === "rejected" ? "my-listing-card--rejected" : ""
              }`}
            >
              <CardContent className="my-listing-card-content">
                <div className="my-listing-card-image">
                  <Link to={`/dress/${item.id}`} aria-label={`View ${item.title}`}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                </div>
                <div className="my-listing-card-body">
                  <div className="my-listing-card-top">
                    <CardTitle className="my-listing-card-title">
                      <Link to={`/dress/${item.id}`}>{item.title}</Link>
                    </CardTitle>
                    <p className="my-listing-card-brand">{item.brand}</p>
                    <CardAction className="my-listing-card-action">
                      <ListingActionsMenu
                        item={item}
                        isOpen={openMenuId === item.id}
                        onToggle={() =>
                          setOpenMenuId((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                        onClose={() => setOpenMenuId(null)}
                        onDelete={handleDeleteListing}
                        deleting={deletingId === item.id}
                      />
                    </CardAction>
                    <div className="my-listing-card-meta">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`my-listing-type my-listing-type--${item.typeVariant}`}
                        disabled
                      >
                        {item.type}
                      </Button>
                      <span
                        className={`my-listing-availability my-listing-availability--${item.availabilityKey}`}
                      >
                        {item.availabilityLabel}
                      </span>
                      <CardDescription className="my-listing-size">
                        • {item.size}
                      </CardDescription>
                    </div>
                  </div>

                  {item.verificationStatus === "pending" ? (
                    <div className="my-listing-review-banner my-listing-review-banner--pending">
                      <Clock size={16} />
                      <span>Awaiting admin approval. You will be notified once reviewed.</span>
                    </div>
                  ) : null}

                  {item.verificationStatus === "rejected" ? (
                    <div className="my-listing-review-banner my-listing-review-banner--rejected">
                      <AlertCircle size={16} />
                      <div>
                        <p className="my-listing-rejection-title">Listing not approved</p>
                        {item.adminNote ? (
                          <p className="my-listing-rejection-note">{item.adminNote}</p>
                        ) : null}
                        <Button asChild size="sm" className="my-listing-resubmit-btn">
                          <Link to="/addListing" state={{ editListingId: item.id }}>
                            Edit & Resubmit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="my-listing-card-bottom">
                    <div>
                      <CardDescription
                        className={`my-listing-price ${
                          item.typeVariant === "auction" ? "is-auction" : ""
                        }`}
                      >
                        {item.price}
                      </CardDescription>
                      <CardDescription className="my-listing-detail">
                        {item.detail}
                      </CardDescription>
                    </div>
                    <div className="my-listing-card-bottom-actions">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`my-listing-status my-listing-status--${item.statusVariant}`}
                        disabled
                      >
                        {item.status}
                      </Button>
                      {canManageListing(item) ? (
                        <Button asChild variant="outline" size="sm" className="my-listing-view-btn">
                          <Link to="/addListing" state={{ editListingId: item.id }}>
                            <Pencil size={14} />
                            Edit
                          </Link>
                        </Button>
                      ) : null}
                      {item.canToggleAvailability ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="my-listing-view-btn"
                          disabled={togglingId === item.id}
                          onClick={() => handleToggleAvailability(item)}
                        >
                          {togglingId === item.id
                            ? "Saving..."
                            : item.isAvailable
                              ? "Mark Unavailable"
                              : "Mark Available"}
                        </Button>
                      ) : null}
                      <Button asChild variant="outline" size="sm" className="my-listing-view-btn">
                        <Link to={`/dress/${item.id}`}>
                          <Eye size={14} />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="my-listing-empty">
            <CardContent className="my-listing-empty-content">
              <p>
                {listings.length === 0
                  ? "You have not submitted any listings yet."
                  : "No listings match your search or filter."}
              </p>
              <Button asChild className="my-listing-add-btn">
                <Link to="/addListing">
                  <Plus size={18} />
                  Add Listing
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
