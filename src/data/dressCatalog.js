import {
  LISTING_SIZE_OPTIONS,
  normalizeListingCondition,
  normalizeListingSize,
} from "./listingSpecs";
import { getPublicListingById } from "./catalogStore";

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
};

const formatRs = (amount) => `Rs. ${amount.toLocaleString("en-PK")}`;

const AUCTION_RULES = [
  "No cancellations or withdrawals once a bid is placed.",
  "Highest bid at the end of the countdown wins.",
  "Payment must be finalized within 24h of winning.",
  "Seller approval required for final transaction.",
];

const RENTAL_POLICY = [
  "The full dress price is collected as a refundable security deposit.",
  "This deposit is not a purchase price; the item remains the property of the seller.",
  "Rental charges are deducted only after the dress is returned and inspected.",
  "The remaining balance is refunded to your original payment method or wallet.",
  "Items must be returned by 12 PM on the scheduled end date.",
  "Late returns incur a fee of 50% of the daily rental rate per day.",
  "Major damages or permanent stains will be deducted from the deposit.",
  "Rental is only confirmed once the seller accepts the booking request.",
];

const CATEGORY_PATH_BY_MAIN = {
  Female: "/femaleFashion",
  Male: "/maleFashion",
  Kids: "/kidsFashion",
};

const getCategoryBreadcrumb = (categoryLabel) => {
  if (categoryLabel === "Male Fashion") return "Men";
  if (categoryLabel === "Kids Fashion") return "Kids";
  return "Women";
};

const resolveDressConditionLabel = (dress, listingType = dress.listingType) => {
  if (dress.listingCondition) return dress.listingCondition;
  const label = dress.conditionStatus ?? dress.condition;
  if (label) return normalizeListingCondition(label);
  return "Like New";
};

export const getDressConditionLabel = (dress) =>
  dress?.conditionLabel ?? resolveDressConditionLabel(dress ?? {}, dress?.listingType);

const applyListingSpecs = (dress) => {
  const listingSize = normalizeListingSize(dress.listingSize ?? dress.sizes?.[0]);
  const listingCondition = resolveDressConditionLabel(dress, dress.listingType);

  return {
    listingSize,
    listingCondition,
    conditionLabel: listingCondition,
    conditionStatus: listingCondition,
    condition: listingCondition,
    sizes: LISTING_SIZE_OPTIONS,
    sizeOptions: LISTING_SIZE_OPTIONS,
  };
};

const enrichResaleDress = (dress) => {
  const salePrice = parsePrice(dress.salePrice ?? dress.price);
  const startingBid = parsePrice(dress.startingBid) || salePrice;
  const price = salePrice;
  const estimatedValue = dress.originalRetailPrice ?? dress.estimatedValue ?? null;
  const currentBid = dress.currentBid ?? startingBid;
  const minimumNextBid = dress.minimumNextBid ?? currentBid + 2500;
  const mainImage = dress.mainImage ?? dress.image ?? "";
  const gallery =
    dress.gallery?.length > 0
      ? dress.gallery
      : mainImage
        ? [mainImage]
        : [];
  const bidHistory = (dress.bidHistory ?? []).map((bid) => ({
    ...bid,
    amountFormatted: bid.amountFormatted ?? formatRs(bid.amount),
  }));
  const bidderCount = dress.bidderCount ?? bidHistory.length;

  return {
    ...dress,
    listingType: "resale",
    gallery,
    mainImage: gallery[0] ?? mainImage,
    rating: dress.rating ?? null,
    salePrice,
    salePriceFormatted: dress.salePriceFormatted ?? formatRs(salePrice),
    startingBid,
    startingBidFormatted: dress.startingBidFormatted ?? formatRs(startingBid),
    estimatedValue,
    estimatedValueFormatted: estimatedValue ? formatRs(estimatedValue) : null,
    currentBid,
    minimumNextBid,
    bidderCount,
    bidStatus: dress.bidStatus ?? "Open",
    yourHighestBid: dress.yourHighestBid ?? null,
    bidHistory,
    auctionRules: dress.auctionRules ?? AUCTION_RULES,
    breadcrumbCategory: dress.breadcrumbCategory ?? dress.categoryLabel ?? "Pre-owned",
    categoryBreadcrumb: dress.categoryBreadcrumb ?? getCategoryBreadcrumb(dress.categoryLabel),
    countdown: dress.countdown ?? { hours: 0, minutes: 0, seconds: 0 },
    currentBidFormatted: dress.currentBidFormatted ?? formatRs(currentBid),
    minimumNextBidFormatted: dress.minimumNextBidFormatted ?? formatRs(minimumNextBid),
    priceFormatted: dress.priceFormatted ?? formatRs(price),
    deliveryCharges: dress.deliveryCharges ?? 1500,
    ...applyListingSpecs(dress),
  };
};

