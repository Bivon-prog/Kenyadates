"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Phone, Heart, ArrowRight, Shield, MessageCircle, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [method,      setMethod]      = useState<"email"|"phone">("email");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [error,       setError]       = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const id = method === "email" ? email : phone;
    if (!id || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(method === "email" ? { email: id, password } : { phoneNumber: id, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials. Please try again.");
      login(data.token, data.user);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">

      {/* ── Left panel — branding (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0D0D0D] border-r border-white/6 p-12 relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-2xl bg-[#E8336D] flex items-center justify-center shadow-lg">
              <Heart size={20} fill="white" color="white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Kenya<span style={{ color: "#E8336D" }}>dates</span>
            </span>
          </Link>
        </div>

        {/* Centre copy */}
        <div className="relative">
          <h1 className="text-4xl font-black text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Real People.<br />
            <span style={{ color: "#E8336D" }}>Real Connections.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Join 50,000+ verified singles across Kenya. Swahili chat, M-Pesa payments, face-verified profiles.
          </p>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: Shield,       text: "Face-verified profiles — no catfishing" },
              { icon: MessageCircle,text: "Real-time chat with Swahili translation" },
              { icon: Users,        text: "50,000+ active members across Kenya" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8336D]/12 border border-[#E8336D]/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} color="#E8336D" />
                </div>
                <span className="text-white/60 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative text-white/25 text-xs">© 2026 Kenyandates · Made in Kenya 🇰🇪</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-2xl bg-[#E8336D] flex items-center justify-center">
                <Heart size={20} fill="white" color="white" />
              </div>
              <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kenya<span style={{ color: "#E8336D" }}>dates</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1.5">Welcome back 👋</h2>
            <p className="text-white/45 text-base">Sign in to continue your journey</p>
          </div>

          {/* Method toggle */}
          <div className="flex bg-[#111118] border border-white/8 rounded-2xl p-1.5 gap-1.5 mb-6">
            {[{ id: "email", label: "Email", icon: Mail }, { id: "phone", label: "Phone", icon: Phone }].map(m => (
              <button key={m.id} type="button"
                onClick={() => { setMethod(m.id as any); setError(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: method === m.id ? "#E8336D" : "transparent",
                  color: method === m.id ? "white" : "rgba(255,255,255,0.4)",
                }}>
                <m.icon size={15} /> {m.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3.5 text-red-400 text-sm mb-5 flex items-start gap-2.5">
              <span className="mt-0.5 flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email / Phone */}
            {method === "email" ? (
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required autoComplete="email"
                    className="w-full bg-[#111118] border border-white/8 rounded-2xl pl-11 pr-4 text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#E8336D]/60"
                    style={{ height: 52, fontSize: 16 }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-white/55 mb-2">Phone number</label>
                <div className="flex gap-0">
                  <div className="flex items-center px-4 bg-[#111118] border border-white/8 border-r-0 rounded-l-2xl text-white/50 text-sm whitespace-nowrap flex-shrink-0" style={{ height: 52 }}>
                    🇰🇪 +254
                  </div>
                  <input
                    type="tel" placeholder="7XX XXX XXX"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    required autoComplete="tel"
                    className="flex-1 bg-[#111118] border border-white/8 rounded-r-2xl px-4 text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#E8336D]/60"
                    style={{ height: 52, fontSize: 16 }}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white/55">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#E8336D] font-medium no-underline hover:opacity-80">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password"
                  className="w-full bg-[#111118] border border-white/8 rounded-2xl px-4 pr-12 text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#E8336D]/60"
                  style={{ height: 52, fontSize: 16 }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-bold text-white text-base rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ height: 54, background: "linear-gradient(135deg, #E8336D, #FF6B9D)" }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in…</>
                : <><span>Sign In</span><ArrowRight size={18} /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <p className="text-center text-base text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#E8336D] font-bold no-underline hover:opacity-80">Join Free</Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8">
            {["🔒 Secure", "✅ Verified", "🇰🇪 Kenya"].map(t => (
              <span key={t} className="text-xs text-white/25">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
