"use client";

import React, { useState } from "react";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

const SOLID_COLOURS = ["#C2185B", "#1565C0", "#4527A0", "#00695C", "#E65100"];

const MOCK_LIKES = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  colour: SOLID_COLOURS[i % 5],
  city: ["Nairobi", "Mombasa", "Kisumu", "Eldoret", "Nakuru"][i % 5],
  initial: ["A", "J", "F", "K", "G", "W", "B", "E", "N"][i],
}));

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState("recent");

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-36 md:pb-12">

      {/* ── Header ── */}
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-black mb-1">Likes</h1>
        <p className="text-white/50 text-base">{MOCK_LIKES.length} people liked your profile</p>
      </div>

      {/* ── Tabs — text fits inside, no overflow ── */}
      <div className="px-5 mb-5">
        <div className="flex bg-white/6 border border-white/8 rounded-2xl p-1.5 gap-1.5">
          {[
            { id: "recent", label: "Most Recent" },
            { id: "type",   label: "Your Type"   },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id
                  ? "bg-[#E8336D] text-white"
                  : "text-white/50 hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid — bigger cards with city text centred inside ── */}
      <div className="px-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {MOCK_LIKES.map(p => (
            <div key={p.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ aspectRatio: "3/4" }}>
              {/* Solid colour background */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: p.colour }}>
                <span className="text-white font-black select-none" style={{ fontSize: 72, opacity: 0.18 }}>
                  {p.initial}
                </span>
              </div>
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-lg bg-black/30" />
              {/* Lock + city — centred and fitted */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2">
                <Lock className="w-7 h-7 text-white/50" />
                <span className="text-white/60 text-xs font-semibold text-center w-full truncate px-1">
                  {p.city}
                </span>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#E8336D]/15 opacity-0 group-hover:opacity-100
                transition-opacity flex items-center justify-center">
                <Crown className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Upsell card — crown fits, text visible ── */}
        <div className="mt-6 rounded-3xl p-6 text-center border border-yellow-400/20"
          style={{ background: "rgba(245,197,66,0.06)" }}>
          {/* Crown in a proper fixed-size container */}
          <div className="w-16 h-16 rounded-full bg-yellow-500/15 border border-yellow-500/25
            flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-white font-black text-xl mb-2">See who liked you</h3>
          <p className="text-white/55 text-base leading-relaxed mb-6">
            Upgrade to <strong className="text-yellow-400">KenyaDates Gold</strong> to reveal
            all {MOCK_LIKES.length} profiles and message them directly.
          </p>
          <Link href="/wallet"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
              font-bold text-[#0D0D0D] text-base transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--gradient-gold)" }}>
            Upgrade to Gold
          </Link>
        </div>
      </div>
    </div>
  );
}
