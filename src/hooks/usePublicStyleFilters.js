import { useEffect, useState } from "react";
import api from "@/services/api";

function toStyleOptions(subcategories = []) {
  return subcategories
    .map((sub) => {
      const key = (sub.productStyleKey || sub.name || "").trim();
      const label = (sub.name || sub.productStyleKey || "").trim();
      if (!key) return null;
      return { key, label: label || key };
    })
    .filter(Boolean);
}

/**
 * Active main categories from admin (Male / Female / Kids / any new ones).
 */
export function usePublicMainCategories() {
  const [mains, setMains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getPublicCategories();
        const next = (data.categories ?? []).map((item) => ({
          name: item.name,
          slug: item.slug,
          title: item.title || `${item.name} Fashion`,
          subtitle: item.subtitle || `Browse ${item.name} fashion on Relux Hub.`,
          to: item.to || `/category/${item.slug}`,
          image: item.image || "",
          subcategories: item.subcategories ?? [],
        }));

        if (!cancelled) {
          setMains(next);
        }
      } catch (err) {
        if (!cancelled) {
          setMains([]);
          setError(err.message || "Could not load categories");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { mains, loading, error };
}

/**
 * Style filters for a main category slug.
 * Returns [{ key, label }] from admin subcategories only.
 */
export function usePublicStyleFilters(mainSlug) {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(Boolean(mainSlug));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mainSlug) {
      setStyles([]);
      setLoading(false);
      setError("");
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await api.getPublicCategories();
        const main = (data.categories ?? []).find((item) => item.slug === mainSlug);
        const fromApi = toStyleOptions(main?.subcategories ?? []);

        if (!cancelled) {
          setStyles(fromApi);
        }
      } catch (err) {
        if (!cancelled) {
          setStyles([]);
          setError(err.message || "Could not load style filters");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mainSlug]);

  return styles;
}
