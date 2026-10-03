"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Shield, ShieldOff, Trash2, CheckCircle,
  ChevronLeft, ChevronRight, Filter, UserX, UserCheck,
  Coins, Eye, RefreshCw,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "#E8336D", MODERATOR: "#F59E0B", USER: "#4CAF82",
};

const STATUS_COLORS: Record<string, string> = {
  VERIFIED: "#4CAF82", PENDING: "#F59E0B", UNVERIFIED: "#6B6B8A", REJECTED: "#FF4B6E",
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterVerified, setFilterVerified] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (filterRole) params.set("role", filterRole);
      if (filterVerified) params.set("verified", filterVerified);
      const r = await fetch(`${API}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        const d = await r.json();
        setUsers(d.users);
        setTotal(d.total);
        setPages(d.pages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [token, page, search, filterRole, filterVerified]);

  useEffect(() => { if (token) load(); }, [load]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const action = async (userId: string, path: string, method = "PATCH", body?: any) => {
    setActionLoading(userId + path);
    try {
      const r = await fetch(`${API}/admin/users/${userId}/${path}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (r.ok) { showToast("Done ✓"); load(); }
      else { const d = await r.json(); showToast(d.message || "Error", false); }
    } catch { showToast("Network error", false); }
    setActionLoading(null);
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;
    setActionLoading(id + "delete");
    try {
      const r = await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) { showToast("User deleted"); load(); }
      else showToast("Delete failed", false);
    } catch { showToast("Network error", false); }
    setActionLoading(null);
  };

  const isBanned = (u: any) => u.role === "MODERATOR" && !u.emailVerified;

  return (
    <div className="p-6 md:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border ${toast.ok ? "bg-green-500/15 border-green-500/30 text-green-300" : "bg-red-500/15 border-red-500/30 text-red-300"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Users</h1>
          <p className="text-white/40 text-sm">{total.toLocaleString()} registered users</p>
        </div>
        <button onClick={() => router.push("/admin/users/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--gradient-primary)" }}>
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, phone…"
            className="input w-full pl-8 py-2.5 text-sm"
          />
        </div>
        <select value={filterRole} onChange={e => { setFilterRole(e.target.value); setPage(1); }}
          className="input py-2.5 text-sm w-36">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="MODERATOR">Agent/Banned</option>
        </select>
        <select value={filterVerified} onChange={e => { setFilterVerified(e.target.value); setPage(1); }}
          className="input py-2.5 text-sm w-40">
          <option value="">All Status</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <button onClick={load} className="px-3 py-2.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/10 transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin text-white/60" : "text-white/60"} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">User</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">KYC</th>
                <th className="text-right px-4 py-3 font-semibold hidden md:table-cell">Coins</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-5 rounded skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                  {/* User info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: "var(--gradient-primary)" }}>
                        {u.profile?.displayName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate max-w-[140px]">
                          {u.profile?.displayName ?? "—"}
                          {u.profile?.age ? `, ${u.profile.age}` : ""}
                        </p>
                        <p className="text-white/35 text-xs truncate max-w-[140px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Location */}
                  <td className="px-4 py-3 text-white/50 text-xs hidden sm:table-cell">
                    {u.profile?.city ?? "—"}
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: `${ROLE_COLORS[u.role] ?? "#666"}20`, color: ROLE_COLORS[u.role] ?? "#666" }}>
                      {isBanned(u) ? "BANNED" : u.role}
                    </span>
                  </td>
                  {/* KYC */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold"
                      style={{ color: STATUS_COLORS[u.verificationStatus] ?? "#666" }}>
                      {u.verificationStatus}
                    </span>
                  </td>
                  {/* Coins */}
                  <td className="px-4 py-3 text-right text-white/50 text-xs hidden md:table-cell">
                    🪙 {u.coins ?? 0}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title="View details" onClick={() => router.push(`/admin/users/${u.id}`)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Eye size={12} className="text-white/50" />
                      </button>
                      {u.verificationStatus !== "VERIFIED" && (
                        <button title="Verify user" onClick={() => action(u.id, "verify")}
                          disabled={actionLoading === u.id + "verify"}
                          className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                          <CheckCircle size={12} className="text-blue-400" />
                        </button>
                      )}
                      {!isBanned(u) ? (
                        <button title="Ban user" onClick={() => action(u.id, "ban", "PATCH", { reason: "Admin action" })}
                          disabled={actionLoading === u.id + "ban"}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                          <UserX size={12} className="text-red-400" />
                        </button>
                      ) : (
                        <button title="Unban user" onClick={() => action(u.id, "unban")}
                          disabled={actionLoading === u.id + "unban"}
                          className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center transition-colors">
                          <UserCheck size={12} className="text-green-400" />
                        </button>
                      )}
                      <button title="Delete user" onClick={() => deleteUser(u.id, u.profile?.displayName ?? u.email)}
                        disabled={u.role === "ADMIN"}
                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
