import api from "@/services/api";

const CATEGORY_SLUG = {
  "/femaleFashion": "female",
  "/maleFashion": "male",
  "/kidsFashion": "kids",
};

let listingsById = {};
let listingIdsByCategory = {
  "/femaleFashion": [],
  "/maleFashion": [],
  "/kidsFashion": [],
};
let revision = 0;
let loadingPromise = null;

function applyListings(listings) {
  listingsById = {};
  listingIdsByCategory = {
    "/femaleFashion": [],
    "/maleFashion": [],
    "/kidsFashion": [],
  };

  for (const listing of listings) {
    listingsById[listing.id] = listing;
    if (listing.categoryPath && listingIdsByCategory[listing.categoryPath]) {
      listingIdsByCategory[listing.categoryPath].push(listing.id);
    }
  }

  revision += 1;
  window.dispatchEvent(new Event("relux-catalog-updated"));
}

export async function refreshPublicCatalog() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = api
    .getPublicListings()
    .then((data) => {
      applyListings(data.listings ?? []);
    })
    .catch(() => {
      // Keep existing catalog on transient errors.
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

export function getPublicListingIdsForCategory(categoryPath) {
  return listingIdsByCategory[categoryPath] ?? [];
}

export function getPublicListingById(id) {
  return listingsById[id] ?? null;
}

export function getCatalogRevision() {
  return revision;
}

export function subscribeCatalogRevision(onStoreChange) {
  const handler = () => onStoreChange();
  window.addEventListener("relux-catalog-updated", handler);
  return () => window.removeEventListener("relux-catalog-updated", handler);
}

export function getCategorySlug(categoryPath) {
  return CATEGORY_SLUG[categoryPath];
}
