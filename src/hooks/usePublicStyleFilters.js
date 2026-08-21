import { useEffect, useState } from "react";
import api from "@/services/api";
import { getStyleOptionsForCategory } from "@/data/styleCategories";

const FALLBACK_MAINS = [
  {
    name: "Female",
    slug: "female",
    title: "Female Fashion",
    subtitle: "Elevate your wardrobe with consciously crafted feminine silhouettes.",
    to: "/category/female",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiukL7lSowGGH1BNwfMAuup6a8qUrB5S2pBcM2k76YsM95ete1CKxoRlOz8gZYhKv9P7FSMnYvvQRfmXqbGHXDuS3T9-lgAALWZOlhXkvfnRk7biekOv8gkuW3HXT_RxXSwzGwHkgRW5bn4aAd-TQL8IYO2a6uTOX6DhXc4DmMq8pHr092RKKGkfmbTj7dzefQZWyaldzYKvWMeAlzzFwG2-ETdaCBmA8vuli47HBmfdUL5YEwQMj77rtmCVET6JJFJXMdpbqB0pXm",
  },
  {
    name: "Male",
    slug: "male",
    title: "Male Fashion",
    subtitle: "Shop pre-loved men's fashion curated for timeless style.",
    to: "/category/male",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaq_12MLIjP788-IcuyL49DoE_LqVyMo-bT2kI6tbfr1IRlATc7JAkbZvXTAJ5iSWIezBzWltEPOzV5rzcJ8Hsj6ynHOZGSRUB9tb-n90tbADlW5bbnSaVWxbwJwBHzrjd0sXY9iukLhUUwDiZ998w_h1mSMG2Q5Xv1njglITUncIDEjUcwdUVbcsa8PwVa-bPzA6EMX7cEWqqfgSOREUSRSw4ALLsAs6HhGg87ez0fvWMw3ecpvT30UeJImAlTyZQn2Ls4fVwYSHu",
  },
  {
    name: "Kids",
    slug: "kids",
    title: "Kids Fashion",
    subtitle: "Gentle on the planet, perfect for the next generation of style.",
    to: "/category/kids",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2byFAgLoJ73OybxhWp_M92XJtCnNdZJ9CUqa73mYX6qoO-ood2-CpKvlk3Fh_cV1ajJM0dS2DZYq7SXGG3uh5rxeYjtJFiPBIm3GmVbxPZ7RUPz2lIWIEgeF9S2dVSN8vVYJ8FOIjthXFarAaCdDtzLg7a-oYSbMnfy0bK9kmi-nGi9lT6a9uLV3wZ1klYuJE_85sAwPs1CoA-F2OmSGcTCIeZxcr1pIGOVm2mc1NIVo91LRTj0DJSp6uP1PaHjmxtsB8KWmY64Sg",
  },
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
          subtitle:
            item.subtitle || `Browse ${item.name} fashion on Relux Hub.`,
          to: item.to || `/category/${item.slug}`,
          image: item.image || "",
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
