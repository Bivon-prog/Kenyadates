"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Bell, Search, Star, MapPin, Crown, Coins,
  Shield, Heart, Zap, ChevronRight, Flame, Users
} from "lucide-react";

const PROFILES = [
  { id: 1, name: "Amina", age: 26, city: "Nairobi", distance: "2 km", verified: true, online: true, premium: "gold", interests: ["Travel ✈️", "Fitness 💪", "Music 🎵"], bio: "Nairobi girl who loves adventures and good food 🌍", bg: "from-pink-500 to-rose-500", match: 94 },
  { id: 2, name: "James", age: 29, city: "Mombasa", distance: "350 km", verified: true, online: false, premium: "platinum", interests: ["Sports ⚽", "Business 📈", "Cooking 👨‍🍳"], bio: "Entrepreneur from Mombasa. Let's build something great.", bg: "from-blue-500 to-indigo-500", match: 87 },
  { id: 3, name: "Grace", age: 24, city: "Kisumu", distance: "350 km", verified: true, online: true, premium: null, interests: ["Dancing 💃", "Art 🎨", "Reading 📚"], bio: "Lake Victoria vibes. Good conversations only.", bg: "from-purple-500 to-violet-500", match: 91 },
  { id: 4, name: "Kevin", age: 31, city: "Eldoret", distance: "310 km", verified: false, online: true, premium: "gold", interests: ["Fitness 💪", "Tech 💻", "Nature 🌿"], bio: "Runner, coder, outdoors lover.", bg: "from-teal-500 to-cyan-500", match: 78 },
  { id: 5, name: "Fatuma", age: 27, city: "Nairobi", distance: "5 km", verified: true, online: true, premium: "diamond", interests: ["Fashion 👗", "Photography 📸", "Travel ✈️"], bio: "Digital creative. Passionate about Swahili culture.", bg: "from-amber-500 to-orange-500", match: 96 },
  { id: 6, name: "Wanjiru", age: 25, city: "Nakuru", distance: "160 km", verified: true, online: false, premium: null, interests: ["Music 🎵", "Food 🍽️", "Nature 🌿"], bio: "Nature lover. Bookworm. Foodie.", bg: "from-rose-500 to-pink-500", match: 82 },
];

const SECTIONS = [
  { label: "Recommended", icon: "✨" },
  { label: "New Members", icon: "🆕" },
  { label: "Online Now", icon: "🟢" },
  { label: "Near You", icon: "📍" },
  { label: "Popular", icon: "🔥" },
  { label: "Verified", icon: "✅" },
];

const PREMIUM_COLORS: Record<string, string> = {
  gold: "#F5C542",
  platinum: "#E5E4E2",
  diamond: "#A78BFA",
};

function Avatar({ bg, name, size = 80 }: { bg: string; name: string; size?: number }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${bg} flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name[0]}
    </div>
  );
}

