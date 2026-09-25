"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Phone, Mail, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // In a real app we would support email or phone, but our backend currently accepts phoneNumber
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500, background: "rgba(232,51,109,0.08)", borderRadius: "50%", filter: "blur(100px)" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400, background: "rgba(108,99,255,0.06)", borderRadius: "50%", filter: "blur(80px)" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center" }} className="animate-pulse-glow">
              <Heart size={22} fill="white" color="white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "white" }}>
              Kenya<span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dates</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Welcome back 👋</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Sign in to continue your journey</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: 36 }}>
          {/* Method Toggle */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", padding: 4, marginBottom: 28 }}>
            {[{ id: "phone", label: "Phone", icon: Phone }, { id: "email", label: "Email", icon: Mail }].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id as "phone" | "email")} style={{
                padding: "10px 16px", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
                background: method === m.id ? "var(--gradient-primary)" : "transparent",
                color: method === m.id ? "white" : "var(--text-secondary)",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}>
                <m.icon size={15} /> {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {error && <div style={{ color: "var(--error)", fontSize: 14, textAlign: "center", marginBottom: 10 }}>{error}</div>}

            {method === "phone" ? (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>🇰🇪 +254</span>
                  <input className="input" type="tel" placeholder="7XX XXX XXX" style={{ paddingLeft: 90 }} value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Email Address</label>
                <input className="input" type="email" placeholder="you@example.com" value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPassword ? "text" : "password"} placeholder="Enter your password" style={{ paddingRight: 48 }} value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--accent-secondary)", textDecoration: "none", fontWeight: 500 }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ color: "var(--accent-secondary)", fontWeight: 700, textDecoration: "none" }}>Join Free</Link>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div style={{ textAlign: "center", marginTop: 24, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {["🔒 Secure Login", "✅ Verified Members", "🇰🇪 Made in Kenya"].map(t => (
            <span key={t} style={{ fontSize: 12, color: "var(--text-muted)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