const enrichRentalDress = (dress) => {
  const dailyRate = dress.dailyRate ?? parsePrice(dress.rentPrice) ?? 0;
  const securityDeposit =
    dress.securityDeposit ?? dress.fullDressPrice ?? parsePrice(dress.itemPrice) ?? 0;
  const mainImage = dress.mainImage ?? dress.image ?? "";
  const gallery = dress.gallery?.length > 0 ? dress.gallery : mainImage ? [mainImage] : [];
  const categoryBreadcrumb = dress.categoryBreadcrumb ?? getCategoryBreadcrumb(dress.categoryLabel);

  return {
    ...dress,
    listingType: "rent",
    gallery,
    mainImage: gallery[0] ?? mainImage,
    dailyRate,
    dailyRateFormatted: dress.dailyRateFormatted ?? formatRs(dailyRate),
    securityDeposit,
    securityDepositFormatted: dress.securityDepositFormatted ?? formatRs(securityDeposit),
    fullDressPrice: securityDeposit,
    fullDressPriceFormatted: dress.fullDressPriceFormatted ?? formatRs(securityDeposit),
    fabric: dress.fabric ?? dress.description ?? "",
    occasion: dress.occasion ?? "",
    careInstructions: dress.careInstructions ?? "Professional dry clean only.",
    sellerName: dress.sellerName ?? dress.seller ?? dress.brand ?? "Relux Seller",
    categoryBreadcrumb,
    rentalPolicy: dress.rentalPolicy ?? RENTAL_POLICY,
    ...applyListingSpecs(dress),
  };
};

const getProductPriceValue = (dress) => {
  if (dress.listingType === "rent") {
    return dress.dailyRate ?? parsePrice(dress.rentPrice) ?? 0;
  }
  return parsePrice(dress.price ?? dress.currentBid);
};

const productMatchesStyle = (product, style) => {
  if (!style) return true;
  const wanted = String(style).trim().toLowerCase();
  if (!wanted) return true;

  const styles =
    product.styles?.length > 0
      ? product.styles
      : product.style
        ? [product.style]
        : [];

  return styles.some((item) => String(item).trim().toLowerCase() === wanted);
};

const sortCategoryProducts = (products, sortBy) => {
  if (sortBy === "price-low") {
    return [...products].sort((a, b) => a.priceValue - b.priceValue);
  }
  if (sortBy === "price-high") {
    return [...products].sort((a, b) => b.priceValue - a.priceValue);
  }
  if (sortBy === "newest") {
    return [...products].sort(
      (a, b) =>
        new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime(),
    );
  }
  return products;
};

export const isMongoListingId = (id) => /^[a-f0-9]{24}$/i.test(String(id ?? ""));

export function normalizeMongoId(value) {
  if (!value) return null;
  if (typeof value === "string") {
    return isMongoListingId(value) ? value : null;
  }
  if (typeof value === "object") {
    const id = value._id ?? value.id;
    if (id && isMongoListingId(String(id))) {
      return String(id);
    }
  }
  const asString = String(value);
  return isMongoListingId(asString) ? asString : null;
}

export const mapApiListingToDress = (listing) => {
  const id = String(listing.id);
  const isRent = listing.listingType === "rent";
  const categoryPath = CATEGORY_PATH_BY_MAIN[listing.mainCategory] ?? listing.categoryPath ?? "";
  const categoryLabel =
    listing.mainCategory === "Male"
      ? "Male Fashion"
      : listing.mainCategory === "Kids"
        ? "Kids Fashion"
        : "Female Fashion";

  const dress = {
    id,
    sellerId: normalizeMongoId(listing.sellerId),
    title: listing.title,
    brand: listing.brand || "Relux Seller",
    seller: listing.seller ?? listing.sellerName ?? "Relux Seller",
    sellerName: listing.sellerName ?? listing.seller ?? "Relux Seller",
    description: listing.description,
    fabric: listing.description,
    mainImage: listing.mainImage,
    image: listing.mainImage,
    gallery: listing.gallery?.length ? listing.gallery : listing.mainImage ? [listing.mainImage] : [],
    listingSize: listing.listingSize || "M",
    listingCondition: listing.listingCondition || "Like New",
    style: listing.style,
    styles: listing.style ? [listing.style] : [],
    clothingType: listing.clothingType,
    categoryPath,
    categoryLabel,
    updatedAt: listing.updatedAt ?? listing.submittedAt ?? listing.reviewedAt,
    ...(isRent
      ? {
          listingType: "rent",
          dailyRate: parsePrice(listing.rentPrice),
          securityDeposit: parsePrice(listing.itemPrice),
          fullDressPrice: parsePrice(listing.itemPrice),
        }
      : {
          listingType: "resale",
          salePrice: parsePrice(listing.salePrice),
          startingBid: parsePrice(listing.startingBid),
          price: parsePrice(listing.salePrice),
          currentBid: parsePrice(listing.startingBid || listing.salePrice),
          minimumNextBid: parsePrice(listing.startingBid || listing.salePrice),
        }),
  };

  return isRent ? enrichRentalDress(dress) : enrichResaleDress(dress);
};

export function lookupListingDress(id) {
  if (!isMongoListingId(id)) return null;
  const listing = getPublicListingById(id);
  return listing ? mapApiListingToDress(listing) : null;
}

