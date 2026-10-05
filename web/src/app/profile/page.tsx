"use client";
import React, { useState, useEffect, useRef } from "react";
import { Settings, Pencil, Camera, ChevronRight, Shield, Crown, Search, MapPin, Briefcase, Ruler, Zap, LogOut, Heart, Check, X, Upload, Loader2, Smartphone, Download, FileDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import InstallPrompt from "@/components/InstallPrompt";
import { getProfileAvatar, CURATED_AVATARS } from "@/lib/avatar";

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
      .then(d => {
        if (d) {
          setProfile(d);
          setBio(d.profile?.bio ?? "Living life to the fullest in Nairobi! Coffee lover, tech enthusiast, and weekend explorer ☕️🌿");
          setInterests(d.profile?.interests?.length ? d.profile.interests : ["Travel ✈️", "Cooking 👨‍🍳", "Music 🎵", "Fitness 💪"]);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const toast$ = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const completion = () => {
    if (!profile?.profile) return 65;
    let s = 30;
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

  if (loading) return <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" /></div>;

  const p    = profile?.profile;
  const name = p?.displayName ?? user?.profile?.displayName ?? "Gry";
  const comp = completion();
  const coins= profile?.wallet?.balance ?? 150;

  const existingPhotos = (p?.photos || []).filter((ph: string) => ph && !ph.startsWith("solid:") && !ph.startsWith("gradient:"));
  const displayPhotos = Array.from({ length: 6 }).map((_, i) => existingPhotos[i] || getProfileAvatar(null, name, i));

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white page-pb">
      {toast && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-[#161622] border border-emerald-500/40 text-emerald-300 text-base font-bold shadow-2xl whitespace-nowrap">{toast}</div>}
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }} />

      {/* Top Header Bar */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6 flex flex-wrap items-center justify-between border-b border-white/10 mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">My Profile</h1>
          <p className="text-white/60 text-base mt-1">Manage your account, photos, and subscription</p>
        </div>
        <div className="flex items-center gap-3">
          <InstallPrompt variant="button" />
          {!fullyVerified && (
            <Link href="/verify" className="flex items-center gap-2 bg-blue-500/15 border border-blue-500/40 text-blue-400 text-sm font-extrabold px-5 py-2.5 rounded-full hover:bg-blue-500/25 transition-all no-underline shadow-md">
              <Shield className="w-4 h-4" /> Get Verified
            </Link>
          )}
          <Link href="/wallet" className="flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/40 px-4 py-2.5 rounded-full text-yellow-400 font-extrabold text-sm sm:text-base no-underline shadow-md">
            <span>🪙 {coins} Coins</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Mobile PWA/APK Installation Banner */}
        <InstallPrompt variant="banner" />

        {/* Responsive Desktop Layout: 2-Column Split View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Large Avatar Card, Completeness & Coins */}
          <div className="md:col-span-5 bg-[#14141F] border border-white/15 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
            <div className="relative mb-6">
              <svg className="absolute inset-0 w-[170px] h-[170px] -m-3.5 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#E8336D" strokeWidth="4" strokeDasharray="276" strokeDashoffset={276 - (276 * comp) / 100} strokeLinecap="round" />
              </svg>
              <div className="w-36 h-36 rounded-full border-4 border-[#14141F] shadow-2xl overflow-hidden bg-[#1E1E2E] relative">
                <img src={displayPhotos[0]} alt={name} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => photoRef.current?.click()} disabled={uploading}
                className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] border-2 border-[#14141F] flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              </button>
            </div>

            <h2 className="text-3xl font-black text-white flex items-center gap-2.5">
              {name}{p?.age ? `, ${p.age}` : ", 25"}
              {fullyVerified && <Shield className="w-6 h-6 text-blue-400 fill-blue-400/20" />}
            </h2>
            <p className="text-white/60 text-base flex items-center gap-2 mt-1 font-semibold"><MapPin className="w-4 h-4 text-[#E8336D]" />{p?.city ?? "Nairobi, Kenya"}</p>

            <div className="mt-6 w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex-1 mr-4">
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${comp}%`, background: "linear-gradient(to right, #E8336D, #FF6B9D)" }} />
                </div>
              </div>
              <span className="text-white/80 text-sm font-extrabold whitespace-nowrap">{comp}% complete</span>
            </div>

            {/* Upgrade banner */}
            <Link href="/wallet" className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between rounded-3xl p-6 border border-yellow-500/40 hover:border-yellow-500/70 transition-all no-underline gap-4 bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent shadow-xl">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center flex-shrink-0"><Crown className="w-6 h-6 text-yellow-400" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-black text-lg leading-tight truncate">Upgrade to Gold</p>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 truncate">See who likes you · Unlimited swipes</p>
                </div>
              </div>
              <span className="px-5 py-2.5 rounded-full text-sm font-black text-[#0D0D12] flex-shrink-0 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg">Upgrade</span>
            </Link>

            {/* Sign out */}
            <button onClick={logout}
              className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/30 text-red-400 text-base font-extrabold hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>

          {/* Right Column: About Me, Photos Grid, Interests & App Settings */}
          <div className="md:col-span-7 space-y-8">

            {/* About Me */}
            <div className="bg-[#14141F] border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-white">About Me</h3>
                <div className="flex gap-3">
                  {editBio ? (
                    <>
                      <button onClick={saveBio} disabled={savingBio} className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                        {savingBio ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
                      </button>
                      <button onClick={() => { setEditBio(false); setBio(p?.bio ?? ""); }} className="text-white/40 hover:text-white"><X size={16} /></button>
                    </>
                  ) : (
                    <button onClick={() => setEditBio(true)} className="flex items-center gap-1.5 text-[#E8336D] text-sm font-extrabold hover:underline"><Pencil size={15} /> Edit Bio</button>
                  )}
                </div>
              </div>
              {editBio ? (
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={200}
                  className="w-full bg-white/5 border border-[#E8336D]/60 rounded-2xl p-4 text-white text-base leading-relaxed resize-none outline-none focus:border-[#E8336D] transition-colors"
                  placeholder="Tell potential matches about yourself…" />
              ) : (
                <div className="bg-[#1C1C2A] border border-white/10 rounded-2xl p-5 min-h-[84px]">
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed font-normal">
                    {bio || <span className="text-white/40 italic">No bio yet — tap Edit to add one</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Photos 6-Grid */}
            <div className="bg-[#14141F] border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-extrabold text-white">My Photos</h3>
                <span className="text-white/60 text-sm font-bold">{existingPhotos.length}/6 Uploaded</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {displayPhotos.map((photo, i) => {
                  const isUploaded = i < existingPhotos.length;
                  return (
                    <div key={i} onClick={() => photoRef.current?.click()}
                      className="aspect-[3/4] rounded-2xl border border-white/15 overflow-hidden relative cursor-pointer group bg-[#1A1A26] shadow-xl hover:border-[#E8336D]/60 transition-all">
                      <img src={photo} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={`Photo ${i+1}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <span className="text-xs font-bold text-white bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
                          <Upload size={14} /> {isUploaded ? "Change" : "Upload"}
                        </span>
                      </div>
                      {i === 0 && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#E8336D] text-white font-black text-[10px] uppercase tracking-wider shadow-md">
                          Main Photo
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-[#14141F] border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-extrabold text-white">Interests & Hobbies</h3>
                <button onClick={() => setEditInt(e => !e)} className="flex items-center gap-1.5 text-[#E8336D] text-sm font-extrabold hover:underline"><Pencil size={15} /> {editInt ? "Done" : "Edit"}</button>
              </div>
              {editInt ? (
                <>
                  <div className="flex flex-wrap gap-2.5 mb-5">
                    {INTEREST_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => setInterests(p => p.includes(opt) ? p.filter(x => x !== opt) : p.length < 10 ? [...p, opt] : p)}
                        className="px-4 py-2.5 rounded-full text-sm font-bold border transition-all"
                        style={{ borderColor: interests.includes(opt) ? "#E8336D" : "rgba(255,255,255,0.15)", background: interests.includes(opt) ? "rgba(232,51,109,0.2)" : "rgba(255,255,255,0.04)", color: interests.includes(opt) ? "white" : "rgba(255,255,255,0.7)" }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button onClick={saveInt} className="w-full py-4 rounded-2xl text-base font-extrabold text-white bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] hover:opacity-95 transition-opacity shadow-lg">Save Interests</button>
                </>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {interests.map(item => (
                    <span key={item} className="bg-white/8 border border-white/15 rounded-full px-5 py-2.5 text-white/90 text-sm font-bold">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* App Settings List */}
            <div className="bg-[#14141F] border border-white/15 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-extrabold text-white mb-5">Settings & Verification</h3>
              <div className="bg-[#1A1A26] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/8">
                {[
                  { icon: Search,   label: "Discovery Preferences", href: "/explore" },
                  { icon: Zap,      label: "Profile Boost Options", href: "/wallet" },
                  { icon: Heart,    label: "Membership & Coins",    href: "/wallet" },
                  { icon: Shield,   label: "Verification Status",   href: "/verify" },
                ].map(item => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-colors no-underline">
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5 text-white/60 flex-shrink-0" />
                      <span className="text-white font-extrabold text-base sm:text-lg">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
