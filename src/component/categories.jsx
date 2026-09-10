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

const Categories = () => {
  const [categories, setCategories] = useState([]);
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
        }));

        if (!cancelled) {
          setCategories(next);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load categories");
          setCategories([]);
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

      {loading && <p className="categories-status">Loading categories...</p>}

      {error && (
        <p className="categories-status categories-status--error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="categories-status">No categories are available yet.</p>
      )}

      <div className="categories-grid">
        {categories.map((category) => (
          <article key={category.slug || category.title} className="categories-card-wrap">
            <Card className="categories-card">
              <Link to={category.to} className="categories-card-link">
                <div className="categories-card-image">
                  {category.image ? (
                    <img alt={category.title} src={category.image} />
                  ) : (
                    <div className="categories-card-image-placeholder" aria-hidden="true" />
                  )}
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
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Categories;
