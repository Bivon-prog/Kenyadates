"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATUS_STYLE: Record<string, string> = {
  COMPLETED: "bg-green-500/15 text-green-400",
  PENDING: "bg-yellow-500/15 text-yellow-400",
  FAILED: "bg-red-500/15 text-red-400",
};

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [txs, setTxs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${API}/admin/transactions?page=${page}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setTxs(d.transactions); setTotal(d.total); setPages(d.pages); } })
      .finally(() => setLoading(false));
  }, [token, page]);

  const totalRevenue = txs.filter(t => t.status === "COMPLETED").reduce((s, t) => s + (t.amount ?? 0), 0);

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Transactions</h1>
          <p className="text-white/40 text-sm">{total} M-Pesa payments · KSh {totalRevenue.toLocaleString()} shown</p>
        </div>
      </div>

      <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">User</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Phone</th>
                <th className="text-right px-4 py-3 font-semibold">Amount</th>
                <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">Coins</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 rounded skeleton" /></td>)}</tr>
                ))
              ) : txs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">
                  <CreditCard size={28} className="mx-auto mb-2 opacity-30" />
                  No transactions yet
                </td></tr>
              ) : txs.map(t => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{t.user?.profile?.displayName ?? "—"}</p>
                    <p className="text-white/35 text-xs">{t.user?.email ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden sm:table-cell">{t.phoneNumber}</td>
                  <td className="px-4 py-3 text-right text-white font-bold">KSh {t.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-white/50 hidden md:table-cell">🪙 {t.coinsPurchased}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[t.status] ?? "bg-white/10 text-white/40"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/30 text-xs hidden md:table-cell">
                    {new Date(t.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
            <p className="text-white/30 text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors">
                <ChevronLeft size={14} className="text-white/60" />
              </button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center disabled:opacity-30 hover:bg-white/10 transition-colors">
                <ChevronRight size={14} className="text-white/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
