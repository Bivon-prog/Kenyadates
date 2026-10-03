"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, Search, Star, MapPin, Crown, Coins,
  Shield, Heart, Zap, ChevronRight, Flame, Users, CheckCircle
} from "lucide-react";

const PROFILES = [
  { id: 1, name: "Amina", age: 26, city: "Nairobi", distance: "2 km", verified: true, online: true, premium: "gold", interests: ["Travel", "Fitness", "Music"], bg: "#C2185B" },
  { id: 2, name: "James", age: 29, city: "Mombasa", distance: "350 km", verified: true, online: false, premium: "platinum", interests: ["Sports", "Business", "Cooking"], bg: "#1565C0" },
  { id: 3, name: "Grace", age: 24, city: "Kisumu", distance: "350 km", verified: true, online: true, premium: null, interests: ["Dancing", "Art", "Reading"], bg: "#4527A0" },
  { id: 4, name: "Kevin", age: 31, city: "Eldoret", distance: "310 km", verified: false, online: true, premium: "gold", interests: ["Fitness", "Tech", "Nature"], bg: "#00695C" },
  { id: 5, name: "Fatuma", age: 27, city: "Nairobi", distance: "5 km", verified: true, online: true, premium: "diamond", interests: ["Fashion", "Photography", "Travel"], bg: "#E65100" },
  { id: 6, name: "Wanjiru", age: 25, city: "Nakuru", distance: "160 km", verified: true, online: false, premium: null, interests: ["Music", "Food", "Nature"], bg: "#AD1457" },
];

const SECTIONS = ["Recommended", "New Members", "Online Now", "Near You", "Popular", "Verified"];

const PREMIUM_COLORS: Record<string, string> = {
  gold: "#F5C542", platinum: "#9E9E9E", diamond: "#A78BFA",
};

