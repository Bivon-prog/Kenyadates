"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Users, Flag, Package,
  CreditCard, Crown, LogOut, Heart, Shield,
  ChevronRight, UserCog,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/packages", label: "Coin Packages", icon: Package },
  { href: "/admin/plans", label: "Memberships", icon: Crown },
  { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
  { href: "/admin/agents", label: "Agents", icon: UserCog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.push("/login"); return; }
      if (user.role !== "ADMIN" && user.role !== "MODERATOR") {
        router.push("/app");
      }
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#080810] text-white flex">

      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-[#0D0D1A] border-r border-white/6 flex flex-col fixed left-0 top-0 bottom-0 z-50">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/6">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Heart size={15} fill="white" color="white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">KenyaDates</p>
              <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wider">
                {isAdmin ? "Admin Panel" : "Agent Panel"}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.filter(n => isAdmin || !["Coin Packages", "Memberships", "Transactions", "Agents"].includes(n.label))
            .map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== "/admin" || pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                    active
                      ? "bg-[#E8336D]/12 text-white border border-[#E8336D]/25"
                      : "text-white/45 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {active && <span className="absolute left-3 w-0.5 h-4 bg-[#E8336D] rounded-full" />}
                  <Icon size={16} className={active ? "text-[#E8336D]" : ""} />
                  {label}
                </Link>
              );
            })}
        </nav>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-white/6">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: "var(--gradient-primary)" }}>
              {user.profile?.displayName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.profile?.displayName ?? user.email}</p>
              <p className="text-white/35 text-[10px]">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/8 text-sm transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-60 flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
