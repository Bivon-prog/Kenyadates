"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, Phone, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [method,       setMethod]       = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [email,        setEmail]        = useState("");
  const [phone,        setPhone]        = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const id = method === "email" ? email : phone;
    if (!id || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const body = method === "email" ? { email: id, password } : { phoneNumber: id, password };
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid email or password");
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#E8336D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FF6B9D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md my-auto relative z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-3 no-underline mb-4 group">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#E8336D] to-[#FF6B9D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ width: 52, height: 52 }}>
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Kenya<span className="text-[#E8336D]">dates</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-white/60 text-sm sm:text-base font-medium">Sign in to find your perfect match in Kenya</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="w-full bg-[#14141F]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Email / Phone Login Method Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-[#1C1C2A] border border-white/10 rounded-2xl p-1.5 mb-7">
            <button
              type="button"
              onClick={() => { setMethod("email"); setError(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                method === "email"
                  ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white shadow-md"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" /> Email Address
            </button>
            <button
              type="button"
              onClick={() => { setMethod("phone"); setError(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                method === "phone"
                  ? "bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white shadow-md"
                  : "text-white/50 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4" /> Phone Number
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Feedback */}
            {error && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-4 text-red-400 text-sm font-bold text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Email / Phone Field */}
            {method === "email" ? (
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">
                  Email Address <span className="text-[#E8336D]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-12 pr-4 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2.5 tracking-wide">
                  Phone Number <span className="text-[#E8336D]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-base font-bold pointer-events-none">
                    🇰🇪 +254
                  </span>
                  <input
                    type="tel"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-24 pr-4 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-bold text-white/70 tracking-wide">
                  Password <span className="text-[#E8336D]">*</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-[#FF6B9D] font-extrabold hover:underline no-underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#1C1C2A] border border-white/12 rounded-2xl pl-12 pr-12 py-4 text-white text-base placeholder:text-white/35 outline-none focus:border-[#E8336D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#E8336D] to-[#FF6B9D] text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{ minHeight: 56 }}
            >
              {loading ? (
                "Signing In…"
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="pt-6 border-t border-white/10 mt-6 text-center">
            <p className="text-sm sm:text-base text-white/60">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#FF6B9D] font-black no-underline hover:underline ml-1">
                Join Free
              </Link>
            </p>
          </div>

        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-bold text-white/40">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL Encrypted</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Verified Profiles</span>
          <span>🇰🇪 Made in Kenya</span>
        </div>

      </div>
    </div>
  );
}
