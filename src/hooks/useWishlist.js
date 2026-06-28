import { useCallback, useSyncExternalStore } from "react";
import {
  addToWishlist,
  getWishlistIds,
  getWishlistItems,
  getWishlistRevision,
  isInWishlist,
  removeFromWishlist,
  subscribeWishlistRevision,
  toggleWishlist,
} from "@/data/wishlistStore";

export function useWishlist() {
  useSyncExternalStore(
    subscribeWishlistRevision,
    getWishlistRevision,
    getWishlistRevision,
  );

  const ids = getWishlistIds();
  const items = getWishlistItems();

  const isSaved = useCallback((id) => ids.has(id), [ids]);

  return {
    ids,
    items,
    isSaved,
    isInWishlist,
    add: addToWishlist,
    remove: removeFromWishlist,
    toggle: toggleWishlist,
  };
}
