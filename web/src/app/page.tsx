"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Shield, Globe, Star, ChevronRight, MapPin, MessageCircle, Video, Coins, Crown, Check, Menu, X, Sparkles, Users, Lock } from "lucide-react";

import InstallPrompt from "@/components/InstallPrompt";

const HERO_PROFILES = [
  { name: "Amina", age: 26, city: "Nairobi", verified: true, online: true, bg: "from-pink-500 to-rose-600", emoji: "👩🏾" },
  { name: "James", age: 29, city: "Mombasa", verified: true, online: false, bg: "from-purple-500 to-indigo-600", emoji: "👨🏾" },
  { name: "Fatuma", age: 24, city: "Kisumu", verified: true, online: true, bg: "from-amber-500 to-orange-600", emoji: "👩🏿" },
  { name: "Brian", age: 31, city: "Kampala", verified: false, online: true, bg: "from-teal-500 to-cyan-600", emoji: "👨🏽" },
  { name: "Grace", age: 27, city: "Dar es Salaam", verified: true, online: false, bg: "from-rose-500 to-pink-600", emoji: "👩🏾" },
  { name: "Kevin", age: 28, city: "Eldoret", verified: true, online: true, bg: "from-blue-500 to-violet-600", emoji: "👨🏾" },
];

const FEATURES = [
  { icon: Shield, title: "Face Verified Profiles", desc: "Every profile is verified with Smile Identity AI — only real people, no catfishing.", color: "var(--success)" },
  { icon: MapPin, title: "Local & East African", desc: "Find matches in Nairobi, Mombasa, Kampala, Dar es Salaam and across the region.", color: "var(--accent-primary)" },
  { icon: MessageCircle, title: "Real-Time Chat", desc: "Instant messaging with voice notes, photo sharing and AI-assisted translation.", color: "#6C63FF" },
  { icon: Globe, title: "11 Languages", desc: "Chat in English, Swahili, French and 8 more languages with live translation.", color: "#00C9A7" },
  { icon: Video, title: "In-App Video Calls", desc: "Go from chat to face-to-face with secure in-app audio & video calls.", color: "var(--accent-gold)" },
  { icon: Lock, title: "Privacy First", desc: "Control exactly who sees your location, photos, and online status.", color: "#FF6B6B" },
];

const PLANS = [
  { name: "Free", price: "0", period: "forever", color: "var(--border)", textColor: "var(--text-secondary)", features: ["Basic profile", "5 likes/day", "Limited messaging", "Location search"], cta: "Get Started", popular: false },
  { name: "Gold", price: "999", period: "month", color: "var(--accent-primary)", textColor: "white", gradient: "var(--gradient-primary)", features: ["Unlimited likes", "See who liked you", "Advanced filters", "Chat translation", "Profile boost 1×/week"], cta: "Go Gold", popular: true },
  { name: "Platinum", price: "1,899", period: "month", color: "var(--accent-gold)", textColor: "#0D0D0D", gradient: "var(--gradient-gold)", features: ["Everything in Gold", "Video calls (5hrs/mo)", "Super Likes 5×/day", "Incognito browsing", "Priority support"], cta: "Go Platinum", popular: false },
  { name: "Diamond", price: "3,499", period: "month", color: "#A78BFA", textColor: "white", gradient: "linear-gradient(135deg,#A78BFA,#6C63FF)", features: ["Everything in Platinum", "Unlimited video calls", "AI match insights", "Top profile placement", "Dedicated support"], cta: "Go Diamond", popular: false },
];

const TESTIMONIALS = [
  { name: "Wanjiku M.", city: "Nairobi", text: "I met my husband on Kenyandates! The face verification made me feel so safe.", rating: 5, emoji: "👩🏾" },
  { name: "David O.", city: "Kisumu", text: "The translation feature is amazing — I'm chatting with someone in Tanzania!", rating: 5, emoji: "👨🏾" },
  { name: "Aisha K.", city: "Mombasa", text: "So many genuine people here. Finally a dating app made for us.", rating: 5, emoji: "👩🏿" },
];

