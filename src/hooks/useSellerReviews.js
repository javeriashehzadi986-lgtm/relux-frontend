import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { isMongoListingId, normalizeMongoId } from "@/data/dressCatalog";

export function isMongoSellerId(id) {
  return /^[a-f0-9]{24}$/i.test(String(id ?? ""));
}

export function useSellerReviews(dressOrSellerId) {
  const sellerId =
    typeof dressOrSellerId === "string" || typeof dressOrSellerId === "number"
      ? normalizeMongoId(dressOrSellerId)
      : normalizeMongoId(dressOrSellerId?.sellerId);
  const dress = typeof dressOrSellerId === "object" ? dressOrSellerId : null;
  const usesApi = Boolean(sellerId);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(usesApi);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!usesApi) {
      setReviews([]);
      setStats({ average: 0, count: 0 });
      setSellerInfo(null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await api.getSellerReviews(sellerId);
      setReviews(data.reviews ?? []);
      setStats(data.stats ?? { average: 0, count: 0 });
      setSellerInfo(data.seller ?? null);
    } catch (err) {
      setReviews([]);
      setStats({ average: 0, count: 0 });
      setSellerInfo(null);
      setError(err.message || "Could not load reviews");
    } finally {
      setLoading(false);
    }
  }, [sellerId, usesApi]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = useCallback(
    async ({ rating, quote, author, reportReason = "", reportDetails = "" }) => {
      if (!usesApi) {
        throw new Error("Reviews are only available for live seller listings.");
      }

      setSubmitting(true);
      setError("");

      try {
        const data = await api.createSellerReview({
          sellerId,
          productId: isMongoListingId(dress?.id) ? dress.id : undefined,
          rating,
          quote,
          authorName: author,
          reportReason,
          reportDetails: reportDetails.trim(),
        });

        await load();

        return {
          message:
            data.message ||
            (reportReason || reportDetails.trim()
              ? "Thank you! Your review is live and our team has been notified about your report."
              : "Thank you! Your review has been submitted."),
        };
      } catch (err) {
        const message = err.message || "Could not submit review";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [dress?.id, sellerId, usesApi, load],
  );

  return {
    reviews,
    stats,
    sellerInfo,
    loading,
    error,
    submitting,
    submitReview,
    usesApi,
    refresh: load,
  };
}
