"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  
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
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API}/auth/verify-email`, {
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
        
        if (data.token && data.user) {
          login(data.token, data.user);
        }
        
        setTimeout(() => {
          router.push("/discover");
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "An unexpected error occurred.");
      }
    };

    verify();
  }, [token, isAuthenticated, router, login]);

  return (
    <div className="w-full max-w-sm text-center animate-fade-in">
      <div className="mb-6 flex justify-center">
        {status === "loading" && <Loader2 size={64} color="#E8336D" className="animate-spin" />}
        {status === "success" && <CheckCircle size={64} color="#4CAF82" />}
        {status === "error" && <XCircle size={64} color="#FF4B6E" />}
      </div>
      <h1 className="text-2xl font-black text-white mb-3">
        {status === "loading" && "Verifying…"}
        {status === "success" && "Email Verified! 🎉"}
        {status === "error" && "Verification Failed"}
      </h1>
      <p className="text-white/50 text-base mb-8 leading-relaxed">{message}</p>
      {status === "success" && (
        <button onClick={() => router.push(isAuthenticated ? "/discover" : "/login")}
          className="btn-primary w-full py-4 text-base">
          {isAuthenticated ? "Go to App" : "Sign In"}
        </button>
      )}
      {status === "error" && (
        <button onClick={() => router.push("/register")}
          className="btn-secondary w-full py-4 text-base">
          Back to Sign Up
        </button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="text-center text-white/50">
          <Loader2 size={48} color="#E8336D" className="animate-spin mx-auto mb-4" />
          <p>Loading verification page…</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
