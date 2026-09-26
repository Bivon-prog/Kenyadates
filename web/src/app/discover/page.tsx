"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, X, Star, MapPin, Shield } from "lucide-react";

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

const SWIPE_THRESHOLD = 100;

export default function DiscoverPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState<Profile | null>(null);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  // Drag state
  const startX = useRef(0);
  const startY = useRef(0);
  const dragX = useRef(0);
  const [cardOffset, setCardOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/discovery/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch {
      // Use mock data if API fails
      setProfiles([
        { id: "1", userId: "u1", displayName: "Amina", age: 24, city: "Nairobi", bio: "Love dancing and travelling 🌍", photos: ["https://i.pravatar.cc/600?img=47"], interests: ["Travel", "Music", "Food"], user: { verificationStatus: "VERIFIED" } },
        { id: "2", userId: "u2", displayName: "Wanjiru", age: 26, city: "Mombasa", bio: "Beach lover, foodie & entrepreneur 🌊", photos: ["https://i.pravatar.cc/600?img=48"], interests: ["Beach", "Business", "Cooking"], user: { verificationStatus: "VERIFIED" } },
        { id: "3", userId: "u3", displayName: "Fatuma", age: 23, city: "Kisumu", bio: "Teacher by day, dancer by night 💃", photos: ["https://i.pravatar.cc/600?img=49"], interests: ["Dancing", "Education", "Art"], user: { verificationStatus: "UNVERIFIED" } },
        { id: "4", userId: "u4", displayName: "Kemunto", age: 28, city: "Eldoret", bio: "Runner 🏃‍♀️ Nurse. Dog mom.", photos: ["https://i.pravatar.cc/600?img=50"], interests: ["Fitness", "Health", "Pets"], user: { verificationStatus: "VERIFIED" } },
        { id: "5", userId: "u5", displayName: "Njeri", age: 25, city: "Nakuru", bio: "Passionate about nature and wildlife 🦁", photos: ["https://i.pravatar.cc/600?img=51"], interests: ["Nature", "Photography", "Hiking"], user: { verificationStatus: "VERIFIED" } },
      ]);
    }
    setLoading(false);
  };

  const sendAction = async (toUserId: string, isSuper: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/discovery/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId, isSuper }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.isMatch;
      }
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
        if (isMatch) {
          setShowMatch(profile);
        }
      }
      setCurrentIndex((i) => i + 1);
      setSwipeDir(null);
      setCardOffset(0);
    }, 300);
  }, [profiles, currentIndex]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
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

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];
  const rotation = (cardOffset / 300) * 12;
  const likeOpacity = Math.min(1, cardOffset / 80);
  const passOpacity = Math.min(1, -cardOffset / 80);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-t-brand-orange border-white/20 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Finding your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between pb-24 pt-4 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-sm px-4 flex justify-between items-center mb-2">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-peach">
          KenyaDates
        </h1>
        <button onClick={() => router.push("/wallet")} className="text-white/60 text-xs bg-white/10 px-3 py-1.5 rounded-full">
          🪙 Coins
        </button>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm h-[520px] flex items-center justify-center px-4">
        {/* Next card (behind) */}
        {nextProfile && (
          <div className="absolute inset-4 rounded-3xl overflow-hidden bg-gray-800 scale-95 opacity-70">
            <img src={nextProfile.photos[0] || `https://i.pravatar.cc/600?img=30`} className="w-full h-full object-cover" alt="" />
          </div>
        )}

        {/* Current card */}
        {currentProfile ? (
          <div
            className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none"
            style={{
              transform: `translateX(${swipeDir === "left" ? -400 : swipeDir === "right" ? 400 : cardOffset}px) rotate(${rotation}deg)`,
              transition: swipeDir ? "transform 0.3s ease" : isDragging ? "none" : "transform 0.3s ease",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={currentProfile.photos[0] || `https://i.pravatar.cc/600?img=1`}
              className="w-full h-full object-cover"
              alt={currentProfile.displayName}
            />

            {/* Like / Pass overlays */}
            <div className="absolute top-8 left-6 border-4 border-green-400 rounded-xl px-4 py-2 rotate-[-15deg]" style={{ opacity: likeOpacity }}>
              <span className="text-green-400 font-black text-2xl">LIKE</span>
            </div>
            <div className="absolute top-8 right-6 border-4 border-red-400 rounded-xl px-4 py-2 rotate-[15deg]" style={{ opacity: passOpacity }}>
              <span className="text-red-400 font-black text-2xl">NOPE</span>
            </div>

            {/* Profile info gradient */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{currentProfile.displayName}, {currentProfile.age}</h2>
                {currentProfile.user.verificationStatus === "VERIFIED" && (
                  <Shield className="w-5 h-5 text-blue-400 fill-blue-400" />
                )}
              </div>
              <div className="flex items-center gap-1 text-white/70 text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span>{currentProfile.city}</span>
              </div>
              {currentProfile.bio && (
                <p className="text-white/80 text-sm line-clamp-2">{currentProfile.bio}</p>
              )}
              {currentProfile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentProfile.interests.slice(0, 3).map((i) => (
                    <span key={i} className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{i}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-white/60 p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-white mb-2">You've seen everyone!</h3>
            <p className="text-sm">Check back soon for new people near you.</p>
            <button onClick={loadProfiles} className="mt-6 px-6 py-3 bg-brand-orange text-white rounded-full font-semibold">
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {currentProfile && (
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 rounded-full bg-white/10 border-2 border-red-400/50 flex items-center justify-center hover:bg-red-500/20 hover:scale-110 transition-all active:scale-95"
          >
            <X className="w-7 h-7 text-red-400" />
          </button>
          <button
            onClick={() => handleSwipe("super")}
            className="w-12 h-12 rounded-full bg-white/10 border-2 border-yellow-400/50 flex items-center justify-center hover:bg-yellow-500/20 hover:scale-110 transition-all active:scale-95"
          >
            <Star className="w-5 h-5 text-yellow-400" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-white/10 border-2 border-green-400/50 flex items-center justify-center hover:bg-green-500/20 hover:scale-110 transition-all active:scale-95"
          >
            <Heart className="w-7 h-7 text-green-400" />
          </button>
        </div>
      )}

      {/* Match Modal */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-b from-brand-orange/20 to-black/80 border border-white/20 rounded-3xl p-8 text-center max-w-xs w-full">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-white mb-2">It's a Match!</h2>
            <p className="text-white/70 mb-6">You and <strong className="text-white">{showMatch.displayName}</strong> liked each other!</p>
            <img
              src={showMatch.photos[0] || "https://i.pravatar.cc/150"}
              className="w-24 h-24 rounded-full mx-auto border-4 border-brand-orange mb-6 object-cover"
              alt=""
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowMatch(null); router.push("/matches"); }}
                className="flex-1 py-3 bg-brand-orange text-white font-bold rounded-full hover:opacity-90 transition"
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
