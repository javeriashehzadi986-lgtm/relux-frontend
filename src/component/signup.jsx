import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./signup.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { useAuth } from "@/context/AuthContext";
import { getPostAuthPath } from "@/utils/authRedirect";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import api from "@/services/api";
import "@/components/GoogleSignInButton.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle } = useAuth();
  const [submitted, setsubmitted] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [nameerror, setnameerror] = useState("");
  const [emailerror, setemailerror] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [confirmError, setconfirmError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [googleError, setGoogleError] = useState("");

  const onsubmitted = async (e) => {
    e.preventDefault();
    setSubmitError("");
    let valid = true;

    if (name.trim() === "") {
      setnameerror("Full name is required");
      valid = false;
    } else setnameerror("");

    if (!email.includes("@") || !email.includes(".")) {
      setemailerror("Enter a valid email");
      valid = false;
    } else setemailerror("");

    if (password.length < 6) {
      setpassworderror("Password must be at least 6 characters");
      valid = false;
    } else setpassworderror("");

    if (confirmPassword !== password) {
      setconfirmError("Passwords do not match");
      valid = false;
    } else setconfirmError("");

    if (!valid) return;

    setLoading(true);
    try {
      const data = await register({ name: name.trim(), email, password });
      if (data.requiresVerification) {
        setPendingEmail(data.email || email);
        setsubmitted(true);
        return;
      }
      if (data.user) {
        setsubmitted(true);
        window.setTimeout(() => {
          navigate(getPostAuthPath(data.user, location.state?.from), { replace: true });
        }, 1200);
      }
    } catch (error) {
      if (error.code === "EMAIL_IN_USE") {
        setSubmitError(
          "This email is already registered on an active account. Log in instead, or delete that account first from Profile settings.",
        );
      } else {
        setSubmitError(error.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleError("");
    setGoogleLoading(true);
    try {
      const data = await loginWithGoogle(credentialResponse.credential);
      setsubmitted(true);
      window.setTimeout(() => {
        navigate(getPostAuthPath(data.user, location.state?.from), { replace: true });
      }, 800);
    } catch (error) {
      if (error.code === "EMAIL_IN_USE") {
        setGoogleError("This email is already registered. Log in with email/password or Google.");
      } else {
        setGoogleError(error.message || "Google sign-up failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!pendingEmail) return;
    setResendMessage("");
    setResendLoading(true);
    try {
      const data = await api.resendVerification({ email: pendingEmail });
      setResendMessage(data.message || "Verification email sent.");
    } catch (error) {
      setResendMessage(error.message || "Could not resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-brand-header">
        <Link to="/home" className="signup-logo">
          Relux Hub
        </Link>
      </header>

      <div className="signup-blur signup-blur--left" aria-hidden="true" />
      <div className="signup-blur signup-blur--right" aria-hidden="true" />

      <main className="signup-main">
        {submitted ? (
          <Card className="signup-card">
            <CardContent className="signup-card-content">
              <p className="signup-success">
                {pendingEmail
                  ? "Check your email to verify your account"
                  : "Account Created"}
              </p>
              {pendingEmail ? (
                <>
                  <p className="signup-description" style={{ marginTop: "1rem", textAlign: "center" }}>
                    We sent a verification link to <strong>{pendingEmail}</strong>. Click the
                    link in that email to activate your account. The link expires in 24 hours.
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="signup-submit-btn"
                    style={{ marginTop: "1rem" }}
                    disabled={resendLoading}
                    onClick={handleResendVerification}
                  >
                    {resendLoading ? "Sending..." : "Resend verification email"}
                  </Button>
                  {resendMessage ? (
                    <p className="signup-description" style={{ marginTop: "0.75rem", textAlign: "center" }}>
                      {resendMessage}
                    </p>
                  ) : null}
                  <p className="signup-login-pivot" style={{ marginTop: "1.25rem" }}>
                    Already verified?
                    <Link to="/login" state={location.state}>
                      Login
                    </Link>
                  </p>
                </>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <Card className="signup-card">
            <CardHeader className="signup-card-header">
              <CardTitle className="signup-title">Create Your Account</CardTitle>
              <CardDescription className="signup-description">
                {location.state?.intent === "seller"
                  ? "Create your Relux Hub account first. After signup you will continue to seller verification (CNIC upload)."
                  : "Create a buyer account to rent or shop. To sell, register here first, then apply from Become a Seller."}
              </CardDescription>
            </CardHeader>

            <CardContent className="signup-card-content">
              <form className="signup-form" onSubmit={onsubmitted}>
                <FieldGroup className="signup-field-group">
                  <Field data-invalid={!!nameerror} className="signup-field">
                    <FieldLabel htmlFor="signup-name" className="signup-field-label">
                      Full Name
                    </FieldLabel>
                    <Input
                      id="signup-name"
                      type="text"
                      className="signup-input"
                      placeholder="Enter name"
                      value={name}
                      aria-invalid={!!nameerror}
                      onChange={(e) => {
                        setname(e.target.value);
                        setnameerror("");
                      }}
                    />
                    <FieldError>{nameerror}</FieldError>
                  </Field>

                  <Field data-invalid={!!emailerror} className="signup-field">
                    <FieldLabel htmlFor="signup-email" className="signup-field-label">
                      Email Address
                    </FieldLabel>
                    <Input
                      id="signup-email"
                      type="email"
                      className="signup-input"
                      placeholder="Enter email"
                      value={email}
                      aria-invalid={!!emailerror}
                      onChange={(e) => {
                        setemail(e.target.value);
                        setemailerror("");
                      }}
                    />
                    <FieldError>{emailerror}</FieldError>
                  </Field>

                  <div className="signup-password-grid">
                    <Field data-invalid={!!passworderror} className="signup-field">
                      <FieldLabel
                        htmlFor="signup-password"
                        className="signup-field-label"
                      >
                        Password
                      </FieldLabel>
                      <div className="signup-password-wrap">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          className="signup-input signup-input--password"
                          placeholder="••••••••"
                          value={password}
                          aria-invalid={!!passworderror}
                          autoComplete="new-password"
                          onChange={(e) => {
                            setpassword(e.target.value);
                            setpassworderror("");
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="signup-password-toggle"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                        >
                          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </Button>
                      </div>
                      <FieldError>{passworderror}</FieldError>
                    </Field>

                    <Field data-invalid={!!confirmError} className="signup-field">
                      <FieldLabel
                        htmlFor="signup-confirm-password"
                        className="signup-field-label"
                      >
                        Confirm Password
                      </FieldLabel>
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        className="signup-input"
                        placeholder="••••••••"
                        value={confirmPassword}
                        aria-invalid={!!confirmError}
                        autoComplete="new-password"
                        onChange={(e) => {
                          setconfirmPassword(e.target.value);
                          setconfirmError("");
                        }}
                      />
                      <FieldError>{confirmError}</FieldError>
                    </Field>
                  </div>

                  <Button type="submit" size="auth" className="signup-submit-btn" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                  {submitError && <FieldError>{submitError}</FieldError>}
                </FieldGroup>
              </form>

              <div className="signup-bottom">
                <FieldSeparator className="signup-divider">OR</FieldSeparator>

                <GoogleSignInButton
                  disabled={loading || googleLoading}
                  onSuccess={handleGoogleSuccess}
                  onError={(error) => setGoogleError(error.message || "Google sign-up failed")}
                />
                {googleError ? <FieldError>{googleError}</FieldError> : null}

                <p className="signup-login-pivot">
                  Already have an account?
                  <Link to="/login" state={location.state}>
                    Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Signup;
