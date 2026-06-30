import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleIcon from "@/components/GoogleIcon";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";

const LOGIN_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBSnYGdanF0GYhv0vCxLzPcHcKTIzsyWHGMBv9agRIlHAXHLiLRIKpquL8JMbhuAoqsTDkdGDTELSWmxXQi4_Z96O5DbrRXRxkNqqEENu95HT90prKHhQ7l7pPvfa7VaHSJqm0L9KwHEwYoXXTx1dAlvGt1y2YFnpL7A59XleADEloG4hmHU5edTw9cFXygFzUj3uLLnksJ1SUiXDcbqG-jNDJeNpmPu6AnMJg3gH197CC5qNo_bu41kyK9cULkpYyk1BpAXK2g0zoT";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const onsubmitted = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const isEmailValid = email.includes("@") && email.includes(".");
    const isPasswordValid = password.length >= 6;

    if (!isEmailValid) {
      setemailerror("Enter a valid email");
    } else {
      setemailerror("");
    }

    if (!isPasswordValid) {
      setpassworderror("Password must be at least 6 characters");
    } else {
      setpassworderror("");
    }

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      setSubmitError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="login-visual-gradient" />
        <img
          className="login-visual-image"
          alt="Premium Pakistani Bridal Wear"
          src={LOGIN_IMAGE}
        />
        <div className="login-visual-copy">
          <h1>Welcome Back</h1>
          <p>
            Rent your favorite dresses <strong>بسهولة</strong> and look stunning
          </p>
        </div>
      </section>

      <section className="login-panel">
        <Card className="login-card">
          <CardHeader className="login-card-header">
            <span className="login-brand-mark">ATELIER</span>
            <CardTitle className="login-card-title">Login to Relux Hub</CardTitle>
          </CardHeader>

          <CardContent className="login-card-content">
            <form className="login-form" onSubmit={onsubmitted}>
              <FieldGroup className="login-field-group">
                <Field data-invalid={!!emailerror} className="login-field">
                  <FieldLabel htmlFor="login-email" className="login-field-label">
                    Email Address
                  </FieldLabel>
                  <Input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="name@example.com"
                    value={email}
                    aria-invalid={!!emailerror}
                    onChange={(e) => {
                      setemail(e.target.value);
                      setemailerror("");
                    }}
                  />
                  <FieldError>{emailerror}</FieldError>
                </Field>

                <Field data-invalid={!!passworderror} className="login-field">
                  <div className="login-password-header">
                    <FieldLabel
                      htmlFor="login-password"
                      className="login-field-label login-field-label--inline"
                    >
                      Password
                    </FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      className="login-forgot-link"
                      asChild
                    >
                      <Link to="/forgot-password">Forgot Password?</Link>
                    </Button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    className="login-input"
                    value={password}
                    aria-invalid={!!passworderror}
                    onChange={(e) => {
                      setpassword(e.target.value);
                      setpassworderror("");
                    }}
                  />
                  <FieldError>{passworderror}</FieldError>
                </Field>

                <Button type="submit" size="auth" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {submitError && <FieldError>{submitError}</FieldError>}
              </FieldGroup>
            </form>

            <FieldSeparator className="login-divider">OR</FieldSeparator>

            <Button type="button" variant="google" size="auth">
              <GoogleIcon />
              Continue with Google
            </Button>

            <p className="login-signup-pivot">
              Don&apos;t have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Login;
