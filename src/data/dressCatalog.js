import {
  SELLER_AUCTION_BY_ID,
  SELLER_LISTING_PRODUCTS,
} from "./sellerListingsData";
import {
  LISTING_SIZE_OPTIONS,
  normalizeListingCondition,
  normalizeListingSize,
} from "./listingSpecs";
import {
  getSellerListingOverride,
  getSellerListingIdsForCategory,
  isListingDeleted,
  mapSellerListingToProduct,
} from "./sellerListingStore";
import {
  getPublicListingById,
  getPublicListingIdsForCategory,
} from "./catalogStore";

const parsePrice = (value) => {
  if (typeof value === "number") return value;
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
};

const formatRs = (amount) => `Rs. ${amount.toLocaleString("en-PK")}`;

const DEFAULT_MAIN_IMAGE =
  "https://lh3.googleusercontent.com/aida/AP1WRLvQlyueIjJtPfPD2JarVHAgBg194t6YNdLIuLr0hm8mR27Sui2vUgPnw7PIxKIGwh-H4ZDkiRPDtkGM-SQCy8i2z7PNIZVX8rWVZGnFJnGgZYjQJopzd1TY3FV5nZKcqZTdfc4kyKXlsavUX94dIaZT-jTCoqjSIZrv2h2IBraTwt-5QpH150EkA7MtBzfXTgG49E96vg2JVtrL4vciVn32wFULUmYwBYBra0S97zbKK9yQk3KD7hNVJuk";

const DEFAULT_GALLERY = [
  DEFAULT_MAIN_IMAGE,
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDh-uTueMWDMQ5QeIs0iYINsNGn6mhaVbCKolCNLCmY7xsq1SrUtH5FMQuJRCAb4Vnmd0RhT-89N5bCfSCn6MCgQezyGm4tWYjtxNzgWnU7ffAaDiKAyqN8spEOU1ANmWWyVFggrrYVLG-Ba9_oai--8r1WqPzwyc64FDfmI43M9hXDMP6WSCYtucNY6pMSFEMomjqv1oFAaIsULR6Fd7trPctNCDwozbpV6Gc589DctFKZNh7r-9iw_7xz6iYI1nYAg-A27z7Hd5sJ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNLsQQU70XuYCAZXj0nXTejr471nfs_TMjlsUS1_qJqsUj6dv2aSBE7nu4Gw8ui_o3ydrvgw6bMDA6eqNXk_Llspl0kcFe1Fl0jWmpf5zYTm8q6nPdvyMIglUcU2744_iT7jQMBUGm0KqVLpvsJ0w-0nGSE16KabLdj9japV1HEyn-1FOaTzeUvlzIYS3NWrSpxxcv-25g4cCnNA_DkbxY30HI_YrC0u8_FMN8GIlPYjVUztVc8NCnXavXC_CAmHiSTLwtu1dJLUME",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuEV7fq4RhJgnLGs9CT1htAPoIaa5UVdKFdohBVjtYTbAT3zDaHQB6z4XthfnL9v0uM6e2llzgHpDiIuNpZBRdl2qWG-SbtdbTlw2AlT7z3degcJRa05hi6aWB0CMZOvqvm_sx07VgC6SMi6fnBQNV2V7RDE6dVYaxRXsjlCcC7981zkVAoOyxedITm22I4lu_m6Tqnc_kxKRIy2rCxOAmp4QKMots_H5GaSIpOzVR-W2QVCfPsQmzCua_XlGDaH9wGPY4A0K-OhmU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Li_VYkDtal0eV-xoPYCnoBoQaHx8r51BAVvEjYgZUdR4ah4ZB8VBbdd3IcNSgaozqmR3osN4b72tjvK2TQ2sWCc3bO0ignIL8AzEyL_SzrJ1eECHx01JKjUMBvMXn5iCbSYPKiTXUKbHDBOfpXILos08wDZdr9YkwluWscZYUKqEXBAxGuPDrNDtO11WaVtHHdJqBBEjZilp8WOyILTtPXhQx0H_hMmRqb4NS8gvI7EI7DZLSaxj6w8CKzFzKyy0F6nv5WpVkzA1",
];

const AUCTION_RULES = [
  "No cancellations or withdrawals once a bid is placed.",
  "Highest bid at the end of the countdown wins.",
  "Payment must be finalized within 24h of winning.",
  "Seller approval required for final transaction.",
];

