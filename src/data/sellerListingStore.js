const STORAGE_KEY = "relux-seller-listings";
const DELETED_LISTINGS_KEY = "relux-seller-deleted-listings";

const categoryPathByMain = {
  Female: "/femaleFashion",
  Male: "/maleFashion",
  Kids: "/kidsFashion",
};

export function loadSellerListings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

let listingRevision = 0;

export function saveSellerListing(listing) {
  const listings = loadSellerListings();
  listings[listing.id] = {
    ...listing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  listingRevision += 1;
  window.dispatchEvent(new Event("relux-listings-updated"));
}

export function getListingRevision() {
  return listingRevision;
}

export function subscribeListingRevision(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener("relux-listings-updated", handler);
  return () => window.removeEventListener("relux-listings-updated", handler);
}

export function loadDeletedListingIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DELETED_LISTINGS_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function markListingDeleted(id) {
  const deleted = loadDeletedListingIds();
  deleted.add(id);
  localStorage.setItem(DELETED_LISTINGS_KEY, JSON.stringify([...deleted]));
}

export function deleteSellerListing(id) {
  const listings = loadSellerListings();
  if (listings[id]) {
    delete listings[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }

  markListingDeleted(id);
  listingRevision += 1;
  window.dispatchEvent(new Event("relux-listings-updated"));
}

export function isListingDeleted(id) {
  return loadDeletedListingIds().has(id);
}

export function getSellerListingIdsForCategory(categoryPath) {
  const deletedIds = loadDeletedListingIds();

  return Object.values(loadSellerListings())
    .filter(
      (listing) =>
        (categoryPathByMain[listing.mainCategory] ?? "") === categoryPath,
    )
    .map((listing) => listing.id)
    .filter((id) => !deletedIds.has(id));
}

export function getSellerListingOverride(id) {
  return loadSellerListings()[id] ?? null;
}

export function mapSellerListingToProduct(listing) {
  const listingType = listing.listingType === "rent" ? "rent" : "resale";
  const categoryPath = categoryPathByMain[listing.mainCategory] ?? "/categories";

  return {
    id: listing.id,
    title: listing.title,
    brand: listing.brand || "Zarish Closet",
    seller: listing.seller ?? "Zarish",
    sellerName: listing.sellerName ?? "Zarish",
    listingType,
    listingSize: listing.listingSize,
    listingCondition: listing.listingCondition,
    fabric: listing.description,
    occasion: listing.description,
    image: listing.mainImage,
    mainImage: listing.mainImage,
    gallery: listing.gallery,
    categoryPath,
    categoryLabel:
      listing.mainCategory === "Male"
        ? "Male Fashion"
        : listing.mainCategory === "Kids"
          ? "Kids Fashion"
          : "Female Fashion",
    style: listing.style,
    clothingType: listing.clothingType,
    price: listing.salePrice ? Number(listing.salePrice) : undefined,
    dailyRate: listing.rentPrice ? Number(listing.rentPrice) : undefined,
    securityDeposit: listing.itemPrice ? Number(listing.itemPrice) : undefined,
    fullDressPrice: listing.itemPrice ? Number(listing.itemPrice) : undefined,
    currentBid: listing.startingBid ? Number(listing.startingBid) : undefined,
    minimumNextBid: listing.minBid ? Number(listing.minBid) : undefined,
    updatedAt: listing.updatedAt,
  };
}
