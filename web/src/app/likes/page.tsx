"use client";

import React, { useState } from "react";
import { Sparkles, Crown, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-28 md:pb-6">

      {/* ── Header ── */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <h1 className="text-2xl font-black mb-1">Likes</h1>
        <p className="text-white/50 text-sm">{MOCK_LIKES.length} people liked your profile</p>
      </div>

      {/* ── Tabs ── */}
      <div className="px-4 md:px-8 mb-4">
        <div className="flex gap-1 bg-white/5 rounded-full p-1 w-fit">
          {[
            { id: "recent", label: "Most Recent" },
            { id: "type", label: "Your Type" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? "bg-[#E8336D] text-white shadow"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {MOCK_LIKES.map(p => (
            <div key={p.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111118] border border-white/6 cursor-pointer group">
              {/* Solid colour background, blurred */}
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: p.colour }}>
                <span className="text-white font-black select-none" style={{ fontSize: 64, opacity: 0.2 }}>
                  {p.initial}
                </span>
              </div>
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-lg bg-black/25" />
              {/* Lock */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <Lock className="w-6 h-6 text-white/35" />
                <span className="text-white/35 text-[10px] font-medium">{p.city}</span>
              </div>
              {/* Hover */}
              <div className="absolute inset-0 bg-[#E8336D]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Upsell card ── */}
        <div
          className="mt-6 rounded-3xl p-6 text-center border border-yellow-400/20"
          style={{ background: "linear-gradient(135deg, rgba(245,197,66,0.1), rgba(201,162,39,0.05))" }}
        >
          <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-white font-black text-lg mb-1">See who liked you</h3>
          <p className="text-white/50 text-sm mb-5">
            Upgrade to <strong className="text-yellow-400">KenyaDates Gold</strong> to reveal all {MOCK_LIKES.length} profiles and message them directly.
          </p>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#0D0D0D] text-sm transition-all hover:scale-105 active:scale-95"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Gold
          </Link>
        </div>
      </div>
    </div>
  );
}