export const toProductCardViewFromDress = (dress) => {
  const enriched =
    dress.listingType === "rent" ? enrichRentalDress(dress) : enrichResaleDress(dress);
  const { badge, badgeVariant } = deriveBadge(enriched);
  const priceValue = getProductPriceValue(enriched);

  return {
    id: enriched.id,
    brand: enriched.brand,
    title: enriched.title,
    style: enriched.style,
    styles: enriched.styles ?? (enriched.style ? [enriched.style] : []),
    listingType: enriched.listingType,
    listingSize: enriched.listingSize,
    listingCondition: enriched.listingCondition ?? getDressConditionLabel(enriched),
    price:
      enriched.listingType === "rent"
        ? enriched.dailyRateFormatted
        : enriched.priceFormatted,
    priceValue,
    badge,
    badgeVariant,
    image: enriched.mainImage ?? enriched.image,
    categoryPath: enriched.categoryPath,
    seller: enriched.seller ?? enriched.sellerName,
    sellerId: enriched.sellerId,
    updatedAt: enriched.updatedAt,
  };
};

const deriveBadge = (dress) => {
  const condition = dress.listingCondition ?? dress.conditionStatus ?? dress.condition ?? "";
  if (/brand new|never worn/i.test(condition)) {
    return { badge: "Brand New", badgeVariant: "primary" };
  }
  if (/like new/i.test(condition)) {
    return { badge: "Like New", badgeVariant: "secondary" };
  }
  if (/excellent/i.test(condition)) {
    return { badge: "Excellent", badgeVariant: "excellent" };
  }
  if (/good/i.test(condition)) {
    return { badge: "Good", badgeVariant: "secondary" };
  }

  return { badge: "Pre-owned", badgeVariant: "secondary" };
};

export const filterProductCards = (products, filters = {}) => {
  const { listingType, style, size, priceMax, search, sortBy } = filters;
  const query = search?.trim().toLowerCase() ?? "";

  const filtered = products.filter((product) => {
    if (listingType && listingType !== "all" && product.listingType !== listingType) {
      return false;
    }
    if (!productMatchesStyle(product, style)) {
      return false;
    }
    if (size && product.listingSize !== size) {
      return false;
    }
    if (priceMax != null && product.priceValue > priceMax) {
      return false;
    }
    if (
      query &&
      !product.title.toLowerCase().includes(query) &&
      !product.brand.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  return sortCategoryProducts(filtered, sortBy);
};

export const mapPublicListingsToProductCards = (listings) =>
  (listings ?? []).map((listing) => {
    const dress = mapApiListingToDress(listing);
    const card = toProductCardViewFromDress(dress);

    return {
      ...card,
      sellerId: dress.sellerId,
      updatedAt: listing.submittedAt ?? listing.reviewedAt ?? card.updatedAt ?? null,
      categoryPath: CATEGORY_PATH_BY_MAIN[listing.mainCategory] ?? card.categoryPath ?? "",
    };
  });

export const applyAuctionApiData = (dress, auctionData) => {
  if (!auctionData?.summary) return dress;

  const { summary, history = [], viewer } = auctionData;

  return {
    ...dress,
    currentBid: summary.currentBid,
    currentBidFormatted: summary.currentBidFormatted,
    minimumNextBid: summary.minimumNextBid,
    minimumNextBidFormatted: summary.minimumNextBidFormatted,
    bidderCount: summary.bidderCount,
    bidStatus: viewer?.bidStatus ?? summary.bidStatus ?? dress.bidStatus,
    yourHighestBid: viewer?.yourHighestBidFormatted ?? dress.yourHighestBid ?? null,
    bidHistory: history.length > 0 ? history : dress.bidHistory ?? [],
    countdown: summary.countdown ?? dress.countdown,
    auctionWon: viewer?.hasWon ?? false,
    auctionEnded: summary.auctionEnded ?? false,
  };
};

export const hydrateBuyerOrder = (order) => {
  const dress = lookupListingDress(order.dressId);
  const rentalTotal =
    order.rentalDays && dress?.dailyRate ? dress.dailyRate * order.rentalDays : null;

  return {
    ...order,
    title: dress?.title ?? "Listed item",
    brand: dress?.brand ?? "",
    image: dress?.mainImage ?? dress?.image ?? "",
    listingType: dress?.listingType ?? (order.type === "rental" ? "rent" : "resale"),
    amount:
      order.type === "rental"
        ? formatRs(rentalTotal ?? dress?.securityDeposit ?? (dress?.dailyRate ?? 0) * 3)
        : dress?.priceFormatted ?? "—",
    variant:
      order.variant ??
      `Size: ${order.size ?? "M"}${dress?.brand ? ` • ${dress.brand}` : ""}`,
  };
};

export const hydrateSellerOrder = (order) => {
  const dress = lookupListingDress(order.dressId);

  return {
    ...order,
    itemTitle: dress?.title ?? "Listed item",
    itemImage: dress?.mainImage ?? dress?.image ?? "",
    brand: dress?.brand ?? "",
  };
};

export { formatRs as formatPkr };
