import { useEffect, useSyncExternalStore } from "react";
import {
  getListingRevision,
  subscribeListingRevision,
} from "@/data/sellerListingStore";
import {
  getCatalogRevision,
  refreshPublicCatalog,
  subscribeCatalogRevision,
} from "@/data/catalogStore";

function getCombinedRevision() {
  return getListingRevision() + getCatalogRevision();
}

function subscribeCombinedRevision(onStoreChange) {
  const unsubLocal = subscribeListingRevision(onStoreChange);
  const unsubApi = subscribeCatalogRevision(onStoreChange);
  return () => {
    unsubLocal();
    unsubApi();
  };
}

export function useListingCatalog() {
  useEffect(() => {
    refreshPublicCatalog();
    const onFocus = () => refreshPublicCatalog();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return useSyncExternalStore(
    subscribeCombinedRevision,
    getCombinedRevision,
    getCombinedRevision,
  );
}
