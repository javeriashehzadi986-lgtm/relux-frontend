import React, { useMemo, useState } from "react";
import { CalendarDays, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./profileMyRentals.css";

const FILTER_TABS = [
  { id: "all", label: "All Rentals" },
  { id: "active", label: "Active" },
  { id: "upcoming-return", label: "Upcoming Return" },
  { id: "returned", label: "Returned" },
  { id: "cancelled", label: "Cancelled" },
];

const RENTALS = [
  {
    id: "rental-1",
    title: "Crimson Heritage Lehenga",
    status: "active",
    statusLabel: "Active",
    dates: "Jun 12 – Jun 15, 2025",
    returnNote: "Return pickup scheduled for Jun 16",
    price: "PKR 25,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fB6-yOWqiAy6q3jboGPz27AfrlAW5SoMxNOhmsCigHIz7dkOYF-iHfO2qSKNnlZDv_lPYQcmoTYhdmjq2Jy8y6ncdzgrnzZdxk8PlPXtG18q7B7WTVS36kxpLRdDuXuu-57YIEIYrpkpzUmnmfdkoZR32AkG1ONENxckqc5eYno2LvmJFG1zJd-e3fhP--rr_bh4mava9r5ws8lXIGqLlExaO4mNFIiEolcoN_AbPUgnouHiuxBLgQj_u60iSU021gVrmmqEbZJm",
  },
  {
    id: "rental-2",
    title: "Mint Pearl Walima Gown",
    status: "upcoming-return",
    statusLabel: "Upcoming Return",
    dates: "Jun 8 – Jun 10, 2025",
    returnNote: "Return due tomorrow",
    price: "PKR 18,500",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8TzKIlJBFhyEUYqerMoEjBDiDqV0rpb4lQJuyr8wSrrXnBdPmGXiTxuy8RQ2INfNuIEI8mSmiHm3DxRCuiuzBjnobYo2KMjppce0_DqAsnNyqHqW0XvZGvlilOWRnLYpLARVEl90grSGeTTYVHki2aL08XFQ4kPtzXTRvOuzU-vola6Kct2i-lfkoD4Q1IXuzEXuHn2SSvK1AKkwnpyH6BGifQXc-CtofQyw4tiEQt5WxJBoPzwOOzrC2a6uHAflnWvvLWUQdGD",
  },
  {
    id: "rental-3",
    title: "Emerald Royal Pishwas",
    status: "returned",
    statusLabel: "Returned",
    dates: "May 20 – May 23, 2025",
    returnNote: "Returned on May 24",
    price: "PKR 22,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRUaZkpTcunQa7V2BucWaBc7YhKkyPpp9Ih9uKs-HWKutP6pnm55Y_Aw5kzW7d_8rTGz_vUhWryD7n51HnhBN6ezUYH5RYI0MGSbExKiYsSUSLYczd809KBs7O7MACawdXr0gqfF9b8_v4Imza95o9AxD4dpoL0nV0cwMcoJgr7Ypgst03iKLqTvxBU9HPIXaXLnbaUQfa5nFRYyLdvNrUVboEGmevDutFNBPGjQbQEmKV2Cq-y0XRR4YgjbKSz20RSrdLh8yP1wE7",
  },
  {
    id: "rental-4",
    title: "Golden Sand Party Gown",
    status: "cancelled",
    statusLabel: "Cancelled",
    dates: "Apr 2 – Apr 4, 2025",
    returnNote: "Booking cancelled on Mar 28",
    price: "PKR 15,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhOmURP3037SfHwsoDt53YSSy4U7oIsgH11826JAcEfggPkqk-m1gSK-rahhuaHwFvn1RIZyJqS0N2QkoTvaN_CKFUxXKnanI7Tm1pBZTwT7KxorP_kP26s76q8oqwgutIfK_cyQWySRgh5ioqzMYx62VY6RyEjZiUzpHbKabScsYoum_JogkFK45wIXsj0VCOktfRxQA6t8BZ46kmWVa-K4co9jqLZ7xQvbCkwMNTselMjESer8JVkRvfzMcwKWX7Q7AOZPS-HHM9",
  },
];

const ProfileMyRentals = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRentals = useMemo(() => {
    return RENTALS.filter((rental) => {
      const matchesFilter =
        activeFilter === "all" || rental.status === activeFilter;
      const matchesSearch = rental.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="profile-rentals">
      <header className="profile-rentals-header">
        <div className="profile-rentals-header-top">
          <div>
            <h1 className="profile-rentals-title">My Rentals</h1>
            <p className="profile-rentals-subtitle">
              Manage your current luxury rentals and return schedule.
            </p>
          </div>

          <div className="profile-rentals-toolbar">
            <div className="profile-rentals-search-wrap">
              <Search
                className="profile-rentals-search-icon"
                size={18}
                aria-hidden="true"
              />
              <Input
                type="search"
                className="profile-rentals-search"
                placeholder="Search rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="profile-rentals-filter-btn"
              aria-label="Filter rentals"
            >
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>

        <div className="profile-rentals-tabs">
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant="ghost"
              className={`profile-rentals-tab ${
                activeFilter === tab.id ? "profile-rentals-tab--active" : ""
              }`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </header>

      <div className="profile-rentals-grid">
        {filteredRentals.length > 0 ? (
          filteredRentals.map((rental) => (
            <Card key={rental.id} className="profile-rental-card">
              <div className="profile-rental-image-wrap">
                <img alt={rental.title} src={rental.image} />
                <span
                  className={`profile-rental-badge profile-rental-badge--${rental.status}`}
                >
                  {rental.statusLabel}
                </span>
              </div>
              <CardContent className="profile-rental-content">
                <CardTitle className="profile-rental-title">
                  {rental.title}
                </CardTitle>
                <CardDescription className="profile-rental-dates">
                  <CalendarDays size={16} aria-hidden="true" />
                  {rental.dates}
                </CardDescription>
                <p className="profile-rental-note">{rental.returnNote}</p>
                <div className="profile-rental-footer">
                  <p className="profile-rental-price">{rental.price}</p>
                  <Button type="button" variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="profile-rentals-empty">
            <CardContent className="profile-rentals-empty-content">
              <p>No rentals match your search or filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ProfileMyRentals;