const AUCTION_BY_ID = {
  "male-2": {
    currentBid: 44500,
    minimumNextBid: 46000,
    bidderCount: 6,
    bidStatus: "Active",
    countdown: { hours: 8, minutes: 15, seconds: 42 },
    bidHistory: [
      { initial: "R", name: "R****", amount: 44500, timestamp: "Jun 20, 4:18 PM", isWinner: true },
      { initial: "K", name: "K****", amount: 43000, timestamp: "Jun 20, 3:52 PM" },
      { initial: "H", name: "H****", amount: 41500, timestamp: "Jun 20, 2:30 PM" },
      { initial: "T", name: "T****", amount: 40000, timestamp: "Jun 20, 1:05 PM" },
    ],
    breadcrumbCategory: "Formal Suits",
  },
  "male-4": {
    currentBid: 97800,
    minimumNextBid: 99500,
    bidderCount: 18,
    bidStatus: "Active",
    countdown: { hours: 22, minutes: 6, seconds: 11 },
    bidHistory: [
      { initial: "O", name: "O****", amount: 97800, timestamp: "Jun 21, 11:22 AM", isWinner: true },
      { initial: "F", name: "F****", amount: 96000, timestamp: "Jun 21, 10:48 AM" },
      { initial: "N", name: "N****", amount: 94500, timestamp: "Jun 21, 9:15 AM" },
      { initial: "B", name: "B****", amount: 92000, timestamp: "Jun 21, 8:40 AM" },
    ],
    breadcrumbCategory: "Sherwanis",
  },
  "male-6": {
    currentBid: 112500,
    minimumNextBid: 114000,
    bidderCount: 9,
    bidStatus: "Open",
    countdown: { hours: 5, minutes: 44, seconds: 27 },
    bidHistory: [
      { initial: "Z", name: "Z****", amount: 112500, timestamp: "Jun 21, 6:05 PM", isWinner: true },
      { initial: "I", name: "I****", amount: 110000, timestamp: "Jun 21, 5:20 PM" },
      { initial: "W", name: "W****", amount: 108000, timestamp: "Jun 21, 4:55 PM" },
      { initial: "D", name: "D****", amount: 105500, timestamp: "Jun 21, 3:10 PM" },
    ],
    breadcrumbCategory: "Prince Coats",
  },
  "female-2": {
    currentBid: 43800,
    minimumNextBid: 45000,
    bidderCount: 4,
    bidStatus: "Watching",
    countdown: { hours: 12, minutes: 30, seconds: 0 },
    bidHistory: [
      { initial: "L", name: "L****", amount: 43800, timestamp: "Jun 21, 1:12 PM", isWinner: true },
      { initial: "P", name: "P****", amount: 42500, timestamp: "Jun 21, 12:40 PM" },
      { initial: "E", name: "E****", amount: 41000, timestamp: "Jun 21, 11:05 AM" },
    ],
    breadcrumbCategory: "Abayas",
  },
  "female-4": {
    currentBid: 81200,
    minimumNextBid: 82500,
    bidderCount: 11,
    bidStatus: "Active",
    countdown: { hours: 18, minutes: 9, seconds: 33 },
    bidHistory: [
      { initial: "Z", name: "Z****", amount: 81200, timestamp: "Jun 21, 2:44 PM", isWinner: true },
      { initial: "M", name: "M****", amount: 79500, timestamp: "Jun 21, 2:12 PM" },
      { initial: "S", name: "S****", amount: 78000, timestamp: "Jun 21, 1:55 PM" },
      { initial: "A", name: "A****", amount: 76500, timestamp: "Jun 21, 1:40 PM" },
    ],
    breadcrumbCategory: "Traditional",
  },
  "female-6": {
    currentBid: 67200,
    minimumNextBid: 68500,
    bidderCount: 7,
    bidStatus: "Open",
    countdown: { hours: 3, minutes: 18, seconds: 54 },
    bidHistory: [
      { initial: "Y", name: "Y****", amount: 67200, timestamp: "Jun 21, 7:30 PM", isWinner: true },
      { initial: "C", name: "C****", amount: 66000, timestamp: "Jun 21, 6:45 PM" },
      { initial: "G", name: "G****", amount: 64500, timestamp: "Jun 21, 5:20 PM" },
    ],
    breadcrumbCategory: "Party Wear",
  },
  "kids-2": {
    currentBid: 19200,
    minimumNextBid: 20000,
    bidderCount: 3,
    bidStatus: "Active",
    countdown: { hours: 6, minutes: 2, seconds: 18 },
    bidHistory: [
      { initial: "U", name: "U****", amount: 19200, timestamp: "Jun 20, 5:10 PM", isWinner: true },
      { initial: "V", name: "V****", amount: 18800, timestamp: "Jun 20, 4:35 PM" },
      { initial: "Q", name: "Q****", amount: 18500, timestamp: "Jun 20, 3:50 PM" },
    ],
    breadcrumbCategory: "Kids Formal",
  },
  "kids-4": {
    currentBid: 7200,
    minimumNextBid: 7500,
    bidderCount: 2,
    bidStatus: "Open",
    countdown: { hours: 9, minutes: 41, seconds: 6 },
    bidHistory: [
      { initial: "X", name: "X****", amount: 7200, timestamp: "Jun 21, 10:05 AM", isWinner: true },
      { initial: "J", name: "J****", amount: 6800, timestamp: "Jun 21, 9:22 AM" },
    ],
    breadcrumbCategory: "Kids Traditional",
  },
  "kids-6": {
    currentBid: 23500,
    minimumNextBid: 24000,
    bidderCount: 5,
    bidStatus: "Watching",
    countdown: { hours: 14, minutes: 55, seconds: 19 },
    bidHistory: [
      { initial: "H", name: "H****", amount: 23500, timestamp: "Jun 21, 3:08 PM", isWinner: true },
      { initial: "N", name: "N****", amount: 22800, timestamp: "Jun 21, 2:40 PM" },
      { initial: "K", name: "K****", amount: 22200, timestamp: "Jun 21, 1:15 PM" },
    ],
    breadcrumbCategory: "Kids Party",
  },
  "emerald-heritage-pishwas": {
    currentBid: 192500,
    minimumNextBid: 195000,
    bidderCount: 22,
    bidStatus: "Active",
    countdown: { hours: 14, minutes: 22, seconds: 8 },
    bidHistory: [
      { initial: "J", name: "J****", amount: 192500, timestamp: "Oct 24, 2:44 PM", isWinner: true },
      { initial: "M", name: "M****", amount: 190000, timestamp: "Oct 24, 2:12 PM" },
      { initial: "S", name: "S****", amount: 185000, timestamp: "Oct 24, 1:55 PM" },
      { initial: "A", name: "A****", amount: 182500, timestamp: "Oct 24, 1:40 PM" },
    ],
    breadcrumbCategory: "Bridal Couture",
  },
  ...SELLER_AUCTION_BY_ID,
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
  dress.conditionLabel ??
  resolveDressConditionLabel(dress, dress.listingType);

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
  const price = parsePrice(dress.price);
  const estimatedValue =
    dress.originalRetailPrice ?? dress.estimatedValue ?? Math.round(price * 2.27);
  const auction = AUCTION_BY_ID[dress.id] ?? {};
  const currentBid = auction.currentBid ?? dress.currentBid ?? price;
  const minimumNextBid = auction.minimumNextBid ?? dress.minimumNextBid ?? currentBid + 2500;
  const gallery =
    dress.gallery ?? (dress.image ? [dress.image, ...DEFAULT_GALLERY.slice(1)] : DEFAULT_GALLERY);
  const bidHistory = (auction.bidHistory ?? dress.bidHistory ?? []).map((bid) => ({
    ...bid,
    amountFormatted: formatRs(bid.amount),
  }));
  const bidderCount = auction.bidderCount ?? dress.bidderCount ?? bidHistory.length;

  return {
    ...dress,
    listingType: "resale",
    gallery,
    mainImage: gallery[0],
    rating: dress.rating ?? 5.0,
    estimatedValue,
    estimatedValueFormatted: formatRs(estimatedValue),
    currentBid,
    minimumNextBid,
    bidderCount,
    bidStatus: auction.bidStatus ?? dress.bidStatus ?? "Open",
    yourHighestBid: dress.yourHighestBid ?? null,
    bidHistory,
    auctionRules: dress.auctionRules ?? AUCTION_RULES,
    breadcrumbCategory:
      auction.breadcrumbCategory ?? dress.breadcrumbCategory ?? dress.categoryLabel ?? "Pre-owned",
    categoryBreadcrumb: dress.categoryBreadcrumb ?? getCategoryBreadcrumb(dress.categoryLabel),
    countdown: auction.countdown ?? dress.countdown ?? { hours: 12, minutes: 0, seconds: 0 },
    currentBidFormatted: formatRs(currentBid),
    minimumNextBidFormatted: formatRs(minimumNextBid),
    priceFormatted: formatRs(price),
    ...applyListingSpecs(dress),
  };
};

