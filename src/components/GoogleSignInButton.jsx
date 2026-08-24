import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/GoogleIcon";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  const hostRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(360);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return undefined;

    const updateWidth = () => {
      const nextWidth = Math.max(280, Math.floor(node.getBoundingClientRect().width));
      setButtonWidth(nextWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <Button type="button" variant="google" size="auth" disabled>
        <GoogleIcon />
        Google sign-in not configured
      </Button>
    );
  }

  return (
    <div ref={hostRef} className="google-signin-host">
      {disabled ? (
        <Button type="button" variant="google" size="auth" disabled>
          <GoogleIcon />
          Continue with Google
        </Button>
      ) : (
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => onError?.(new Error("Google sign-in was cancelled or failed"))}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={buttonWidth}
          locale="en"
        />
      )}
    </div>
  );
}
