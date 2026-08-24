import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import api from "@/services/api";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.forgotPassword({ email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="forgot-password-page">
      <header className="forgot-password-brand-header">
        <Link to="/home" className="forgot-password-logo">
          Relux Hub
        </Link>
      </header>

      <div className="forgot-password-main">
        <Card className="forgot-password-card">
          <CardContent className="forgot-password-card-content px-0 py-0">
            <div className="forgot-password-body">
              {!submitted ? (
                <>
                  <div className="forgot-password-icon-wrap">
                    <KeyRound size={30} aria-hidden="true" />
                  </div>

                  <div className="forgot-password-header">
                    <h2 className="forgot-password-title">Forgot Password?</h2>
                    <p className="forgot-password-description">
                      Enter your email address and we will send you a link to reset
                      your password.
                    </p>
                  </div>

                  <form className="forgot-password-form" onSubmit={onSubmit}>
                    <FieldGroup className="forgot-password-field-group">
                      <Field data-invalid={!!error} className="forgot-password-field">
                        <FieldLabel
                          htmlFor="forgot-email"
                          className="forgot-password-field-label"
                        >
                          Email Address
                        </FieldLabel>
                        <Input
                          id="forgot-email"
                          type="email"
                          className="forgot-password-input"
                          placeholder="e.g. name@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          required
                        />
                        {error ? <FieldError>{error}</FieldError> : null}
                      </Field>

                      <Button
                        type="submit"
                        size="auth"
                        className="forgot-password-submit"
                        disabled={loading || !email.trim()}
                      >
                        {loading ? "Sending..." : "Send Reset Link"}
                        <ArrowRight size={20} aria-hidden="true" />
                      </Button>
                    </FieldGroup>
                  </form>
                </>
              ) : (
                <div className="forgot-password-success">
                  <div className="forgot-password-success-icon">
                    <Check size={30} aria-hidden="true" />
                  </div>
                  <h3 className="forgot-password-success-title">Check your inbox</h3>
                  <p className="forgot-password-success-text">
                    If an account exists for <strong>{email}</strong>, we sent a
                    password reset link. Check spam if you don&apos;t see it. The
                    link expires in 1 hour.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="forgot-password-try-again"
                    onClick={handleTryAgain}
                  >
                    Try another email
                  </Button>
                </div>
              )}
            </div>

            <div className="forgot-password-footer">
              <Button
                type="button"
                variant="ghost"
                className="forgot-password-back-link"
                asChild
              >
                <Link to="/login">
                  <ArrowLeft size={18} aria-hidden="true" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
