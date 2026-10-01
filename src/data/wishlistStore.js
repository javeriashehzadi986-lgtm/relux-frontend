import { isMongoListingId } from "./dressCatalog";

const LEGACY_STORAGE_KEY = "relux-wishlist";

try {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
} catch {
  // Ignore storage access errors (private mode, etc.)
}

const parsePrice = (price) => Number(String(price).replace(/[^\d]/g, "")) || 0;

function toApiPayload(item) {
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

/** Build API body for wishlist add/toggle from a product or id. */
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

    return toApiPayload({
      id: productOrId.id,
      itemId: productOrId.id,
      title: productOrId.title ?? "Saved item",
      brand: productOrId.brand ?? "",
      image: productOrId.image ?? productOrId.mainImage ?? "",
      listingType,
      price: typeof price === "number" ? String(price) : price,
      badge: productOrId.badge ?? "Pre-owned",
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
