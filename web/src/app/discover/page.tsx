"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, X, Star, MapPin, Shield, Zap, RotateCcw, Sparkles, SlidersHorizontal, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getProfileAvatar } from "@/lib/avatar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Profile {
  id: string;
  userId: string;
  displayName: string;
  age: number;
  city: string;
  bio?: string;
  photos: string[];
  interests: string[];
  user: { verificationStatus: string };
}

const SWIPE_THRESHOLD = 90;

const MOCK_PROFILES: Profile[] = [
  { id: "1", userId: "u1", displayName: "Amina", age: 24, city: "Nairobi", bio: "Love dancing, coffee, and travelling. Looking for something genuine.", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"], interests: ["Travel", "Music", "Food"], user: { verificationStatus: "VERIFIED" } },
  { id: "2", userId: "u2", displayName: "Wanjiru", age: 26, city: "Mombasa", bio: "Beach lover, foodie and tech entrepreneur.", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"], interests: ["Beach", "Business", "Cooking"], user: { verificationStatus: "VERIFIED" } },
  { id: "3", userId: "u3", displayName: "Fatuma", age: 23, city: "Kisumu", bio: "Architectural designer. Coffee addict ☕", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"], interests: ["Dancing", "Education", "Art"], user: { verificationStatus: "UNVERIFIED" } },
  { id: "4", userId: "u4", displayName: "Kemunto", age: 28, city: "Eldoret", bio: "Runner. Fitness coach. Dog lover 🐕", photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"], interests: ["Fitness", "Health", "Pets"], user: { verificationStatus: "VERIFIED" } },
  { id: "5", userId: "u5", displayName: "Njeri", age: 25, city: "Nakuru", bio: "Passionate about nature, wildlife and outdoor hiking.", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"], interests: ["Nature", "Photography", "Hiking"], user: { verificationStatus: "VERIFIED" } },
];

const TABS = [
  { id: "foryou",  label: "For You" },
  { id: "nearby",  label: "Nearby" },
  { id: "new",     label: "New Singles" },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles]       = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [showMatch, setShowMatch]     = useState<Profile | null>(null);
  const [swipeDir, setSwipeDir]       = useState<"left" | "right" | null>(null);
  const [activeTab, setActiveTab]     = useState("foryou");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cardOffset, setCardOffset]   = useState(0);
  const [isDragging, setIsDragging]   = useState(false);

  const startX = useRef(0);
  const dragX  = useRef(0);

  useEffect(() => {
    loadProfiles();
    try { const u = JSON.parse(localStorage.getItem("kd_user") ?? "{}"); setCurrentUser(u); } catch {}
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/discovery/recommendations`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setProfiles(data.length ? data : MOCK_PROFILES); }
      else setProfiles(MOCK_PROFILES);
    } catch { setProfiles(MOCK_PROFILES); }
    setCurrentIndex(0);
    setLoading(false);
  };

  const sendAction = async (toUserId: string, isSuper: boolean) => {
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/discovery/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId, isSuper }),
      });
      if (res.ok) return (await res.json()).isMatch;
    } catch {}
    return false;
  };

  const handleSwipe = useCallback(async (dir: "left" | "right" | "super") => {
    const profile = profiles[currentIndex];
    if (!profile) return;
    setSwipeDir(dir === "super" ? "right" : dir);
    setTimeout(async () => {
      if (dir !== "left") {
        const isMatch = await sendAction(profile.userId, dir === "super");
        if (isMatch) setShowMatch(profile);
      }
      setCurrentIndex(i => i + 1);
      setSwipeDir(null);
      setCardOffset(0);
    }, 300);
  }, [profiles, currentIndex]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft"  || e.key.toLowerCase() === "a") handleSwipe("left");
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") handleSwipe("right");
      else if (e.key === "ArrowUp"   || e.key.toLowerCase() === "w") handleSwipe("super");
      else if (e.key.toLowerCase() === "r") setCurrentIndex(i => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleSwipe]);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; setIsDragging(true); };
  const onTouchMove  = (e: React.TouchEvent) => { if (!isDragging) return; dragX.current = e.touches[0].clientX - startX.current; setCardOffset(dragX.current); };
  const onTouchEnd   = () => { setIsDragging(false); if (dragX.current > SWIPE_THRESHOLD) handleSwipe("right"); else if (dragX.current < -SWIPE_THRESHOLD) handleSwipe("left"); else setCardOffset(0); dragX.current = 0; };
  const onMouseDown  = (e: React.MouseEvent) => { startX.current = e.clientX; setIsDragging(true); };
  const onMouseMove  = (e: React.MouseEvent) => { if (!isDragging) return; dragX.current = e.clientX - startX.current; setCardOffset(dragX.current); };
  const onMouseUp    = () => { setIsDragging(false); if (dragX.current > SWIPE_THRESHOLD) handleSwipe("right"); else if (dragX.current < -SWIPE_THRESHOLD) handleSwipe("left"); else setCardOffset(0); dragX.current = 0; };

  const currentProfile = profiles[currentIndex];
  const nextProfile    = profiles[currentIndex + 1];
  const rotation       = (cardOffset / 300) * 12;
  const likeOpacity    = Math.min(1, cardOffset / 80);
  const passOpacity    = Math.min(1, -cardOffset / 80);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-semibold text-base">Finding verified singles near you…</p>
        </div>
      </div>
    );
  }

  /* ─────────────── Shared card JSX ─────────────── */
  const SwipeCard = ({ mobile }: { mobile: boolean }) => (
    <div
      className={`${mobile ? "absolute inset-0" : "absolute inset-0"} rounded-3xl overflow-hidden shadow-2xl select-none border border-white/15 bg-[#14141F]`}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: 2,
        transform: `translateX(${swipeDir === "left" ? -600 : swipeDir === "right" ? 600 : cardOffset}px) rotate(${rotation}deg)`,
        transition: swipeDir ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" : isDragging ? "none" : "transform 0.3s ease",
      }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}   onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
    >
      <img src={getProfileAvatar(currentProfile!.photos[0], currentProfile!.displayName, currentIndex)} className="w-full h-full object-cover" draggable={false} alt={currentProfile!.displayName} />
      <div className="absolute top-8 left-8 border-[4px] border-emerald-400 rounded-2xl px-5 py-2 -rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: likeOpacity }}>
        <span className="text-emerald-400 font-black text-2xl tracking-wider">LIKE</span>
      </div>
      <div className="absolute top-8 right-8 border-[4px] border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: passOpacity }}>
        <span className="text-red-500 font-black text-2xl tracking-wider">NOPE</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 pt-20">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-3xl font-black text-white tracking-tight">{currentProfile!.displayName}, {currentProfile!.age}</h2>
          {currentProfile!.user.verificationStatus === "VERIFIED" && <Shield className="w-6 h-6 text-blue-400 fill-blue-400/20 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 text-white/80 text-sm font-semibold mb-2">
          <MapPin className="w-4 h-4 text-[#E8336D]" /><span>{currentProfile!.city}</span>
        </div>
        {currentProfile!.bio && <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-3">{currentProfile!.bio}</p>}
        <div className="flex flex-wrap gap-2">
          {currentProfile!.interests.slice(0, 3).map(i => (
            <span key={i} className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">{i}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const ActionButtons = () => (
    <div className="flex items-center justify-center gap-5">
      <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-white/15 flex items-center justify-center active:scale-95 shadow-xl">
        <RotateCcw className="w-5 h-5 text-yellow-400" />
      </button>
      <button onClick={() => handleSwipe("left")} className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-red-500/50 flex items-center justify-center active:scale-95 shadow-2xl">
        <X className="w-8 h-8 text-red-500" strokeWidth={3} />
      </button>
      <button onClick={() => handleSwipe("super")} className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-blue-400/50 flex items-center justify-center active:scale-95 shadow-xl">
        <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
      </button>
      <button onClick={() => handleSwipe("right")} className="w-16 h-16 rounded-full border flex items-center justify-center active:scale-95 shadow-2xl" style={{ background: "rgba(232,51,109,0.15)", borderColor: "rgba(232,51,109,0.6)" }}>
        <Heart className="w-8 h-8 text-[#E8336D] fill-[#E8336D]" />
      </button>
      <button className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-purple-400/50 flex items-center justify-center active:scale-95 shadow-xl">
        <Zap className="w-6 h-6 text-purple-400 fill-purple-400/30" />
      </button>
    </div>
  );

  return (
    <div className="bg-[#0D0D12] text-white" style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* ═══════════ MOBILE LAYOUT ═══════════ */}
      {/* pb-[72px] accounts for the fixed bottom nav height */}
      <div className="flex flex-col h-full lg:hidden" style={{ paddingBottom: 72 }}>

        {/* Tabs — large, full-width */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3">
          <div className="flex bg-[#14141F] border border-white/10 rounded-2xl p-1.5 gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-3.5 rounded-xl text-[15px] font-extrabold transition-all ${
                  activeTab === t.id
                    ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white shadow-md"
                    : "text-white/45"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card — fills all space between tabs and buttons */}
        <div className="flex-1 px-4 relative min-h-0">
          {nextProfile && (
            <div className="absolute inset-x-4 inset-y-0 rounded-3xl overflow-hidden scale-[0.95] opacity-50 origin-bottom bg-[#14141F] border border-white/10" style={{ zIndex: 1 }}>
              <img src={getProfileAvatar(nextProfile.photos[0], nextProfile.displayName, currentIndex + 1)} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            </div>
          )}
          {currentProfile ? (
            <div
              className="absolute inset-x-4 inset-y-0 rounded-3xl overflow-hidden shadow-2xl select-none border border-white/15 bg-[#14141F]"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 2,
                transform: `translateX(${swipeDir === "left" ? -600 : swipeDir === "right" ? 600 : cardOffset}px) rotate(${rotation}deg)`,
                transition: swipeDir ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" : isDragging ? "none" : "transform 0.3s ease",
              }}
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
            >
              <img src={getProfileAvatar(currentProfile.photos[0], currentProfile.displayName, currentIndex)} className="w-full h-full object-cover" draggable={false} alt={currentProfile.displayName} />
              <div className="absolute top-8 left-8 border-[4px] border-emerald-400 rounded-2xl px-5 py-2 -rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: likeOpacity }}>
                <span className="text-emerald-400 font-black text-2xl tracking-wider">LIKE</span>
              </div>
              <div className="absolute top-8 right-8 border-[4px] border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: passOpacity }}>
                <span className="text-red-500 font-black text-2xl tracking-wider">NOPE</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 pt-20">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-black text-white tracking-tight">{currentProfile.displayName}, {currentProfile.age}</h2>
                  {currentProfile.user.verificationStatus === "VERIFIED" && <Shield className="w-5 h-5 text-blue-400 fill-blue-400/20 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm font-semibold mb-2">
                  <MapPin className="w-4 h-4 text-[#E8336D]" /><span>{currentProfile.city}</span>
                </div>
                {currentProfile.bio && <p className="text-white/80 text-sm leading-relaxed line-clamp-2 mb-3">{currentProfile.bio}</p>}
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.slice(0, 3).map(i => (
                    <span key={i} className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-x-4 inset-y-0 flex flex-col items-center justify-center text-center p-8 bg-[#14141F] border border-white/10 rounded-3xl">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-black text-white mb-2">You&apos;ve seen everyone!</h3>
              <p className="text-white/60 text-base mb-6">Check back soon for new profiles.</p>
              <button onClick={loadProfiles} className="px-8 py-3.5 rounded-full font-extrabold text-white" style={{ background: "var(--gradient-primary)" }}>Refresh</button>
            </div>
          )}
        </div>

        {/* Action buttons — pinned directly above bottom nav */}
        {currentProfile && (
          <div className="flex-shrink-0 flex items-center justify-center gap-5 px-4 py-4">
            <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-white/15 flex items-center justify-center active:scale-95">
              <RotateCcw className="w-5 h-5 text-yellow-400" />
            </button>
            <button onClick={() => handleSwipe("left")} className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-red-500/50 flex items-center justify-center active:scale-95">
              <X className="w-8 h-8 text-red-500" strokeWidth={3} />
            </button>
            <button onClick={() => handleSwipe("super")} className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-blue-400/50 flex items-center justify-center active:scale-95">
              <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
            </button>
            <button onClick={() => handleSwipe("right")} className="w-16 h-16 rounded-full border flex items-center justify-center active:scale-95" style={{ background: "rgba(232,51,109,0.15)", borderColor: "rgba(232,51,109,0.6)" }}>
              <Heart className="w-8 h-8 text-[#E8336D] fill-[#E8336D]" />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#1A1A2E] border border-purple-400/50 flex items-center justify-center active:scale-95">
              <Zap className="w-6 h-6 text-purple-400 fill-purple-400/30" />
            </button>
          </div>
        )}
      </div>

      {/* ═══════════ DESKTOP LAYOUT ═══════════ */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0">
        <div className="max-w-7xl mx-auto w-full px-8 py-4 flex flex-col flex-1 min-h-0">

          {/* Desktop header */}
          <header className="flex items-center justify-between py-3 mb-4 border-b border-white/10 flex-shrink-0">
            <div className="flex gap-1 bg-[#14141F] border border-white/10 rounded-full p-1.5">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-6 py-2 rounded-full text-sm font-extrabold transition-all ${activeTab === t.id ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white shadow-md" : "text-white/50 hover:text-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/explore" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-bold hover:bg-white/10 no-underline">
                <SlidersHorizontal className="w-4 h-4 text-[#E8336D]" /> Filters
              </Link>
              <Link href="/verify" className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-extrabold no-underline">
                <Shield className="w-4 h-4" /> Verify
              </Link>
            </div>
          </header>

          {/* Desktop grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start flex-1 min-h-0">

            {/* Left sidebar */}
            <aside className="lg:col-span-4 flex flex-col bg-[#14141F] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link href="/profile" className="flex items-center gap-3.5 no-underline group">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E8336D] shadow-md bg-[#1E1E2E]">
                    <img src={getProfileAvatar(currentUser?.profile?.photos?.[0], currentUser?.profile?.displayName, 0)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Me" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight group-hover:text-[#E8336D] transition-colors">{currentUser?.profile?.displayName ?? "My Profile"}</h3>
                    <p className="text-white/50 text-xs mt-0.5">View & Edit Profile</p>
                  </div>
                </Link>
                <Link href="/wallet" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-black no-underline">
                  🪙 {currentUser?.wallet?.balance ?? 150}
                </Link>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/50">Recent Matches</h4>
                  <Link href="/matches" className="text-xs font-bold text-[#E8336D] no-underline hover:underline">See all</Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {MOCK_PROFILES.slice(0, 4).map((p, idx) => (
                    <Link key={p.id} href="/matches" className="flex flex-col items-center gap-1.5 flex-shrink-0 no-underline group">
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] group-hover:scale-105 transition-transform">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#14141F] bg-[#1E1E2E]">
                          <img src={getProfileAvatar(p.photos[0], p.displayName, idx)} className="w-full h-full object-cover" alt={p.displayName} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white/80 max-w-[64px] truncate">{p.displayName}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link href="/explore" className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors no-underline group">
                  <div className="flex items-center gap-3"><Sparkles className="w-5 h-5 text-purple-400" /><span className="text-sm font-extrabold text-white">Explore Categories</span></div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/likes" className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors no-underline group">
                  <div className="flex items-center gap-3"><Heart className="w-5 h-5 text-[#E8336D]" /><span className="text-sm font-extrabold text-white">Who Liked You</span></div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8336D] text-white text-xs font-black">9</span>
                </Link>
              </div>
              <div className="bg-[#1C1C2A] border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                <p className="font-extrabold text-white/70 uppercase tracking-wider mb-2">Keyboard Controls</p>
                {[["Pass", "← or A"], ["Like", "→ or D"], ["Super Like", "↑ or W"], ["Undo", "R"]].map(([a, b]) => (
                  <div key={a} className="flex items-center justify-between text-white/60">
                    <span>{a}</span><span className="px-2 py-1 rounded bg-white/10 text-white font-mono font-bold">{b}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* Right swipe stage */}
            <main className="lg:col-span-8 flex flex-col items-center justify-center gap-6">
              <div className="relative w-full max-w-lg" style={{ aspectRatio: "3/4", maxHeight: "calc(100vh - 280px)" }}>
                {nextProfile && (
                  <div className="absolute inset-2 rounded-3xl overflow-hidden scale-[0.95] opacity-50 origin-bottom bg-[#14141F] border border-white/10" style={{ zIndex: 1 }}>
                    <img src={getProfileAvatar(nextProfile.photos[0], nextProfile.displayName, currentIndex + 1)} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>
                )}
                {currentProfile ? (
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl select-none border border-white/15 bg-[#14141F]"
                    style={{
                      cursor: isDragging ? "grabbing" : "grab", zIndex: 2,
                      transform: `translateX(${swipeDir === "left" ? -600 : swipeDir === "right" ? 600 : cardOffset}px) rotate(${rotation}deg)`,
                      transition: swipeDir ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" : isDragging ? "none" : "transform 0.3s ease",
                    }}
                    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                  >
                    <img src={getProfileAvatar(currentProfile.photos[0], currentProfile.displayName, currentIndex)} className="w-full h-full object-cover" draggable={false} alt={currentProfile.displayName} />
                    <div className="absolute top-8 left-8 border-[4px] border-emerald-400 rounded-2xl px-5 py-2 -rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: likeOpacity }}>
                      <span className="text-emerald-400 font-black text-2xl tracking-wider">LIKE</span>
                    </div>
                    <div className="absolute top-8 right-8 border-[4px] border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-black/40 backdrop-blur-md" style={{ opacity: passOpacity }}>
                      <span className="text-red-500 font-black text-2xl tracking-wider">NOPE</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h2 className="text-3xl font-black text-white tracking-tight">{currentProfile.displayName}, {currentProfile.age}</h2>
                        {currentProfile.user.verificationStatus === "VERIFIED" && <Shield className="w-6 h-6 text-blue-400 fill-blue-400/20 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/80 text-sm font-semibold mb-3">
                        <MapPin className="w-4 h-4 text-[#E8336D]" /><span>{currentProfile.city}</span>
                      </div>
                      {currentProfile.bio && <p className="text-white/90 text-sm leading-relaxed line-clamp-2 mb-4">{currentProfile.bio}</p>}
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.slice(0, 4).map(i => (
                          <span key={i} className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold">{i}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#14141F] border border-white/10 rounded-3xl shadow-2xl">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-black text-white mb-2">You&apos;ve seen everyone!</h3>
                    <p className="text-white/60 text-base mb-6 max-w-xs">Check back soon for new profiles near you.</p>
                    <button onClick={loadProfiles} className="px-8 py-3.5 rounded-full font-extrabold text-white shadow-xl hover:opacity-90" style={{ background: "var(--gradient-primary)" }}>Refresh</button>
                  </div>
                )}
              </div>

              {currentProfile && (
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} title="Undo (R)" className="w-[52px] h-[52px] rounded-full bg-[#1A1A2E] border border-white/15 flex items-center justify-center hover:bg-white/15 active:scale-95 shadow-xl">
                    <RotateCcw className="w-5 h-5 text-yellow-400" />
                  </button>
                  <button onClick={() => handleSwipe("left")} title="Pass (A/←)" className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-red-500/50 flex items-center justify-center hover:bg-red-500/15 active:scale-95 shadow-2xl">
                    <X className="w-8 h-8 text-red-500" strokeWidth={3} />
                  </button>
                  <button onClick={() => handleSwipe("super")} title="Super Like (W/↑)" className="w-[52px] h-[52px] rounded-full bg-[#1A1A2E] border border-blue-400/50 flex items-center justify-center hover:bg-blue-400/15 active:scale-95 shadow-xl">
                    <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
                  </button>
                  <button onClick={() => handleSwipe("right")} title="Like (D/→)" className="w-16 h-16 rounded-full border flex items-center justify-center active:scale-95 shadow-2xl" style={{ background: "rgba(232,51,109,0.15)", borderColor: "rgba(232,51,109,0.6)" }}>
                    <Heart className="w-8 h-8 text-[#E8336D] fill-[#E8336D]" />
                  </button>
                  <button title="Boost" className="w-[52px] h-[52px] rounded-full bg-[#1A1A2E] border border-purple-400/50 flex items-center justify-center hover:bg-purple-400/15 active:scale-95 shadow-xl">
                    <Zap className="w-6 h-6 text-purple-400 fill-purple-400/30" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="rounded-3xl p-8 text-center max-w-sm w-full border border-white/20 shadow-2xl" style={{ background: "linear-gradient(145deg, rgba(232,51,109,0.2), rgba(20,20,31,0.95))" }}>
            <div className="text-6xl mb-4 animate-bounce">💘</div>
            <h2 className="text-3xl font-black text-white mb-2">It&apos;s a Match!</h2>
            <p className="text-white/70 text-base mb-6">You and <strong className="text-white font-extrabold">{showMatch.displayName}</strong> liked each other!</p>
            <div className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-[#E8336D] overflow-hidden shadow-2xl bg-[#1E1E2E]">
              <img src={getProfileAvatar(showMatch.photos[0], showMatch.displayName, 0)} className="w-full h-full object-cover" alt={showMatch.displayName} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowMatch(null); router.push("/matches"); }} className="flex-1 py-3.5 rounded-full font-extrabold text-white text-base hover:opacity-90 shadow-lg" style={{ background: "var(--gradient-primary)" }}>Send Message</button>
              <button onClick={() => setShowMatch(null)} className="flex-1 py-3.5 bg-white/10 text-white font-extrabold text-base rounded-full hover:bg-white/20">Keep Swiping</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
