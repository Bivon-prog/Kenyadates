"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Save, X, Coins } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Pkg = { id: string; name: string; priceKsh: number; coins: number; bonusCoins: number };
const EMPTY: Omit<Pkg, "id"> = { name: "", priceKsh: 0, coins: 0, bonusCoins: 0 };

export default function AdminPackagesPage() {
  const { token } = useAuth();
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null); // id or "new"
  const [form, setForm] = useState<Omit<Pkg, "id">>(EMPTY);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/packages`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) setPkgs(await r.json());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const save = async () => {
    const body = editing === "new" ? form : { id: editing!, ...form };
    const r = await fetch(`${API}/admin/packages`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) { showToast("Saved ✓"); setEditing(null); setForm(EMPTY); load(); }
    else showToast("Save failed");
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete package "${name}"?`)) return;
    const r = await fetch(`${API}/admin/packages/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { showToast("Deleted"); load(); }
  };

  const startEdit = (p: Pkg) => {
    setEditing(p.id);
    setForm({ name: p.name, priceKsh: p.priceKsh, coins: p.coins, bonusCoins: p.bonusCoins });
  };

  const u = (k: string, v: string) => setForm(p => ({ ...p, [k]: k === "name" ? v : parseFloat(v) || 0 }));

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {toast && <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Coin Packages</h1>
          <p className="text-white/40 text-sm">{pkgs.length} packages · paid via M-Pesa</p>
        </div>
        <button onClick={() => { setEditing("new"); setForm(EMPTY); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus size={15} /> New Package
        </button>
      </div>

      {/* Add / Edit form */}
      {editing && (
        <div className="bg-[#0D0D1A] border border-[#E8336D]/30 rounded-2xl p-5 mb-5">
          <h3 className="text-white font-bold mb-4">{editing === "new" ? "New Package" : "Edit Package"}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Name</label>
              <input className="input py-2 text-sm" value={form.name} onChange={e => u("name", e.target.value)} placeholder="e.g. Popular" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Price (KSh)</label>
              <input className="input py-2 text-sm" type="number" min="1" value={form.priceKsh} onChange={e => u("priceKsh", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Coins</label>
              <input className="input py-2 text-sm" type="number" min="1" value={form.coins} onChange={e => u("coins", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Bonus Coins</label>
              <input className="input py-2 text-sm" type="number" min="0" value={form.bonusCoins} onChange={e => u("bonusCoins", e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/25 transition-colors">
              <Save size={13} /> Save
            </button>
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-white/50 text-sm font-semibold hover:bg-white/10 transition-colors">
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Packages list */}
      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl skeleton" />) :
          pkgs.length === 0 ? (
            <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-10 text-center">
              <Coins size={28} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/30 text-sm">No packages yet — add one above</p>
            </div>
          ) : pkgs.map(p => (
            <div key={p.id} className="bg-[#0D0D1A] border border-white/6 rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold">{p.name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  KSh {p.priceKsh.toLocaleString()} → {p.coins.toLocaleString()} coins
                  {p.bonusCoins > 0 && <span className="text-yellow-400 ml-1">+{p.bonusCoins} bonus</span>}
                </p>
              </div>
              <p className="text-white/30 text-xs hidden sm:block">
                {((p.coins + p.bonusCoins) / p.priceKsh).toFixed(1)} coins/KSh
              </p>
              <div className="flex gap-1.5">
                <button onClick={() => startEdit(p)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Pencil size={13} className="text-white/50" />
                </button>
                <button onClick={() => del(p.id, p.name)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
