"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Shield, Ban, CheckCircle, Coins, Trash2, Crown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserDetailPage() {
  const { id } = useParams() as { id: string };
  const { token } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coinAmount, setCoinAmount] = useState("");
  const [coinReason, setCoinReason] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) setUser(await r.json());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const doAction = async (path: string, method = "PATCH", body?: any) => {
    const r = await fetch(`${API}/admin/users/${id}/${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.ok) { showToast("Done ✓"); load(); }
    else showToast("Error — check console");
  };

  const adjustCoins = async () => {
    const amount = parseInt(coinAmount);
    if (isNaN(amount)) return;
    await doAction("coins", "PATCH", { amount, reason: coinReason || "Admin adjustment" });
    setCoinAmount(""); setCoinReason("");
  };

  const deleteUser = async () => {
    if (!confirm("Permanently delete this user? This CANNOT be undone.")) return;
    const r = await fetch(`${API}/admin/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) router.push("/admin/users");
    else showToast("Delete failed");
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <div className="p-8 text-white/40">User not found</div>;

  const p = user.profile;
  const isBanned = user.role === "MODERATOR" && !user.emailVerified;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {toast && <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm shadow-xl">{toast}</div>}

      <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> All Users
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="md:col-span-1 bg-[#0D0D1A] border border-white/6 rounded-2xl p-5 text-center">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center font-black text-2xl mb-3"
            style={{ background: "var(--gradient-primary)" }}>
            {p?.displayName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h2 className="text-white font-bold text-lg">{p?.displayName ?? "—"}</h2>
          <p className="text-white/40 text-sm">{user.email}</p>
          {user.phoneNumber && <p className="text-white/30 text-xs mt-1">{user.phoneNumber}</p>}
          <div className="flex justify-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: user.role === "ADMIN" ? "#E8336D20" : "#4CAF8220", color: user.role === "ADMIN" ? "#E8336D" : "#4CAF82" }}>
              {isBanned ? "BANNED" : user.role}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: user.verificationStatus === "VERIFIED" ? "#4CAF8220" : "#6B6B8A20", color: user.verificationStatus === "VERIFIED" ? "#4CAF82" : "#6B6B8A" }}>
              {user.verificationStatus}
            </span>
          </div>
          <div className="mt-4 text-center">
            <p className="text-white/30 text-xs">Joined {new Date(user.createdAt).toLocaleDateString("en-KE")}</p>
          </div>
        </div>

        {/* Details + actions */}
        <div className="md:col-span-2 space-y-4">
          {/* Info */}
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-5">
            <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Profile Details</h3>
            <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              {[
                ["Age", p?.age], ["Gender", p?.gender],
                ["City", p?.city], ["County", p?.county],
                ["Photos", p?.photos?.length ?? 0], ["Interests", p?.interests?.length ?? 0],
                ["Likes sent", user.sentLikes?.length ?? 0], ["Matches", (user.matches1?.length ?? 0) + (user.matches2?.length ?? 0)],
                ["Coins", user.wallet?.balance ?? 0], ["Reports received", user.reportsReceived?.length ?? 0],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-white/35 text-xs">{k}</dt>
                  <dd className="text-white font-medium">{String(v ?? "—")}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Quick actions */}
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-5">
            <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {user.verificationStatus !== "VERIFIED" && (
                <button onClick={() => doAction("verify")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-colors">
                  <CheckCircle size={13} /> Grant Verified Badge
                </button>
              )}
              <button onClick={() => doAction("role", "PATCH", { role: "ADMIN" })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8336D]/10 border border-[#E8336D]/20 text-[#E8336D] text-xs font-semibold hover:bg-[#E8336D]/20 transition-colors">
                <Crown size={13} /> Make Admin
              </button>
              <button onClick={() => doAction("role", "PATCH", { role: "MODERATOR" })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-colors">
                <Shield size={13} /> Make Agent
              </button>
              {!isBanned ? (
                <button onClick={() => doAction("ban", "PATCH", { reason: "Admin action" })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                  <Ban size={13} /> Ban User
                </button>
              ) : (
                <button onClick={() => doAction("unban")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
                  <CheckCircle size={13} /> Unban
                </button>
              )}
              {user.role !== "ADMIN" && (
                <button onClick={deleteUser}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                  <Trash2 size={13} /> Delete Account
                </button>
              )}
            </div>
          </div>

          {/* Adjust coins */}
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-5">
            <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Adjust Coins (Current: {user.wallet?.balance ?? 0} 🪙)</h3>
            <div className="flex gap-2">
              <input type="number" placeholder="e.g. +100 or -50"
                value={coinAmount} onChange={e => setCoinAmount(e.target.value)}
                className="input flex-1 py-2 text-sm" />
              <input placeholder="Reason" value={coinReason} onChange={e => setCoinReason(e.target.value)}
                className="input flex-1 py-2 text-sm" />
              <button onClick={adjustCoins}
                className="px-4 py-2 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-gold)" }}>
                <Coins size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
