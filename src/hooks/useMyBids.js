import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";

export function useMyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await api.getMyBids();
      setBids(data.bids ?? []);
    } catch (err) {
      setBids([]);
      setError(err.message || "Could not load your bids");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { bids, loading, error, refresh: load };
}
