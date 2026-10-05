"use client";

import Link from "next/link";
import { Heart, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#E8336D]/15 border border-[#E8336D]/30 flex items-center justify-center mb-6 text-[#E8336D]">
        <Heart size={32} />
      </div>
      <h1 className="text-6xl font-black text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        404
      </h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-white/50 text-base max-w-md mb-8 leading-relaxed">
        Looking for love in all the wrong places? The page you&apos;re trying to reach doesn&apos;t exist or has moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link href="/discover" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
          <Search size={18} /> Discover Matches
        </Link>
        <Link href="/" className="btn-secondary w-full py-3.5 flex items-center justify-center gap-2">
          <Home size={18} /> Home Page
        </Link>
      </div>
    </div>
  );
}
