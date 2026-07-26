import { useCallback, useEffect, useState } from "react";
import api from "@/services/api";
import { isMongoListingId } from "@/data/dressCatalog";
import {
  addSellerReport,
  addSellerReview,
  getSellerKey,
  getSellerRatingStats,
  getSellerReviews as getLocalSellerReviews,
} from "@/data/sellerReviewsStore";

export function isMongoSellerId(id) {
  return /^[a-f0-9]{24}$/i.test(String(id ?? ""));
}

export function useSellerReviews(dress) {
  const sellerId =
    dress?.sellerId && isMongoSellerId(dress.sellerId)
      ? String(dress.sellerId)
      : null;
  const sellerKey = getSellerKey(dress);
  const usesApi = Boolean(sellerId);

  const [reviews, setReviews] = useState(() =>
    usesApi ? [] : getLocalSellerReviews(sellerKey),
  );
  const [stats, setStats] = useState(() =>
    usesApi
      ? { average: 0, count: 0 }
      : getSellerRatingStats(getLocalSellerReviews(sellerKey)),
  );
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(usesApi);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!usesApi) {
      const localReviews = getLocalSellerReviews(sellerKey);
      setReviews(localReviews);
      setStats(getSellerRatingStats(localReviews));
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
  }, [sellerId, sellerKey, usesApi]);

  useEffect(() => {
    load();
  }, [load]);

  const submitReview = useCallback(
    async ({ rating, quote, author, reportReason = "", reportDetails = "" }) => {
      if (!usesApi) {
        addSellerReview(sellerKey, { rating, quote, author });

        if (reportReason || reportDetails.trim()) {
          addSellerReport({
            sellerKey,
            dressId: dress?.id,
            reason: reportReason || "other",
            details: reportDetails.trim() || "No additional details provided.",
            author,
          });
        }

        const localReviews = getLocalSellerReviews(sellerKey);
        setReviews(localReviews);
        setStats(getSellerRatingStats(localReviews));

        return {
          message:
            reportReason || reportDetails.trim()
              ? "Thank you! Your review and report have been submitted to our team."
              : "Thank you! Your review has been submitted.",
        };
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

        setReviews((current) => [data.review, ...current]);
        if (data.stats) {
          setStats(data.stats);
        }

        return {
          message:
            data.message ||
            "Thank you! Your review has been submitted.",
        };
      } catch (err) {
        const message = err.message || "Could not submit review";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [dress?.id, sellerId, sellerKey, usesApi],
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
