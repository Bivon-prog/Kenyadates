"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Heart, Search } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Match {
  id: string;
  user1: { id: string; profile: { displayName: string; photos: string[]; city: string } | null };
  user2: { id: string; profile: { displayName: string; photos: string[]; city: string } | null };
  messages: { content: string; createdAt: string }[];
}

const MOCK_MATCHES: Match[] = [
  { id: "m1", user1: { id: "me", profile: null }, user2: { id: "u1", profile: { displayName: "Amina", photos: ["solid:#C2185B"], city: "Nairobi" } }, messages: [{ content: "Hey, how are you?", createdAt: new Date(Date.now() - 120000).toISOString() }] },
  { id: "m2", user1: { id: "me", profile: null }, user2: { id: "u2", profile: { displayName: "Wanjiru", photos: ["solid:#1565C0"], city: "Mombasa" } }, messages: [{ content: "Would love to catch up sometime!", createdAt: new Date(Date.now() - 3600000 * 3).toISOString() }] },
  { id: "m3", user1: { id: "me", profile: null }, user2: { id: "u3", profile: { displayName: "Kemunto", photos: ["solid:#00695C"], city: "Eldoret" } }, messages: [] },
  { id: "m4", user1: { id: "me", profile: null }, user2: { id: "u4", profile: { displayName: "Njeri", photos: ["solid:#E65100"], city: "Nakuru" } }, messages: [{ content: "That sounds amazing!", createdAt: new Date(Date.now() - 86400000).toISOString() }] },
];

// Simple avatar component for gradient placeholders
function Avatar({ photos, displayName, size = 56 }: { photos: string[]; displayName?: string; size?: number }) {
  const photo = photos?.[0] ?? "";
  if (photo.startsWith("solid:")) {
    const colour = photo.replace("solid:", "");
    return (
      <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none"
        style={{ width: size, height: size, background: colour, fontSize: size * 0.38 }}>
        {displayName?.[0]?.toUpperCase() ?? "?"}
      </div>
    );
  }
  if (photo.startsWith("gradient:")) {
    const gradient = photo.replace("gradient:", "");
    return (
      <div className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white flex-shrink-0`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}>
        {displayName?.[0]?.toUpperCase() ?? "?"}
      </div>
    );
  }
  return (
    <img
      src={photo || `https://ui-avatars.com/api/?name=${displayName}&background=333&color=fff&bold=true`}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size }}
      alt={displayName}
    />
  );
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const myId = "me"; // In real app from AuthContext

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    try {
      const token = localStorage.getItem("kd_token");
      const res = await fetch(`${API}/chat/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.length ? data : MOCK_MATCHES);
      } else {
        setMatches(MOCK_MATCHES);
      }
    } catch {
      setMatches(MOCK_MATCHES);
    }
    setLoading(false);
  };

  const getOther = (m: Match) => m.user1.id === myId ? m.user2 : m.user1;

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
  };

  const filtered = matches.filter(m => {
    const p = getOther(m).profile;
    return !search || p?.displayName?.toLowerCase().includes(search.toLowerCase());
  });

  // Separate new matches (no messages) from conversations
  const newMatches = filtered.filter(m => m.messages.length === 0);
  const conversations = filtered.filter(m => m.messages.length > 0);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-24 md:pb-6">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/8 px-4 md:px-8 pt-5 pb-4">
        <h1 className="text-2xl font-black mb-4" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Messages
        </h1>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search matches…"
            className="w-full bg-white/6 border border-white/8 rounded-full pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#E8336D]/50 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center px-8">
          <Heart className="w-16 h-16 text-white/15 mb-4" />
          <h3 className="text-lg font-bold text-white/50 mb-2">No matches yet</h3>
          <p className="text-white/30 text-sm">Keep swiping to find your perfect match!</p>
          <button
            onClick={() => router.push("/discover")}
            className="mt-5 px-6 py-2.5 rounded-full text-white text-sm font-semibold"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-2 md:px-8 pt-4">

          {/* ── New matches row ── */}
          {newMatches.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider px-2 mb-3">
                New Matches · {newMatches.length}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
                {newMatches.map(m => {
                  const other = getOther(m);
                  const p = other.profile;
                  return (
                    <button
                      key={m.id}
                      onClick={() => router.push(`/chat/${m.id}`)}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0"
                    >
                      <div className="relative">
                        <div className="p-0.5 rounded-full" style={{ background: "var(--gradient-primary)" }}>
                          <div className="p-0.5 rounded-full bg-[#0D0D0D]">
                            <Avatar photos={p?.photos ?? []} displayName={p?.displayName} size={56} />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-white/70 font-medium max-w-[60px] truncate">
                        {p?.displayName ?? "User"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Conversations ── */}
          {conversations.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider px-2 mb-2">
                Messages
              </h2>
              <div className="divide-y divide-white/5">
                {conversations.map(m => {
                  const other = getOther(m);
                  const p = other.profile;
                  const last = m.messages[0];
                  return (
                    <button
                      key={m.id}
                      onClick={() => router.push(`/chat/${m.id}`)}
                      className="w-full flex items-center gap-3 px-2 py-3.5 hover:bg-white/4 rounded-xl transition-colors text-left"
                    >
                      <div className="relative">
                        <Avatar photos={p?.photos ?? []} displayName={p?.displayName} size={52} />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0D0D0D] rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-white text-sm truncate">{p?.displayName ?? "User"}</span>
                          <span className="text-[11px] text-white/30 flex-shrink-0 ml-2">{formatTime(last.createdAt)}</span>
                        </div>
                        <p className="text-sm text-white/45 truncate">{last.content}</p>
                        {p?.city && <span className="text-[11px] text-white/25">{p.city}</span>}
                      </div>
                      <MessageCircle className="w-4 h-4 text-white/20 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
