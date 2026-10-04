"use client";

import React, { useState } from "react";
import { Sparkles, Coffee, Heart, Zap, Users, Search, Shield, MapPin, Star } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "long-term",    label: "Long-term partner",       icon: Heart,     color: "text-pink-400",   bg: "bg-pink-400/12",   border: "border-pink-400/20"   },
  { id: "long-short",   label: "Long-term, open to short",icon: Search,    color: "text-blue-400",   bg: "bg-blue-400/12",   border: "border-blue-400/20"   },
  { id: "short-long",   label: "Short-term, open to long",icon: Coffee,    color: "text-amber-400",  bg: "bg-amber-400/12",  border: "border-amber-400/20"  },
  { id: "short-term",   label: "Short-term fun",          icon: Zap,       color: "text-yellow-400", bg: "bg-yellow-400/12", border: "border-yellow-400/20" },
  { id: "friends",      label: "New friends",             icon: Users,     color: "text-green-400",  bg: "bg-green-400/12",  border: "border-green-400/20"  },
  { id: "figuring",     label: "Still figuring it out",   icon: Sparkles,  color: "text-purple-400", bg: "bg-purple-400/12", border: "border-purple-400/20" },
];

const FEATURED_CITIES = [
  { city: "Nairobi",  count: "2,400+", emoji: "🏙️" },
  { city: "Mombasa",  count: "890+",   emoji: "🌊" },
  { city: "Kisumu",   count: "560+",   emoji: "🌅" },
  { city: "Nakuru",   count: "420+",   emoji: "🦩" },
  { city: "Eldoret",  count: "310+",   emoji: "🏃" },
  { city: "Thika",    count: "280+",   emoji: "🌿" },
];

export default function ExplorePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white page-pb">

      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <h1 className="text-2xl font-black mb-1">Explore</h1>
        <p className="text-white/50 text-base">Find exactly what you&apos;re looking for</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 space-y-8">

        {/* ── What are you looking for ── */}
        <section>
          <h2 className="text-base font-bold text-white/60 mb-4">I&apos;m looking for</h2>
          {/* Change 6: bigger cards, text centred and fitted, no overflow */}
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                onClick={() => setSelected(selected === cat.id ? null : cat.id)}
                className={`rounded-2xl flex flex-col items-center justify-center text-center
                  border-2 transition-all active:scale-[0.97] ${cat.bg} ${cat.border}
                  ${selected === cat.id ? "ring-2 ring-[#E8336D] ring-offset-2 ring-offset-[#0D0D0D]" : ""}
                `}
                style={{ padding: "24px 16px", minHeight: 140 }}
              >
                {/* Icon in a proper sized circle */}
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3 flex-shrink-0">
                  <cat.icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                {/* Text — wraps naturally, always inside card */}
                <span className="text-white font-semibold text-sm leading-snug w-full">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Browse by city ── */}
        <section>
          <h2 className="text-base font-bold text-white/60 mb-4">Browse by city</h2>
          {/* Change 7: larger rows, bigger text */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURED_CITIES.map(({ city, count, emoji }) => (
              <button key={city}
                className="bg-white/4 hover:bg-white/8 border border-white/8 rounded-2xl
                  flex items-center gap-4 transition-all hover:border-[#E8336D]/30
                  active:scale-[0.98] text-left"
                style={{ padding: "16px" }}>
                <span className="text-3xl flex-shrink-0">{emoji}</span>
                <div className="min-w-0">
                  <p className="font-bold text-white text-base truncate">{city}</p>
                  <p className="text-white/40 text-sm flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{count} members</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="space-y-3 pb-4">
          <h2 className="text-base font-bold text-white/60 mb-4">Features</h2>

          {/* Change 8: bigger containers, larger text and icons */}
          <Link href="/verify"
            className="flex items-center gap-5 bg-blue-500/8 border border-blue-500/20
              rounded-2xl hover:bg-blue-500/12 transition-colors no-underline"
            style={{ padding: "20px" }}>
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Get Verified</h3>
              <p className="text-white/50 text-sm mt-0.5">Earn your verified badge + 50 free coins</p>
            </div>
          </Link>

          <button
            className="w-full flex items-center gap-5 bg-[#E8336D]/8 border border-[#E8336D]/20
              rounded-2xl hover:bg-[#E8336D]/12 transition-colors text-left"
            style={{ padding: "20px" }}>
            <div className="w-14 h-14 rounded-2xl bg-[#E8336D]/15 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-[#E8336D]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Near You</h3>
              <p className="text-white/50 text-sm mt-0.5">See people within 10 km of you</p>
            </div>
          </button>

          <button
            className="w-full flex items-center gap-5 bg-yellow-500/8 border border-yellow-500/20
              rounded-2xl hover:bg-yellow-500/12 transition-colors text-left"
            style={{ padding: "20px" }}>
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
              <Star className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Super Likes</h3>
              <p className="text-white/50 text-sm mt-0.5">Stand out — 3× more likely to match</p>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
}

