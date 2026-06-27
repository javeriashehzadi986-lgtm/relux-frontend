export const LISTING_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];

export const LISTING_CONDITION_OPTIONS = ["Like New", "Good", "Fair"];

export const normalizeListingSize = (value) => {
  if (!value) return "M";
  const normalized = String(value).replace(/^Size\s*/i, "").trim().toUpperCase();
  if (LISTING_SIZE_OPTIONS.includes(normalized)) return normalized;
  return "M";
};

export const normalizeListingCondition = (value) => {
  if (!value) return "Like New";
  const text = String(value).toLowerCase();
  if (text.includes("like new")) return "Like New";
  if (text.includes("good")) return "Good";
  if (text.includes("fair")) return "Fair";
  return "Like New";
};
