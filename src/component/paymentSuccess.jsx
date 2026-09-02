import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";
import "./paymentStatus.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("Missing payment session.");
      return;
    }

    let cancelled = false;
    api
      .getPaymentSession(sessionId)
      .then((data) => {
        if (cancelled) return;
        setOrderId(data.order?.orderId || "");
        setStatus(data.paymentStatus === "paid" ? "paid" : "pending");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setError(err.message || "Could not confirm payment.");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="payment-status-page">
      {status === "loading" && (
        <>
          <Loader2 size={40} className="payment-status-icon payment-status-icon--spin" />
          <h1 className="payment-status-title">Confirming payment…</h1>
          <p className="payment-status-text">Please wait while we verify your Stripe checkout.</p>
        </>
      )}

      {(status === "paid" || status === "pending") && (
        <>
          <CheckCircle2 size={48} className="payment-status-icon payment-status-icon--success" />
          <h1 className="payment-status-title">
            {status === "paid" ? "Payment successful" : "Payment received"}
          </h1>
          <p className="payment-status-text">
            {orderId
              ? `Order ${orderId} is confirmed. You can track it in your profile.`
              : "Your purchase is confirmed. You can track it in your profile."}
          </p>
          <div className="payment-status-actions">
            <Button asChild>
              <Link to="/profile?section=orders">View my orders</Link>
            </Button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="payment-status-title">Could not confirm</h1>
          <p className="payment-status-text">{error}</p>
          <div className="payment-status-actions">
            <Button asChild variant="outline">
              <Link to="/profile?section=orders">Go to orders</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