const STEPS = [
  { step: "01", title: "Create Your Profile", desc: "Sign up with your phone, add photos and tell your story.", icon: "📱" },
  { step: "02", title: "Get Face Verified", desc: "Complete face verification to get your verified badge and 150 free Coins.", icon: "✅" },
  { step: "03", title: "Discover & Match", desc: "Browse profiles, like the ones you love, and match with people who like you back.", icon: "💘" },
  { step: "04", title: "Chat & Connect", desc: "Start chatting, call, send gifts and build a real connection.", icon: "💬" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 24px",
        background: scrolled ? "rgba(13,13,13,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Heart size={18} fill="white" color="white" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "white" }}>
            Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
          {["Features", "How It Works", "Pricing", "Stories"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>{item}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <InstallPrompt />
          <Link href="/login" className="btn-secondary" style={{ padding: "10px 24px", fontSize: 14 }}>Sign In</Link>
          <Link href="/register" className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}>Join Free</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", color: "white", cursor: "pointer" }} className="md:hidden block">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 80, position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, background: "rgba(232,51,109,0.12)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "5%", width: 300, height: 300, background: "rgba(108,99,255,0.1)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div style={{ animationDelay: "0.1s" }} className="animate-fade-in">
            <div className="badge badge-pink" style={{ marginBottom: 24, width: "fit-content" }}>
              <Sparkles size={12} /> East Africa&apos;s Dating Platform
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px,5vw,68px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
              Real People.<br />
              <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Real Connections.</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Meet verified singles from Kenya, Uganda, Tanzania and across East Africa. Face-verified profiles. Real conversations. Genuine relationships.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
                Start For Free <ChevronRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary" style={{ fontSize: 16, padding: "16px 36px" }}>
                See How It Works
              </a>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[["50K+", "Members"], ["98%", "Verified"], ["4.9★", "Rating"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 24, fontWeight: 800, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Profile cards grid */}
          <div style={{ position: "relative", height: 520 }} className="animate-fade-in">
            {HERO_PROFILES.map((p, i) => {
              const positions = [
                { top: "0%", left: "10%", rotate: "-3deg", scale: 1 },
                { top: "0%", right: "0%", rotate: "4deg", scale: 0.95 },
                { top: "35%", left: "0%", rotate: "-2deg", scale: 0.92 },
                { top: "35%", right: "5%", rotate: "3deg", scale: 0.98 },
                { top: "65%", left: "15%", rotate: "2deg", scale: 0.9 },
                { top: "65%", right: "2%", rotate: "-4deg", scale: 0.88 },
              ];
              const pos = positions[i];
              return (
                <div key={p.name} className="glass" style={{
                  position: "absolute", ...pos,
                  transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                  borderRadius: "var(--radius-lg)", padding: "16px", width: 150,
                  transition: "transform 0.3s ease",
                  animationDelay: `${i * 0.1}s`,
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(0deg) scale(1.05)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(${pos.rotate}) scale(${pos.scale})`; }}
                >
                  <div style={{
                    width: "100%", aspectRatio: "1", borderRadius: "var(--radius-md)",
                    background: `linear-gradient(135deg, ${p.bg.replace("from-", "").replace(" to-", ", ")})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 40, marginBottom: 10
                  }}
                    className={`bg-gradient-to-br ${p.bg}`}
                  >
                    {p.emoji}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{p.name}, {p.age}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{p.city}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
                    {p.verified && <span className="badge badge-success" style={{ fontSize: 10, padding: "2px 6px" }}>✓ Verified</span>}
                    {p.online && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--success)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />Online</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="badge badge-pink" style={{ marginBottom: 16, display: "inline-flex" }}><Shield size={12} /> Why Kenyandates</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16 }}>
            Built for <span className="gradient-text">East Africa</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>Everything you need for safe, genuine connections — designed for our culture.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card" style={{ padding: 32, transition: "all 0.3s ease", animationDelay: `${i * 0.1}s` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
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

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: "var(--bg-surface)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "rgba(232,51,109,0.05)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-pink" style={{ marginBottom: 16, display: "inline-flex" }}><Heart size={12} /> Your Journey</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700 }}>How It Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ textAlign: "center", position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 40, left: "60%", width: "80%", height: 1, background: "var(--border)", display: "none" }} />
                )}
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(232,51,109,0.15)", border: "2px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>
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

      {/* Pricing */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="badge badge-gold" style={{ marginBottom: 16, display: "inline-flex" }}><Crown size={12} /> Membership</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16 }}>Choose Your Plan</h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)" }}>Start free. Upgrade when you&apos;re ready.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{
              borderRadius: "var(--radius-xl)", padding: 32, position: "relative",
              background: plan.popular ? "rgba(232,51,109,0.06)" : "var(--bg-card)",
              border: plan.popular ? "2px solid var(--accent-primary)" : "1px solid var(--border)",
              transition: "all 0.3s ease"
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "var(--gradient-primary)", borderRadius: "var(--radius-full)", padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                  ✨ Most Popular
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
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: plan.gradient || "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} color={plan.textColor} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{
                display: "block", textAlign: "center", padding: "14px", borderRadius: "var(--radius-full)",
                background: plan.gradient || "var(--bg-elevated)", color: plan.textColor || "white",
                fontWeight: 700, fontSize: 14, textDecoration: "none",
                border: plan.gradient ? "none" : "1px solid var(--border)",
                transition: "all 0.2s"
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

      {/* Testimonials */}
      <section id="stories" style={{ padding: "100px 24px", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge badge-success" style={{ marginBottom: 16, display: "inline-flex" }}><Users size={12} /> Success Stories</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700 }}>Real Love Stories</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: 32 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
                </div>
                <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,51,109,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{t.emoji}</div>
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

      {/* CTA Banner */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(232,51,109,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 40 }} className="animate-pulse-glow">
            💘
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 20 }}>
            Ready to Find Your <span className="gradient-text">Match?</span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.7 }}>
            Join 50,000+ verified singles across East Africa. Create your free profile and get 150 Coins to start your journey.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 17, padding: "18px 48px" }}>
              Join Free — Get 150 Coins <Coins size={18} />
            </Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>No credit card required. Face verified in minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Heart size={16} fill="white" color="white" />
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Kenyandates</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>Real People. Real Connections. Kenya&apos;s most trusted dating platform.</p>
            </div>
            {[
              { title: "Platform", links: ["Features", "How It Works", "Pricing", "Download App"] },
              { title: "Company", links: ["About Us", "Success Stories", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Community Guidelines", "Cookie Policy"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize: 14, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-secondary)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2025 Kenyandates. All rights reserved.</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Made with ❤️ in Nairobi, Kenya 🇰🇪</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
