"use client";

import React, { useState } from "react";
import { Settings, Pencil, Camera, ChevronRight, Shield, Crown, Search, MapPin, Briefcase, Ruler, Zap, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const INTERESTS = ["Travel", "Coffee", "Gym", "Music", "Photography"];

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("Looking for something real.");

  const profile = {
    name: user?.profile?.displayName ?? "You",
    age: user?.profile?.age ?? 28,
    completion: 65,
    city: user?.profile?.city ?? "Nairobi",
    gradient: "from-blue-500 to-indigo-600",
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24 md:pb-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 md:px-8 pt-5 pb-2">
        <button className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <Link href="/verify" className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
          <Shield className="w-4 h-4" />
          Get Verified
        </Link>
      </div>

      <div className="max-w-xl mx-auto px-4 md:px-8">

        {/* ── Avatar ── */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="relative mb-1">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-[132px] h-[132px] -m-2 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
              <circle
                cx="50" cy="50" r="44" fill="none" stroke="#E8336D" strokeWidth="3.5"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * profile.completion) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${profile.gradient} border-4 border-[#0D0D0D] flex items-center justify-center shadow-lg relative`}>
              <span className="text-4xl font-bold text-white">{profile.name[0]?.toUpperCase()}</span>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E8336D] border-2 border-[#0D0D0D] flex items-center justify-center hover:bg-[#FF6B9D] transition-colors shadow">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold flex items-center justify-center gap-2">
              {profile.name}, {profile.age}
              <Shield className="w-4 h-4 text-blue-400 fill-blue-400/50" />
            </h1>
            <p className="text-white/40 text-sm flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{profile.city}
            </p>
          </div>
          {/* Completion */}
          <div className="mt-3 flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${profile.completion}%`, background: "var(--gradient-primary)" }} />
            </div>
            <span className="text-white/50 text-xs font-medium">{profile.completion}% complete</span>
            <button className="text-[#E8336D] text-xs font-semibold">Finish →</button>
          </div>
        </div>

        {/* ── Upgrade banner ── */}
        <Link href="/wallet"
          className="flex items-center justify-between rounded-2xl p-4 mb-5 border border-yellow-500/25 hover:border-yellow-500/40 transition-all"
          style={{ background: "linear-gradient(135deg, rgba(245,197,66,0.10), rgba(201,162,39,0.04))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Upgrade to Gold</p>
              <p className="text-white/45 text-xs">See who likes you · Unlimited swipes</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black text-[#0D0D0D]" style={{ background: "var(--gradient-gold)" }}>Upgrade</span>
        </Link>

        {/* ── Bio ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">About Me</h2>
            <button onClick={() => setEditingBio(!editingBio)} className="text-[#E8336D] text-xs font-semibold">
              {editingBio ? "Save" : "Edit"}
            </button>
          </div>
          {editingBio ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-[#E8336D]/40 rounded-xl p-3 text-white text-sm resize-none outline-none focus:border-[#E8336D] transition-colors"
            />
          ) : (
            <p className="text-white/70 text-sm leading-relaxed bg-white/4 border border-white/8 rounded-xl p-3">{bio}</p>
          )}
        </div>

        {/* ── Info pills ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { icon: MapPin, text: `${profile.city}` },
            { icon: Briefcase, text: "Software Engineer" },
            { icon: Ruler, text: "180 cm" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-sm text-white/70">
              <t.icon className="w-3.5 h-3.5 text-white/40" />
              {t.text}
            </div>
          ))}
        </div>

        {/* ── Photos ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Photos</h2>
            <span className="text-white/30 text-xs">1/6</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}
                className="aspect-[3/4] rounded-xl border border-dashed flex items-center justify-center cursor-pointer hover:border-[#E8336D]/50 hover:bg-[#E8336D]/5 transition-all"
                style={{ borderColor: i === 0 ? "rgba(232,51,109,0.5)" : "rgba(255,255,255,0.1)", background: i === 0 ? "rgba(232,51,109,0.05)" : "rgba(255,255,255,0.02)" }}
              >
                {i === 0 ? (
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${profile.gradient} opacity-80`} />
                ) : (
                  <span className="text-white/20 text-2xl font-light">+</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Interests ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Interests</h2>
            <button className="text-[#E8336D] text-xs font-semibold">+ Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <span key={i} className="border border-white/15 rounded-full px-3 py-1.5 text-white/80 text-sm">{i}</span>
            ))}
          </div>
        </div>

        {/* ── Prompts ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Prompts</h2>
            <button className="text-[#E8336D] text-xs font-semibold">+ Add</button>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-xl p-4">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">A shower thought I recently had…</p>
            <p className="text-white font-medium text-sm leading-relaxed">Why do we say &apos;slept like a baby&apos; when babies wake up every 2 hours?</p>
          </div>
        </div>

        {/* ── Settings list ── */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Settings</h2>
          <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/6">
            {[
              { icon: Search, label: "Discovery Settings", href: "#" },
              { icon: Zap, label: "Boost Settings", href: "#" },
              { icon: Heart, label: "Membership Plans", href: "/wallet" },
              { icon: Settings, label: "Account Settings", href: "#" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-white/40" />
                  <span className="text-white/80 text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/25" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Logout ── */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/25 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors mb-8"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
