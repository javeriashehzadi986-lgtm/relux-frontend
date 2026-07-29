import { useCallback, useEffect, useState } from "react";
import { mapPublicListingsToProductCards } from "@/data/dressCatalog";
import api from "@/services/api";

const DEFAULT_LIMIT = 6;

export function useFeaturedRentals(limit = DEFAULT_LIMIT) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getPublicListings({
        type: "rent",
        limit,
      });
      setProducts(mapPublicListingsToProductCards(data.listings ?? []));
    } catch (err) {
      setProducts([]);
      setError(err.message || "Could not load featured rentals");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refresh: load };
}
