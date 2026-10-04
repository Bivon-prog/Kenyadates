"use client";
import { useState } from "react";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";

const COLOURS = ["#C2185B","#1565C0","#4527A0","#00695C","#E65100"];
const CITIES  = ["Nairobi","Mombasa","Kisumu","Eldoret","Nakuru"];
const NAMES   = ["A","J","F","K","G","W","B","E","N"];

const LIKES = Array.from({ length: 9 }, (_, i) => ({
  id: i, colour: COLOURS[i % 5], city: CITIES[i % 5], initial: NAMES[i],
}));

export default function LikesPage() {
  const [tab, setTab] = useState("recent");

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white page-pb">

      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-black mb-1">Likes</h1>
        <p className="text-white/50 text-base">{LIKES.length} people liked your profile</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5">
        <div className="flex bg-[#111118] border border-white/8 rounded-2xl p-1.5 gap-1.5">
          {[["recent","Most Recent"],["type","Your Type"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 py-3.5 rounded-xl text-base font-bold transition-all"
              style={{ background: tab === id ? "#E8336D" : "transparent", color: tab === id ? "white" : "rgba(255,255,255,0.45)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {LIKES.map(p => (
            <div key={p.id} className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ aspectRatio: "3/4" }}>
              {/* Background */}
              <div className="absolute inset-0" style={{ backgroundColor: p.colour }} />
              {/* Big initial */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-black select-none" style={{ fontSize: 80, opacity: 0.15 }}>{p.initial}</span>
              </div>
              {/* Blur */}
              <div className="absolute inset-0 backdrop-blur-xl bg-black/35" />
              {/* Lock + city */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white/60" />
                </div>
                <span className="text-white/70 text-sm font-semibold text-center truncate w-full px-1">{p.city}</span>
              </div>
              {/* Hover */}
              <div className="absolute inset-0 bg-[#E8336D]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Upsell */}
        <div className="mt-6 rounded-3xl p-7 text-center border border-yellow-400/20 bg-[#111118]">
          <div className="w-16 h-16 rounded-full bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center mx-auto mb-5">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-white font-black text-xl mb-2">See who liked you</h3>
          <p className="text-white/55 text-base leading-relaxed mb-6">
            Upgrade to <strong className="text-yellow-400">KenyaDates Gold</strong> to reveal all {LIKES.length} profiles and message them directly.
          </p>
          <Link href="/wallet"
            className="flex items-center justify-center w-full py-4 rounded-2xl font-bold text-[#0D0D0D] text-base no-underline hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "var(--gradient-gold)" }}>
            Upgrade to Gold
          </Link>
        </div>
      </div>
    </div>
  );
}