const RENT_PRODUCTS = {
  "male-1": {
    id: "male-1",
    title: "Midnight Velvet Sherwani",
    brand: "Deepak Perwani",
    listingType: "rent",
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "male-3": {
    id: "male-3",
    title: "Ivory Silk Waistcoat",
    brand: "Nomi Ansari",
    listingType: "rent",
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "male-5": {
    id: "male-5",
    title: "Satin Lapel Midnight Tuxedo",
    brand: "Mohtaram",
    listingType: "rent",
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "female-1": {
    id: "female-1",
    title: "Royal Emerald Bridal Lehenga",
    brand: "Elan Luxury",
    listingType: "rent",
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "female-3": {
    id: "female-3",
    title: "Blossom Organza Gown",
    brand: "Faraz Manan",
    listingType: "rent",
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "female-5": {
    id: "female-5",
    title: "Champagne Silk Ensemble",
    brand: "Misha Lakhani",
    listingType: "rent",
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "kids-1": {
    id: "kids-1",
    title: "Emerald Velvet Lehenga",
    brand: "J. Kids Collection",
    listingType: "rent",
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
  "kids-3": {
    id: "kids-3",
    title: "Powder Pink Gharara",
    brand: "Agha Noor Kids",
    listingType: "rent",
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
  "kids-5": {
    id: "kids-5",
    title: "Royal Prince Coat",
    brand: "Hsy Kids",
    listingType: "rent",
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
};

const RENTAL_GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTA2PpUpjUnS49c_o0CZPuhcUBtfUw8rTWLyO1ZhHocETeXL2wGDHp9JQDncr_QzADadBH2HYp5_gltkuvBwPfxmD76rJst6d-FmTsA0yiRGUGrDGk2xQxc_wC6hzK_9CBJAov1LxKfiSE8A9vKYDDKoix4-HU4DEePiMbtIxJYCvhlnODZ6pDpoATajB5cywvEqKGooqovtyCb0DpSw8Ps_bUuPVz_WDj6DWJZDMHrEnj3TLPvthxwaHZeA0Jyde-AdR4PVbMz9TA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3hVoM7kDGc3NEuXMFrra8T2FPLNUQx5oeRPxw0P2mOWsKEFYegBmJmuD8zeZ-FCPROckE_A3bsc702UtC9flsY8QyUzemXTJlamFeN5-6wXGx5AMajUHM-IzSQuSrxefqTfgBgunJz9vXwp7TdWXZldj3IEeNbpoElZukuPxHcXgJqYCAFesC_JprO4b6MFjjN9bDSFQOJQp-GoM6Lw6N3xytK-ovuGsULSyjf9BI9IGxjhUyf0zddGtzWbDdguA-5n_zFae1iuu3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCndUWALMagBLVlzTPGjlXdB1uwMhfjGJTjIXtAzm6ve5Yn00BDGxdo73fDebg7DXZiJ9dSalYYfphgAJldlsAXGjnEhKbFyHZAV7ZuAnVSw3r0c7EYcoSDLOU4I3ZkvRv3fXdwirCcQ22ttTDC67Y5g96mcSW-_yTGNvdebmFr2Hu7P2i7CRbFLEPVk3XtP2gFdTrLNnoEjRYUjMDC2BdLQ2rJymATh5_Gzg6xDqVBjWsRkYe4ZDd9HwV01WPjLV9bzg7fDnZ8Zc3R",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBuV2GcqnZ4blXEFIfiDexKVElxfsS_C46HpiEiXToXpGtP_GAOMU5qDdeKzAmq57mkEr8o5-MiEg_hCErFal4o9yqPqEPvGC2y5hgnGuu32u1LAKGUo00KgI-64CIZYeFv5rbevSjycOPf62U_ZUU8IRZOAm-KA_Y7Yf_t8Qs8aqQxN9zcgbTLUH18cW0466JD-ag_HZwmFeYVFOhcNabKR9E7ywm_IOFEqWXVku-nZPBPJt7mpQjFWEVhyCYxZX5VKfkRyY4AQO91",
];

const RENT_CARD_DATA = {
  "male-1": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBm9Dz5PJZZdS9RkLNJkkpAdAC8YptD1AtAK2ClUVixihYYs_BjsHxT-VzgKKt-TzDF8jzC0X6SuUpC_bQjaJFiNdlBcv7vayPOW4snRGYg8DCY4kyFSakBn6uvd84zP2KcFNTycDIvv063KAIzLY6IZbhbiH6AAK4IquoYgvppg_k8NeNhvuoGBrIwdJfKRcdlt0zAO5W9Bse0yof9I20mQecQuJVZaPP4TMgY4-ZgmmNySNRqtI6TAauth1NdwdXUg-BdPHwQdfiP",
    dailyRate: 7000,
    securityDeposit: 37500,
  },
  "male-3": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF5WgXJ9JhDVSA3zNBCOdn9lNZDOG9s5polxhKNCuMs0TtnjT7qIa9dUIxQSGfOMvfPWXGTU6v155SxyOBgGwDVPLlcQuXBDOxDoi0-b7efi15ogsJ4lfdts5QxJdcUkMDhA4OD7Vr03LOfrKttnBZ7bI4uoNlkemmXY5tEvs2yQ6lRkXxOq4sF8OM5t5CLmwblcC6D5HlHADplK0X5i5cyjowKaJ3ZcZv85G01J0_Ab7uXnlCGT-Kp6WjPOi5l4mg25ryB3CP1Msq",
    dailyRate: 5000,
    securityDeposit: 16500,
  },
  "male-5": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjYn_WmKVW8k7h_gK1CVNnRrkwuDb_3yJxE7Oly1EQHTrrLexAc9QYitj6GOJ4CsTVPBZr4HivaPqAIv0NefQF6UVpVoLRa9AEYp4eop-m-CMFvG4U4G0-yxXTk68j1tJHqnez-14FMUcQuO6jVMxzVq1yKW8E-K2Mhc1UElyBeKAaJCF-It5fEfpOmB3uJ6GNgZefZlOKF7ZDqnU0J-eBwURgk2yoaXh777zyJaLx2mBDe-VzRG-5_r_quOrQR_r2qlMkIc-n6mjF",
    dailyRate: 8000,
    securityDeposit: 31500,
  },
  "female-1": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVh_ymJd-uGzRCLTDxmtnYgowXIFZWtD28_5edk15Gpg4mQoddsgPTHf1fk-2u_oFQqQ1gtj6xhbmpVSrzC15BhQvKsq2R_ChKwevbAcUNJCacjJU7E5xmD-C7v1NtcAl_lMXTCAD90dTQPcyujG6o3_m1PzYNME80G-fqj8c3D8p36AlEsVOrjOCC2h89kbWv2mRoid7mF-nJhsBYd8cfuPHT_Xkux1UE1DuFtMJDS_-OpnABEIPG9hYNpBhqfR3s4zHZlrK1cUlB",
    dailyRate: 8000,
    securityDeposit: 75000,
  },
  "female-3": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSA-FJBW7OromnSWzZSaHuJAV_MxdaCIyzJjOHs7AgM4b_wO0uMO8sbTQPIHShD0bLtq47KqVXpUvrhEnxdaT5WAy3oql7kxmp--lvNe8-iOqVk9jiltunEjG51lwYO7nH6v-8acmcHh9udaov2s1KkOlHZdCdFf_WxvUt7cQV0HuCXd27mhz0aXeoKFeHNwUMxywEgZa1B_HdP4hFIxf5jL5hIFythWSOarf44Iwswbd66Blj5h0LDYjJ7Xr6FZ7yMucslpNcpam2",
    dailyRate: 7000,
    securityDeposit: 54000,
  },
  "female-5": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXt2_iQb3X05D6P02Pvy4ESkJJj9OVHETS3gSRosW5k6Nqu6s6cn3J4da9t-xu7KIIhDvoP3-S-wKVzt8Poims4tKB-Q_t7DQ4FxaNn_eCYL7tg23fRgK_znqK7OurgsU5WGEr6kMnZxxWOeniJjEvAAK_ppJvD9pdeX8Ed1pVoaOd9MxvhOtRuxAQ4tJ40Kj-7pbc1ZWZg0v8zHZBfqVt5nwNLAGrx0DJG-O6-PNXE7G4u-YwTUEv7ptGqfNSPIf2Sw55UrqFbuGr",
    dailyRate: 5000,
    securityDeposit: 36000,
  },
  "kids-1": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPAWrywHthD2bIuMRXjlirsHrAedKSqWI-mzFaO807fPcAcaY7KgVeI6CRbp8kjMxunVoWIu4hESh79OzHJwhvKllhtXd2ekZsfrnUKnUfwfdUYL-o8vM8VGHUm31aPIu0DF7guEAxU645MVyvbTCX1ReVpws7FRo-ztloti1iq9jmifrTUNu7RldvMf5DyBJKbT7MZ7th-Aw8ren-UiyEaf0whTZ6LqKcCKJm6W_2husgdLt9i28idwuttpPMAYjxbVm67_xgYuWI",
    dailyRate: 5000,
    securityDeposit: 7500,
  },
  "kids-3": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTaodaeaveS1nq7pWfSfEZ9AOVpHOwFZ990Kgtsfu7Z-NqiwCJjW8z9uzoqS5EI4eFhPK9aqPMBx1QyM2Y6XwJvad7zH55RJuRD1-t7eipFiFJywpf6JJ_VVznR__rnK3YZ0kGVrOXCUpL24fNj5WUzu31DS6op79GhmR8-mfLoruak2JH8XpnesDutq8NQzzLS92By02t1Od3DRbmZqZjUYq1jT9TethW8uswCxLYdSLb_ZUtOJgSxYlEw6yVsleyn5YH5sX0OmI_",
    dailyRate: 5000,
    securityDeposit: 5400,
  },
  "kids-5": {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGHGBDkETCLdgHiyzRFRDE7FeVjj6peT5rKszrK5whuWLU4ftEgyP0NUS2bGBWPP8iH5NzfGP--3KGjTlj6vV2UkJBf4XyDTwJFHluvUzNErMtxG_WxaiuZG9UC_585aqTfAko5B7IGLfKA-p4HrLPLfPjK-dI0uSzZXQOH2vLEEZEyesA47JRkWrT6bJ2-BMxptXi2BYNExScnHsi7s4ddFlIjyg89SNSz52w3gL9IpQfLnWKgiI1-TfhSRwAff7zuiLLVk2z-Kbr",
    dailyRate: 7000,
    securityDeposit: 13500,
  },
};

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

