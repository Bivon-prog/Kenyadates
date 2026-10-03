"use client";

import React, { useState } from "react";
import { Sparkles, Coffee, Heart, Zap, Users, Search, Shield, MapPin, Star } from "lucide-react";

const CATEGORIES = [
  { id: "long-term", label: "Long-term partner", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/15", border: "border-pink-400/20" },
  { id: "long-to-short", label: "Long-term, open to short", icon: Search, color: "text-blue-400", bg: "bg-blue-400/15", border: "border-blue-400/20" },
  { id: "short-to-long", label: "Short-term, open to long", icon: Coffee, color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/20" },
  { id: "short-term", label: "Short-term fun", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/15", border: "border-yellow-400/20" },
  { id: "friends", label: "New friends", icon: Users, color: "text-green-400", bg: "bg-green-400/15", border: "border-green-400/20" },
  { id: "figuring", label: "Still figuring it out", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/15", border: "border-purple-400/20" },
];

const FEATURED_CITIES = [
  { city: "Nairobi", count: "2,400+", emoji: "🏙️" },
  { city: "Mombasa", count: "890+", emoji: "🌊" },
  { city: "Kisumu", count: "560+", emoji: "🌅" },
  { city: "Nakuru", count: "420+", emoji: "🦩" },
  { city: "Eldoret", count: "310+", emoji: "🏃" },
  { city: "Thika", count: "280+", emoji: "🌿" },
];

export default function ExplorePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24 md:pb-6">

      {/* ── Header ── */}
      <div className="px-4 md:px-8 pt-6 pb-4">
        <h1 className="text-2xl font-black mb-1">Explore</h1>
        <p className="text-white/50 text-sm">Find exactly what you&apos;re looking for</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 space-y-8">

        {/* ── What are you looking for ── */}
        <section>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">I&apos;m looking for</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelected(selected === cat.id ? null : cat.id)}
                className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center border transition-all hover:scale-[1.02] active:scale-[0.98] aspect-square ${cat.bg} ${cat.border} ${
                  selected === cat.id ? "ring-2 ring-[#E8336D] ring-offset-1 ring-offset-[#0D0D0D]" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <span className="text-white font-semibold text-xs leading-snug">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Browse by city ── */}
        <section>
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">
            Browse by city
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURED_CITIES.map(({ city, count, emoji }) => (
              <button
                key={city}
                className="bg-white/4 hover:bg-white/8 border border-white/8 rounded-2xl p-4 flex items-center gap-3 transition-all hover:border-[#E8336D]/30 text-left active:scale-[0.98]"
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{city}</p>
                  <p className="text-white/40 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" /> {count} members
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Quick feature promos ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Features</h2>

          {/* Get verified */}
          <div className="flex items-center gap-4 bg-blue-500/8 border border-blue-500/20 rounded-2xl p-4 cursor-pointer hover:bg-blue-500/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Get Verified</h3>
              <p className="text-white/50 text-sm">Earn your verified badge + 50 free coins</p>
            </div>
          </div>

          {/* Near you */}
          <div className="flex items-center gap-4 bg-[#E8336D]/8 border border-[#E8336D]/20 rounded-2xl p-4 cursor-pointer hover:bg-[#E8336D]/12 transition-colors">
            <div className="w-12 h-12 rounded-full bg-[#E8336D]/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-[#E8336D]" />
            </div>
            <div>
              <h3 className="text-white font-bold">Near You</h3>
              <p className="text-white/50 text-sm">See people within 10 km of you</p>
            </div>
          </div>

          {/* Super likes */}
          <div className="flex items-center gap-4 bg-yellow-500/8 border border-yellow-500/20 rounded-2xl p-4 cursor-pointer hover:bg-yellow-500/12 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400/50" />
            </div>
            <div>
              <h3 className="text-white font-bold">Super Likes</h3>
              <p className="text-white/50 text-sm">Stand out — 3× more likely to match</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