function ProfileCard({ p, compact = false }: { p: typeof PROFILES[0]; compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="card overflow-hidden transition-all duration-300 cursor-pointer group"
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Photo area */}
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: compact ? "4/3" : "3/4", background: "var(--bg-surface)" }}
      >
        <Avatar bg={p.bg} name={p.name} size={compact ? 60 : 80} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {p.verified && (
            <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 7px" }}>
              <Shield size={8} /> Verified
            </span>
          )}
          {p.premium && (
            <span
              className="badge"
              style={{ fontSize: 10, padding: "2px 7px", background: `${PREMIUM_COLORS[p.premium]}20`, color: PREMIUM_COLORS[p.premium], border: `1px solid ${PREMIUM_COLORS[p.premium]}40` }}
            >
              <Crown size={8} style={{ display: "inline", marginRight: 2 }} />
              {p.premium.charAt(0).toUpperCase() + p.premium.slice(1)}
            </span>
          )}
        </div>

        {/* Match % */}
        <div
          className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(232,51,109,0.88)" }}
        >
          <span style={{ fontSize: 10, fontWeight: 800, color: "white" }}>{p.match}%</span>
        </div>

        {/* Online dot */}
        {p.online && (
          <div className="absolute" style={{ bottom: compact ? 76 : 96, left: 12 }}>
            <span className="online-dot" style={{ display: "inline-block" }} />
          </div>
        )}

        {/* Info */}
        <div className="absolute bottom-0 inset-x-0 p-3">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span style={{ fontSize: compact ? 15 : 17, fontWeight: 800 }}>{p.name},</span>
            <span style={{ fontSize: compact ? 13 : 15, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{p.age}</span>
          </div>
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={10} color="var(--text-muted)" />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.city} · {p.distance}</span>
          </div>
          {!compact && (
            <div className="flex gap-1 flex-wrap">
              {p.interests.slice(0, 2).map(i => (
                <span key={i} className="badge badge-pink" style={{ fontSize: 10, padding: "2px 7px" }}>{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: liked ? "var(--gradient-primary)" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "none",
          }}
        >
          <Heart size={15} fill={liked ? "white" : "none"} color="white" />
        </button>
      </div>
    </div>
  );
}

export default function AppHomePage() {
  const [activeSection, setActiveSection] = useState("Recommended");
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search
    ? PROFILES.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase())
      )
    : PROFILES;

  return (
    /* On desktop the side nav is rendered by BottomNav (72px wide).
       The layout wrapper in layout.tsx already adds md:pl-[72px].
       Here we just handle the content layout. */
    <div className="min-h-screen bg-[#0D0D0D]">

      {/* ── Desktop sidebar (extra nav for /app only) ── */}
      <aside className="hidden lg:flex flex-col fixed left-[72px] top-0 bottom-0 w-56 border-r border-white/8 bg-[#0D0D10] py-6 px-3 z-40">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-8 no-underline">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Heart size={16} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "white" }}>
            Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { icon: Flame, label: "Discover", href: "/discover" },
            { icon: Users, label: "Explore", href: "/explore" },
            { icon: Heart, label: "Likes", href: "/likes" },
            { icon: Bell, label: "Matches", href: "/matches" },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all no-underline"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Coins */}
        <div className="rounded-xl p-3 mb-2" style={{ background: "rgba(245,197,66,0.07)", border: "1px solid rgba(245,197,66,0.18)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Coins size={14} color="var(--accent-gold)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-gold)" }}>My Coins</span>
          </div>
          <div className="text-xl font-black text-white mb-2">150 🪙</div>
          <Link href="/wallet" className="btn-gold block text-center no-underline" style={{ fontSize: 11, padding: "7px 12px" }}>Buy Coins</Link>
        </div>

        {/* Upgrade */}
        <Link href="/wallet" className="rounded-xl p-3 no-underline block" style={{ background: "var(--gradient-primary)" }}>
          <div className="flex items-center gap-2 mb-0.5">
            <Crown size={14} color="white" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Upgrade to Gold</span>
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Unlimited likes & more</span>
        </Link>
      </aside>

      {/* ── Main content ── */}
      <main className="lg:pl-56 min-h-screen pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-white mb-0.5">Good day 👋</h1>
              <p className="text-white/40 text-sm">You have 3 new matches waiting</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/4 flex items-center justify-center hover:bg-white/8 transition-colors"
              >
                <Search size={16} color="var(--text-secondary)" />
              </button>
              <button className="relative w-10 h-10 rounded-full border border-white/10 bg-white/4 flex items-center justify-center hover:bg-white/8 transition-colors">
                <Bell size={16} color="var(--text-secondary)" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8336D] border border-[#0D0D0D]" />
              </button>
            </div>
          </div>

          {/* Search */}
          {showSearch && (
            <div className="mb-5 animate-slide-up">
              <input
                className="input"
                placeholder="Search by name, city, interests…"
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* Section tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
            {SECTIONS.map(s => (
              <button
                key={s.label}
                onClick={() => setActiveSection(s.label)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all"
                style={{
                  borderColor: activeSection === s.label ? "var(--accent-primary)" : "var(--border)",
                  background: activeSection === s.label ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                  color: activeSection === s.label ? "var(--accent-secondary)" : "var(--text-secondary)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* Recommended grid */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">✨ Recommended</h2>
              <Link href="/discover" className="text-xs font-semibold flex items-center gap-0.5 no-underline" style={{ color: "var(--accent-secondary)" }}>
                See all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => <ProfileCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* Online now */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">🟢 Online Now</h2>
              <Link href="/discover" className="text-xs font-semibold no-underline" style={{ color: "var(--accent-secondary)" }}>See all</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              {PROFILES.filter(p => p.online).map(p => (
                <Link key={p.id} href="/discover" className="flex-shrink-0 flex flex-col items-center gap-1.5 no-underline">
                  <div className="relative">
                    <div className="p-0.5 rounded-full" style={{ background: "var(--gradient-primary)" }}>
                      <div className="p-0.5 rounded-full bg-[#0D0D0D]">
                        <Avatar bg={p.bg} name={p.name} size={52} />
                      </div>
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 border-2 border-[#0D0D0D] rounded-full" />
                  </div>
                  <span className="text-[11px] text-white/60 font-medium">{p.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Super likes banner */}
          <div
            className="rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 flex-wrap"
            style={{ background: "rgba(232,51,109,0.07)", border: "1px solid rgba(232,51,109,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-primary)" }}>
                <Zap size={20} color="white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">2 Super Likes left today</p>
                <p className="text-white/40 text-xs">Stand out — 3× more responses</p>
              </div>
            </div>
            <Link
              href="/discover"
              className="btn-primary no-underline"
              style={{ padding: "9px 18px", fontSize: 12 }}
            >
              Use Now <Star size={13} />
            </Link>
          </div>

          {/* New members compact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">🆕 New Members</h2>
              <Link href="/discover" className="text-xs font-semibold no-underline" style={{ color: "var(--accent-secondary)" }}>See all</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {PROFILES.slice(2).map(p => <ProfileCard key={p.id} p={p} compact />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
