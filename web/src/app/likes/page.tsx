"use client";
import { useState } from "react";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";
import { CURATED_AVATARS } from "@/lib/avatar";

const CITIES = ["Nairobi", "Mombasa", "Kisumu", "Eldoret", "Nakuru", "Thika", "Nyeri", "Malindi", "Naivasha"];

const LIKES = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  photo: CURATED_AVATARS[i % CURATED_AVATARS.length],
  city: CITIES[i % CITIES.length],
}));

export default function LikesPage() {
  const [tab, setTab] = useState("recent");

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white page-pb">

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">Who Liked You</h1>
        <p className="text-white/60 text-base">{LIKES.length} singles liked your profile in Kenya</p>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <div className="flex bg-[#14141F] border border-white/10 rounded-2xl p-1.5 gap-2">
          {[["recent", "Most Recent"], ["type", "Your Type"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 py-3 rounded-xl text-sm sm:text-base font-extrabold transition-all"
              style={{
                background: tab === id ? "gradient-to-r from-[#E8336D] to-[#FF6B9D]" : "transparent",
                color: tab === id ? "white" : "rgba(255,255,255,0.5)",
                backgroundColor: tab === id ? "#E8336D" : "transparent"
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {LIKES.map(p => (
            <div
              key={p.id}
              className="relative rounded-3xl overflow-hidden cursor-pointer group bg-[#14141F] border border-white/10 shadow-xl"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Blurred Photo */}
              <img src={p.photo} className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-75 group-hover:scale-125 transition-transform duration-500" alt="" />
              <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

              {/* Lock + city */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 z-10">
                <div className="w-12 h-12 rounded-full bg-black/60 border border-yellow-500/40 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-white font-extrabold text-sm sm:text-base text-center truncate w-full px-1">{p.city}</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#E8336D]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Banner — Pinned cleanly with safe padding above bottom nav */}
        <div className="mt-10 mb-8 rounded-3xl p-8 text-center border border-yellow-500/40 bg-gradient-to-b from-[#14141F] to-[#1A1A2E] backdrop-blur-xl shadow-2xl max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-white font-black text-2xl mb-2">See who liked you</h3>
          <p className="text-white/70 text-base leading-relaxed mb-6 max-w-md mx-auto">
            Upgrade to <strong className="text-yellow-400 font-black">KenyaDates Gold</strong> to reveal all {LIKES.length} profiles and message them instantly.
          </p>
          <Link
            href="/wallet"
            className="flex items-center justify-center w-full py-4 rounded-2xl font-black text-[#0D0D0D] text-lg no-underline hover:opacity-95 active:scale-95 transition-all shadow-xl"
            style={{ background: "var(--gradient-gold)" }}
          >
            Upgrade to Gold
          </Link>
        </div>
      </div>
    </div>
  );
}