const enrichRentalDress = (dress) => {
  const card = RENT_CARD_DATA[dress.id] ?? {};
  const dailyRate = card.dailyRate ?? dress.dailyRate ?? 5000;
  const securityDeposit =
    card.securityDeposit ?? dress.securityDeposit ?? dress.fullDressPrice ?? 45000;
  const mainImage = card.image ?? dress.image ?? RENTAL_GALLERY[0];
  const gallery = dress.gallery ?? [mainImage, ...RENTAL_GALLERY.slice(1, 4)];
  const categoryBreadcrumb = dress.categoryBreadcrumb ?? getCategoryBreadcrumb(dress.categoryLabel);

  return {
    ...dress,
    listingType: "rent",
    gallery,
    mainImage: gallery[0],
    dailyRate,
    dailyRateFormatted: formatRs(dailyRate),
    securityDeposit,
    securityDepositFormatted: formatRs(securityDeposit),
    fullDressPrice: securityDeposit,
    fullDressPriceFormatted: formatRs(securityDeposit),
    fabric:
      dress.fabric ?? "Pure Organza Silk with Zardozi and Tilla embroidery.",
    occasion: dress.occasion ?? "Wedding, Reception, Bridal Shower.",
    careInstructions:
      dress.careInstructions ?? "Professional dry clean only. Steam iron from reverse side.",
    sellerName: dress.sellerName ?? `${dress.brand} Atelier`,
    sellerAvatar:
      dress.sellerAvatar ??
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-7XpVzJ-nkd6xoJGUxJEd8wafm9GWWk74OY-MFdkUeDz-LMZsbTYH_cyfM8YyDlX4kNh6zke05mYCJbGsCqB3GMHHKmDFYA1i3WaMp9kUAd4ONN4o9VXVmcLzPn0XdPc6cETeyI5E9KHnf02yF-dwpf_z5zfm9WqTBgAqSqocCj_T37El2N1Exvcmw5zaEo8gZzIat5srvI0rDKrdEVi7wCMogBBoJce_EJZtjmLS3956lqIDpBjiK0A-rPLqI9psUBAUMXee0Al8",
    sellerRating: dress.sellerRating ?? 4.9,
    sellerReviews: dress.sellerReviews ?? 124,
    sellerMemberSince: dress.sellerMemberSince ?? "2022",
    categoryBreadcrumb,
    rentalPolicy: dress.rentalPolicy ?? RENTAL_POLICY,
    sizeGuide: dress.sizeGuide ?? {
      chest: "34 inches",
      waist: "28 inches",
      length: "58 inches",
      shoulder: "14.5 inches",
    },
    ...applyListingSpecs(dress),
  };
};

