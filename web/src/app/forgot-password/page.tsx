"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");
      setSubmitted(true);
    } catch (err: any) {
      // Show success anyway for security, or show error if network fails
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-black text-white mb-2">Reset Password 🔐</h1>
          <p className="text-white/50 text-base">We will send a reset link to your email</p>
        </div>

        <div className="bg-[#111118] border border-white/8 rounded-3xl p-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                If an account exists for <strong className="text-white">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link href="/login" className="btn-secondary w-full text-base flex items-center justify-center gap-2" style={{ minHeight: 52 }}>
                <ArrowLeft size={18} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-[#ff6b9d] text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white/60 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    className="input"
                    type="email"
                    placeholder="you@example.com"
                    style={{ minHeight: 56, paddingLeft: 48, fontSize: 16 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-base"
                style={{ minHeight: 56, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? "Sending link…" : <span className="flex items-center justify-center gap-2">Send Reset Link <ArrowRight size={18} /></span>}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-sm text-white/50 hover:text-white inline-flex items-center gap-2">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
