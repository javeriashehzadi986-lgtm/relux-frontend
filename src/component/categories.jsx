import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api";
import "./categories.css";

const FALLBACK_CATEGORIES = [
  {
    slug: "female",
    title: "Female Fashion",
    subtitle: "Elevate your wardrobe with consciously crafted feminine silhouettes.",
    to: "/category/female",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiukL7lSowGGH1BNwfMAuup6a8qUrB5S2pBcM2k76YsM95ete1CKxoRlOz8gZYhKv9P7FSMnYvvQRfmXqbGHXDuS3T9-lgAALWZOlhXkvfnRk7biekOv8gkuW3HXT_RxXSwzGwHkgRW5bn4aAd-TQL8IYO2a6uTOX6DhXc4DmMq8pHr092RKKGkfmbTj7dzefQZWyaldzYKvWMeAlzzFwG2-ETdaCBmA8vuli47HBmfdUL5YEwQMj77rtmCVET6JJFJXMdpbqB0pXm",
  },
  {
    slug: "male",
    title: "Male Fashion",
    subtitle: "Shop pre-loved men's fashion curated for timeless style.",
    to: "/category/male",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaq_12MLIjP788-IcuyL49DoE_LqVyMo-bT2kI6tbfr1IRlATc7JAkbZvXTAJ5iSWIezBzWltEPOzV5rzcJ8Hsj6ynHOZGSRUB9tb-n90tbADlW5bbnSaVWxbwJwBHzrjd0sXY9iukLhUUwDiZ998w_h1mSMG2Q5Xv1njglITUncIDEjUcwdUVbcsa8PwVa-bPzA6EMX7cEWqqfgSOREUSRSw4ALLsAs6HhGg87ez0fvWMw3ecpvT30UeJImAlTyZQn2Ls4fVwYSHu",
  },
  {
    slug: "kids",
    title: "Kids Fashion",
    subtitle: "Gentle on the planet, perfect for the next generation of style.",
    to: "/category/kids",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2byFAgLoJ73OybxhWp_M92XJtCnNdZJ9CUqa73mYX6qoO-ood2-CpKvlk3Fh_cV1ajJM0dS2DZYq7SXGG3uh5rxeYjtJFiPBIm3GmVbxPZ7RUPz2lIWIEgeF9S2dVSN8vVYJ8FOIjthXFarAaCdDtzLg7a-oYSbMnfy0bK9kmi-nGi9lT6a9uLV3wZ1klYuJE_85sAwPs1CoA-F2OmSGcTCIeZxcr1pIGOVm2mc1NIVo91LRTj0DJSp6uP1PaHjmxtsB8KWmY64Sg",
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getPublicCategories();
        const next = (data.categories ?? []).map((category) => ({
          slug: category.slug,
          title: category.title || `${category.name} Fashion`,
          subtitle: category.subtitle || `Browse ${category.name} fashion on Relux Hub.`,
          to: category.to || `/category/${category.slug}`,
          image: category.image,
          totalListings: category.totalListings ?? 0,
        }));

        if (!cancelled && next.length > 0) {
          setCategories(next);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load categories");
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="categories-page">
      <div className="categories-header">
        <h1>Curated Categories</h1>
        <p>Finest selections for every occasion</p>
      </div>

      {error && (
        <p className="categories-status categories-status--error" role="alert">
          {error}. Showing default categories.
        </p>
      )}
      {loading && !error && (
        <p className="categories-status">Loading categories...</p>
      )}

      <div className="categories-grid">
        {categories.map((category) => (
          <article key={category.slug || category.title} className="categories-card-wrap">
            <Card className="categories-card">
              <Link to={category.to} className="categories-card-link">
                <div className="categories-card-image">
                  <img alt={category.title} src={category.image} />
                </div>
              </Link>
              <CardContent className="categories-card-content">
                <Link to={category.to} className="categories-card-title-link">
                  <CardTitle className="categories-card-title">
                    {category.title}
                  </CardTitle>
                </Link>
                <CardDescription className="categories-card-subtitle">
                  {category.subtitle}
                </CardDescription>
                {typeof category.totalListings === "number" && (
                  <p className="categories-card-count">
                    {category.totalListings} listings
                  </p>
                )}
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Categories;
