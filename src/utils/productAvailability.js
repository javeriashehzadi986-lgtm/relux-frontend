export function getListingAvailability(listing) {
  if (!listing) {
    return { key: "unavailable", label: "Unavailable", canPurchase: false };
  }

  if (listing.availability?.label) {
    return listing.availability;
  }

  if (listing.status === "sold") {
    return { key: "sold", label: "Sold", canPurchase: false };
  }
  if (listing.status === "rented") {
    return { key: "rented", label: "Currently Rented", canPurchase: false };
  }
  if (listing.verificationStatus === "pending" || listing.status === "pending") {
    return { key: "pending", label: "Pending Review", canPurchase: false };
  }
  if (listing.isAvailable === false) {
    return { key: "unavailable", label: "Unavailable", canPurchase: false };
  }
  if (listing.status === "active" && listing.verificationStatus === "approved") {
    return { key: "available", label: "Available", canPurchase: true };
  }

  return { key: "unavailable", label: "Unavailable", canPurchase: false };
}
