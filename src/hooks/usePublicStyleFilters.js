import { useEffect, useState } from "react";
import api from "@/services/api";
import { getStyleOptionsForCategory } from "@/data/styleCategories";

const FALLBACK_MAINS = [
  { name: "Female", slug: "female", title: "Female Fashion", to: "/category/female" },
  { name: "Male", slug: "male", title: "Male Fashion", to: "/category/male" },
  { name: "Kids", slug: "kids", title: "Kids Fashion", to: "/category/kids" },
];

const LEGACY_SLUGS = new Set(["female", "male", "kids"]);

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

function legacyStyleOptions(mainSlug) {
  const label =
    mainSlug === "male" ? "Male" : mainSlug === "kids" ? "Kids" : "Female";
  return getStyleOptionsForCategory(label).map((style) => ({
    key: style,
    label: style,
  }));
}

/**
 * Active main categories from admin (Male / Female / Kids / any new ones).
 */
export function usePublicMainCategories() {
  const [mains, setMains] = useState(FALLBACK_MAINS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getPublicCategories();
        const next = (data.categories ?? []).map((item) => ({
          name: item.name,
          slug: item.slug,
          title: item.title || `${item.name} Fashion`,
          to: item.to || `/category/${item.slug}`,
          subcategories: item.subcategories ?? [],
        }));
        if (!cancelled && next.length > 0) {
          setMains(next);
        }
      } catch {
        if (!cancelled) setMains(FALLBACK_MAINS);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return mains;
}

/**
 * Style filters for a main category slug.
 * Returns [{ key, label }] from admin subcategories only.
 */
export function usePublicStyleFilters(mainSlug) {
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    if (!mainSlug) {
      setStyles([]);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await api.getPublicCategories();
        const main = (data.categories ?? []).find((item) => item.slug === mainSlug);
        const fromApi = toStyleOptions(main?.subcategories);

        if (cancelled) return;

        if (main) {
          setStyles(fromApi);
          return;
        }

        if (LEGACY_SLUGS.has(mainSlug)) {
          setStyles(legacyStyleOptions(mainSlug));
          return;
        }

        setStyles([]);
      } catch {
        if (cancelled) return;
        if (LEGACY_SLUGS.has(mainSlug)) {
          setStyles(legacyStyleOptions(mainSlug));
        } else {
          setStyles([]);
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
