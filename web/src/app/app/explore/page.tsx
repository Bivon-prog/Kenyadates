"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, User, Home, Compass, Search, Filter, X, MapPin, Shield, Crown, ChevronDown, SlidersHorizontal, Star } from "lucide-react";

const ALL_PROFILES = [
  { id: 1, name: "Amina", age: 26, city: "Nairobi", distance: "2 km", verified: true, online: true, premium: "gold", goal: "Serious Relationship", interests: ["Travel ✈️", "Fitness 💪", "Music 🎵"], emoji: "👩🏾", match: 94 },
  { id: 2, name: "James", age: 29, city: "Mombasa", distance: "350 km", verified: true, online: false, premium: "platinum", goal: "Marriage", interests: ["Sports ⚽", "Business 📈"], emoji: "👨🏾", match: 87 },
  { id: 3, name: "Grace", age: 24, city: "Kisumu", distance: "350 km", verified: true, online: true, premium: null, goal: "Casual Dating", interests: ["Dancing 💃", "Art 🎨"], emoji: "👩🏿", match: 91 },
  { id: 4, name: "Kevin", age: 31, city: "Eldoret", distance: "310 km", verified: false, online: true, premium: "gold", goal: "Serious Relationship", interests: ["Fitness 💪", "Tech 💻"], emoji: "👨🏽", match: 78 },
  { id: 5, name: "Fatuma", age: 27, city: "Nairobi", distance: "5 km", verified: true, online: true, premium: "diamond", goal: "Friendship", interests: ["Fashion 👗", "Photography 📸"], emoji: "👩🏾", match: 96 },
  { id: 6, name: "Brian", age: 28, city: "Kampala", distance: "650 km", verified: true, online: false, premium: null, goal: "Marriage", interests: ["Music 🎵", "Gaming 🎮"], emoji: "👨🏾", match: 82 },
  { id: 7, name: "Aisha", age: 25, city: "Nairobi", distance: "8 km", verified: true, online: true, premium: "gold", goal: "Serious Relationship", interests: ["Reading 📚", "Travel ✈️"], emoji: "👩🏾", match: 89 },
  { id: 8, name: "Dennis", age: 33, city: "Nakuru", distance: "156 km", verified: false, online: false, premium: null, goal: "Marriage", interests: ["Business 📈", "Nature 🌿"], emoji: "👨🏾", match: 71 },
  { id: 9, name: "Cynthia", age: 23, city: "Nairobi", distance: "3 km", verified: true, online: true, premium: "platinum", goal: "Casual Dating", interests: ["Art 🎨", "Food 🍽️"], emoji: "👩🏽", match: 85 },
  { id: 10, name: "Moses", age: 30, city: "Dar es Salaam", distance: "830 km", verified: true, online: true, premium: null, goal: "Serious Relationship", interests: ["Sports ⚽", "Cooking 👨‍🍳"], emoji: "👨🏿", match: 76 },
  { id: 11, name: "Joyce", age: 28, city: "Nairobi", distance: "11 km", verified: true, online: false, premium: "gold", goal: "Marriage", interests: ["Fitness 💪", "Dancing 💃"], emoji: "👩🏾", match: 88 },
  { id: 12, name: "Peter", age: 27, city: "Kisumu", distance: "355 km", verified: false, online: true, premium: null, goal: "Friendship", interests: ["Gaming 🎮", "Tech 💻"], emoji: "👨🏾", match: 73 },
];

