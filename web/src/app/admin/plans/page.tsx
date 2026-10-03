"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Save, X, Crown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
type Plan = { id: string; name: string; priceKsh: number; monthlyCoins: number; benefits: any };
const EMPTY: Omit<Plan, "id"> = { name: "", priceKsh: 0, monthlyCoins: 0, benefits: {} };

const PLAN_COLORS: Record<string, string> = {
  Free: "#6B6B8A", Gold: "#F5C542", Platinum: "#E5E4E2", Diamond: "#A78BFA",
};

export default function AdminPlansPage() {
  const { token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Plan, "id">>(EMPTY);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/plans`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) setPlans(await r.json());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const save = async () => {
    const body = editing === "new" ? form : { id: editing!, ...form };
    const r = await fetch(`${API}/admin/plans`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) { showToast("Saved ✓"); setEditing(null); setForm(EMPTY); load(); }
    else showToast("Save failed");
  };

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: k === "name" ? v : parseFloat(v) || 0 }));

  const startEdit = (p: Plan) => {
    setEditing(p.id);
    setForm({ name: p.name, priceKsh: p.priceKsh, monthlyCoins: p.monthlyCoins, benefits: p.benefits });
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {toast && <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Membership Plans</h1>
          <p className="text-white/40 text-sm">{plans.length} tiers configured</p>
        </div>
        <button onClick={() => { setEditing("new"); setForm(EMPTY); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-gold)" }}>
          <Plus size={15} /> New Plan
        </button>
      </div>

      {editing && (
        <div className="bg-[#0D0D1A] border border-yellow-500/30 rounded-2xl p-5 mb-5">
          <h3 className="text-white font-bold mb-4">{editing === "new" ? "New Plan" : "Edit Plan"}</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Plan Name</label>
              <input className="input py-2 text-sm" value={form.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Gold" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Price (KSh/month)</label>
              <input className="input py-2 text-sm" type="number" min="0" value={form.priceKsh} onChange={e => u("priceKsh", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Monthly Coins</label>
              <input className="input py-2 text-sm" type="number" min="0" value={form.monthlyCoins} onChange={e => u("monthlyCoins", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-colors"><Save size={13} /> Save</button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-white/50 text-sm font-semibold hover:bg-white/10 transition-colors"><X size={13} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl skeleton" />) :
          plans.map(p => {
            const color = PLAN_COLORS[p.name] ?? "#6B6B8A";
            return (
              <div key={p.id} className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={16} style={{ color }} />
                    <span className="font-black text-white">{p.name}</span>
                  </div>
                  <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Pencil size={12} className="text-white/40" />
                  </button>
                </div>
                <p className="text-2xl font-black" style={{ color }}>
                  {p.priceKsh === 0 ? "Free" : `KSh ${p.priceKsh.toLocaleString()}`}
                  {p.priceKsh > 0 && <span className="text-sm font-normal text-white/40">/mo</span>}
                </p>
                <p className="text-white/40 text-xs mt-1">🪙 {p.monthlyCoins.toLocaleString()} coins/month</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
