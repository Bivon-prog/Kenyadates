"use client";
import React, { useState, useEffect, useRef } from "react";
import { Settings, Pencil, Camera, ChevronRight, Shield, Crown, Search, MapPin, Briefcase, Ruler, Zap, LogOut, Heart, Check, X, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const INTEREST_OPTIONS = ["Travel ✈️","Music 🎵","Food 🍽️","Sports ⚽","Reading 📚","Dancing 💃","Movies 🎬","Fitness 💪","Art 🎨","Gaming 🎮","Cooking 👨‍🍳","Nature 🌿","Photography 📸","Fashion 👗","Tech 💻","Business 📈"];

export default function ProfilePage() {
  const { logout, user, token } = useAuth();
  const [profile,  setProfile]  = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [editBio,  setEditBio]  = useState(false);
  const [bio,      setBio]      = useState("");
  const [savingBio,setSavingBio]= useState(false);
  const [editInt,  setEditInt]  = useState(false);
  const [interests,setInterests]= useState<string[]>([]);
  const [uploading,setUploading]= useState(false);
  const [toast,    setToast]    = useState<string|null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setProfile(d); setBio(d.profile?.bio ?? ""); setInterests(d.profile?.interests ?? []); } })
      .finally(() => setLoading(false));
  }, [token]);

  const toast$ = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const completion = () => {
    if (!profile?.profile) return 20;
    let s = 20;
    if (profile.profile.bio)                      s += 15;
    if (profile.profile.photos?.length > 0)       s += 25;
    if (profile.profile.interests?.length > 0)    s += 15;
    if (profile.profile.occupation)               s += 10;
    if (profile.verificationStatus === "VERIFIED") s += 15;
    return Math.min(100, s);
  };

  const fullyVerified = profile?.emailVerified && profile?.phoneNumber && profile?.verificationStatus === "VERIFIED";

  const saveBio = async () => {
    setSavingBio(true);
    const r = await fetch(`${API}/users/profile`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ bio }) });
    if (r.ok) { setProfile((p: any) => ({ ...p, profile: { ...p.profile, bio } })); toast$("Bio saved ✓"); }
    setSavingBio(false); setEditBio(false);
  };

  const saveInt = async () => {
    const r = await fetch(`${API}/users/profile`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ interests }) });
    if (r.ok) { setProfile((p: any) => ({ ...p, profile: { ...p.profile, interests } })); toast$("Saved ✓"); }
    setEditInt(false);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch(`${API}/users/upload-photo`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (r.ok) {
      const { url } = await r.json();
      setProfile((p: any) => ({ ...p, profile: { ...p.profile, photos: [...(p.profile?.photos ?? []), url] } }));
      toast$("Photo uploaded ✓");
    } else toast$("Upload failed");
    setUploading(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" /></div>;

  const p    = profile?.profile;
  const name = p?.displayName ?? user?.profile?.displayName ?? "You";
  const comp = completion();
  const coins= profile?.wallet?.balance ?? 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white page-pb">
      {toast && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[#111118] border border-green-500/30 text-green-300 text-base shadow-xl whitespace-nowrap">{toast}</div>}
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <button className="flex items-center gap-2 text-white/60 text-base font-medium hover:text-white transition-colors"><Settings className="w-5 h-5" /> Settings</button>
        {!fullyVerified && (
          <Link href="/verify" className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-blue-500/15 transition-colors no-underline">
            <Shield className="w-4 h-4" /> Get Verified
          </Link>
        )}
      </div>

      <div className="max-w-xl mx-auto px-5">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <svg className="absolute inset-0 w-[140px] h-[140px] -m-2 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E8336D" strokeWidth="3" strokeDasharray="276" strokeDashoffset={276 - (276 * comp) / 100} strokeLinecap="round" />
            </svg>
            <div className="w-32 h-32 rounded-full border-4 border-[#0D0D0D] shadow-xl overflow-hidden bg-[#1E1E2E]">
              {p?.photos?.[0] && !p.photos[0].startsWith("gradient:") && !p.photos[0].startsWith("solid:") ? (
                <img src={p.photos[0]} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white">{name[0]?.toUpperCase()}</div>
              )}
            </div>
            <button onClick={() => photoRef.current?.click()} disabled={uploading}
              className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#E8336D] border-2 border-[#0D0D0D] flex items-center justify-center shadow-lg hover:bg-[#FF6B9D] transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            </button>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {name}{p?.age ? `, ${p.age}` : ""}
            {fullyVerified && <Shield className="w-5 h-5 text-blue-400 fill-blue-400/30" />}
          </h1>
          <p className="text-white/50 text-base flex items-center gap-1.5 mt-1"><MapPin className="w-4 h-4" />{p?.city ?? "Kenya"}</p>
          <div className="mt-4 flex items-center gap-3 bg-white/5 border border-white/8 rounded-full px-5 py-2.5">
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${comp}%`, background: "var(--gradient-primary)" }} /></div>
            <span className="text-white/55 text-sm font-medium">{comp}% complete</span>
          </div>
          <p className="mt-3 text-yellow-400/80 text-base font-semibold">🪙 {coins.toLocaleString()} coins</p>
        </div>

        {/* Upgrade banner */}
        <Link href="/wallet" className="flex items-center justify-between rounded-2xl p-5 mb-6 border border-yellow-500/20 hover:border-yellow-500/35 transition-all no-underline" style={{ background: "rgba(245,197,66,0.05)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0"><Crown className="w-6 h-6 text-yellow-400" /></div>
            <div>
              <p className="text-white font-bold text-base">Upgrade to Gold</p>
              <p className="text-white/45 text-sm mt-0.5">See who likes you · Unlimited swipes</p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-black text-[#0D0D0D] flex-shrink-0" style={{ background: "var(--gradient-gold)" }}>Upgrade</span>
        </Link>

        {/* About Me */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">About Me</h2>
            <div className="flex gap-3">
              {editBio ? (
                <>
                  <button onClick={saveBio} disabled={savingBio} className="flex items-center gap-1.5 text-green-400 text-sm font-semibold">
                    {savingBio ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
                  </button>
                  <button onClick={() => { setEditBio(false); setBio(p?.bio ?? ""); }} className="text-white/40"><X size={13} /></button>
                </>
              ) : (
                <button onClick={() => setEditBio(true)} className="flex items-center gap-1.5 text-[#E8336D] text-sm font-semibold"><Pencil size={13} /> Edit</button>
              )}
            </div>
          </div>
          {editBio ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={200}
              className="w-full bg-white/5 border border-[#E8336D]/40 rounded-2xl p-4 text-white text-base resize-none outline-none focus:border-[#E8336D] transition-colors"
              placeholder="Tell people about yourself…" />
          ) : (
            <div className="bg-[#111118] border border-white/8 rounded-2xl p-4 min-h-[72px]">
              <p className="text-white/70 text-base leading-relaxed">
                {p?.bio || <span className="text-white/30 italic">No bio yet — tap Edit to add one</span>}
              </p>
            </div>
          )}
        </div>

        {/* Info pills */}
        {(p?.city || p?.occupation || p?.height) && (
          <div className="flex flex-wrap gap-2.5 mb-6">
            {[p?.city&&{icon:MapPin,text:p.city}, p?.occupation&&{icon:Briefcase,text:p.occupation}, p?.height&&{icon:Ruler,text:`${p.height} cm`}].filter(Boolean).map((t: any, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#111118] border border-white/10 rounded-full px-4 py-2.5 text-base text-white/70">
                <t.icon className="w-4 h-4 text-white/40 flex-shrink-0" /><span>{t.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Photos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Photos</h2>
            <span className="text-white/40 text-sm">{p?.photos?.length ?? 0}/6</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => {
              const photo = p?.photos?.[i];
              const isReal = photo && !photo.startsWith("gradient:") && !photo.startsWith("solid:");
              return (
                <div key={i} onClick={() => !photo && photoRef.current?.click()}
                  className="aspect-[3/4] rounded-2xl border-2 border-dashed overflow-hidden relative cursor-pointer transition-all hover:border-[#E8336D]/50 bg-[#111118]"
                  style={{ borderColor: !photo && i === 0 ? "rgba(232,51,109,0.55)" : "rgba(255,255,255,0.1)" }}>
                  {isReal ? (
                    <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Upload size={22} className={i === 0 ? "text-[#E8336D]" : "text-white/20"} />
                      {i === 0 && <span className="text-xs text-[#E8336D] font-bold text-center px-1">MAIN PHOTO</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Interests {interests.length > 0 && `(${interests.length})`}</h2>
            <button onClick={() => setEditInt(e => !e)} className="flex items-center gap-1.5 text-[#E8336D] text-sm font-semibold"><Pencil size={13} /> {editInt ? "Done" : "Edit"}</button>
          </div>
          {editInt ? (
            <>
              <div className="flex flex-wrap gap-2.5 mb-4">
                {INTEREST_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => setInterests(p => p.includes(opt) ? p.filter(x => x !== opt) : p.length < 10 ? [...p, opt] : p)}
                    className="px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all"
                    style={{ borderColor: interests.includes(opt) ? "#E8336D" : "rgba(255,255,255,0.1)", background: interests.includes(opt) ? "rgba(232,51,109,0.12)" : "rgba(255,255,255,0.03)", color: interests.includes(opt) ? "white" : "rgba(255,255,255,0.5)" }}>
                    {opt}
                  </button>
                ))}
              </div>
              <button onClick={saveInt} className="w-full py-4 rounded-2xl text-base font-bold text-white hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-primary)" }}>Save Interests</button>
            </>
          ) : interests.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {interests.map(i => <span key={i} className="border border-white/15 rounded-full px-4 py-2 text-white/80 text-sm">{i}</span>)}
            </div>
          ) : (
            <button onClick={() => setEditInt(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-white/40 text-base hover:border-[#E8336D]/30 transition-all">+ Add your interests</button>
          )}
        </div>

        {/* Settings */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-white mb-4">Settings</h2>
          <div className="bg-[#111118] border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/6">
            {[
              { icon: Search,   label: "Discovery Settings", href: "#" },
              { icon: Zap,      label: "Boost Profile",      href: "#" },
              { icon: Heart,    label: "Membership Plans",   href: "/wallet" },
              { icon: Shield,   label: "Verification",       href: "/verify" },
              { icon: Settings, label: "Account Settings",   href: "#" },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center justify-between px-5 py-5 hover:bg-white/4 transition-colors no-underline">
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-white/45 flex-shrink-0" />
                  <span className="text-white/85 text-base font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/25" />
              </Link>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-red-500/25 text-red-400 text-base font-semibold hover:bg-red-500/8 transition-colors mb-4">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}
