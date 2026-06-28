const STORAGE_KEY = "relux-seller-reviews";
const REPORTS_STORAGE_KEY = "relux-seller-reports";

const SEED_REVIEWS = [
  {
    id: "seed-1",
    rating: 5,
    quote:
      "The dress arrived in pristine condition and fit beautifully for my sister's nikkah. The rental process was seamless from booking to return.",
    author: "Sara M., Lahore",
  },
  {
    id: "seed-2",
    rating: 5,
    quote:
      "Absolutely stunning craftsmanship. The security deposit was refunded promptly after inspection. Will definitely rent again for the next event.",
    author: "Hina A., Karachi",
  },
];

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveAll(reviewsBySeller) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsBySeller));
}

export function getSellerKey(dress) {
  return dress.sellerName ?? dress.seller ?? dress.brand ?? "unknown-seller";
}

export function getSellerReviews(sellerKey) {
  const userReviews = loadAll()[sellerKey] ?? [];
  return [...userReviews, ...SEED_REVIEWS];
}

export function addSellerReview(sellerKey, { rating, quote, author }) {
  const all = loadAll();
  const review = {
    id: `review-${Date.now()}`,
    rating,
    quote,
    author,
    createdAt: new Date().toISOString(),
  };
  all[sellerKey] = [review, ...(all[sellerKey] ?? [])];
  saveAll(all);
  return review;
}

function loadReports() {
  try {
    return JSON.parse(localStorage.getItem(REPORTS_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export function addSellerReport({
  sellerKey,
  dressId,
  reason,
  details,
  author,
}) {
  const report = {
    id: `report-${Date.now()}`,
    sellerKey,
    dressId,
    reason,
    details,
    author,
    createdAt: new Date().toISOString(),
  };
  saveReports([report, ...loadReports()]);
  return report;
}

export function getSellerRatingStats(reviews) {
  if (!reviews.length) {
    return { average: 0, count: 0 };
  }
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: total / reviews.length,
    count: reviews.length,
  };
}
