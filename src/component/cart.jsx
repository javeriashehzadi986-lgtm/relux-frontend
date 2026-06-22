import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import "./cart.css";

const INITIAL_ITEMS = [
  {
    id: "nikkah",
    category: "Bridal Couture",
    title: "Zari Embroidered Ivory Nikkah Ensemble",
    meta: "Size: Custom Tailored • Condition: Pristine",
    price: 85000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAROHtU-KXTld80XJZI7pKHXtHALUyQMmG3EFZptMfZAVFiOkP4hjKlOIlcWIbNWpwgP9pfGvTxcz6-nuNUuybbV_lyBGpRtgLMc88yKT3SkQLuBmOMHuIu4NN6d9lXnhXUZpJk2rpPNhx0GlzVqlvoqJ6zi8-RO5iJn2EJN9dZXB7GV8k6KnM22ddTa3ufOx2FHIz9cTHzKN60i_3IbV5NdfBX2ZU7LJtESgYK8hkAa63Lb1dbDDJeAffGq76AQJCYwIEOVxJ2WTLS",
  },
  {
    id: "pishwas",
    category: "Formal Wear",
    title: "Emerald Velvet Tilla Work Pishwas",
    meta: "Size: Medium • Condition: Excellent",
    price: 42500,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAxs0PvVq18UxJ1k6pD65i-7013GdgFI_ebnN0v4nIsGjItKEO96wknZww_3bGv_wELsOlRvnPRaLC4DTb_mTlrS-FNjxoJRXZVVerrNAS7pHJ35S7syh-ZFslPM8u1by_zBqHS98LLRoukVGh50tNzgtkjvFNurqbQ89btvH1nGXWL-eeQlY2x2sGmt6FDaOKaM5ACMmSjvNdHvwROBu9ZNPGlMzEIJbP12ah0D13i3Qb5VrE5KBDlxCFH4erUID7rtmqY7cxlLeHJ",
  },
];

const formatPrice = (amount) =>
  `Rs. ${amount.toLocaleString("en-PK")}`;

const Cart = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const rent = 4500;
  const shipping = 2500;
  const total = subtotal + rent + shipping;

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <p className="cart-header-eyebrow">Review Your Curated Selection</p>
        <h1>Your Atelier Cart</h1>
      </header>

      <div className="cart-layout">
        <section className="cart-items-section">
          {items.map((item) => (
            <Card key={item.id} className="cart-item-card py-0 gap-0 ring-0">
              <CardContent className="cart-item-content">
                <div className="cart-item-image-wrap">
                  <img alt={item.title} src={item.image} />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <p className="cart-item-category">{item.category}</p>
                      <CardTitle className="cart-item-title">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="cart-item-meta">
                        {item.meta}
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="icon"
                      size="icon"
                      className="cart-remove-btn"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>

                  <div className="cart-item-footer">
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="cart-continue-wrap">
            <Button
              type="button"
              variant="ghost"
              className="cart-continue-link"
              asChild
            >
              <Link to="/rentDresses">
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </section>

        <aside className="cart-summary-aside">
          <Card className="cart-summary-card py-0 gap-0 ring-0 shadow-none">
            <CardContent className="cart-summary-content">
              <CardTitle className="cart-summary-title">Order Summary</CardTitle>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Rent</span>
                  <span>{formatPrice(rent)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
              </div>

              <div className="cart-summary-total">
                <span className="cart-summary-total-label">Estimated Total</span>
                <p className="cart-summary-total-value">{formatPrice(total)}</p>
              </div>

              <div className="cart-summary-actions">
                <Button type="button" size="full" className="cart-checkout-btn">
                  Proceed to Checkout
                </Button>
                <p className="cart-summary-note">
                  Secure Encrypted Checkout • Hassle-Free Returns
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
