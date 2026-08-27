import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

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
    <div style={{ maxWidth: 520, margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
      {status === "loading" && (
        <>
          <Loader2 size={40} style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Confirming payment…</h1>
          <p>Please wait while we verify your Stripe checkout.</p>
        </>
      )}

      {(status === "paid" || status === "pending") && (
        <>
          <CheckCircle2 size={48} style={{ margin: "0 auto 1rem", color: "#1a7f4b" }} />
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {status === "paid" ? "Payment successful" : "Payment received"}
          </h1>
          <p style={{ marginBottom: "1.5rem" }}>
            {orderId
              ? `Order ${orderId} is confirmed. You can track it in your profile.`
              : "Your purchase is confirmed. You can track it in your profile."}
          </p>
          <Button asChild>
            <Link to="/profile?section=orders">View my orders</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Could not confirm</h1>
          <p style={{ marginBottom: "1.5rem" }}>{error}</p>
          <Button asChild variant="outline">
            <Link to="/profile?section=orders">Go to orders</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
