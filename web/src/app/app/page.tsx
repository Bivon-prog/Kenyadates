"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Compass, Heart, MessageCircle, User, Bell, Search, Filter, Star, MapPin, Video, Mic, Crown, Coins, Shield, X, Check, ChevronRight, Flame, Zap } from "lucide-react";

const PROFILES = [
  { id: 1, name: "Amina", age: 26, city: "Nairobi", distance: "2 km", verified: true, online: true, premium: "gold", goal: "Serious Relationship", interests: ["Travel ✈️", "Fitness 💪", "Music 🎵"], bio: "Nairobi girl who loves adventures and good food 🌍", emoji: "👩🏾", bg: "from-pink-500 to-rose-500", match: 94 },
  { id: 2, name: "James", age: 29, city: "Mombasa", distance: "350 km", verified: true, online: false, premium: "platinum", goal: "Marriage", interests: ["Sports ⚽", "Business 📈", "Cooking 👨‍🍳"], bio: "Entrepreneur from Mombasa. Let's build something great together.", emoji: "👨🏾", bg: "from-blue-500 to-indigo-500", match: 87 },
  { id: 3, name: "Grace", age: 24, city: "Kisumu", distance: "350 km", verified: true, online: true, premium: null, goal: "Casual Dating", interests: ["Dancing 💃", "Art 🎨", "Reading 📚"], bio: "Lake Victoria vibes. Looking for good conversations and better adventures.", emoji: "👩🏿", bg: "from-purple-500 to-violet-500", match: 91 },
  { id: 4, name: "Kevin", age: 31, city: "Eldoret", distance: "310 km", verified: false, online: true, premium: "gold", goal: "Serious Relationship", interests: ["Fitness 💪", "Tech 💻", "Nature 🌿"], bio: "Runner, coder, and lover of the great outdoors.", emoji: "👨🏽", bg: "from-teal-500 to-cyan-500", match: 78 },
  { id: 5, name: "Fatuma", age: 27, city: "Nairobi", distance: "5 km", verified: true, online: true, premium: "diamond", goal: "Friendship First", interests: ["Fashion 👗", "Photography 📸", "Travel ✈️"], bio: "Digital creative. Passionate about Swahili culture and storytelling.", emoji: "👩🏾", bg: "from-amber-500 to-orange-500", match: 96 },
  { id: 6, name: "Brian", age: 28, city: "Kampala", distance: "650 km", verified: true, online: false, premium: null, goal: "Marriage", interests: ["Music 🎵", "Gaming 🎮", "Food 🍽️"], bio: "Ugandan gentleman. Believes in God, family and good food.", emoji: "👨🏾", bg: "from-rose-500 to-pink-500", match: 82 },
];

const SECTIONS = [
  { label: "Recommended", icon: "✨" },
  { label: "New Members", icon: "🆕" },
  { label: "Online Now", icon: "🟢" },
  { label: "Near You", icon: "📍" },
  { label: "Popular", icon: "🔥" },
  { label: "Verified", icon: "✅" },
  { label: "Premium", icon: "👑" },
];

const PREMIUM_COLORS: Record<string, string> = {
  gold: "var(--accent-gold)",
  platinum: "#E5E4E2",
  diamond: "#A78BFA",
};

