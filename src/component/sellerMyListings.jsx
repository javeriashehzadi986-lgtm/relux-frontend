import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Plus,
  Eye,
  Pencil,
  Copy,
  PauseCircle,
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
import { SELLER_LISTING_META } from "@/data/sellerListingsData";
import {
  hydratePublishedSellerListing,
  hydrateSellerListing,
} from "@/data/dressCatalog";
import {
  deleteSellerListing,
  isListingDeleted,
  loadSellerListings,
} from "@/data/sellerListingStore";
import { useListingCatalog } from "@/hooks/useListingCatalog";
import "./sellerMyListings.css";

const summaryCards = [
  { label: "Active", value: "24", variant: "primary", filter: "Active" },
  { label: "Rent", value: "08", variant: "secondary", filter: "Rent" },
  { label: "Auctions", value: "04", variant: "tertiary", filter: "Auctions" },
];

const filterChips = ["All", "Rent", "Auctions"];

function buildSellerListings() {
  const staticIds = new Set(SELLER_LISTING_META.map((meta) => meta.dressId));
  const published = Object.values(loadSellerListings())
    .filter((listing) => !staticIds.has(listing.id))
    .map(hydratePublishedSellerListing);

  const staticListings = SELLER_LISTING_META.map(hydrateSellerListing).filter(
    (listing) => !isListingDeleted(listing.id),
  );

  return [...published, ...staticListings].filter(
    (listing) => !isListingDeleted(listing.id),
  );
}

function ListingActionsMenu({
  item,
  isOpen,
  onToggle,
  onClose,
  onDuplicate,
  onDeactivateRequest,
  onDeleteRequest,
}) {
  const menuRef = useRef(null);
  const canDeactivate =
    item.statusVariant === "active" || item.statusVariant === "live";

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

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div className="my-listing-menu-wrap" ref={menuRef}>
      <Button
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
        <ul className="my-listing-menu" role="menu" aria-label={`Actions for ${item.title}`}>
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
          <li role="none">
            <Link
              to="/addListing"
              state={{ editListingId: item.id }}
              className="my-listing-menu-item"
              role="menuitem"
              onClick={onClose}
            >
              <Pencil size={16} />
              Edit Listing
            </Link>
          </li>
          <li role="none">
            <button
              type="button"
              className="my-listing-menu-item"
              role="menuitem"
              onClick={() => {
                onDuplicate(item.id);
                onClose();
              }}
            >
              <Copy size={16} />
              Duplicate Listing
            </button>
          </li>
          {canDeactivate && (
            <li role="none">
              <button
                type="button"
                className="my-listing-menu-item"
                role="menuitem"
                onClick={() => {
                  onDeactivateRequest(item.id);
                  onClose();
                }}
              >
                <PauseCircle size={16} />
                Deactivate Listing
              </button>
            </li>
          )}
          <li className="my-listing-menu-divider" role="separator" aria-hidden="true" />
          <li role="none">
            <button
              type="button"
              className="my-listing-menu-item my-listing-menu-item--danger"
              role="menuitem"
              onClick={() => {
                onDeleteRequest(item.id);
                onClose();
              }}
            >
              <Trash2 size={16} />
              Delete Listing
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export function SellerMyListingsContent() {
  const catalogRevision = useListingCatalog();
  const [listings, setListings] = useState(() => buildSellerListings());
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  useEffect(() => {
    setListings(buildSellerListings());
  }, [catalogRevision]);

  const deleteListing = listings.find((item) => item.id === deleteTarget);
  const deactivateListing = listings.find((item) => item.id === deactivateTarget);

  const handleDuplicate = (listingId) => {
    setListings((current) => {
      const source = current.find((item) => item.id === listingId);
      if (!source) return current;

      const duplicate = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
        dressId: source.id,
        title: `${source.title} (Copy)`,
        status: "Active",
        statusVariant: "active",
      };

      return [duplicate, ...current];
    });
  };

  const handleDeactivateConfirm = () => {
    if (!deactivateTarget) return;
    setListings((current) =>
      current.map((item) =>
        item.id === deactivateTarget
          ? { ...item, status: "Inactive", statusVariant: "sold" }
          : item
      )
    );
    setDeactivateTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteSellerListing(deleteTarget);
    setDeleteTarget(null);
  };

  const filteredListings = useMemo(() => {
    const filterMap = {
      All: null,
      Rent: "Rent",
      Auctions: "Auction",
    };

    return listings.filter((item) => {
      if (activeFilter === "Active") {
        if (item.status !== "Active" && item.status !== "Live") return false;
      } else {
        const filterType = filterMap[activeFilter];
        if (filterType && item.type !== filterType) return false;
      }
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesSearch;
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
        {filteredListings.length > 0 ? (
          filteredListings.map((item) => (
          <Card
            key={item.id}
            className="my-listing-card py-0 gap-0 ring-0 shadow-none"
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
                          current === item.id ? null : item.id
                        )
                      }
                      onClose={() => setOpenMenuId(null)}
                      onDuplicate={handleDuplicate}
                      onDeactivateRequest={setDeactivateTarget}
                      onDeleteRequest={setDeleteTarget}
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
                    <CardDescription className="my-listing-size">
                      • {item.size}
                    </CardDescription>
                  </div>
                </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={`my-listing-status my-listing-status--${item.statusVariant}`}
                    disabled
                  >
                    {item.status}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        ) : (
          <Card className="my-listing-empty">
            <CardContent className="my-listing-empty-content">
              <p>No listings match your search or filter.</p>
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

      {deactivateTarget && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-listing-title"
          onClick={() => setDeactivateTarget(null)}
        >
          <Card
            className="profile-logout-modal my-listing-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle
                id="deactivate-listing-title"
                className="profile-logout-modal-title"
              >
                Deactivate listing?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                {deactivateListing
                  ? `"${deactivateListing.title}" will be hidden from buyers until you activate it again.`
                  : "This listing will be hidden from buyers until you activate it again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setDeactivateTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="profile-logout-confirm-btn"
                onClick={handleDeactivateConfirm}
              >
                Deactivate
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div
          className="profile-logout-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-listing-title"
          onClick={() => setDeleteTarget(null)}
        >
          <Card
            className="profile-logout-modal my-listing-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="profile-logout-modal-header">
              <CardTitle
                id="delete-listing-title"
                className="profile-logout-modal-title"
              >
                Delete listing?
              </CardTitle>
              <CardDescription className="profile-logout-modal-description">
                {deleteListing
                  ? `"${deleteListing.title}" will be permanently removed from your listings. This action cannot be undone.`
                  : "This listing will be permanently removed. This action cannot be undone."}
              </CardDescription>
            </CardHeader>
            <CardContent className="profile-logout-modal-actions">
              <Button
                type="button"
                variant="ghost"
                className="profile-logout-cancel-btn"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="my-listing-delete-confirm-btn"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
