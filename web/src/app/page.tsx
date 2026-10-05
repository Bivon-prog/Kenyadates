"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Shield, Globe, Star, ChevronRight, MapPin, MessageCircle, Video, Coins, Crown, Check, Menu, X, Users, Lock } from "lucide-react";
import InstallPrompt from "@/components/InstallPrompt";

const HERO_PROFILES = [
  { name: "Amina",  age: 26, city: "Nairobi", verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { name: "James",  age: 29, city: "Mombasa", verified: true,  online: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { name: "Fatuma", age: 24, city: "Kisumu",  verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" },
  { name: "Kevin",  age: 28, city: "Eldoret", verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
  { name: "Grace",  age: 27, city: "Nakuru",  verified: true,  online: false, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
  { name: "Brian",  age: 31, city: "Thika",   verified: true,  online: true,  photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
];


const FEATURES = [
  { icon: Shield,       title: "Face Verified Profiles", desc: "Every profile verified — only real people, no catfishing.",               color: "var(--success)" },
  { icon: MapPin,       title: "Kenya First",            desc: "Find matches across Nairobi, Mombasa, Kisumu and all of Kenya.",          color: "var(--accent-primary)" },
  { icon: MessageCircle,title: "Real-Time Chat",         desc: "Instant messaging with voice notes and Swahili translation.",             color: "#6C63FF" },
  { icon: Globe,        title: "11 Languages",           desc: "Chat in English, Swahili, French and more with live translation.",        color: "#00C9A7" },
  { icon: Video,        title: "In-App Video Calls",     desc: "Go from chat to face-to-face with secure in-app calls.",                  color: "var(--accent-gold)" },
  { icon: Lock,         title: "Privacy First",          desc: "Control exactly who sees your location, photos and online status.",       color: "#FF6B6B" },
];

const PLANS = [
  { name: "Free",     price: "0",     period: "forever", features: ["Basic profile", "5 likes/day", "Limited messaging", "Location search"],                                                          cta: "Get Started", popular: false, gradient: "", textColor: "var(--text-secondary)" },
  { name: "Gold",     price: "999",   period: "month",   features: ["Unlimited likes", "See who liked you", "Advanced filters", "Chat translation", "Profile boost 1×/week"],                       cta: "Go Gold",     popular: true,  gradient: "var(--gradient-primary)",       textColor: "white" },
  { name: "Platinum", price: "1,899", period: "month",   features: ["Everything in Gold", "Video calls 5hrs/mo", "Super Likes 5×/day", "Incognito browsing", "Priority support"],                  cta: "Go Platinum", popular: false, gradient: "var(--gradient-gold)",          textColor: "#0D0D0D" },
  { name: "Diamond",  price: "3,499", period: "month",   features: ["Everything in Platinum", "Unlimited video calls", "Top profile placement", "Dedicated support"],                              cta: "Go Diamond",  popular: false, gradient: "linear-gradient(135deg,#A78BFA,#6C63FF)", textColor: "white" },
];

const TESTIMONIALS = [
  { name: "Wanjiku M.", city: "Nairobi", text: "I met my husband on Kenyandates! The face verification made me feel so safe.", rating: 5 },
  { name: "David O.",   city: "Kisumu",  text: "The translation feature is amazing — I'm chatting with someone in Tanzania!", rating: 5 },
  { name: "Aisha K.",   city: "Mombasa", text: "So many genuine people here. Finally a dating app made for us.",              rating: 5 },
];

const STEPS = [
  { step: "01", title: "Create Your Profile", desc: "Sign up, add photos and tell your story.",                                           icon: "📱" },
  { step: "02", title: "Get Face Verified",   desc: "Quick selfie to get your verified badge and 150 free Coins.",                        icon: "✅" },
  { step: "03", title: "Discover & Match",    desc: "Browse profiles, like the ones you love and match with people who like you back.",   icon: "💘" },
  { step: "04", title: "Chat & Connect",      desc: "Start chatting, call, send gifts and build a real connection.",                      icon: "💬" },
];

// Footer link map — real pages or /coming-soon
const FOOTER_LINKS: Record<string, Record<string, string>> = {
  Platform: {
    "Features":     "#features",
    "How It Works": "#how-it-works",
    "Pricing":      "#pricing",
    "Download App": "#",
  },
  Company: {
    "About Us":        "/about",
    "Success Stories": "#stories",
    "Blog":            "/blog",
    "Careers":         "/careers",
  },
  Legal: {
    "Privacy Policy":        "/privacy",
    "Terms of Service":      "/terms",
    "Community Guidelines":  "/guidelines",
    "Cookie Policy":         "/cookies",
  },
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features",     href: "#features"      },
    { label: "How It Works", href: "#how-it-works"  },
    { label: "Pricing",      href: "#pricing"       },
    { label: "Stories",      href: "#stories"       },
  ];

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-[200] px-4 sm:px-8 py-3.5 bg-[#0D0D12]/95 backdrop-blur-xl border-b border-white/10 transition-all flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#E8336D] flex items-center justify-center shadow-lg">
            <Heart size={20} fill="white" color="white" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
            Kenya<span className="text-[#E8336D]">dates</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href}
              className="text-white/70 hover:text-white text-sm font-semibold transition-colors no-underline">
              {label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <InstallPrompt variant="button" className="hidden sm:flex" />
          <InstallPrompt variant="badge" className="flex sm:hidden" />
          
          <Link href="/login" className="hidden sm:inline-flex px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 font-bold text-xs sm:text-sm transition-all no-underline">
            Sign In
          </Link>
          <Link href="/register" className="hidden sm:inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity no-underline">
            Join Free
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 text-white border border-white/15">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] z-[190] bg-[#12121A]/98 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl space-y-4">
          <InstallPrompt variant="banner" />

          <div className="flex flex-col gap-2">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white text-base font-semibold py-2.5 border-b border-white/5 no-underline">
                {label}
              </a>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="flex-1 py-3 text-center rounded-2xl border border-white/20 text-white font-bold text-sm no-underline bg-white/5">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="flex-1 py-3 text-center rounded-2xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white font-extrabold text-sm no-underline shadow-lg">
              Join Free
            </Link>
          </div>
        </div>
      )}


      {/* ── Hero — Change 18: navbar no longer overlaps hero text (z-index fixed) ── */}
      <section className="relative min-h-screen flex items-center pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

          {/* Left */}
          <div className="animate-fade-in text-center lg:text-left">
            {/* Change 19 & 20: removed the oval "Kenya's #1 Dating App" badge entirely */}
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[clamp(2.8rem,5vw,4.5rem)] font-bold leading-tight mb-6 text-white">
              Real People.<br />
              <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Real Connections.
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Meet verified singles from Nairobi, Mombasa, Kisumu and all across Kenya.
              Face-verified profiles, Swahili chat, and M-Pesa payments — built for us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href="/register" className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2">
                Start For Free <ChevronRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-4 flex items-center justify-center">
                See How It Works
              </a>
            </div>
            <div className="flex gap-8 justify-center lg:justify-start flex-wrap">
              {[["50K+", "Members"], ["98%", "Verified"], ["4.9★", "Rating"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-3xl font-black" style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
                  <div className="text-sm text-white/50 mt-1 font-medium tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — profile cards */}
          <div className="relative h-[400px] lg:h-[520px] w-full max-w-[400px] mx-auto lg:mr-0 animate-fade-in">
            {HERO_PROFILES.map((p, i) => {
              const pos = [
                { top: "0%",  left: "10%", rotate: "-3deg", scale: 1    },
                { top: "0%",  right: "0%", rotate:  "4deg", scale: 0.95 },
                { top: "35%", left:  "0%", rotate: "-2deg", scale: 0.92 },
                { top: "35%", right: "5%", rotate:  "3deg", scale: 0.98 },
                { top: "65%", left: "15%", rotate:  "2deg", scale: 0.9  },
                { top: "65%", right: "2%", rotate: "-4deg", scale: 0.88 },
              ][i];
              return (
                <div key={p.name} className="glass" style={{
                  position: "absolute", ...pos,
                  transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                  borderRadius: "var(--radius-lg)", padding: 12, width: 148,
                  transition: "transform 0.3s ease",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) scale(1.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(${pos.rotate}) scale(${pos.scale})`; }}
                >
                  <div className="w-full aspect-square rounded-xl mb-2.5 flex items-center justify-center relative overflow-hidden bg-[#1E1E2E]">
                    <img src={p.photo} className="w-full h-full object-cover" alt={p.name} />
                    {p.online && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-black" />}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{p.name}, {p.age}</p>
                  <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{p.city}</p>
                  {p.verified && <p style={{ fontSize: 10, color: "#60A5FA", fontWeight: 600, marginTop: 4 }}>✓ Verified</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features — Change 21: removed "Why Kenyandates" badge pill ── */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          {/* No badge/pill — just heading */}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 700, marginBottom: 16 }}>
            Built for <span className="gradient-text">Kenya</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Everything you need for safe, genuine connections — designed for our culture.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: 32, transition: "all 0.3s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: "var(--radius-md)", background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works — Change 21: removed "Your Journey" badge pill ── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 700 }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {STEPS.map(s => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(232,51,109,0.12)",
                  border: "2px solid var(--border-accent)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-primary)", marginBottom: 8, letterSpacing: 2 }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing — Change 22: removed "Membership" badge pill ── */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 700, marginBottom: 16 }}>
            Choose Your Plan
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Start free. Upgrade when you&apos;re ready.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              borderRadius: "var(--radius-xl)", padding: 32, position: "relative",
              background: plan.popular ? "rgba(232,51,109,0.06)" : "var(--bg-card)",
              border: plan.popular ? "2px solid var(--accent-primary)" : "1px solid var(--border)",
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--gradient-primary)", borderRadius: "var(--radius-full)",
                  padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: 1 }}>{plan.name.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>KES</span>
                  <span style={{ fontSize: 40, fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>/{plan.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: plan.gradient || "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Check size={11} color={plan.textColor} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{
                display: "block", textAlign: "center", padding: 14, borderRadius: "var(--radius-full)",
                background: plan.gradient || "var(--bg-elevated)", color: plan.textColor || "white",
                fontWeight: 700, fontSize: 14, textDecoration: "none",
                border: plan.gradient ? "none" : "1px solid var(--border)",
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
          💳 Pay with M-Pesa, Google Play, Apple Pay or Card. Cancel anytime.
        </p>
      </section>

      {/* ── Stories — Change 23: removed "Success Stories" badge pill ── */}
      <section id="stories" style={{ padding: "100px 24px", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,4vw,56px)", fontWeight: 700 }}>
              Real Love Stories
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: 32 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
                </div>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#C2185B",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white" }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 20 }}>
            Ready to Find Your <span className="gradient-text">Match?</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.7 }}>
            Join 50,000+ verified singles across Kenya. Create your free profile and get 150 Coins to start.
          </p>
          <Link href="/register" className="btn-primary" style={{ fontSize: 17, padding: "18px 48px" }}>
            Join Free — Get 150 Coins <Coins size={18} />
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>No credit card required.</p>
        </div>
      </section>

      {/* ── Footer — Change 25: all links go to real pages or coming-soon ── */}
      <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E8336D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={16} fill="white" color="white" />
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Kenyandates</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
                Real People. Real Connections. Kenya&apos;s most trusted dating platform.
              </p>
            </div>
            {Object.entries(FOOTER_LINKS).map(([col, links]) => (
              <div key={col}>
                <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>{col}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(links).map(([label, href]) => (
                    <li key={label}>
                      {href.startsWith("#") ? (
                        <a href={href} style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-secondary)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                          {label}
                        </a>
                      ) : (
                        <Link href={href} style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-secondary)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2026 Kenyandates. All rights reserved.</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Made with ❤️ in Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
