import { useSyncExternalStore } from "react";
import {
  getListingRevision,
  subscribeListingRevision,
} from "@/data/sellerListingStore";

export function useListingCatalog() {
  return useSyncExternalStore(
    subscribeListingRevision,
    getListingRevision,
    getListingRevision,
  );
}
