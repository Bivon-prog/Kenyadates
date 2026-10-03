"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Users, Flag, Package,
  CreditCard, Crown, LogOut, Heart, Shield,
  UserCog, Menu, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",             label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/users",       label: "Users",        icon: Users },
  { href: "/admin/reports",     label: "Reports",      icon: Flag },
  { href: "/admin/packages",    label: "Coin Packages",icon: Package,   adminOnly: true },
  { href: "/admin/plans",       label: "Memberships",  icon: Crown,     adminOnly: true },
  { href: "/admin/transactions",label: "Transactions", icon: CreditCard,adminOnly: true },
  { href: "/admin/agents",      label: "Agents",       icon: UserCog,   adminOnly: true },
];

const SIDEBAR_FULL = 240;
const SIDEBAR_MINI = 68;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router  = useRouter();
  const pathname = usePathname();

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const [isDesktop,   setIsDesktop]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!isLoading) {
      if (!user) { router.push("/login"); return; }
      if (user.role !== "ADMIN" && user.role !== "MODERATOR") router.push("/app");
    }
  }, [user, isLoading]);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8336D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin   = user.role === "ADMIN";
  const sidebarW  = collapsed ? SIDEBAR_MINI : SIDEBAR_FULL;

  return (
    <div className="min-h-screen bg-[#080810] text-white">

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ────────────────── SIDEBAR ────────────────── */}
      <aside
        style={{ width: sidebarW }}
        className={[
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col",
          "bg-[#0B0B18] border-r border-white/6",
          "transition-[width,transform] duration-300 ease-in-out overflow-hidden",
          // Mobile: slide in/out; Desktop: always visible
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/6 flex-shrink-0 min-h-[60px]">
          {/* Logo — only when expanded */}
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5 no-underline overflow-hidden">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}>
                <Heart size={15} fill="white" color="white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm leading-none whitespace-nowrap">KenyaDates</p>
                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wider">
                  {isAdmin ? "Admin" : "Agent"}
                </p>
              </div>
            </Link>
          )}

          {/* Icon-only logo when collapsed */}
          {collapsed && (
            <Link href="/" className="mx-auto no-underline">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}>
                <Heart size={14} fill="white" color="white" />
              </div>
            </Link>
          )}

          {/* Collapse toggle (desktop) / Close (mobile) */}
          <button
            onClick={() => collapsed ? setCollapsed(false) : setCollapsed(true)}
            className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center
              bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {collapsed
              ? <ChevronRight size={13} className="text-white/40" />
              : <ChevronLeft  size={13} className="text-white/40" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex w-7 h-7 rounded-lg items-center justify-center
              bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X size={14} className="text-white/50" />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5">
            {NAV.filter(n => !n.adminOnly || isAdmin).map(({ href, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === href
                : pathname.startsWith(href) && pathname !== "/admin";

              return (
                <div key={href} className={collapsed ? "px-1" : "px-2"}>
                  <Link
                    href={href}
                    title={label}
                    className={[
                      "relative flex items-center rounded-xl transition-all group",
                      "border",
                      collapsed ? "justify-center py-3" : "gap-3 px-3 py-2.5",
                      active
                        ? "bg-[#E8336D]/12 border-[#E8336D]/25 text-white"
                        : "border-transparent text-white/40 hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    {/* Active indicator bar */}
                    {active && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#E8336D] rounded-r-full" />
                    )}

                    <Icon size={17} className={`flex-shrink-0 ${active ? "text-[#E8336D]" : ""}`} />

                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{label}</span>
                    )}

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs
                        font-medium text-white bg-[#1A1A2E] border border-white/10 shadow-xl
                        whitespace-nowrap opacity-0 group-hover:opacity-100
                        pointer-events-none z-50 transition-opacity">
                        {label}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* ── Footer: user + logout ── */}
        <div className="border-t border-white/6 flex-shrink-0 py-3">
          {!collapsed && (
            <div className="mx-2 mb-2 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/4">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
                font-bold text-xs" style={{ background: "var(--gradient-primary)" }}>
                {user.profile?.displayName?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {user.profile?.displayName ?? user.email}
                </p>
                <p className="text-white/30 text-[10px]">{user.role}</p>
              </div>
            </div>
          )}

          <div className={collapsed ? "px-1" : "px-2"}>
            <button
              onClick={logout}
              title="Sign Out"
              className={[
                "w-full flex items-center rounded-xl transition-all",
                "text-red-400/60 hover:text-red-400 hover:bg-red-400/8",
                collapsed ? "justify-center py-3" : "gap-2 px-3 py-2",
              ].join(" ")}
            >
              <LogOut size={15} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ────────────────── MAIN ────────────────── */}
      <div
        className="transition-[margin] duration-300 min-h-screen flex flex-col"
        style={{ marginLeft: isDesktop ? sidebarW : 0 }}
      >
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-30 bg-[#080810]/95 backdrop-blur-md
          border-b border-white/6 flex items-center gap-3 px-4 py-3 min-h-[57px]">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex w-8 h-8 rounded-lg items-center justify-center
              bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Menu size={16} className="text-white/60" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
            <span className="text-white/30 hidden sm:inline">Admin</span>
            {pathname !== "/admin" && (
              <>
                <span className="text-white/20 hidden sm:inline">/</span>
                <span className="text-white font-medium truncate capitalize">
                  {NAV.find(n => pathname.startsWith(n.href) && !n.exact)?.label
                    ?? pathname.replace("/admin/", "").replace("/", " › ")}
                </span>
              </>
            )}
            {pathname === "/admin" && (
              <span className="text-white font-medium">Dashboard</span>
            )}
          </nav>

          {/* Role badge */}
          <span
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full
              text-xs font-bold flex-shrink-0"
            style={{
              background: isAdmin ? "rgba(232,51,109,0.12)" : "rgba(245,158,11,0.12)",
              color:      isAdmin ? "#E8336D"               : "#F59E0B",
              border:     `1px solid ${isAdmin ? "rgba(232,51,109,0.25)" : "rgba(245,158,11,0.25)"}`,
            }}
          >
            <Shield size={10} />
            {isAdmin ? "Super Admin" : "Agent"}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
