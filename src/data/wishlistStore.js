import { isMongoListingId } from "./dressCatalog";

const STORAGE_KEY = "relux-wishlist";

const parsePrice = (price) => Number(String(price).replace(/[^\d]/g, "")) || 0;

let wishlistRevision = 0;

export function loadWishlistEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  wishlistRevision += 1;
  window.dispatchEvent(new Event("relux-wishlist-updated"));
}

export function getWishlistRevision() {
  return wishlistRevision;
}

export function subscribeWishlistRevision(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener("relux-wishlist-updated", handler);
  return () => window.removeEventListener("relux-wishlist-updated", handler);
}

export function productToWishlistItem(product, addedAt = Date.now()) {
  const listingType = product.listingType ?? "resale";
  const price =
    product.price ??
    product.priceFormatted ??
    product.dailyRateFormatted ??
    "";

  return {
    id: product.id,
    itemId: product.id,
    brand: product.brand,
    title: product.title,
    listingType,
    price,
    badge: product.badge ?? (listingType === "rent" ? "Pristine" : "Pre-owned"),
    badgeVariant:
      product.badgeVariant ?? (listingType === "rent" ? "primary" : "secondary"),
    image: product.image ?? product.mainImage,
    addedAt,
    popularity: product.popularity ?? 3,
    sortPrice:
      product.sortPrice ??
      product.priceValue ??
      product.dailyRate ??
      parsePrice(price),
  };
}

export function wishlistItemToApiPayload(item) {
  return {
    itemId: item.id ?? item.itemId,
    id: item.id ?? item.itemId,
    title: item.title,
    brand: item.brand,
    image: item.image,
    listingType: item.listingType,
    price: item.price,
    badge: item.badge,
    badgeVariant: item.badgeVariant,
    sortPrice: item.sortPrice,
  };
}

export function getWishlistIds() {
  return new Set(loadWishlistEntries().map((entry) => entry.id));
}

export function isInWishlist(id) {
  return getWishlistIds().has(id);
}

export function getWishlistItems() {
  return loadWishlistEntries()
    .filter((entry) => isMongoListingId(entry.id))
    .sort((a, b) => b.addedAt - a.addedAt);
}

export function addToWishlist(productOrId) {
  const item =
    typeof productOrId === "string"
      ? { id: productOrId, title: "Saved item", brand: "", listingType: "resale", price: "" }
      : productToWishlistItem(productOrId);

  if (!isMongoListingId(item.id)) {
    return false;
  }

  const entries = loadWishlistEntries().filter((entry) => entry.id !== item.id);
  entries.unshift(typeof productOrId === "string" ? item : productToWishlistItem(productOrId));
  persist(entries);
  return true;
}

export function removeFromWishlist(id) {
  const entries = loadWishlistEntries().filter((entry) => entry.id !== id);
  persist(entries);
}

export function resolveWishlistPayload(productOrId) {
  if (typeof productOrId === "object" && productOrId?.id) {
    const listingType =
      productOrId.listingType === "rent"
        ? "rent"
        : productOrId.listingType === "sale"
          ? "sale"
          : productOrId.listingType ?? "resale";

    const price =
      productOrId.price ??
      productOrId.priceFormatted ??
      productOrId.dailyRateFormatted ??
      "";

    return wishlistItemToApiPayload({
      id: productOrId.id,
      itemId: productOrId.id,
      title: productOrId.title ?? "Saved item",
      brand: productOrId.brand ?? "",
      image: productOrId.image ?? productOrId.mainImage ?? "",
      listingType,
      price: typeof price === "number" ? String(price) : price,
      badge:
        productOrId.badge ?? (listingType === "rent" ? "Pristine" : "Pre-owned"),
      badgeVariant:
        productOrId.badgeVariant ??
        (listingType === "rent" ? "primary" : "secondary"),
      sortPrice:
        productOrId.sortPrice ??
        productOrId.priceValue ??
        productOrId.dailyRate ??
        parsePrice(price),
    });
  }

  const id = String(productOrId ?? "").trim();
  if (!id) {
    throw new Error("Wishlist item id is required");
  }

  if (!isMongoListingId(id)) {
    throw new Error("Only live listings can be saved to your wishlist");
  }

  return {
    itemId: id,
    id,
    productId: id,
  };
}

export function clearLocalWishlist() {
  localStorage.removeItem(STORAGE_KEY);
  wishlistRevision += 1;
  window.dispatchEvent(new Event("relux-wishlist-updated"));
}

export async function syncLocalWishlistToServer(apiClient) {
  const entries = loadWishlistEntries().filter((entry) => isMongoListingId(entry.id));
  if (entries.length === 0) return;

  await Promise.all(
    entries.map((entry) =>
      apiClient
        .addWishlistItem(wishlistItemToApiPayload(entry))
        .catch(() => null),
    ),
  );

  clearLocalWishlist();
}

export function toggleWishlist(productOrId) {
  const id = typeof productOrId === "string" ? productOrId : productOrId.id;

  if (isInWishlist(id)) {
    removeFromWishlist(id);
    return false;
  }

  addToWishlist(productOrId);
  return true;
}
