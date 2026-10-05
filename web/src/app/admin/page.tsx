"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Heart, Shield, Flag, Coins, TrendingUp,
  UserCheck, MessageCircle, RefreshCw, Crown,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Stats {
  totalUsers: number;
  activeToday: number;
  verifiedUsers: number;
  bannedUsers: number;
  totalMatches: number;
  totalMessages: number;
  totalRevenue: number;
  openReports: number;
  totalCoinsCirculating: number;
  newUsersThisWeek: number;
}

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-5 flex items-start gap-4 hover:border-white/12 transition-colors">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <p className="text-white/45 text-xs font-medium mb-1">{label}</p>
        <p className="text-white text-2xl font-black leading-none">{value ?? "—"}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) setStats(await r.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">Dashboard</h1>
          <p className="text-white/40 text-sm">Platform overview · {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl text-sm text-white/60 hover:text-white transition-all">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading && !stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats?.totalUsers?.toLocaleString()} color="#E8336D" sub={`+${stats?.newUsersThisWeek} this week`} />
            <StatCard icon={UserCheck} label="Active Today" value={stats?.activeToday?.toLocaleString()} color="#4CAF82" />
            <StatCard icon={Shield} label="Verified Users" value={stats?.verifiedUsers?.toLocaleString()} color="#60A5FA" sub={`${stats && stats.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}% of total`} />
            <StatCard icon={Heart} label="Total Matches" value={stats?.totalMatches?.toLocaleString()} color="#F472B6" />
            <StatCard icon={MessageCircle} label="Messages Sent" value={stats?.totalMessages?.toLocaleString()} color="#A78BFA" />
            <StatCard icon={Flag} label="Open Reports" value={stats?.openReports?.toLocaleString()} color="#F59E0B" sub="Needs review" />
            <StatCard icon={Coins} label="Coins in Circulation" value={stats?.totalCoinsCirculating?.toLocaleString()} color="#F5C542" />
            <StatCard icon={TrendingUp} label="Total Revenue" value={`KSh ${stats?.totalRevenue?.toLocaleString() ?? 0}`} color="#34D399" sub="M-Pesa payments" />
          </div>

          {/* Quick actions */}
          <div className="bg-[#0D0D1A] border border-white/6 rounded-2xl p-6">
            <h2 className="text-white font-bold text-base mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Add User", href: "/admin/users/new", color: "#E8336D", icon: Users },
                { label: "Review Reports", href: "/admin/reports", color: "#F59E0B", icon: Flag },
                { label: "Manage Packages", href: "/admin/packages", color: "#F5C542", icon: Coins },
                { label: "Add Agent", href: "/admin/agents/new", color: "#A78BFA", icon: Crown },
              ].map(({ label, href, color, icon: Icon }) => (
                <a key={label} href={href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-white/15 hover:bg-white/4 transition-all no-underline">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                    <Icon size={15} color={color} />
                  </div>
                  <span className="text-white/70 text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
