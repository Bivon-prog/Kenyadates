"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, Star, MapPin, Crown, Coins, Shield, Heart, Zap, ChevronRight, Flame, Users, CheckCircle } from "lucide-react";
import { getProfileAvatar } from "@/lib/avatar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MOCK_PROFILES = [
  { id: 1, name: "Amina",   age: 26, city: "Nairobi", distance: "2 km",   verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", interests: ["Travel","Fitness","Music"] },
  { id: 2, name: "James",   age: 29, city: "Mombasa", distance: "350 km", verified: true,  online: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", interests: ["Sports","Business","Cooking"] },
  { id: 3, name: "Grace",   age: 24, city: "Kisumu",  distance: "350 km", verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80", interests: ["Dancing","Art","Reading"] },
  { id: 4, name: "Kevin",   age: 31, city: "Eldoret", distance: "310 km", verified: false, online: true,  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", interests: ["Fitness","Tech","Nature"] },
  { id: 5, name: "Fatuma",  age: 27, city: "Nairobi", distance: "5 km",   verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80", interests: ["Fashion","Photography"] },
  { id: 6, name: "Wanjiru", age: 25, city: "Nakuru",  distance: "160 km", verified: true,  online: false, photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80", interests: ["Music","Food","Nature"] },
];

const SECTIONS = ["Recommended","New Members","Online Now","Near You","Popular","Verified"];

function ProfileCard({ p, compact = false }: { p: any; compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  const aspect = compact ? "aspect-square" : "aspect-[3/4]";
  const photoUrl = getProfileAvatar(p.photo || p.photos?.[0], p.name, p.id);

  return (
    <div className={`rounded-2xl overflow-hidden bg-[#111118] border border-white/8 cursor-pointer hover:-translate-y-1 transition-transform relative group`}>
      <div className={`${aspect} relative flex items-center justify-center bg-[#1A1A2E]`}>
        <img src={photoUrl} className="w-full h-full object-cover" alt={p.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        
        {/* Online */}
        {p.online && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-black" />}
        
        {/* Verified */}
        {p.verified && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1">
            <CheckCircle size={10} className="text-blue-400" />
            <span className="text-blue-400 text-[10px] font-bold">ID</span>
          </span>
        )}
        
        {/* Info overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-10 pr-10">
          <p className="text-white font-bold text-sm sm:text-base leading-tight truncate">{p.name}, {p.age}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-white/60 flex-shrink-0" />
            <span className="text-white/60 text-xs truncate">{p.city}</span>
          </div>
          {!compact && p.interests?.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-1.5">
              {p.interests.slice(0, 2).map((i: string) => (
                <span key={i} className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium">{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Like btn */}
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20"
          style={{ background: liked ? "#E8336D" : "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
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
  const [profiles, setProfiles] = useState(MOCK_PROFILES);

  useEffect(() => {
    const token = localStorage.getItem("kd_token");
    if (!token) return;
    fetch(`${API}/wallet/balance`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null).then(d => { if (d?.balance !== undefined) setMyCoins(d.balance); }).catch(() => {});
    fetch(`${API}/discovery/recommendations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : []).then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setProfiles(d.map((rp: any, i: number) => ({
            id: i + 100, name: rp.displayName, age: rp.age, city: rp.city,
            distance: rp.city ?? "Kenya", verified: rp.user?.verificationStatus === "VERIFIED",
            online: rp.isOnline ?? false,
            photo: getProfileAvatar(rp.photos?.[0], rp.displayName, i),
            interests: (rp.interests ?? []).slice(0,3).map((x: string) => x.replace(/\s*[^\w\s].*/, "")),
          })));
        }
      }).catch(() => {});
    try { const u = JSON.parse(localStorage.getItem("kd_user") ?? "{}"); setMyName(u.profile?.displayName?.split(" ")[0] ?? ""); } catch {}
  }, []);

  const filtered = search ? profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())) : profiles;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-[76px] top-0 bottom-0 w-56 border-r border-white/6 bg-[#0A0A0F] py-6 px-4 z-40">
        <Link href="/" className="flex items-center gap-2.5 mb-8 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E8336D]">
            <Heart size={15} fill="white" color="white" />
          </div>
          <span className="text-white font-bold text-base">KenyaDates</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {[{icon:Flame,label:"Discover",href:"/discover"},{icon:Users,label:"Explore",href:"/explore"},{icon:Heart,label:"Likes",href:"/likes"},{icon:Bell,label:"Matches",href:"/matches"}].map(item => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all no-underline">
              <item.icon size={18} />{item.label}
            </Link>
          ))}
        </nav>
        <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(245,197,66,0.07)", border: "1px solid rgba(245,197,66,0.18)" }}>
          <p className="text-[#F5C542] text-xs font-semibold mb-1">My Coins</p>
          <p className="text-white font-black text-xl mb-3">{myCoins > 0 ? myCoins.toLocaleString() : 0} 🪙</p>
          <Link href="/wallet" className="block text-center py-2 rounded-xl text-white text-sm font-bold no-underline hover:opacity-90" style={{ background: "var(--gradient-gold)", color: "#0D0D0D" }}>Buy Coins</Link>
        </div>
        <Link href="/wallet" className="flex items-center gap-2.5 px-4 py-3 rounded-xl no-underline" style={{ background: "var(--gradient-primary)" }}>
          <Crown size={15} color="white" />
          <span className="text-white text-sm font-bold">Upgrade to Gold</span>
        </Link>
      </aside>

      <main className="lg:pl-56 page-pb">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-white">{myName ? `Hey ${myName} 👋` : "Hey there 👋"}</h1>
              <p className="text-white/40 text-sm mt-0.5">Find someone worth meeting</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSearch(s => !s)} className="w-11 h-11 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Search size={18} className="text-white/60" />
              </button>
              <button className="relative w-11 h-11 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Bell size={18} className="text-white/60" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8336D]" />
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mb-5">
              <input className="input" style={{ fontSize: 16 }} placeholder="Search by name or city…" autoFocus value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          )}

          {/* Section tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                style={{ background: activeSection === s ? "#E8336D" : "rgba(255,255,255,0.06)", color: activeSection === s ? "white" : "rgba(255,255,255,0.5)" }}>
                {s}
              </button>
            ))}
          </div>

          {/* Recommended grid */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Recommended for you</h2>
              <Link href="/discover" className="text-sm font-semibold text-[#E8336D] no-underline flex items-center gap-0.5">See all <ChevronRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map(p => <ProfileCard key={p.id} p={p} />)}
            </div>
          </section>

          {/* Online now */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Online now <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              </h2>
              <Link href="/discover" className="text-sm font-semibold text-[#E8336D] no-underline">See all</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              {profiles.filter(p => p.online).map((p, i) => (
                <Link key={p.id} href="/discover" className="flex-shrink-0 flex flex-col items-center gap-2 no-underline">
                  <div className="relative">
                    <img src={getProfileAvatar(p.photo, p.name, i)} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#E8336D]" />
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-[#0A0A0F] rounded-full" />
                  </div>
                  <span className="text-xs text-white/55 font-medium">{p.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Super likes banner */}
          <div className="flex items-center justify-between p-5 rounded-2xl mb-8" style={{ background: "rgba(232,51,109,0.07)", border: "1px solid rgba(232,51,109,0.18)" }}>
            <div>
              <p className="text-white font-bold text-base">2 Super Likes left</p>
              <p className="text-white/40 text-sm mt-0.5">Stand out — 3× more replies</p>
            </div>
            <Link href="/discover" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold no-underline hover:opacity-90" style={{ background: "#E8336D" }}>
              <Star size={14} /> Use Now
            </Link>
          </div>

          {/* New members */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">New members</h2>
              <Link href="/discover" className="text-sm font-semibold text-[#E8336D] no-underline">See all</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {profiles.slice(2).map(p => <ProfileCard key={p.id} p={p} compact />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
