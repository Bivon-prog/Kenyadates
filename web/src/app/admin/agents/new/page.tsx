"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, UserCog } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Nyeri","Meru","Thika","Machakos","Kitale","Kericho","Garissa","Malindi","Kakamega","Kisii","Embu","Bungoma","Migori","Homa Bay","Kilifi"];

export default function NewAgentPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "", password: "", displayName: "", age: "25",
    gender: "Man", city: "Nairobi", county: "Nairobi", phoneNumber: "",
  });

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/admin/users`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: parseInt(form.age), role: "MODERATOR" }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed");
      router.push("/admin/agents");
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Agents
      </button>
      <h1 className="text-2xl font-black text-white mb-1">Create Agent Account</h1>
      <p className="text-white/40 text-sm mb-8">Agents can view users and review reports — no delete access</p>

      <form onSubmit={submit} className="space-y-5 bg-[#0D0D1A] border border-white/6 rounded-2xl p-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Email *</label>
            <input className="input" type="email" required value={form.email} onChange={e => u("email", e.target.value)} placeholder="agent@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Password *</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={e => u("password", e.target.value)} placeholder="Min 6 characters" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Full Name *</label>
            <input className="input" required value={form.displayName} onChange={e => u("displayName", e.target.value)} placeholder="e.g. James Mwangi" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Phone (optional)</label>
            <input className="input" value={form.phoneNumber} onChange={e => u("phoneNumber", e.target.value)} placeholder="0712345678" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Age *</label>
            <input className="input" type="number" min="18" max="60" required value={form.age} onChange={e => u("age", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">Gender *</label>
            <select className="input" value={form.gender} onChange={e => u("gender", e.target.value)}>
              <option>Man</option><option>Woman</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">City *</label>
            <input className="input" required value={form.city} onChange={e => u("city", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-2">County *</label>
            <select className="input" value={form.county} onChange={e => u("county", e.target.value)}>
              {COUNTIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20 text-yellow-400/80 text-xs">
          ⚠️ This creates an <strong>Agent</strong> account (MODERATOR role). Agents can view the admin panel and review reports but cannot delete users or change packages.
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
          <UserCog size={16} />
          {loading ? "Creating…" : "Create Agent Account"}
        </button>
      </form>
    </div>
  );
}