function ProfileCard({ p, compact = false }: { p: typeof PROFILES[0]; compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="card" style={{ overflow: "hidden", transition: "all 0.3s ease", cursor: "pointer", position: "relative" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      {/* Photo area */}
      <div style={{
        aspectRatio: compact ? "4/3" : "3/4", position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: compact ? 60 : 80, lineHeight: 1 }}>{p.emoji}</div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 40%, transparent 70%)" }} />

        {/* Top badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          {p.verified && <span className="badge badge-success" style={{ fontSize: 10, padding: "3px 8px" }}><Shield size={9} /> Verified</span>}
          {p.premium && <span style={{ padding: "3px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 700, background: `${PREMIUM_COLORS[p.premium]}20`, color: PREMIUM_COLORS[p.premium], border: `1px solid ${PREMIUM_COLORS[p.premium]}40` }}>
            <Crown size={9} style={{ display: "inline", marginRight: 3 }} />{p.premium.charAt(0).toUpperCase() + p.premium.slice(1)}
          </span>}
        </div>

        {/* Match % */}
        <div style={{ position: "absolute", top: 10, right: 10, width: 36, height: 36, borderRadius: "50%", background: "rgba(232,51,109,0.9)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <span style={{ fontSize: 10, fontWeight: 800, lineHeight: 1, color: "white" }}>{p.match}%</span>
        </div>

        {/* Online dot */}
        {p.online && <div style={{ position: "absolute", bottom: compact ? 80 : 100, left: 14 }}><span className="online-dot" style={{ display: "inline-block" }} /></div>}

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 12px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: compact ? 16 : 18, fontWeight: 800 }}>{p.name},</span>
            <span style={{ fontSize: compact ? 14 : 16, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>{p.age}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: compact ? 0 : 8 }}>
            <MapPin size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.city} · {p.distance}</span>
          </div>
          {!compact && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {p.interests.slice(0, 2).map(i => (
                <span key={i} className="badge badge-pink" style={{ fontSize: 10, padding: "2px 8px" }}>{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Like button */}
        <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} style={{
          position: "absolute", bottom: 10, right: 10, width: 38, height: 38, borderRadius: "50%",
          background: liked ? "var(--gradient-primary)" : "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
        }}>
          <Heart size={16} fill={liked ? "white" : "none"} color="white" />
        </button>
      </div>
    </div>
  );
}

function Sidebar({ active }: { active: string }) {
  const navItems = [
    { icon: Home, label: "Home", href: "/app" },
    { icon: Compass, label: "Explore", href: "/app/explore" },
    { icon: Heart, label: "Favorites", href: "/app/favorites" },
    { icon: MessageCircle, label: "Chat", href: "/app/chat" },
    { icon: User, label: "Me", href: "/app/me" },
  ];
  return (
    <aside style={{ width: 240, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, padding: "24px 16px" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 36, padding: "0 8px" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Heart size={18} fill="white" color="white" />
        </div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
          Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
        </span>
      </Link>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(item => {
          const isActive = active === item.label;
          return (
            <Link key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: "var(--radius-md)",
              textDecoration: "none", transition: "all 0.2s",
              background: isActive ? "rgba(232,51,109,0.1)" : "transparent",
              color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)",
              fontWeight: isActive ? 700 : 500, fontSize: 15
            }}>
              <item.icon size={20} color={isActive ? "var(--accent-primary)" : "var(--text-secondary)"} />
              {item.label}
              {item.label === "Chat" && <span style={{ marginLeft: "auto", background: "var(--gradient-primary)", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>3</span>}
            </Link>
          );
        })}
      </nav>

      {/* Coins widget */}
      <div style={{ background: "rgba(245,197,66,0.08)", border: "1px solid rgba(245,197,66,0.2)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Coins size={16} color="var(--accent-gold)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-gold)" }}>My Coins</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>150 🪙</div>
        <Link href="/app/coins" className="btn-gold" style={{ fontSize: 12, padding: "8px 14px", width: "100%" }}>Buy Coins</Link>
      </div>

      {/* Upgrade */}
      <Link href="/app/membership" style={{ background: "var(--gradient-primary)", borderRadius: "var(--radius-md)", padding: "14px 16px", textDecoration: "none", display: "block" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Crown size={16} color="white" />
          <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Upgrade to Gold</span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Unlimited likes & more</span>
      </Link>
    </aside>
  );
}

export default function AppHomePage() {
  const [activeSection, setActiveSection] = useState("Recommended");
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div style={{ display: "flex", background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Sidebar active="Home" />

      <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Good afternoon, Wanjiku 👋</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>You have 3 new matches waiting for you</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowSearch(!showSearch)} style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={18} color="var(--text-secondary)" />
            </button>
            <button style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Bell size={18} color="var(--text-secondary)" />
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "var(--accent-primary)", borderRadius: "50%", border: "2px solid var(--bg-primary)" }} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div style={{ marginBottom: 24 }} className="animate-slide-up">
            <input className="input" placeholder="Search by name, city, interests..." style={{ fontSize: 15 }} autoFocus />
          </div>
        )}

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 28, paddingBottom: 4 }}>
          {SECTIONS.map(s => (
            <button key={s.label} onClick={() => setActiveSection(s.label)} style={{
              padding: "8px 16px", borderRadius: "var(--radius-full)", border: "1px solid", cursor: "pointer", whiteSpace: "nowrap",
              fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              borderColor: activeSection === s.label ? "var(--accent-primary)" : "var(--border)",
              background: activeSection === s.label ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
              color: activeSection === s.label ? "var(--accent-secondary)" : "var(--text-secondary)",
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Featured profile — large card */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>✨ Recommended For You</h2>
            <Link href="/app/explore" style={{ fontSize: 13, color: "var(--accent-secondary)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              See all <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {PROFILES.map(p => <ProfileCard key={p.id} p={p} />)}
          </div>
        </div>

        {/* Online Now strip */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>🟢 Online Now</h2>
            <Link href="/app/explore" style={{ fontSize: 13, color: "var(--accent-secondary)", textDecoration: "none", fontWeight: 600 }}>See all</Link>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
            {PROFILES.filter(p => p.online).map(p => (
              <div key={p.id} style={{ flexShrink: 0, textAlign: "center", cursor: "pointer" }}>
                <div style={{ position: "relative", width: 68, height: 68, margin: "0 auto 8px" }}>
                  <div className="avatar-ring" style={{ width: "100%", height: "100%", borderRadius: "50%", padding: 2 }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{p.emoji}</div>
                  </div>
                  <div className="verified-dot" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.age}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Super Likes prompt */}
        <div className="glass-accent" style={{ borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={24} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>You have 2 Super Likes left today</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Stand out — Super Likes get 3× more responses</div>
            </div>
          </div>
          <Link href="/app/explore" className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>Use Now <Star size={14} /></Link>
        </div>

        {/* New Members */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>🆕 New Members</h2>
            <Link href="/app/explore" style={{ fontSize: 13, color: "var(--accent-secondary)", textDecoration: "none", fontWeight: 600 }}>See all</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {PROFILES.slice(2).map(p => <ProfileCard key={p.id} p={p} compact />)}
          </div>
        </div>
      </main>
    </div>
  );
}
