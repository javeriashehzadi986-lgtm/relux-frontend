import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./dressDetailsBreadcrumb.css";

const LISTING_LABELS = {
  rent: "Rental Dresses",
  resale: "Resale Dresses",
};

function resolveCategoryBreadcrumb(dress) {
  if (dress.categoryBreadcrumb) return dress.categoryBreadcrumb;
  if (dress.categoryLabel === "Male Fashion") return "Men";
  if (dress.categoryLabel === "Kids Fashion") return "Kids";
  return "Women";
}

export function DressDetailsBreadcrumb({ dress, listingType = "rent" }) {
  const categoryPath = dress.categoryPath ?? "/categories";
  const categoryBreadcrumb = resolveCategoryBreadcrumb(dress);
  const listingLabel = LISTING_LABELS[listingType] ?? LISTING_LABELS.resale;

  return (
    <nav className="dress-details-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li className="dress-details-breadcrumb-sep" aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>
          <Link to={categoryPath}>{categoryBreadcrumb}</Link>
        </li>
        <li className="dress-details-breadcrumb-sep" aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>
          <Link to={`${categoryPath}?type=${listingType}`}>{listingLabel}</Link>
        </li>
        <li className="dress-details-breadcrumb-sep" aria-hidden="true">
          <ChevronRight size={14} />
        </li>
        <li>Dress Details</li>
      </ol>
    </nav>
  );
}
