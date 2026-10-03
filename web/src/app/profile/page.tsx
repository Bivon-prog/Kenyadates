"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings, Pencil, Camera, ChevronRight, Shield, Crown,
  Search, MapPin, Briefcase, Ruler, Zap, LogOut, Heart,
  Check, X, Upload, Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INTEREST_OPTIONS = [
  "Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚",
  "Dancing 💃","Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮",
  "Cooking 👨‍🍳","Nature 🌿","Photography 📸","Fashion 👗","Tech 💻","Business 📈",
];

export default function ProfilePage() {
  const { logout, user, token } = useAuth();

  const [profile, setProfile]         = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [editingBio, setEditingBio]   = useState(false);
  const [bio, setBio]                 = useState("");
  const [savingBio, setSavingBio]     = useState(false);
  const [editInterests, setEditInterests] = useState(false);
  const [interests, setInterests]     = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast]             = useState<string | null>(null);
  const photoRef                      = useRef<HTMLInputElement>(null);

  // Load real profile from backend
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setProfile(d);
          setBio(d.profile?.bio ?? "");
          setInterests(d.profile?.interests ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Calculate profile completion
  const calcCompletion = (p: any) => {
    if (!p?.profile) return 20;
    let score = 20;
    if (p.profile.bio)                   score += 15;
    if (p.profile.photos?.length > 0)    score += 25;
    if (p.profile.interests?.length > 0) score += 15;
    if (p.profile.occupation)            score += 10;
    if (p.verificationStatus === "VERIFIED") score += 15;
    return Math.min(100, score);
  };

  const saveBio = async () => {
    setSavingBio(true);
    const r = await fetch(`${API}/users/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ bio }),
    });
    if (r.ok) {
      setProfile((p: any) => ({ ...p, profile: { ...p.profile, bio } }));
      showToast("Bio saved ✓");
    }
    setSavingBio(false);
    setEditingBio(false);
  };

  const saveInterests = async () => {
    const r = await fetch(`${API}/users/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ interests }),
    });
    if (r.ok) {
      setProfile((p: any) => ({ ...p, profile: { ...p.profile, interests } }));
      showToast("Interests saved ✓");
    }
    setEditInterests(false);
  };

  const toggleInterest = (i: string) => {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 10 ? [...prev, i] : prev
    );
  };

  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch(`${API}/users/upload-photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (r.ok) {
      const { url } = await r.json();
      setProfile((p: any) => ({
        ...p,
        profile: { ...p.profile, photos: [...(p.profile?.photos ?? []), url] },
      }));
      showToast("Photo uploaded ✓");
    } else {
      showToast("Upload failed — try again");
    }
    setUploadingPhoto(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p    = profile?.profile;
  const name = p?.displayName ?? user?.profile?.displayName ?? "You";
  const completion = calcCompletion(profile);
  const isVerified = profile?.verificationStatus === "VERIFIED";
  const coins = profile?.wallet?.balance ?? 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24 md:pb-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl
          bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">
          {toast}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={photoRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }}
      />

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 md:px-8 pt-5 pb-2">
        <button className="flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        {!isVerified ? (
          <Link href="/verify" className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
            <Shield className="w-4 h-4" /> Get Verified
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 text-blue-400 text-sm font-semibold">
            <Shield className="w-4 h-4 fill-blue-400/30" /> Verified ✓
          </span>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 md:px-8">

        {/* ── Avatar + name ── */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="relative mb-1">
            {/* Completion ring */}
            <svg className="absolute inset-0 w-[132px] h-[132px] -m-2 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E8336D" strokeWidth="3.5"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * completion) / 100}
                strokeLinecap="round" />
            </svg>

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-4 border-[#0D0D0D] shadow-lg overflow-hidden relative"
              style={{ background: "linear-gradient(135deg,#E8336D,#6C63FF)" }}>
              {p?.photos?.[0] && !p.photos[0].startsWith("gradient:") ? (
                <img src={p.photos[0]} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white">
                  {name[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Upload button */}
            <button
              onClick={() => photoRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#E8336D] border-2
                border-[#0D0D0D] flex items-center justify-center hover:bg-[#FF6B9D]
                transition-colors shadow disabled:opacity-60"
            >
              {uploadingPhoto
                ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                : <Camera className="w-3.5 h-3.5 text-white" />
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold flex items-center justify-center gap-2">
              {name}{p?.age ? `, ${p.age}` : ""}
              {isVerified && <Shield className="w-4 h-4 text-blue-400 fill-blue-400/50" />}
            </h1>
            <p className="text-white/40 text-sm flex items-center justify-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{p?.city ?? "Kenya"}
            </p>
          </div>

          {/* Completion bar */}
          <div className="mt-3 flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%`, background: "var(--gradient-primary)" }} />
            </div>
            <span className="text-white/50 text-xs font-medium">{completion}% complete</span>
          </div>

          {/* Coins */}
          <div className="mt-2 flex items-center gap-1.5 text-yellow-400/80 text-xs font-medium">
            🪙 {coins.toLocaleString()} coins
          </div>
        </div>

        {/* ── Upgrade banner (only if not premium) ── */}
        <Link href="/wallet"
          className="flex items-center justify-between rounded-2xl p-4 mb-5 border border-yellow-500/25 hover:border-yellow-500/40 transition-all"
          style={{ background: "linear-gradient(135deg,rgba(245,197,66,0.10),rgba(201,162,39,0.04))" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Upgrade to Gold</p>
              <p className="text-white/45 text-xs">See who likes you · Unlimited swipes</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black text-[#0D0D0D]"
            style={{ background: "var(--gradient-gold)" }}>Upgrade</span>
        </Link>

        {/* ── Bio ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">About Me</h2>
            <div className="flex gap-2">
              {editingBio ? (
                <>
                  <button onClick={saveBio} disabled={savingBio}
                    className="flex items-center gap-1 text-green-400 text-xs font-semibold disabled:opacity-60">
                    {savingBio ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Save
                  </button>
                  <button onClick={() => { setEditingBio(false); setBio(p?.bio ?? ""); }}
                    className="text-white/30 text-xs font-semibold">
                    <X size={11} />
                  </button>
                </>
              ) : (
                <button onClick={() => setEditingBio(true)}
                  className="flex items-center gap-1 text-[#E8336D] text-xs font-semibold">
                  <Pencil size={11} /> Edit
                </button>
              )}
            </div>
          </div>
          {editingBio ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full bg-white/5 border border-[#E8336D]/40 rounded-xl p-3 text-white
                text-sm resize-none outline-none focus:border-[#E8336D] transition-colors"
              placeholder="Tell people about yourself…"
            />
          ) : (
            <p className="text-white/70 text-sm leading-relaxed bg-white/4 border border-white/8 rounded-xl p-3 min-h-[52px]">
              {p?.bio || <span className="text-white/25 italic">No bio yet — tap Edit to add one</span>}
            </p>
          )}
        </div>

        {/* ── Info pills ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            p?.city     && { icon: MapPin,   text: p.city },
            p?.occupation && { icon: Briefcase, text: p.occupation },
            p?.height   && { icon: Ruler,    text: `${p.height} cm` },
          ].filter(Boolean).map((t: any, i) => (
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
            <span className="text-white/30 text-xs">{p?.photos?.length ?? 0}/6</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => {
              const photo = p?.photos?.[i];
              return (
                <div key={i}
                  onClick={() => !photo && photoRef.current?.click()}
                  className="aspect-[3/4] rounded-xl border border-dashed flex items-center
                    justify-center cursor-pointer overflow-hidden relative transition-all
                    hover:border-[#E8336D]/50 hover:bg-[#E8336D]/5"
                  style={{
                    borderColor: !photo && i === 0 ? "rgba(232,51,109,0.5)" : "rgba(255,255,255,0.1)",
                    background:  !photo && i === 0 ? "rgba(232,51,109,0.04)" : "rgba(255,255,255,0.02)",
                  }}>
                  {photo ? (
                    <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={16} className={i === 0 ? "text-[#E8336D]" : "text-white/20"} />
                      {i === 0 && <span className="text-[9px] text-[#E8336D] font-bold">MAIN</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Interests ── */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">
              Interests {interests.length > 0 && `(${interests.length})`}
            </h2>
            <button onClick={() => setEditInterests(!editInterests)}
              className="flex items-center gap-1 text-[#E8336D] text-xs font-semibold">
              <Pencil size={11} /> {editInterests ? "Done" : "Edit"}
            </button>
          </div>

          {editInterests ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {INTEREST_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => toggleInterest(opt)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{
                      borderColor: interests.includes(opt) ? "#E8336D" : "rgba(255,255,255,0.1)",
                      background:  interests.includes(opt) ? "rgba(232,51,109,0.12)" : "rgba(255,255,255,0.03)",
                      color:       interests.includes(opt) ? "white" : "rgba(255,255,255,0.5)",
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={saveInterests}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-primary)" }}>
                Save Interests
              </button>
            </>
          ) : interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <span key={i} className="border border-white/15 rounded-full px-3 py-1.5 text-white/80 text-xs">{i}</span>
              ))}
            </div>
          ) : (
            <button onClick={() => setEditInterests(true)}
              className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/30 text-sm hover:border-[#E8336D]/30 hover:text-white/50 transition-all">
              + Add your interests
            </button>
          )}
        </div>

        {/* ── Settings ── */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Settings</h2>
          <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/6">
            {[
              { icon: Search, label: "Discovery Settings", href: "#" },
              { icon: Zap,    label: "Boost Profile",      href: "#" },
              { icon: Heart,  label: "Membership Plans",   href: "/wallet" },
              { icon: Shield, label: "Verification",       href: "/verify" },
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
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border
            border-red-500/25 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors mb-8">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