const EXPLORE_TABS = ["For You", "New", "Online", "Popular", "Long-Time", "Verified"];
const PREMIUM_COLORS: Record<string, string> = { gold: "var(--accent-gold)", platinum: "#E5E4E2", diamond: "#A78BFA" };

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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("For You");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [likes, setLikes] = useState<number[]>([]);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 45, maxDistance: 500, verified: false, online: false, premium: false });
  const [profiles, setProfiles] = useState(ALL_PROFILES);
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    fetch('http://localhost:5000/discovery/matches')
      .then(res => res.json())
      .then(data => {
        const fetchedProfiles = data.map((d: any) => ({
          id: parseInt(d.id) + 1000,
          name: d.name,
          age: d.age,
          city: d.location,
          distance: "5 km",
          verified: true,
          online: true,
          premium: "gold",
          goal: "Serious Relationship",
          interests: ["Travel ✈️", "Fitness 💪"],
          emoji: "👩🏾",
          match: 99,
          photoUrl: d.photoUrl
        }));
        setProfiles([...fetchedProfiles, ...ALL_PROFILES]);
      })
      .catch(err => console.error("Error fetching matches:", err));
  }, []);

  const handleMpesa = () => {
    fetch('http://localhost:5000/payments/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, amount, coins: 10 })
    })
    .then(res => res.json())
    .then(data => {
      alert("Success: " + data.message);
      setMpesaModalOpen(false);
    })
    .catch(err => alert("Error: " + err));
  };

  const filtered = profiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Sidebar active="Explore" />

      <main style={{ flex: 1, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 0", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Explore</h1>
            <button onClick={() => setShowFilters(!showFilters)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: "var(--radius-full)",
              background: showFilters ? "var(--gradient-primary)" : "var(--bg-primary)",
              border: "1px solid var(--border)", cursor: "pointer", color: "white", fontSize: 13, fontWeight: 600
            }}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city..." style={{ paddingLeft: 42, paddingRight: 42 }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {EXPLORE_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: "transparent", whiteSpace: "nowrap", transition: "all 0.2s",
                color: activeTab === tab ? "var(--accent-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === tab ? "2px solid var(--accent-primary)" : "2px solid transparent",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="glass" style={{ margin: "16px 28px", borderRadius: "var(--radius-lg)", padding: 24 }} >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Age Range</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" className="input" value={filters.minAge} style={{ textAlign: "center" }} onChange={e => setFilters(f => ({ ...f, minAge: +e.target.value }))} />
                  <span style={{ color: "var(--text-muted)" }}>–</span>
                  <input type="number" className="input" value={filters.maxAge} style={{ textAlign: "center" }} onChange={e => setFilters(f => ({ ...f, maxAge: +e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Max Distance: {filters.maxDistance} km</label>
                <input type="range" min={5} max={2000} value={filters.maxDistance} style={{ width: "100%", accentColor: "var(--accent-primary)" }} onChange={e => setFilters(f => ({ ...f, maxDistance: +e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[{ key: "verified", label: "✅ Verified Only" }, { key: "online", label: "🟢 Online Now" }, { key: "premium", label: "👑 Premium Members" }].map(f => (
                <button key={f.key} onClick={() => setFilters(prev => ({ ...prev, [f.key]: !prev[f.key as keyof typeof prev] }))} style={{
                  padding: "8px 16px", borderRadius: "var(--radius-full)", border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                  borderColor: filters[f.key as keyof typeof filters] ? "var(--accent-primary)" : "var(--border)",
                  background: filters[f.key as keyof typeof filters] ? "rgba(232,51,109,0.1)" : "var(--bg-surface)",
                  color: filters[f.key as keyof typeof filters] ? "var(--accent-secondary)" : "var(--text-secondary)"
                }}>{f.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{filtered.length} people found</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ aspectRatio: "3/4", position: "relative", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {(p as any).photoUrl ? <img src={(p as any).photoUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 70 }}>{p.emoji}</div>}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.95) 0%, transparent 60%)" }} />

                  <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                    {p.verified && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 700, background: "rgba(76,175,130,0.2)", color: "var(--success)", border: "1px solid rgba(76,175,130,0.3)" }}>✓ Verified</span>}
                    {p.premium && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 700, background: `${PREMIUM_COLORS[p.premium]}20`, color: PREMIUM_COLORS[p.premium] }}>{p.premium}</span>}
                  </div>

                  {p.online && <div style={{ position: "absolute", top: 10, right: 10, width: 10, height: 10, background: "var(--success)", borderRadius: "50%", border: "2px solid var(--bg-card)" }} />}

                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{p.name}, {p.age}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                      <MapPin size={11} color="var(--text-muted)" />
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.city} · {p.distance}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.interests.slice(0, 2).map(i => (
                        <span key={i} style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: 10, fontWeight: 600, background: "rgba(232,51,109,0.15)", color: "var(--accent-secondary)", border: "1px solid rgba(232,51,109,0.2)" }}>{i}</span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", gap: 6 }}>
                    <button onClick={e => { e.stopPropagation(); }} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Star size={14} color="var(--accent-gold)" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setLikes(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]); }} style={{ width: 34, height: 34, borderRadius: "50%", background: likes.includes(p.id) ? "var(--gradient-primary)" : "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Heart size={14} fill={likes.includes(p.id) ? "white" : "none"} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {mpesaModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div className="card" style={{ padding: 24, width: 300, background: "var(--bg-surface)" }}>
              <h3 style={{ marginBottom: 16 }}>Buy Premium Coins</h3>
              <input className="input" placeholder="Phone Number (e.g. 07...)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} style={{ marginBottom: 12, width: '100%' }} />
              <input className="input" type="number" placeholder="Amount (KES)" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ marginBottom: 12, width: '100%' }} />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setMpesaModalOpen(false)} style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", background: "transparent", color: "var(--text)", border: "1px solid var(--border)", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleMpesa} style={{ padding: "8px 16px", borderRadius: "var(--radius-full)", background: "var(--gradient-primary)", color: "white", border: "none", cursor: "pointer" }}>Pay</button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Floating Action Button for Premium */}
      <button 
        onClick={() => setMpesaModalOpen(true)}
        style={{
          position: "fixed", bottom: 30, right: 30, 
          padding: "16px 24px", borderRadius: "var(--radius-full)", 
          background: "var(--gradient-primary)", color: "white", 
          border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700,
          boxShadow: "0 4px 12px rgba(232,51,109,0.3)", zIndex: 50
        }}>
        Buy Premium Coins (M-Pesa)
      </button>
    </div>
  );
}
