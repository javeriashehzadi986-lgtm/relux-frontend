import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { getPostAuthPath } from "@/utils/authRedirect";
import "./forgotPassword.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const token = useMemo(() => String(searchParams.get("token") ?? "").trim(), [searchParams]);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification link is missing or invalid.");
      return;
    }

    let active = true;

    api
      .verifyEmail({ token })
      .then(async (data) => {
        if (!active) return;
        if (data.token && data.user) {
          await loginWithToken(data.token, data.user);
        }
        setStatus("success");
        setMessage(data.message || "Your account is now active.");
        window.setTimeout(() => {
          navigate(getPostAuthPath(data.user), { replace: true });
        }, 1500);
      })
      .catch((error) => {
        if (!active) return;
        setStatus("error");
        setMessage(error.message || "Could not verify your email.");
      });

    return () => {
      active = false;
    };
  }, [token, navigate, loginWithToken]);

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
              {status === "loading" ? (
                <>
                  <div className="forgot-password-icon-wrap">
                    <MailCheck size={30} aria-hidden="true" />
                  </div>
                  <div className="forgot-password-header">
                    <h2 className="forgot-password-title">Verifying your email</h2>
                    <p className="forgot-password-description">
                      Please wait while we activate your Relux Hub account.
                    </p>
                  </div>
                </>
              ) : null}

              {status === "success" ? (
                <div className="forgot-password-success">
                  <div className="forgot-password-success-icon">
                    <Check size={30} aria-hidden="true" />
                  </div>
                  <h3 className="forgot-password-success-title">Email verified</h3>
                  <p className="forgot-password-success-text">{message}</p>
                  <p className="forgot-password-success-text">Redirecting you now...</p>
                </div>
              ) : null}

              {status === "error" ? (
                <>
                  <div className="forgot-password-icon-wrap">
                    <MailCheck size={30} aria-hidden="true" />
                  </div>
                  <div className="forgot-password-header">
                    <h2 className="forgot-password-title">Verification failed</h2>
                    <p className="forgot-password-description">{message}</p>
                  </div>
                  <Button type="button" size="auth" className="forgot-password-submit" asChild>
                    <Link to="/signup">
                      Back to Sign Up
                      <ArrowRight size={20} aria-hidden="true" />
                    </Link>
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
