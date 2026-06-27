export const SELLER_LISTING_META = [
  {
    dressId: "silk-slip",
    type: "Rent",
    typeVariant: "rent",
    size: "Size S",
    status: "Active",
    statusVariant: "active",
  },
  {
    dressId: "wool-blazer",
    type: "Sale",
    typeVariant: "sale",
    size: "Size M",
    status: "Sold",
    statusVariant: "sold",
  },
  {
    dressId: "walima-gown",
    type: "Auction",
    typeVariant: "auction",
    size: "Size M",
    status: "Live",
    statusVariant: "live",
  },
  {
    dressId: "cashmere-knit",
    type: "Sale",
    typeVariant: "sale",
    size: "Size L",
    status: "Active",
    statusVariant: "active",
  },
];

export const SELLER_LISTING_IMAGES = {
  "silk-slip":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAV_Q58P3tOM_BdZ7FugrByF2hGdVkOd8ypdFq0Y6qIvVV6BLq0KVldQNMfN3odhTp9AZ-wksa4aF1F9PIYbiixuCt9YiQKjqQGV_keBYmXXn5IDem8QG7anjQ8D3yafRx3E2_ENGA52gsaVff0J29MmXG4kQxwxQyp_ZynHJBUyFfcznDVQIbanS-0DKHIMK_MEb6zB6p-zMAd6sj_efaIxsdXWnceCp7XJpKV2cAoJx4NAtBHM3MYMObKIbcvgVDB1ENKirXmYJbX",
  "wool-blazer":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBQlU7p5bA5NVI6b4zFxcHYyPDo0PdZzBRaZ32I-fEPE1Kf346un0l1Ll18TKnXlFrcUqIFINZ_T9y8zBBXnPQFGv7xl8Woa64WcjOX8Itv8oSzHzRE9McEBEqmjtLYjk8ZVcO2C4Q1t5ZfIL1jGi5PKNy4WEG0RiSk1ydihmNy56AN43CpmfAJdSIJYyktUuG55aXi0bDQxaTNEM0PUQ7v2M2bmLmtAlR1AjB4pCFyHGMvFcmwYSI-egpGaB3iMbSryT7tIocxKVUU",
  "walima-gown":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8TzKIlJBFhyEUYqerMoEjBDiDqV0rpb4lQJuyr8wSrrXnBdPmGXiTxuy8RQ2INfNuIEI8mSmiHm3DxRCuiuzBjnobYo2KMjppce0_DqAsnNyqHqW0XvZGvlilOWRnLYpLARVEl90grSGeTTYVHki2aL08XFQ4kPtzXTRvOuzU-vola6Kct2i-lfkoD4Q1IXuzEXuHn2SSvK1AKkwnpyH6BGifQXc-CtofQyw4tiEQt5WxJBoPzwOOzrC2a6uHAflnWvvLWUQdGD",
  "cashmere-knit":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQemD3e6BOZATewDckoKN6LGnMsltEY2gw2q8lUInmROjSEuYbIBlXLU9LUnCGJIGwNMXoNKyqeBcXytDaU5EI9HU4SsDZZzh8zPiKHd9ZgptgIA9vSmf2EVijv5Q65Z4SF_wE4V54whxi3f5U9mej7h0idCDMflF_MmbmFSiI6jigtowaWzcJQd8eQ8qHoXkLskRTeqv-DsFY0OYczzrRtmuKiRt8dqoNh-zIy4f85wyWtLtisvVC3LIzzo-_yP2PF2M4C_dnSjkz",
};

/** @deprecated Use hydrateSellerListing from dressCatalog with SELLER_LISTING_META */
export const SELLER_LISTINGS = SELLER_LISTING_META.map((meta) => ({
  id: meta.dressId,
  title: "",
  type: meta.type,
  typeVariant: meta.typeVariant,
  size: meta.size,
  price: "",
  detail: "",
  status: meta.status,
  statusVariant: meta.statusVariant,
  image: SELLER_LISTING_IMAGES[meta.dressId] ?? "",
}));

export const SELLER_LISTING_PRODUCTS = {
  "silk-slip": {
    id: "silk-slip",
    title: "Vintage Silk Slip Dress",
    brand: "Zarish Closet",
    seller: "Zarish",
    sellerName: "Zarish",
    listingType: "rent",
    image: SELLER_LISTING_IMAGES["silk-slip"],
    dailyRate: 12500,
    securityDeposit: 85000,
    condition: "Excellent",
    sizes: ["XS", "S", "M"],
    fabric: "Pure silk with a soft satin finish.",
    occasion: "Evening events, parties, formal dinners.",
    categoryPath: "/sellerProfile",
    categoryLabel: "Seller Listing",
    categoryBreadcrumb: "Pre-loved",
  },
  "wool-blazer": {
    id: "wool-blazer",
    title: "Tailored Wool Blazer",
    brand: "Zarish Closet",
    seller: "Zarish",
    listingType: "resale",
    image: SELLER_LISTING_IMAGES["wool-blazer"],
    price: 78000,
    originalRetailPrice: 145000,
    condition: "Like New - Worn twice",
    conditionStatus: "Like New",
    deliveryCharges: 1500,
    categoryPath: "/sellerProfile",
    categoryLabel: "Seller Listing",
    breadcrumbCategory: "Outerwear",
  },
  "walima-gown": {
    id: "walima-gown",
    title: "Mint Pearl Walima Gown",
    brand: "Zarish Closet",
    seller: "Zarish",
    listingType: "resale",
    image: SELLER_LISTING_IMAGES["walima-gown"],
    price: 86000,
    originalRetailPrice: 165000,
    condition: "Excellent - Worn once",
    conditionStatus: "Excellent Condition",
    deliveryCharges: 1500,
    categoryPath: "/sellerProfile",
    categoryLabel: "Seller Listing",
    breadcrumbCategory: "Bridal Wear",
  },
  "cashmere-knit": {
    id: "cashmere-knit",
    title: "Cashmere Oversized Knit",
    brand: "Zarish Closet",
    seller: "Zarish",
    listingType: "resale",
    image: SELLER_LISTING_IMAGES["cashmere-knit"],
    price: 54000,
    originalRetailPrice: 98000,
    condition: "Good - Gently worn",
    conditionStatus: "Good Condition",
    deliveryCharges: 1200,
    categoryPath: "/sellerProfile",
    categoryLabel: "Seller Listing",
    breadcrumbCategory: "Knitwear",
  },
};

export const SELLER_AUCTION_BY_ID = {
  "walima-gown": {
    currentBid: 86000,
    minimumNextBid: 87500,
    bidderCount: 5,
    bidStatus: "Active",
    countdown: { hours: 52, minutes: 4, seconds: 0 },
    bidHistory: [
      {
        initial: "A",
        name: "A****",
        amount: 86000,
        timestamp: "Jun 21, 4:10 PM",
        isWinner: true,
      },
      {
        initial: "S",
        name: "S****",
        amount: 84500,
        timestamp: "Jun 21, 2:35 PM",
      },
      {
        initial: "F",
        name: "F****",
        amount: 82000,
        timestamp: "Jun 21, 11:20 AM",
      },
    ],
    breadcrumbCategory: "Bridal Wear",
  },
};

export const getSellerListingById = (id) =>
  SELLER_LISTINGS.find((listing) => listing.id === id) ?? null;
