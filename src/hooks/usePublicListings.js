import { useCallback, useEffect, useState } from "react";
import { mapPublicListingsToProductCards } from "@/data/dressCatalog";
import api from "@/services/api";

export function usePublicListings(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getPublicListings(category);
      setProducts(mapPublicListingsToProductCards(data.listings ?? []));
    } catch (err) {
      setProducts([]);
      setError(err.message || "Could not load listings");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refresh: load };
}