// Clean initial-based avatar — no gradients, just solid colour + letter
function Avatar({ name, photo, size = 80, colour }: { name: string; photo?: string; size?: number; colour: string }) {
  if (photo && !photo.startsWith("gradient:")) {
    return (
      <img
        src={photo}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
        alt={name}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none"
      style={{ width: size, height: size, background: colour, fontSize: size * 0.38 }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

function ProfileCard({ p, compact = false }: { p: typeof PROFILES[0]; compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer bg-[#111118] border border-white/6 hover:border-white/12 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: compact ? "4/3" : "3/4" }}
      >
        {/* Solid colour background — not gradient */}
        <div className="absolute inset-0" style={{ backgroundColor: p.bg, opacity: 0.9 }} />
        <span
          className="relative z-10 font-black text-white select-none"
          style={{ fontSize: compact ? 48 : 64, opacity: 0.25 }}
        >
          {p.name[0]}
        </span>

        {/* Overlay gradient for text legibility only */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

        {/* Verified + premium badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          {p.verified && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/60 text-blue-400 text-[10px] font-semibold">
              <CheckCircle size={9} className="fill-blue-400/20" /> ID
            </span>
          )}
          {p.premium && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60"
              style={{ color: PREMIUM_COLORS[p.premium] }}>
              {p.premium.charAt(0).toUpperCase() + p.premium.slice(1)}
            </span>
          )}
        </div>

        {/* Online indicator */}
        {p.online && (
          <span className="absolute top-2 right-2 z-10 w-2 h-2 rounded-full bg-green-400 ring-2 ring-black/60" />
        )}

        {/* Info */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-10">
          <p className="text-white font-bold text-sm leading-none mb-0.5">
            {p.name}, {p.age}
          </p>
          <div className="flex items-center gap-1">
            <MapPin size={9} className="text-white/50" />
            <span className="text-white/60 text-[11px]">{p.city}</span>
          </div>
          {!compact && p.interests.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1.5">
              {p.interests.slice(0, 2).map(i => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/15 text-white/80">{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all"
          style={{ background: liked ? "#E8336D" : "rgba(0,0,0,0.5)" }}
        >
          <Heart size={14} fill={liked ? "white" : "none"} color="white" />
        </button>
      </div>
    </div>
  );
}

export default function AppHomePage() {
  const [activeSection, setActiveSection] = useState("Recommended");
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [myCoins, setMyCoins] = useState(0);
  const [myName, setMyName] = useState("");
  const [realProfiles, setRealProfiles] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("kd_token");
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/discovery/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : []).then(d => {
      if (Array.isArray(d) && d.length > 0) setRealProfiles(d);
    }).catch(() => {});
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.balance !== undefined) setMyCoins(d.balance);
    }).catch(() => {});
    const stored = localStorage.getItem("kd_user");
    if (stored) {
      try { setMyName(JSON.parse(stored).profile?.displayName?.split(" ")[0] ?? ""); } catch {}
    }
  }, []);

  const displayProfiles = realProfiles.length > 0
    ? realProfiles.map((rp, i) => ({
        id: i + 100,
        name: rp.displayName,
        age: rp.age,
        city: rp.city,
        distance: rp.city ?? "Kenya",
        verified: rp.user?.verificationStatus === "VERIFIED",
        online: rp.isOnline ?? false,
        premium: null as string | null,
        interests: (rp.interests ?? []).slice(0, 3).map((x: string) => x.replace(/\s*[^\w\s].*/, "")),
        bg: ["#C2185B","#1565C0","#4527A0","#00695C","#E65100","#AD1457"][i % 6],
      }))
    : PROFILES;

  const filtered = search
    ? displayProfiles.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()))
    : displayProfiles;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-[72px] top-0 bottom-0 w-52 border-r border-white/6 bg-[#0A0A0F] py-6 px-3 z-40">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-8 no-underline">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E8336D]">
            <Heart size={14} fill="white" color="white" />
          </div>
          <span className="text-white font-bold text-base">Kenyandates</span>
        </Link>
        <nav className="flex flex-col gap-0.5 flex-1">
          {[
            { icon: Flame, label: "Discover", href: "/discover" },
            { icon: Users, label: "Explore", href: "/explore" },
            { icon: Heart, label: "Likes", href: "/likes" },
            { icon: Bell, label: "Matches", href: "/matches" },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-white/45 hover:text-white hover:bg-white/5 transition-all no-underline">
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="rounded-xl p-3 mb-2 bg-[#111118] border border-white/6">
          <p className="text-white/40 text-xs mb-1">Coins</p>
          <p className="text-white font-bold text-lg">{myCoins > 0 ? myCoins.toLocaleString() : 0}</p>
          <Link href="/wallet" className="block text-center mt-2 py-1.5 rounded-lg bg-[#E8336D] text-white text-xs font-semibold no-underline hover:opacity-90 transition-opacity">
            Buy Coins
          </Link>
        </div>
        <Link href="/wallet" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#E8336D] no-underline">
          <Crown size={13} color="white" />
          <span className="text-white text-xs font-semibold">Upgrade to Gold</span>
        </Link>
      </aside>

      <main className="lg:pl-52 min-h-screen pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold text-white">
                {myName ? `Hey ${myName}` : "Hey there"} 👋
              </h1>
              <p className="text-white/35 text-sm">Find someone worth meeting</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSearch(!showSearch)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/8 transition-colors">
                <Search size={15} className="text-white/50" />
              </button>
              <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/8 transition-colors relative">
                <Bell size={15} className="text-white/50" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E8336D]" />
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mb-4">
              <input className="input" placeholder="Search by name or city…" autoFocus
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          )}

          {/* Section tabs — clean text, no emoji */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeSection === s ? "#E8336D" : "rgba(255,255,255,0.05)",
                  color: activeSection === s ? "white" : "rgba(255,255,255,0.4)",
                  whiteSpace: "nowrap",
                }}>
                {s}
              </button>
            ))}
          </div>

          {/* Main grid */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white/70">Recommended for you</h2>
              <Link href="/discover" className="text-xs font-semibold text-[#E8336D] no-underline flex items-center gap-0.5">
                See all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filtered.map(p => <ProfileCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* Online now */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white/70">
                Online now
                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-green-400 relative top-[-1px]" />
              </h2>
              <Link href="/discover" className="text-xs font-semibold text-[#E8336D] no-underline">See all</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {displayProfiles.filter(p => p.online).map(p => (
                <Link key={p.id} href="/discover" className="flex-shrink-0 flex flex-col items-center gap-1 no-underline">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                      style={{ background: p.bg }}>
                      {p.name[0]}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0A0A0F] rounded-full" />
                  </div>
                  <span className="text-[11px] text-white/50">{p.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Super likes prompt — minimal */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111118] border border-white/6 mb-8">
            <div>
              <p className="text-white text-sm font-semibold">2 Super Likes remaining</p>
              <p className="text-white/35 text-xs mt-0.5">Super Likes get 3× more replies</p>
            </div>
            <Link href="/discover"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E8336D] text-white text-xs font-semibold no-underline hover:opacity-90 transition-opacity">
              <Star size={12} /> Use Now
            </Link>
          </div>

          {/* New members */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white/70">New members</h2>
              <Link href="/discover" className="text-xs font-semibold text-[#E8336D] no-underline">See all</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {displayProfiles.slice(2).map(p => <ProfileCard key={p.id} p={p} compact />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
