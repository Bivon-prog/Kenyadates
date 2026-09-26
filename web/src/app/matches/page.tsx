"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Heart } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Match {
  id: string;
  user1: { id: string; profile: { displayName: string; photos: string[]; city: string } | null };
  user2: { id: string; profile: { displayName: string; photos: string[]; city: string } | null };
  messages: { content: string; createdAt: string }[];
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId") || "";
    setMyId(id);
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/chat/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const getOtherUser = (match: Match) => {
    if (match.user1.id === myId) return match.user2;
    return match.user1;
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 px-4 pt-6 pb-4 border-b border-white/10">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-peach">
          Matches
        </h1>
        <p className="text-white/50 text-sm mt-1">People who liked you back ❤️</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-t-brand-orange border-white/20 rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center px-8">
          <Heart className="w-16 h-16 text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white/60">No matches yet</h3>
          <p className="text-white/40 text-sm mt-2">Keep swiping to find your perfect match!</p>
          <button
            onClick={() => router.push("/discover")}
            className="mt-6 px-6 py-3 bg-brand-orange text-white rounded-full font-semibold text-sm"
          >
            Discover People
          </button>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {matches.map((match) => {
            const other = getOtherUser(match);
            const lastMsg = match.messages[0];
            const profile = other.profile;
            return (
              <button
                key={match.id}
                onClick={() => router.push(`/chat/${match.id}`)}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/5 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={profile?.photos[0] || `https://i.pravatar.cc/80?u=${other.id}`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                    alt={profile?.displayName}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-black rounded-full" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{profile?.displayName || "User"}</span>
                    {lastMsg && (
                      <span className="text-xs text-white/40 ml-2 flex-shrink-0">{formatTime(lastMsg.createdAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-sm text-white/50 truncate">
                      {lastMsg ? lastMsg.content : `Matched with ${profile?.displayName || "this person"}`}
                    </span>
                  </div>
                  {profile?.city && (
                    <span className="text-xs text-white/30">{profile.city}</span>
                  )}
                </div>

                <MessageCircle className="w-5 h-5 text-white/30 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
