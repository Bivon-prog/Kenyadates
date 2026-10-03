"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Plus, UserCog, Trash2, ShieldOff } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminAgentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      // Agents are MODERATOR role users
      const r = await fetch(`${API}/admin/users?role=MODERATOR&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) setAgents((await r.json()).users);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const demote = async (id: string) => {
    if (!confirm("Demote this agent to regular user?")) return;
    const r = await fetch(`${API}/admin/users/${id}/role`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role: "USER" }),
    });
    if (r.ok) { showToast("Demoted to User"); load(); }
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete agent ${name}?`)) return;
    const r = await fetch(`${API}/admin/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) { showToast("Deleted"); load(); }
  };

  // Filter: moderators who are NOT banned (banned = emailVerified:false)
  const activeAgents = agents.filter(a => a.emailVerified !== false);

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {toast && <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Agents</h1>
          <p className="text-white/40 text-sm">{activeAgents.length} active agent{activeAgents.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => router.push("/admin/agents/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
          <Plus size={15} /> New Agent
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl skeleton" />)
        ) : activeAgents.length === 0 ? (
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-12 text-center">
            <UserCog size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/30 text-sm mb-4">No agents yet</p>
            <button onClick={() => router.push("/admin/agents/new")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              Create First Agent
            </button>
          </div>
        ) : activeAgents.map(a => (
          <div key={a.id} className="bg-[#0D0D1A] border border-white/6 rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              {a.profile?.displayName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold">{a.profile?.displayName ?? "—"}</p>
              <p className="text-white/35 text-xs">{a.email} · {a.profile?.city ?? "—"}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-400">AGENT</span>
              <button onClick={() => demote(a.id)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" title="Demote to User">
                <ShieldOff size={13} className="text-white/40" />
              </button>
              <button onClick={() => del(a.id, a.profile?.displayName ?? a.email)}
                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors" title="Delete agent">
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
