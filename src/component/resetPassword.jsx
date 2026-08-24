import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import api from "@/services/api";
import "./forgotPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => String(searchParams.get("token") ?? "").trim(), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset link is missing or invalid. Request a new one.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not reset password. Request a new link.");
    } finally {
      setLoading(false);
    }
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
              {!done ? (
                <>
                  <div className="forgot-password-icon-wrap">
                    <KeyRound size={30} aria-hidden="true" />
                  </div>

                  <div className="forgot-password-header">
                    <h2 className="forgot-password-title">Set New Password</h2>
                    <p className="forgot-password-description">
                      Choose a new password for your Relux Hub account.
                    </p>
                  </div>

                  {!token ? (
                    <p className="forgot-password-success-text" style={{ marginBottom: "1rem" }}>
                      This reset link is invalid. Please request a new one from Forgot Password.
                    </p>
                  ) : (
                    <form className="forgot-password-form" onSubmit={onSubmit}>
                      <FieldGroup className="forgot-password-field-group">
                        <Field className="forgot-password-field">
                          <FieldLabel
                            htmlFor="reset-password"
                            className="forgot-password-field-label"
                          >
                            New Password
                          </FieldLabel>
                          <Input
                            id="reset-password"
                            type="password"
                            className="forgot-password-input"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            required
                            autoComplete="new-password"
                          />
                        </Field>

                        <Field data-invalid={!!error} className="forgot-password-field">
                          <FieldLabel
                            htmlFor="reset-confirm"
                            className="forgot-password-field-label"
                          >
                            Confirm Password
                          </FieldLabel>
                          <Input
                            id="reset-confirm"
                            type="password"
                            className="forgot-password-input"
                            placeholder="Re-enter password"
                            value={confirm}
                            onChange={(e) => {
                              setConfirm(e.target.value);
                              setError("");
                            }}
                            required
                            autoComplete="new-password"
                          />
                          {error ? <FieldError>{error}</FieldError> : null}
                        </Field>

                        <Button
                          type="submit"
                          size="auth"
                          className="forgot-password-submit"
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update Password"}
                          <ArrowRight size={20} aria-hidden="true" />
                        </Button>
                      </FieldGroup>
                    </form>
                  )}
                </>
              ) : (
                <div className="forgot-password-success">
                  <div className="forgot-password-success-icon">
                    <Check size={30} aria-hidden="true" />
                  </div>
                  <h3 className="forgot-password-success-title">Password updated</h3>
                  <p className="forgot-password-success-text">
                    Your password has been changed. You can now log in with your new
                    password.
                  </p>
                  <Button
                    type="button"
                    size="auth"
                    className="forgot-password-submit"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                    <ArrowRight size={20} aria-hidden="true" />
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
                <Link to="/forgot-password">
                  <ArrowLeft size={18} aria-hidden="true" />
                  Request new link
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
