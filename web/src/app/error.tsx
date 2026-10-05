"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mb-6 text-red-400">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Something went wrong
      </h1>
      <p className="text-white/50 text-base max-w-md mb-8 leading-relaxed">
        An unexpected error occurred. Don&apos;t worry, your account and profile data are completely safe.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={18} /> Try Again
        </button>
        <Link href="/" className="btn-secondary w-full py-3.5 flex items-center justify-center gap-2">
          <Home size={18} /> Go Home
        </Link>
      </div>
    </div>
  );
}