const BASE_PRODUCTS = {
  "male-2": {
    id: "male-2",
    title: "Charcoal Italian Wool Suit",
    brand: "Republic by Omar Farooq",
    seller: "Ahmed Raza",
    condition: "Excellent - Professionally dry cleaned",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB82Zbg2Ch_SZ5m2n60FQX76_RhFiEEfyOXKH1S-1I2wCQus6u5Ix7KK_zD8XIfTpNPG0MsLWZ5KXKj9aiLdTE-qW-4owhklrrp9fgQVoC7YEHZLmn1N0d_7Ht8XTU5z7Xl9w3JpHiVgrG-2kz62QsERr8ccY54WAmqzgoJgDNFLUVgv1P30IWPT_zKulyCOTrTouU7M7Nt5usiLbFmEEkNLiw_UTsGCsAYoTp1nzQECpi4pjqTRdyH8_zA3nFXP_ON572uc_rBSd_N",
    listingType: "resale",
    price: 42000,
    originalRetailPrice: 95000,
    deliveryCharges: 1500,
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "male-4": {
    id: "male-4",
    title: "Royal Jamawar Sherwani",
    brand: "Hassan Sheheryar Yasin (HSY)",
    seller: "Omar Siddiqui",
    condition: "Excellent - Worn once",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBb3_ALdFPd5HGLtVL-cIEcGqcxxDGt0kuf-X5pfJOsd1xZRtPgWYF0yXRjqm38kGVj3MzV7l4caXI7wcEaVJrMCMEXF_v_dUFXQmJs8feQ2-_VsAr5xAw8rK3AUpa0j-Q_f7_3BjHfx2_NK77LRc50wzRDXl0mcJXfrNDAYnyciydbA9V-nF8yS_7O1qBLVl2wE7Dazwzc6bE4fDVBsT4D-eS7NfYsNkxzFV8rrWwJ7v4O6Ab3TqsGPqVEQndFBV2us5DujAXzA7f-",
    listingType: "resale",
    price: 95000,
    originalRetailPrice: 185000,
    deliveryCharges: 2000,
    auctionWon: true,
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "male-6": {
    id: "male-6",
    title: "Black Raw Silk Prince Coat",
    brand: "Faraz Manan",
    seller: "Hassan Ali",
    condition: "Excellent - Like new",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQaRXEDQg_VAfzy3K_0l080hT8vxQ-mKgynO3cELXGCiekZJ0ZVxIpvLmwFNwgNQs7oVyKYQ9omNljZkn1uzk7HS9ckvwafEW9ybPYyMzdWf-FI6jVDDJz1wsNwa2Y8Ar3mQw_ncDF6fMtemMk84IxDXoh_vAdp-kYBkpQhtHQ5jzjXoO0891SxUR2xDqY1RgQ1FmhCUxBwVXqgHcn2XU0pxdarKMCM4AAId2Duasu6bHSiLlAJlRVjfYgW55fcie64yT59JuKzz1x",
    listingType: "resale",
    price: 110000,
    originalRetailPrice: 220000,
    deliveryCharges: 2000,
    categoryPath: "/maleFashion",
    categoryLabel: "Male Fashion",
  },
  "female-2": {
    id: "female-2",
    title: "Ethereal Lace Abaya",
    brand: "Zaha Couture",
    seller: "Sana Tariq",
    condition: "Like New - Worn once",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9l5_S5Kw0tPO7ImG2ZCifAkI0JT8r4EKvjL-K7_quuPiR7HLBim3qJpa59SC8Agt_xkwZ6MgmPm2CBqqEgNY4Vij6YK01lGM8s5QuBsR607KgqyTRTeOzZkjGR8219b6etQp_PY3vwv_LPXWOM3Pi_RcUQTByHjkloMkMKxtSgoNFWAbwqPwm961bsAkT61WJ4DL8jY6hBCMo4USGAe8gXnv0Rt-oaW9NHtuH8B7BSKvYAJYilEShAp9g2hiyDNzhUfUyf9QZMmFF",
    listingType: "resale",
    price: 42000,
    originalRetailPrice: 78000,
    deliveryCharges: 1500,
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "female-4": {
    id: "female-4",
    title: "Velvet Heritage Kalidar",
    brand: "Mohsin Naveed Ranjha",
    seller: "Zainab Malik",
    condition: "Like New - Worn 2 times",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhNdmYNvWHyRjwu1661dhd_ETKzt6rlAE2bcQ7ksK6Fw8t6lbIHIaKD2HqjeWEJ-A6TTpxGVX_nwtpT8eHDwejRE7C7PHD7O2W9UtRjCqJzqmbXxPSfZvInUQfruDnZdYzZEUiep3cg6bl7LHnc-EoGtgZD1vPCIf6SFoMJbbbym55Br4mLsUWKVtEUzpQaofausGFpvcIg5V3GCEEtDCBFAk1YgwlBHyJT832Euo-Wiy-62tYPNZfQP6tRECVSDMtsxU1QBanClpV",
    listingType: "resale",
    price: 78000,
    originalRetailPrice: 145000,
    deliveryCharges: 1500,
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "female-6": {
    id: "female-6",
    title: "Midnight Sequin Sari",
    brand: "Sania Maskatiya",
    seller: "Ayesha Khan",
    condition: "Like New - Gently worn",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoBmnjhPkmcaBgjtBRhlPyinWu7MHuLIVAcbP-HuaNF5WYwITDkY9mkGhV46Del984wBsu1FW4OBWjXvarO5YxkX_FfgiDIolFOuW7YnWTtQChMbygTiZ84y_S8AXlWwk09OvIU3p3_nQIYLMhn5Td_ZxqAssJUJi4T_XpsTfpT_YdpKqB_2I1ibcos8s9AbdWjw4iW5kKs-pSFF-F3FoCXFERABgzrD1pqwtbLPPcHQHy3_1vfXg2Bxje4wEQnTUI7rRh-sByb8_c",
    listingType: "resale",
    price: 65000,
    originalRetailPrice: 120000,
    deliveryCharges: 1500,
    categoryPath: "/femaleFashion",
    categoryLabel: "Female Fashion",
  },
  "kids-2": {
    id: "kids-2",
    title: "Mint Silk Sherwani",
    brand: "Maria B. Mini",
    seller: "Fatima Noor",
    condition: "Brand New - Never worn",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAz4exkEofpmXi50Vw6wY7bgfHZtOM5Dr4DuRutbc9SLWfqtAYaY7YCN7UtI9gbG-Ey2f7FAUSE3BMnvZK5SsDcnq_N4x1Da3oGwz8KjKED4zDr6dc7OwIK7yKpt7QFCdQvA26977PjBe_HM8-22bbqq7kNdfA8tLdV_hntoHw1B0KDvVLeupCs87zb-yDq48EqzUtrszsejNOQl0ZwwdzZxwfyqtKosFsyB20D69zbH-XSY9AhSNH3LArmDCdrmsxOA-kW_YnXBC3g",
    listingType: "resale",
    price: 18500,
    originalRetailPrice: 32000,
    deliveryCharges: 1200,
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
  "kids-4": {
    id: "kids-4",
    title: "Mirror-Work Kurta",
    brand: "Sana Safinaz Kids",
    seller: "Maryam Shah",
    condition: "Like New - Worn once",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByB2PgwX9GpWg2xk3YWxDpV6evW2fzOeV0cyc_-s8PxYK2VyxOYzWPNNxHVQDgPkhKRjads6J-0qk9iql0xRdereQOmlmxsI1NrZPqSp3-kP1wEXqg3S7f3K723kHk6Kt3ZjflKecKtHQ7reE8fJzzvcmne7AtI5idwkMTEKsoxy_QEBap5jhgcc41IIq3d5AS-om88voSa-dRphgnxoqGfHOGqvFciV2ySUgRG3alwCiTy5yOuj0Kb-6xIsp_4ofTlQ0dQ2-PRqJa",
    listingType: "resale",
    price: 6800,
    originalRetailPrice: 14000,
    deliveryCharges: 1000,
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
  "kids-6": {
    id: "kids-6",
    title: "Organza Dream Frock",
    brand: "Zainab Chottani Mini",
    seller: "Hina Aslam",
    condition: "Like New - Gently used",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDoZLfvpC2xIpJRpKksp_kudjGPhMGZu267CKS_CKPZQzOaAiLO1qygDIDINywMxm-ad95VVpzgCrDhDJRZ8XPjWcCyPK4K9vw8XesTonzn0C67TE8Ga6BwiGsn1QvzFaLfRgO2Or5wCEyzcH186tIEirb7RZ4vA1lBOogddJlhGIAAxFpaU5e1L_OG2rsYZDVPiSU62lxTHhdkA7MO16vwnTkoiQW-IVNhBqlu8MsVeUU_kw0ytnnbbnbtzSK3J4AVZGjWUdVPCL",
    listingType: "resale",
    price: 22000,
    originalRetailPrice: 45000,
    deliveryCharges: 1200,
    categoryPath: "/kidsFashion",
    categoryLabel: "Kids Fashion",
  },
};

const ALL_PRODUCTS = { ...RENT_PRODUCTS, ...BASE_PRODUCTS, ...SELLER_LISTING_PRODUCTS };

const REFERENCE_DRESS = {
  id: "emerald-heritage-pishwas",
  title: "Zari Embroidered Ivory Nikkah Ensemble",
  brand: "House of Kamiar",
  seller: "Amina Sheikh",
  image: DEFAULT_MAIN_IMAGE,
  gallery: DEFAULT_GALLERY,
  listingType: "resale",
  price: 185000,
  estimatedValue: 420000,
  categoryPath: "/femaleFashion",
  categoryLabel: "Female Fashion",
};

const PRODUCT_STYLES = {
  "female-1": "Bridal",
  "female-2": "Bridal",
  "female-3": "Party",
  "female-4": "Traditional",
  "female-5": "Formal",
  "female-6": "Party",
  "male-1": "Groom",
  "male-2": "Formal",
  "male-3": "Party",
  "male-4": "Traditional",
  "male-5": "Formal",
  "male-6": "Party",
  "kids-1": "Traditional",
  "kids-2": "Traditional",
  "kids-3": "Party",
  "kids-4": "Traditional",
  "kids-5": "Formal",
  "kids-6": "Party",
  "silk-slip": "Party",
  "wool-blazer": "Formal",
  "walima-gown": "Bridal",
  "cashmere-knit": "Formal",
};

const PRODUCT_MULTI_STYLES = {
  "male-3": ["Party", "Traditional"],
};

const getProductPriceValue = (dress) => {
  if (dress.listingType === "rent") {
    return dress.dailyRate ?? parsePrice(dress.rentPrice) ?? 0;
  }
  return parsePrice(dress.price ?? dress.currentBid);
};

const productMatchesStyle = (product, style) => {
  if (!style) return true;
  const styles =
    product.styles?.length > 0
      ? product.styles
      : product.style
        ? [product.style]
        : [];
  return styles.includes(style);
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
        new Date(b.updatedAt ?? 0).getTime() -
        new Date(a.updatedAt ?? 0).getTime(),
    );
  }
  return products;
};

export const filterProductCards = (products, filters = {}) => {
  const { listingType, style, size, priceMax, search, sortBy } = filters;
  const query = search?.trim().toLowerCase() ?? "";

  const filtered = products.filter((product) => {
    if (
      listingType &&
      listingType !== "all" &&
      product.listingType !== listingType
    ) {
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

const deriveBadge = (dress) => {
  if (dress.listingType === "rent") {
    return { badge: "Pristine", badgeVariant: "primary" };
  }

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

export const isMongoListingId = (id) => /^[a-f0-9]{24}$/i.test(String(id ?? ""));

export const mapApiListingToDress = (listing) => {
  const id = String(listing.id);
  const isRent = listing.listingType === "rent";
  const dress = {
    id,
    sellerId: listing.sellerId ? String(listing.sellerId) : undefined,
    title: listing.title,
    brand: listing.brand || "Relux Seller",
    seller: listing.seller ?? listing.sellerName ?? "Relux Seller",
    sellerName: listing.sellerName ?? listing.seller ?? "Relux Seller",
    sellerId: listing.sellerId ? String(listing.sellerId) : null,
    description: listing.description,
    fabric: listing.description,
    mainImage: listing.mainImage,
    image: listing.mainImage,
    gallery: listing.gallery?.length ? listing.gallery : [listing.mainImage],
    listingSize: listing.listingSize || "M",
    listingCondition: listing.listingCondition || "Like New",
    style: listing.style,
    clothingType: listing.clothingType,
    categoryPath: listing.categoryPath,
    categoryLabel: listing.clothingType || listing.mainCategory,
    updatedAt: listing.updatedAt,
    ...(isRent
      ? {
          listingType: "rent",
          dailyRate: parsePrice(listing.rentPrice),
          securityDeposit: parsePrice(listing.itemPrice),
          fullDressPrice: parsePrice(listing.itemPrice),
        }
      : {
          listingType: "resale",
          price: parsePrice(listing.salePrice),
          currentBid: parsePrice(listing.startingBid || listing.salePrice),
          minimumNextBid: parsePrice(
            listing.minBid || listing.startingBid || listing.salePrice,
          ),
        }),
  };

  return isRent ? enrichRentalDress(dress) : enrichResaleDress(dress);
};

export const getDressById = (id) => {
  const apiListing = getPublicListingById(id);
  if (apiListing) {
    return mapApiListingToDress(apiListing);
  }

  const stored = getSellerListingOverride(id);
  const catalogDress = ALL_PRODUCTS[id];
  const dress = stored
    ? { ...(catalogDress ?? {}), ...mapSellerListingToProduct(stored), id }
    : (catalogDress ?? REFERENCE_DRESS);

  if (dress.listingType === "rent") {
    return enrichRentalDress(dress);
  }

  return enrichResaleDress(dress);
};

export const toProductCardView = (dress) => {
  const enriched = getDressById(dress.id);
  return toProductCardViewFromDress(enriched);
};

export const toProductCardViewFromDress = (dress) => {
  const enriched =
    dress.listingType === "rent"
      ? enrichRentalDress(dress)
      : enrichResaleDress(dress);
  const { badge, badgeVariant } = deriveBadge(enriched);
  const style = enriched.style ?? PRODUCT_STYLES[enriched.id];
  const styles =
    enriched.styles ??
    PRODUCT_MULTI_STYLES[enriched.id] ??
    (style ? [style] : enriched.style ? [enriched.style] : []);
  const priceValue = getProductPriceValue(enriched);

  return {
    id: enriched.id,
    brand: enriched.brand,
    title: enriched.title,
    style,
    styles,
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

const CATEGORY_PATH_BY_MAIN = {
  Female: "/femaleFashion",
  Male: "/maleFashion",
  Kids: "/kidsFashion",
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

const getDressIdsForCategory = (categoryPath) => {
  const catalogIds = Object.values(ALL_PRODUCTS)
    .filter((product) => product.categoryPath === categoryPath)
    .map((product) => product.id);
  const sellerIds = getSellerListingIdsForCategory(categoryPath);
  const apiIds = getPublicListingIdsForCategory(categoryPath);
  return [...new Set([...catalogIds, ...sellerIds, ...apiIds])].filter(
    (id) => !isListingDeleted(id),
  );
};

export const getDressesByCategory = (categoryPath, filters = {}) => {
  const products = getDressIdsForCategory(categoryPath)
    .map((id) => getDressById(id))
    .map(toProductCardView);

  return filterProductCards(products, filters);
};

export const hydrateBuyerOrder = (order) => {
  const dress = getDressById(order.dressId);
  const rentalTotal =
    order.rentalDays && dress.dailyRate
      ? dress.dailyRate * order.rentalDays
      : null;

  return {
    ...order,
    title: dress.title,
    brand: dress.brand,
    image: dress.mainImage ?? dress.image,
    listingType: dress.listingType,
    amount:
      order.type === "rental"
        ? formatRs(rentalTotal ?? dress.securityDeposit ?? dress.dailyRate * 3)
        : dress.priceFormatted,
    variant: order.variant ?? `Size: ${order.size ?? "M"} • ${dress.brand}`,
  };
};

export const hydrateBuyerBid = (bid) => {
  const dress = getDressById(bid.dressId);

  return {
    ...bid,
    title: dress.title,
    seller: dress.seller ?? dress.sellerName ?? dress.brand,
    image: dress.mainImage ?? dress.image,
    originalPrice: dress.estimatedValueFormatted ?? dress.priceFormatted,
    currentHighest: dress.currentBidFormatted ?? dress.priceFormatted,
    myBid: formatRs(bid.myBidAmount),
    bidDelta:
      bid.myBidAmount < (dress.currentBid ?? 0)
        ? `-${Math.round(((dress.currentBid ?? 0) - bid.myBidAmount) / 1000)}k`
        : null,
  };
};

export const hydrateSellerOrder = (order) => {
  const dress = getDressById(order.dressId);

  return {
    ...order,
    itemTitle: dress.title,
    itemImage: dress.mainImage ?? dress.image,
    brand: dress.brand,
  };
};

export const hydrateSellerListing = (meta) => {
  const dress = getDressById(meta.dressId);
  const isAuction = meta.type === "Auction";

  return {
    id: meta.dressId,
    title: dress.title,
    brand: dress.brand,
    type: meta.type,
    typeVariant: meta.typeVariant,
    size: meta.size ?? `Size ${dress.listingSize ?? "M"}`,
    price:
      dress.listingType === "rent"
        ? `${dress.dailyRateFormatted} / day`
        : isAuction
          ? `Current: ${dress.currentBidFormatted}`
          : dress.priceFormatted,
    detail: dress.listingCondition ?? getDressConditionLabel(dress),
    status: meta.status,
    statusVariant: meta.statusVariant,
    image: dress.mainImage ?? dress.image,
    listingType: dress.listingType,
  };
};

export const hydratePublishedSellerListing = (listing) => {
  const dress = getDressById(listing.id);
  const isRent = listing.listingType === "rent";
  const isAuction = Boolean(listing.startingBid && listing.listingType === "sale");

  return {
    id: listing.id,
    title: dress.title,
    brand: dress.brand,
    type: isRent ? "Rent" : isAuction ? "Auction" : "Sale",
    typeVariant: isRent ? "rent" : isAuction ? "auction" : "sale",
    size: `Size ${dress.listingSize ?? listing.listingSize ?? "M"}`,
    price: isRent
      ? `${dress.dailyRateFormatted} / day`
      : dress.priceFormatted ?? formatRs(parsePrice(listing.salePrice)),
    detail: getDressConditionLabel(dress),
    status: "Active",
    statusVariant: "active",
    image: dress.mainImage ?? dress.image,
    listingType: dress.listingType,
    isPublished: true,
  };
};

export { formatRs as formatPkr };
