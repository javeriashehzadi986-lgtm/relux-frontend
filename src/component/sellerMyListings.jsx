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
import "./sellerMyListings.css";

const summaryCards = [
  { label: "Active", value: "24", variant: "primary" },
  { label: "Sale", value: "12", variant: "secondary" },
  { label: "Rent", value: "08", variant: "secondary" },
  { label: "Auctions", value: "04", variant: "tertiary" },
];

const filterChips = ["All", "Sale", "Rent", "Auctions"];

const INITIAL_LISTINGS = [
  {
    id: "silk-slip",
    title: "Vintage Silk Slip Dress",
    type: "Rent",
    typeVariant: "rent",
    size: "Size S",
    price: "$45 / day",
    detail: "Excellent Condition",
    status: "Active",
    statusVariant: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV_Q58P3tOM_BdZ7FugrByF2hGdVkOd8ypdFq0Y6qIvVV6BLq0KVldQNMfN3odhTp9AZ-wksa4aF1F9PIYbiixuCt9YiQKjqQGV_keBYmXXn5IDem8QG7anjQ8D3yafRx3E2_ENGA52gsaVff0J29MmXG4kQxwxQyp_ZynHJBUyFfcznDVQIbanS-0DKHIMK_MEb6zB6p-zMAd6sj_efaIxsdXWnceCp7XJpKV2cAoJx4NAtBHM3MYMObKIbcvgVDB1ENKirXmYJbX",
  },
  {
    id: "wool-blazer",
    title: "Tailored Wool Blazer",
    type: "Sale",
    typeVariant: "sale",
    size: "Size M",
    price: "$280",
    detail: "Like New",
    status: "Sold",
    statusVariant: "sold",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlU7p5bA5NVI6b4zFxcHYyPDo0PdZzBRaZ32I-fEPE1Kf346un0l1Ll18TKnXlFrcUqIFINZ_T9y8zBBXnPQFGv7xl8Woa64WcjOX8Itv8oSzHzRE9McEBEqmjtLYjk8ZVcO2C4Q1t5ZfIL1jGi5PKNy4WEG0RiSk1ydihmNy56AN43CpmfAJdSIJYyktUuG55aXi0bDQxaTNEM0PUQ7v2M2bmLmtAlR1AjB4pCFyHGMvFcmwYSI-egpGaB3iMbSryT7tIocxKVUU",
  },
  {
    id: "walima-gown",
    title: "Mint Pearl Walima Gown",
    type: "Auction",
    typeVariant: "auction",
    size: "Size M",
    price: "Current: $310",
    detail: "2d 4h left",
    status: "Live",
    statusVariant: "live",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8TzKIlJBFhyEUYqerMoEjBDiDqV0rpb4lQJuyr8wSrrXnBdPmGXiTxuy8RQ2INfNuIEI8mSmiHm3DxRCuiuzBjnobYo2KMjppce0_DqAsnNyqHqW0XvZGvlilOWRnLYpLARVEl90grSGeTTYVHki2aL08XFQ4kPtzXTRvOuzU-vola6Kct2i-lfkoD4Q1IXuzEXuHn2SSvK1AKkwnpyH6BGifQXc-CtofQyw4tiEQt5WxJBoPzwOOzrC2a6uHAflnWvvLWUQdGD",
  },
  {
    id: "cashmere-knit",
    title: "Cashmere Oversized Knit",
    type: "Sale",
    typeVariant: "sale",
    size: "Size L",
    price: "$195",
    detail: "Good Condition",
    status: "Active",
    statusVariant: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQemD3e6BOZATewDckoKN6LGnMsltEY2gw2q8lUInmROjSEuYbIBlXLU9LUnCGJIGwNMXoNKyqeBcXytDaU5EI9HU4SsDZZzh8zPiKHd9ZgptgIA9vSmf2EVijv5Q65Z4SF_wE4V54whxi3f5U9mej7h0idCDMflF_MmbmFSiI6jigtowaWzcJQd8eQ8qHoXkLskRTeqv-DsFY0OYczzrRtmuKiRt8dqoNh-zIy4f85wyWtLtisvVC3LIzzo-_yP2PF2M4C_dnSjkz",
  },
];

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
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const deleteListing = listings.find((item) => item.id === deleteTarget);
  const deactivateListing = listings.find((item) => item.id === deactivateTarget);

  const handleDuplicate = (listingId) => {
    setListings((current) => {
      const source = current.find((item) => item.id === listingId);
      if (!source) return current;

      const duplicate = {
        ...source,
        id: `${source.id}-copy-${Date.now()}`,
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
    setListings((current) => current.filter((item) => item.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const filteredListings = useMemo(() => {
    const filterMap = {
      All: null,
      Sale: "Sale",
      Rent: "Rent",
      Auctions: "Auction",
    };

    return listings.filter((item) => {
      const filterType = filterMap[activeFilter];
      const matchesFilter = !filterType || item.type === filterType;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      return matchesFilter && matchesSearch;
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
            <Card
              key={card.label}
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
        {filteredListings.map((item) => (
          <Card
            key={item.id}
            className="my-listing-card py-0 gap-0 ring-0 shadow-none"
          >
            <CardContent className="my-listing-card-content">
              <div className="my-listing-card-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="my-listing-card-body">
                <div className="my-listing-card-top">
                  <CardTitle className="my-listing-card-title">
                    {item.title}
                  </CardTitle>
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
        ))}
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
