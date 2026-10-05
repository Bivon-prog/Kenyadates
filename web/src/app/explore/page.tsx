"use client";

import React, { useState } from "react";
import { Sparkles, Coffee, Heart, Zap, Users, Search, Shield, MapPin, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import InstallPrompt from "@/components/InstallPrompt";

const CATEGORIES = [
  { id: "long-term",    label: "Long-term partner",       icon: Heart,     color: "text-pink-400",   bg: "bg-pink-500/10",   border: "border-pink-500/25"   },
  { id: "long-short",   label: "Long-term, open to short",icon: Search,    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/25"   },
  { id: "short-long",   label: "Short-term, open to long",icon: Coffee,    color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/25"  },
  { id: "short-term",   label: "Short-term fun",          icon: Zap,       color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/25" },
  { id: "friends",      label: "New friends",             icon: Users,     color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/25" },
  { id: "figuring",     label: "Still figuring it out",   icon: Sparkles,  color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/25" },
];

const FEATURED_CITIES = [
  { city: "Nairobi",  count: "2,400+ singles", emoji: "🏙️" },
  { city: "Mombasa",  count: "890+ singles",   emoji: "🌊" },
  { city: "Kisumu",   count: "560+ singles",   emoji: "🌅" },
  { city: "Nakuru",   count: "420+ singles",   emoji: "🦩" },
  { city: "Eldoret",  count: "310+ singles",   emoji: "🏃" },
  { city: "Thika",    count: "280+ singles",   emoji: "🌿" },
];

export default function ExplorePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white page-pb">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6 border-b border-white/10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Explore KenyaDates</h1>
          <p className="text-white/60 text-base mt-1">Discover matches by intent, location, and verified badges</p>
        </div>
        <InstallPrompt variant="button" />
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-10">

        {/* ── What are you looking for ── */}
        <section>
          <h2 className="text-xl font-extrabold text-white mb-5 flex items-center gap-2">
            <span>Relationship Goals</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => setSelected(selected === cat.id ? null : cat.id)}
                className={`rounded-3xl p-6 flex flex-col items-center justify-center text-center
                  border-2 transition-all active:scale-[0.98] ${cat.bg} ${cat.border} shadow-lg
                  ${selected === cat.id ? "ring-2 ring-[#E8336D] ring-offset-4 ring-offset-[#0D0D12] scale-105" : "hover:border-white/30"}
                `}
                style={{ minHeight: 150 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-3 flex-shrink-0 shadow-inner">
                  <cat.icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                <span className="text-white font-bold text-sm sm:text-base leading-snug w-full">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Featured Features Cards (No Text Overlap) ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-white mb-5">Special Features & Verification</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/verify"
              className="bg-[#14141F] border border-blue-500/30 rounded-3xl p-6 hover:bg-blue-500/10 transition-all no-underline flex flex-col justify-between shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg sm:text-xl leading-tight">Get Face Verified</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Selfie check gets you the verified blue badge + 50 free coins.</p>
              </div>
            </Link>

            <Link href="/discover"
              className="bg-[#14141F] border border-[#E8336D]/30 rounded-3xl p-6 hover:bg-[#E8336D]/10 transition-all no-underline flex flex-col justify-between shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8336D]/20 flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-7 h-7 text-[#E8336D]" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg sm:text-xl leading-tight">Near You Radar</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Discover active singles living within 10 km of your current location.</p>
              </div>
            </Link>

            <Link href="/wallet"
              className="bg-[#14141F] border border-yellow-500/30 rounded-3xl p-6 hover:bg-yellow-500/10 transition-all no-underline flex flex-col justify-between shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Star className="w-7 h-7 text-yellow-400" />
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-lg sm:text-xl leading-tight">Super Likes & Boost</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">Stand out at the top of recommendations — 3× higher match rate.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Browse by city ── */}
        <section>
          <h2 className="text-xl font-extrabold text-white mb-5">Browse Singles by City</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURED_CITIES.map(({ city, count, emoji }) => (
              <Link key={city} href="/discover"
                className="bg-[#14141F] hover:bg-[#1C1C2B] border border-white/10 rounded-3xl p-5
                  flex items-center gap-4 transition-all hover:border-[#E8336D]/40
                  active:scale-[0.98] no-underline shadow-lg group">
                <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">{emoji}</span>
                <div className="min-w-0">
                  <p className="font-extrabold text-white text-base sm:text-lg truncate">{city}</p>
                  <p className="text-white/50 text-xs sm:text-sm font-medium mt-0.5 truncate">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}


