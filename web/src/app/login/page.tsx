"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const [method,   setMethod]   = useState<"email" | "phone">("email");
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
      const body = method === "email" ? { email: id, password } : { phoneNumber: id, password };
      const res  = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials.");
      login(data.token, data.user);
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      display: "flex",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div className="login-left-panel" style={{
        display: "none",
        width: "420px",
        minWidth: "420px",
        background: "#111",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 44px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow blobs */}
        <div style={{
          position: "absolute", top: -120, left: -120,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,51,109,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,51,109,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "'Playfair Display', serif" }}>
            Kenya<span style={{ color: "#E8336D" }}>dates</span>
          </span>
        </Link>

        {/* Copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
            Find your<br />
            <span style={{ color: "#E8336D" }}>perfect match.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Join 50,000+ verified singles across Kenya.<br />
            Real people, real connections.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24 }}>
            {[
              { num: "50K+", label: "Members" },
              { num: "4.8★", label: "Rating" },
              { num: "98%", label: "Verified" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 2 }}>{s.num}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", position: "relative", zIndex: 1 }}>
          🔒 Your data is private and never sold.
        </p>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="login-mobile-logo" style={{ marginBottom: 36 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'Playfair Display', serif" }}>
                Kenya<span style={{ color: "#E8336D" }}>dates</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", marginBottom: 6 }}>Sign in</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", marginBottom: 32 }}>
            Welcome back. Enter your details below.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              borderRadius: 14, padding: "12px 16px", marginBottom: 20,
              background: "rgba(232,65,65,0.08)", border: "1px solid rgba(232,65,65,0.2)",
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: 13, color: "#ff7b7b" }}>{error}</span>
            </div>
          )}

          {/* Method toggle */}
          <div style={{
            display: "flex", gap: 4, padding: 4, borderRadius: 14,
            background: "#161616", border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 24,
          }}>
            {(["email", "phone"] as const).map(m => (
              <button key={m} type="button" onClick={() => { setMethod(m); setError(""); }}
                style={{
                  flex: 1, height: 40, borderRadius: 11, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                  background: method === m ? "#E8336D" : "transparent",
                  color: method === m ? "white" : "rgba(255,255,255,0.35)",
                }}>
                {m === "email" ? "Email" : "Phone"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Identifier */}
            <div>
              <p style={labelSt}>{method === "email" ? "Email address" : "Phone number"}</p>
              {method === "email" ? (
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} required autoComplete="email"
                  style={inputSt} onFocus={focusSt} onBlur={blurSt} />
              ) : (
                <div style={{ ...inputSt, display: "flex", alignItems: "center", padding: 0, overflow: "hidden" }}>
                  <span style={{
                    padding: "0 14px", color: "rgba(255,255,255,0.32)", fontSize: 13,
                    borderRight: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap",
                    height: "100%", display: "flex", alignItems: "center",
                  }}>
                    🇰🇪 +254
                  </span>
                  <input type="tel" placeholder="7XX XXX XXX" value={phone}
                    onChange={e => setPhone(e.target.value)} required autoComplete="tel"
                    style={{
                      flex: 1, padding: "0 16px", background: "transparent", border: "none",
                      outline: "none", color: "white", fontSize: 15, height: "100%",
                      fontFamily: "'Inter', sans-serif",
                    }} />
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={labelSt}>Password</p>
                <Link href="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: "#E8336D", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} placeholder="••••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                  style={{ ...inputSt, paddingRight: 48 }} onFocus={focusSt} onBlur={blurSt} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.28)", display: "flex", alignItems: "center",
                }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", height: 54, marginTop: 8, borderRadius: 99, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #E8336D 0%, #C2185B 100%)",
              color: "white", fontSize: 16, fontWeight: 900,
              opacity: loading ? 0.55 : 1, transition: "opacity 0.2s",
            }}>
              {loading
                ? <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
                    animation: "spin 0.7s linear infinite", display: "inline-block",
                  }} />
                : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, marginTop: 24, color: "rgba(255,255,255,0.25)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#E8336D", fontWeight: 700, textDecoration: "none" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const inputSt: React.CSSProperties = {
  width: "100%", height: 52, borderRadius: 14, padding: "0 16px",
  background: "#161616", border: "1px solid rgba(255,255,255,0.08)",
  color: "white", fontSize: 15, outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "'Inter', sans-serif",
};
const focusSt = (e: React.FocusEvent<any>) => (e.target.style.borderColor = "#E8336D");
const blurSt  = (e: React.FocusEvent<any>) => (e.target.style.borderColor = "rgba(255,255,255,0.08)");
const labelSt: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
  color: "rgba(255,255,255,0.32)", textTransform: "uppercase", marginBottom: 8,
};
