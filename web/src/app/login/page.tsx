"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Phone, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [method,       setMethod]       = useState<"email"|"phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const id = method === "email" ? email : phone;
    if (!id || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const body = method === "email" ? { email: id, password } : { phoneNumber: id, password };
      const res  = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");
      login(data.token, data.user);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const inputH = { minHeight: 56, fontSize: 16 };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E8336D] flex items-center justify-center">
              <Heart size={24} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "white" }}>
              Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-2">Welcome back 👋</h1>
          <p className="text-white/50 text-base">Sign in to continue</p>
        </div>

        <div className="bg-[#111118] border border-white/8 rounded-3xl p-6">
          {/* Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#0D0D0D] rounded-2xl p-1.5 mb-6">
            {[{id:"email",label:"Email",icon:Mail},{id:"phone",label:"Phone",icon:Phone}].map(m => (
              <button key={m.id} onClick={() => { setMethod(m.id as any); setError(""); }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: method === m.id ? "var(--gradient-primary)" : "transparent", color: method === m.id ? "white" : "rgba(255,255,255,0.45)" }}>
                <m.icon size={16} /> {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-[#ff6b9d] text-sm text-center">{error}</div>
            )}

            {method === "email" ? (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input className="input" type="email" placeholder="you@example.com"
                    style={{ ...inputH, paddingLeft: 48 }} value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 text-base pointer-events-none">🇰🇪 +254</span>
                  <input className="input" type="tel" placeholder="7XX XXX XXX"
                    style={{ ...inputH, paddingLeft: 100 }} value={phone} onChange={e => setPhone(e.target.value)} required autoComplete="tel" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white/60 mb-2">Password</label>
              <div className="relative">
                <input className="input" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  style={{ ...inputH, paddingRight: 52 }} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#FF6B9D] font-medium no-underline hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary w-full text-base" style={{ minHeight: 56, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Signing in…" : <span className="flex items-center justify-center gap-2">Sign In <ArrowRight size={18} /></span>}
            </button>
          </form>

          <p className="text-center text-sm text-white/45 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#FF6B9D] font-bold no-underline">Join Free</Link>
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          {["🔒 Secure","✅ Verified","🇰🇪 Made in Kenya"].map(t => (
            <span key={t} className="text-xs text-white/30">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
