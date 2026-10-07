"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [method,   setMethod]   = useState<"email"|"phone">("email");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const id = method === "email" ? email : phone;
    if (!id || !password) { setError("Please fill in all fields."); setLoading(false); return; }
    try {
      const API  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const body = method === "email" ? { email: id, password } : { phoneNumber: id, password };
      const res  = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials.");
      login(data.token, data.user);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#151515" }}>

      {/* ── Desktop left/right split ── */}
      <div className="flex flex-1">

        {/* Brand side — desktop only */}
        <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] border-r border-white/5">
          <div className="mb-6">
            <Link href="/" className="no-underline">
              <span className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Kenya<span style={{ color: "#E8336D" }}>dates</span>
              </span>
            </Link>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Find your<br />
            <span style={{ color: "#E8336D" }}>perfect match.</span>
          </h1>
          <p className="text-white/45 text-lg leading-relaxed">
            Join 50,000+ verified singles across Kenya. Real people, real connections.
          </p>
        </div>

        {/* Form side */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-[380px] mx-auto lg:mx-0">

            {/* Mobile logo */}
            <div className="lg:hidden mb-10">
              <Link href="/" className="no-underline">
                <span className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Kenya<span style={{ color: "#E8336D" }}>dates</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-black text-white mb-2">Sign in</h2>
            <p className="text-white/40 text-base mb-10">
              Welcome back. Enter your details below.
            </p>

            {/* Error */}
            {error && (
              <div className="rounded-2xl px-4 py-3.5 mb-6 text-sm text-red-400"
                style={{ background: "rgba(232,65,65,0.1)", border: "1px solid rgba(232,65,65,0.2)" }}>
                {error}
              </div>
            )}

            {/* Toggle */}
            <div className="flex rounded-2xl p-1 mb-8 gap-1" style={{ background: "#222" }}>
              {[["email","Email"],["phone","Phone"]].map(([id,label]) => (
                <button key={id} type="button" onClick={() => { setMethod(id as any); setError(""); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: method === id ? "#E8336D" : "transparent",
                    color: method === id ? "white" : "rgba(255,255,255,0.35)",
                  }}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-5">

              {/* Identifier */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">
                  {method === "email" ? "Email" : "Phone number"}
                </label>
                {method === "email" ? (
                  <input type="email" placeholder="manuela_brown@gmail.com" value={email}
                    onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    className="w-full rounded-2xl px-5 text-white placeholder:text-white/25 outline-none transition-colors"
                    style={{ height: 56, fontSize: 16, background: "#222", border: "none" }}
                    onFocus={e => e.target.style.outline = "2px solid #E8336D"}
                    onBlur={e => e.target.style.outline = "none"} />
                ) : (
                  <div className="flex rounded-2xl overflow-hidden" style={{ background: "#222" }}>
                    <span className="flex items-center px-4 text-white/40 text-sm whitespace-nowrap flex-shrink-0">🇰🇪 +254</span>
                    <input type="tel" placeholder="7XX XXX XXX" value={phone}
                      onChange={e => setPhone(e.target.value)} required autoComplete="tel"
                      className="flex-1 px-2 text-white placeholder:text-white/25 outline-none bg-transparent"
                      style={{ height: 56, fontSize: 16 }} />
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold no-underline" style={{ color: "#E8336D" }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="••••••••••" value={password}
                    onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                    className="w-full rounded-2xl px-5 pr-14 text-white placeholder:text-white/25 outline-none transition-colors"
                    style={{ height: 56, fontSize: 16, background: "#222", border: "none" }}
                    onFocus={e => e.target.style.outline = "2px solid #E8336D"}
                    onBlur={e => e.target.style.outline = "none"} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                    {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full font-black text-white text-lg rounded-full transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                  style={{ height: 58, background: "linear-gradient(135deg, #E8336D 0%, #C2185B 100%)" }}>
                  {loading
                    ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : "Sign in"}
                </button>
              </div>
            </form>

            <p className="text-center text-sm mt-8" style={{ color: "rgba(255,255,255,0.35)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold no-underline" style={{ color: "#E8336D" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
