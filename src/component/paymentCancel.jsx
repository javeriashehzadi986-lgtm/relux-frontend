import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./paymentStatus.css";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product_id");
  const orderId = searchParams.get("order_id");

  return (
    <div className="payment-status-page">
      <h1 className="payment-status-title">Payment cancelled</h1>
      <p className="payment-status-text">
        No charge was made. You can return and try again when you are ready.
      </p>
      <div className="payment-status-actions">
        {productId ? (
          <Button asChild>
            <Link to={`/dress/${productId}/checkout`}>Return to checkout</Link>
          </Button>
        ) : null}
        {orderId ? (
          <Button asChild variant={productId ? "outline" : "default"}>
            <Link to={`/orders/${orderId}/checkout`}>Return to rental checkout</Link>
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
