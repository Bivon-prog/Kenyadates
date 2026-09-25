"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. The link may be broken.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Failed to verify email");
        }

        setStatus("success");
        setMessage("Your email has been successfully verified! You can now access all features.");
        
        // Auto-redirect to app if they are logged in
        if (isAuthenticated) {
          setTimeout(() => {
            router.push("/app");
          }, 3000);
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "An unexpected error occurred.");
      }
    };

    verify();
  }, [token, isAuthenticated, router]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "rgba(232,51,109,0.08)", borderRadius: "50%", filter: "blur(100px)" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400, background: "rgba(108,99,255,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />

      <div className="glass animate-fade-in" style={{ width: "100%", maxWidth: 440, borderRadius: "var(--radius-xl)", padding: 40, textAlign: "center", position: "relative" }}>
        
        <div style={{ display: "inline-flex", marginBottom: 24 }}>
          {status === "loading" && <Loader2 size={64} color="var(--accent-primary)" className="animate-spin" />}
          {status === "success" && <CheckCircle size={64} color="var(--color-success)" />}
          {status === "error" && <XCircle size={64} color="var(--color-error)" />}
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
          {status === "loading" && "Verifying..."}
          {status === "success" && "Email Verified! 🎉"}
          {status === "error" && "Verification Failed"}
        </h1>
        
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
          {message}
        </p>

        {status === "success" && (
          <button onClick={() => router.push(isAuthenticated ? "/app" : "/login")} className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16 }}>
            {isAuthenticated ? "Go to Dashboard" : "Sign In to Continue"}
          </button>
        )}

        {status === "error" && (
          <button onClick={() => router.push("/register")} className="btn-secondary" style={{ width: "100%", padding: 16, fontSize: 16 }}>
            Back to Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
