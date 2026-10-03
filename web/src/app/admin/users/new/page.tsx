"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, UserPlus } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika","Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii","Embu","Bungoma","Migori","Homa Bay","Kilifi"];

export default function NewUserPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "", password: "", displayName: "", age: "25",
    gender: "Man", city: "Nairobi", county: "Nairobi",
    phoneNumber: "", role: "USER",
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/admin/users`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed");
      router.push("/admin/users");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Back
      </button>
      <h1 className="text-2xl font-black text-white mb-1">Add New User</h1>
      <p className="text-white/40 text-sm mb-8">Create a regular user, admin, or agent account</p>

      <form onSubmit={submit} className="space-y-5 bg-[#0D0D1A] border border-white/6 rounded-2xl p-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Email *</label>
            <input className="input" type="email" required value={form.email} onChange={e => update("email", e.target.value)} placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Password *</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Display Name *</label>
            <input className="input" required value={form.displayName} onChange={e => update("displayName", e.target.value)} placeholder="e.g. Amina Wanjiru" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Phone (optional)</label>
            <input className="input" value={form.phoneNumber} onChange={e => update("phoneNumber", e.target.value)} placeholder="0712345678" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Age *</label>
            <input className="input" type="number" min="18" max="80" required value={form.age} onChange={e => update("age", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Gender *</label>
            <select className="input" value={form.gender} onChange={e => update("gender", e.target.value)}>
              <option>Man</option><option>Woman</option><option>Non-binary</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">City *</label>
            <input className="input" required value={form.city} onChange={e => update("city", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">County *</label>
            <select className="input" value={form.county} onChange={e => update("county", e.target.value)}>
              {COUNTIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-2">Account Role *</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "USER", label: "User", desc: "Regular member", color: "#4CAF82" },
              { value: "MODERATOR", label: "Agent", desc: "Support agent", color: "#F59E0B" },
              { value: "ADMIN", label: "Admin", desc: "Full access", color: "#E8336D" },
            ].map(r => (
              <button key={r.value} type="button" onClick={() => update("role", r.value)}
                className="p-3 rounded-xl border text-left transition-all"
                style={{
                  borderColor: form.role === r.value ? r.color : "rgba(255,255,255,0.08)",
                  background: form.role === r.value ? `${r.color}12` : "transparent",
                }}>
                <p className="font-bold text-sm text-white">{r.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-primary)" }}>
          <UserPlus size={16} />
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
