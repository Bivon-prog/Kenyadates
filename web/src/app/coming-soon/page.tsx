"use client";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ComingSoonPage() {
  const params = useSearchParams();
  const page = params.get("page") ?? "This page";
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#E8336D]/10 border border-[#E8336D]/20 flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-[#E8336D]" />
      </div>
      <h1 className="text-3xl font-black mb-3">Coming Soon</h1>
      <p className="text-white/50 text-lg mb-8 max-w-sm">
        <strong className="text-white">{page}</strong> is under construction. Check back soon!
      </p>
      <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ background: "var(--gradient-primary)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
}
