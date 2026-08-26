import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product_id");

  return (
    <div style={{ maxWidth: 520, margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Payment cancelled</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        No charge was made. You can return to checkout and try again when you are ready.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        {productId ? (
          <Button asChild>
            <Link to={`/dress/${productId}/checkout`}>Return to checkout</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link to="/profile?section=orders">My orders</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancel;
