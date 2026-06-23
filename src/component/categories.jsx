import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./categories.css";

const categories = [
  {
    title: "Female Fashion",
    subtitle: "Elevate your wardrobe with consciously crafted feminine silhouettes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiukL7lSowGGH1BNwfMAuup6a8qUrB5S2pBcM2k76YsM95ete1CKxoRlOz8gZYhKv9P7FSMnYvvQRfmXqbGHXDuS3T9-lgAALWZOlhXkvfnRk7biekOv8gkuW3HXT_RxXSwzGwHkgRW5bn4aAd-TQL8IYO2a6uTOX6DhXc4DmMq8pHr092RKKGkfmbTj7dzefQZWyaldzYKvWMeAlzzFwG2-ETdaCBmA8vuli47HBmfdUL5YEwQMj77rtmCVET6JJFJXMdpbqB0pXm",
  },
  {
    title: "Male Fashion",
    subtitle: "Shop pre-loved men's fashion curated for timeless style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBaq_12MLIjP788-IcuyL49DoE_LqVyMo-bT2kI6tbfr1IRlATc7JAkbZvXTAJ5iSWIezBzWltEPOzV5rzcJ8Hsj6ynHOZGSRUB9tb-n90tbADlW5bbnSaVWxbwJwBHzrjd0sXY9iukLhUUwDiZ998w_h1mSMG2Q5Xv1njglITUncIDEjUcwdUVbcsa8PwVa-bPzA6EMX7cEWqqfgSOREUSRSw4ALLsAs6HhGg87ez0fvWMw3ecpvT30UeJImAlTyZQn2Ls4fVwYSHu",
  },
  {
    title: "Kids Fashion",
    subtitle: "Gentle on the planet, perfect for the next generation of style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2byFAgLoJ73OybxhWp_M92XJtCnNdZJ9CUqa73mYX6qoO-ood2-CpKvlk3Fh_cV1ajJM0dS2DZYq7SXGG3uh5rxeYjtJFiPBIm3GmVbxPZ7RUPz2lIWIEgeF9S2dVSN8vVYJ8FOIjthXFarAaCdDtzLg7a-oYSbMnfy0bK9kmi-nGi9lT6a9uLV3wZ1klYuJE_85sAwPs1CoA-F2OmSGcTCIeZxcr1pIGOVm2mc1NIVo91LRTj0DJSp6uP1PaHjmxtsB8KWmY64Sg",
  },
];

const Categories = () => {
  return (
    <section className="categories-page">
      <div className="categories-header">
        <h1>Curated Categories</h1>
        <p>Finest selections for every occasion</p>
      </div>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.title}
            to="/rentDresses"
            className="categories-card-link"
          >
            <Card className="categories-card">
              <div className="categories-card-image">
                <img alt={category.title} src={category.image} />
              </div>
              <CardContent className="categories-card-content">
                <CardTitle className="categories-card-title">
                  {category.title}
                </CardTitle>
                <CardDescription className="categories-card-subtitle">
                  {category.subtitle}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
