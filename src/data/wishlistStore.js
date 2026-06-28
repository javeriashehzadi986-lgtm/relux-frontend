import { getDressById, toProductCardView } from "./dressCatalog";

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
  return {
    id: product.id,
    brand: product.brand,
    title: product.title,
    listingType: product.listingType,
    price: product.price,
    badge: product.badge ?? "Pre-owned",
    badgeVariant: product.badgeVariant ?? "secondary",
    image: product.image ?? product.mainImage,
    addedAt,
    popularity: product.popularity ?? 3,
    sortPrice: product.sortPrice ?? product.priceValue ?? parsePrice(product.price),
  };
}

function wishlistItemFromId(id, addedAt = Date.now()) {
  const product = toProductCardView(getDressById(id));
  return productToWishlistItem(product, addedAt);
}

export function getWishlistIds() {
  return new Set(loadWishlistEntries().map((entry) => entry.id));
}

export function isInWishlist(id) {
  return getWishlistIds().has(id);
}

export function getWishlistItems() {
  return loadWishlistEntries()
    .map((entry) => {
      try {
        const fresh = wishlistItemFromId(entry.id, entry.addedAt);
        return { ...fresh, addedAt: entry.addedAt };
      } catch {
        return entry;
      }
    })
    .sort((a, b) => b.addedAt - a.addedAt);
}

export function addToWishlist(productOrId) {
  const item =
    typeof productOrId === "string"
      ? wishlistItemFromId(productOrId)
      : productToWishlistItem(productOrId);

  const entries = loadWishlistEntries().filter((entry) => entry.id !== item.id);
  entries.unshift(item);
  persist(entries);
  return true;
}

export function removeFromWishlist(id) {
  const entries = loadWishlistEntries().filter((entry) => entry.id !== id);
  persist(entries);
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
