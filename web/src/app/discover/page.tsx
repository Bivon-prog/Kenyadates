"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, X, Star, MapPin, Shield, Zap, RotateCcw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BRAND = "#E8336D";

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
  { id: "1", userId: "u1", displayName: "Amina", age: 24, city: "Nairobi", bio: "Love dancing and travelling. Looking for something genuine.", photos: ["solid:#C2185B"], interests: ["Travel", "Music", "Food"], user: { verificationStatus: "VERIFIED" } },
  { id: "2", userId: "u2", displayName: "Wanjiru", age: 26, city: "Mombasa", bio: "Beach lover, foodie and entrepreneur.", photos: ["solid:#1565C0"], interests: ["Beach", "Business", "Cooking"], user: { verificationStatus: "VERIFIED" } },
  { id: "3", userId: "u3", displayName: "Fatuma", age: 23, city: "Kisumu", bio: "Teacher by day, dancer by night.", photos: ["solid:#E65100"], interests: ["Dancing", "Education", "Art"], user: { verificationStatus: "UNVERIFIED" } },
  { id: "4", userId: "u4", displayName: "Kemunto", age: 28, city: "Eldoret", bio: "Runner. Nurse. Dog mom.", photos: ["solid:#00695C"], interests: ["Fitness", "Health", "Pets"], user: { verificationStatus: "VERIFIED" } },
  { id: "5", userId: "u5", displayName: "Njeri", age: 25, city: "Nakuru", bio: "Passionate about nature and wildlife.", photos: ["solid:#4527A0"], interests: ["Nature", "Photography", "Hiking"], user: { verificationStatus: "VERIFIED" } },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [activeTab, setActiveTab] = useState("foryou");

  const startX = useRef(0);
  const dragX = useRef(0);
  const [cardOffset, setCardOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/discovery/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.length ? data : MOCK_PROFILES);
      } else {
        setProfiles(MOCK_PROFILES);
      }
    } catch {
      setProfiles(MOCK_PROFILES);
    }
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
    } catch { /* silently fail */ }
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

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    dragX.current = e.touches[0].clientX - startX.current;
    setCardOffset(dragX.current);
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragX.current > SWIPE_THRESHOLD) handleSwipe("right");
    else if (dragX.current < -SWIPE_THRESHOLD) handleSwipe("left");
    else setCardOffset(0);
    dragX.current = 0;
  };

  // Mouse drag support for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dragX.current = e.clientX - startX.current;
    setCardOffset(dragX.current);
  };
  const onMouseUp = () => {
    setIsDragging(false);
    if (dragX.current > SWIPE_THRESHOLD) handleSwipe("right");
    else if (dragX.current < -SWIPE_THRESHOLD) handleSwipe("left");
    else setCardOffset(0);
    dragX.current = 0;
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const rotation = (cardOffset / 300) * 12;
  const likeOpacity = Math.min(1, cardOffset / 80);
  const passOpacity = Math.min(1, -cardOffset / 80);

  const TABS = [
    { id: "foryou", label: "For You" },
    { id: "nearby", label: "Nearby" },
    { id: "new", label: "New" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Finding matches near you…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col h-[100dvh] overflow-hidden pb-[env(safe-area-inset-bottom)]">

      {/* ── Header ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-2 md:px-8">
        <div className="flex gap-1 bg-white/5 rounded-full p-1">
          {TABS.map(t => (
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
        <button className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center hover:bg-white/12 transition-colors">
          <Shield className="w-4 h-4 text-white/60" />
        </button>
      </header>

      {/* ── Card area ── */}
      <div className="relative flex-1 flex items-center justify-center px-3 py-2 min-h-0">

        {/* Back card */}
        {nextProfile && (
          <div className="absolute inset-3 rounded-3xl overflow-hidden scale-[0.94] opacity-60 origin-bottom" style={{ zIndex: 1 }}>
            {nextProfile.photos[0]?.startsWith("solid:") ? (
              <div className="w-full h-full" style={{ backgroundColor: nextProfile.photos[0].replace("solid:", "") }} />
            ) : nextProfile.photos[0]?.startsWith("gradient:") ? (
              <div className={`w-full h-full bg-gradient-to-br ${nextProfile.photos[0].replace("gradient:", "")}`} />
            ) : (
              <img src={nextProfile.photos[0]} className="w-full h-full object-cover" alt="" />
            )}
          </div>
        )}

        {/* Front card */}
        {currentProfile ? (
          <div
            className="absolute inset-3 rounded-3xl overflow-hidden shadow-2xl select-none cursor-grab active:cursor-grabbing"
            style={{
              zIndex: 2,
              transform: `translateX(${swipeDir === "left" ? -500 : swipeDir === "right" ? 500 : cardOffset}px) rotate(${rotation}deg)`,
              transition: swipeDir ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)"
                : isDragging ? "none" : "transform 0.3s ease",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Photo */}
            {currentProfile.photos[0]?.startsWith("gradient:") ? (
              <div className={`w-full h-full bg-gradient-to-br ${currentProfile.photos[0].replace("gradient:", "")}`} />
            ) : currentProfile.photos[0]?.startsWith("solid:") ? (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: currentProfile.photos[0].replace("solid:", "") }}>
                <span className="text-white font-black select-none" style={{ fontSize: 120, opacity: 0.15 }}>
                  {currentProfile.displayName[0]}
                </span>
              </div>
            ) : (
              <img src={currentProfile.photos[0]} className="w-full h-full object-cover" draggable={false} alt={currentProfile.displayName} />
            )}

            {/* LIKE / NOPE overlays */}
            <div
              className="absolute top-8 left-6 border-[3px] border-green-400 rounded-xl px-4 py-1.5 -rotate-12"
              style={{ opacity: likeOpacity }}
            >
              <span className="text-green-400 font-black text-xl tracking-wide">LIKE</span>
            </div>
            <div
              className="absolute top-8 right-6 border-[3px] border-red-400 rounded-xl px-4 py-1.5 rotate-12"
              style={{ opacity: passOpacity }}
            >
              <span className="text-red-400 font-black text-xl tracking-wide">NOPE</span>
            </div>

            {/* Profile info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">
                  {currentProfile.displayName}, {currentProfile.age}
                </h2>
                {currentProfile.user.verificationStatus === "VERIFIED" && (
                  <Shield className="w-5 h-5 text-blue-400 fill-blue-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentProfile.city}</span>
              </div>
              {currentProfile.bio && (
                <p className="text-white/85 text-sm line-clamp-2 mb-3">{currentProfile.bio}</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {currentProfile.interests.slice(0, 3).map(i => (
                  <span key={i} className="bg-white/15 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium">{i}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center px-8" style={{ zIndex: 2 }}>
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">You&apos;ve seen everyone!</h3>
            <p className="text-white/50 text-sm mb-6">Check back soon for new people near you.</p>
            <button
              onClick={loadProfiles}
              className="px-6 py-3 rounded-full font-semibold text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* ── Action buttons ── */}
      {currentProfile && (
        <div className="flex-shrink-0 flex items-center justify-center gap-3 px-6 pb-24 md:pb-6 pt-2">
          {/* Undo */}
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            className="w-11 h-11 rounded-full bg-[#1A1A2E] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </button>

          {/* Pass */}
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-red-500/40 flex items-center justify-center hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <X className="w-8 h-8 text-red-400" strokeWidth={2.5} />
          </button>

          {/* Super like */}
          <button
            onClick={() => handleSwipe("super")}
            className="w-13 h-13 rounded-full bg-[#1A1A2E] border border-blue-400/40 flex items-center justify-center hover:bg-blue-400/10 transition-all hover:scale-105 active:scale-95"
            style={{ width: 52, height: 52 }}
          >
            <Star className="w-5 h-5 text-blue-400 fill-blue-400/50" />
          </button>

          {/* Like */}
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: "rgba(232,51,109,0.1)", borderColor: "rgba(232,51,109,0.5)" }}
          >
            <Heart className="w-8 h-8" style={{ color: BRAND, fill: `${BRAND}60` }} />
          </button>

          {/* Boost */}
          <button
            className="w-11 h-11 rounded-full bg-[#1A1A2E] border border-purple-400/40 flex items-center justify-center hover:bg-purple-400/10 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      )}

      {/* ── Match modal ── */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div
            className="rounded-3xl p-8 text-center max-w-xs w-full border border-white/15 shadow-2xl"
            style={{ background: "linear-gradient(145deg, rgba(232,51,109,0.15), rgba(13,13,13,0.95))" }}
          >
            <div className="text-5xl mb-3">💘</div>
            <h2 className="text-3xl font-black text-white mb-1">It&apos;s a Match!</h2>
            <p className="text-white/60 text-sm mb-6">
              You and <strong className="text-white">{showMatch.displayName}</strong> liked each other!
            </p>

            {showMatch.photos[0]?.startsWith("solid:") ? (
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#E8336D] font-black text-white text-3xl"
                style={{ backgroundColor: showMatch.photos[0].replace("solid:", "") }}>
                {showMatch.displayName[0]}
              </div>
            ) : showMatch.photos[0]?.startsWith("gradient:") ? (
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br ${showMatch.photos[0].replace("gradient:", "")} border-4 border-[#E8336D]`} />
            ) : (
              <img src={showMatch.photos[0]} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-[#E8336D] object-cover" alt="" />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowMatch(null); router.push("/matches"); }}
                className="flex-1 py-3 rounded-full font-bold text-white transition hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}
              >
                Send Message
              </button>
              <button
                onClick={() => setShowMatch(null)}
                className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
