"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Heart, Shield, Flag, Coins, TrendingUp,
  UserCheck, MessageCircle, RefreshCw, Crown,
  ArrowUpRight,
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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
  trend,
}: {
  icon: any;
  label: string;
  value: string | number | undefined;
  color: string;
  sub?: string;
  trend?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center gap-4
        border border-white/6 hover:border-white/12 transition-all group text-center min-h-[160px]"
      style={{ background: "linear-gradient(145deg, #0f0f1e 0%, #0D0D1A 100%)" }}
    >
      {/* Subtle glow in top-right corner */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity group-hover:opacity-20"
        style={{ background: color }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}25` }}
      >
        <Icon size={22} color={color} />
      </div>

      {/* Value + label */}
      <div>
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-white text-3xl font-black leading-none tracking-tight">
          {value ?? "—"}
        </p>
        {sub && (
          <p className="text-white/30 text-xs mt-2 font-medium">{sub}</p>
        )}
      </div>

      {/* Trend badge pinned bottom-right */}
      {trend && (
        <span
          className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          <ArrowUpRight size={11} />
          {trend}
        </span>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 border border-white/4 bg-[#0D0D1A] animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5" />
      </div>
      <div className="h-3 w-20 rounded bg-white/5 mb-3" />
      <div className="h-8 w-28 rounded bg-white/8" />
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

  useEffect(() => {
    if (token) load();
  }, [token]);

  const verifiedPct =
    stats && stats.totalUsers
      ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100)
      : 0;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-white/40 text-sm">
            Platform overview ·{" "}
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10
            border border-white/8 hover:border-white/15 rounded-xl text-sm text-white/60
            hover:text-white transition-all flex-shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── Stats grid ── */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats?.totalUsers?.toLocaleString()}
              color="#E8336D"
              sub="Registered accounts"
              trend={`+${stats?.newUsersThisWeek ?? 0} this week`}
            />
            <StatCard
              icon={UserCheck}
              label="Active Today"
              value={stats?.activeToday?.toLocaleString()}
              color="#4CAF82"
              sub="Logged in today"
            />
            <StatCard
              icon={Shield}
              label="Verified Users"
              value={stats?.verifiedUsers?.toLocaleString()}
              color="#60A5FA"
              sub={`${verifiedPct}% of total users`}
            />
            <StatCard
              icon={Heart}
              label="Total Matches"
              value={stats?.totalMatches?.toLocaleString()}
              color="#F472B6"
              sub="Mutual likes"
            />
            <StatCard
              icon={MessageCircle}
              label="Messages Sent"
              value={stats?.totalMessages?.toLocaleString()}
              color="#A78BFA"
              sub="All time"
            />
            <StatCard
              icon={Flag}
              label="Open Reports"
              value={stats?.openReports?.toLocaleString()}
              color="#F59E0B"
              sub="Awaiting review"
            />
            <StatCard
              icon={Coins}
              label="Coins in Circulation"
              value={stats?.totalCoinsCirculating?.toLocaleString()}
              color="#F5C542"
              sub="Active coin balance"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Revenue"
              value={`KSh ${stats?.totalRevenue?.toLocaleString() ?? 0}`}
              color="#34D399"
              sub="M-Pesa payments"
            />
          </div>

          {/* ── Quick Actions ── */}
          <div
            className="rounded-2xl border border-white/6 p-6 sm:p-8 mt-6"
            style={{ background: "linear-gradient(145deg, #0f0f1e 0%, #0D0D1A 100%)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg">Quick Actions</h2>
                <p className="text-white/35 text-sm mt-1">Common administrative tasks</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Add User",       desc: "Create a new account",      href: "/admin/users/new",     color: "#E8336D", icon: Users },
                { label: "Review Reports", desc: "Check flagged content",      href: "/admin/reports",        color: "#F59E0B", icon: Flag },
                { label: "Manage Packages",desc: "Edit coin packages",         href: "/admin/packages",       color: "#F5C542", icon: Coins },
                { label: "Add Agent",      desc: "Onboard a new agent",        href: "/admin/agents/new",     color: "#A78BFA", icon: Crown },
              ].map(({ label, desc, href, color, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/6
                    hover:border-white/15 hover:bg-white/4 transition-all no-underline group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: `${color}18`, border: `1px solid ${color}20` }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white/90 text-sm font-semibold leading-none mb-1">
                      {label}
                    </p>
                    <p className="text-white/35 text-xs truncate">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
