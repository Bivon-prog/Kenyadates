"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Flag, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminReportsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "resolved" | "all">("open");
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const resolved = filter === "open" ? "false" : filter === "resolved" ? "true" : undefined;
      const params = new URLSearchParams();
      if (resolved !== undefined) params.set("resolved", resolved);
      const r = await fetch(`${API}/admin/reports?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) { const d = await r.json(); setReports(d.reports); setTotal(d.total); }
    } catch { }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token, filter]);

  const resolve = async (id: string) => {
    const r = await fetch(`${API}/admin/reports/${id}/resolve`, {
      method: "PATCH", headers: { Authorization: `Bearer ${token}` },
    });
    if (r.ok) { setToast("Report resolved ✓"); setTimeout(() => setToast(null), 3000); load(); }
  };

  return (
    <div className="p-6 md:p-8">
      {toast && <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Reports</h1>
          <p className="text-white/40 text-sm">{total} {filter} report{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(["open", "resolved", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${filter === f ? "bg-[#E8336D] text-white" : "text-white/40 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)
        ) : reports.length === 0 ? (
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-12 text-center">
            <Flag size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/30">No {filter} reports</p>
          </div>
        ) : reports.map(r => (
          <div key={r.id} className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-4 flex items-start gap-4">
            {/* Reporter */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-white font-semibold text-sm">
                  {r.reporter?.profile?.displayName ?? r.reporter?.email ?? "Unknown"}
                </span>
                <span className="text-white/25 text-xs">reported</span>
                <button onClick={() => router.push(`/admin/users/${r.reportedUserId}`)}
                  className="text-[#E8336D] font-semibold text-sm hover:underline">
                  {r.reportedUser?.profile?.displayName ?? r.reportedUser?.email ?? "Unknown"}
                </button>
              </div>
              <p className="text-white/70 text-sm font-medium mb-1">Reason: <span className="text-white">{r.reason}</span></p>
              {r.description && <p className="text-white/45 text-xs">{r.description}</p>}
              <p className="text-white/25 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            {/* Status + actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.resolved ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                {r.resolved ? "Resolved" : "Open"}
              </span>
              <div className="flex gap-1.5">
                <button onClick={() => router.push(`/admin/users/${r.reportedUserId}`)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors" title="View reported user">
                  <Eye size={12} className="text-white/50" />
                </button>
                {!r.resolved && (
                  <button onClick={() => resolve(r.id)}
                    className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center transition-colors" title="Mark resolved">
                    <CheckCircle size={12} className="text-green-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
