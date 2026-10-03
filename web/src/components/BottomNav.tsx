"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Compass, Heart, MessageCircle, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/discover", icon: Flame, label: "Swipe" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/likes", icon: Heart, label: "Likes" },
  { href: "/matches", icon: MessageCircle, label: "Chat" },
  { href: "/profile", icon: User, label: "Profile" },
];

const HIDDEN_ROUTES = ["/login", "/register", "/verify-email", "/verify", "/call"];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/" || HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) return null;

  return (
    <>
      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 safe-area-pb">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all ${
                  active ? "text-[#E8336D] scale-105" : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? "fill-[#E8336D]/20" : ""}`} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop side nav ── */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[72px] z-50 bg-black/95 backdrop-blur-lg border-r border-white/10 items-center py-6 gap-2">
        {/* Logo dot */}
        <Link href="/discover" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8336D] to-[#FF6B9D] flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform">
          <Flame className="w-5 h-5 text-white fill-white/80" />
        </Link>

        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              title={label}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all group ${
                active
                  ? "bg-[#E8336D]/15 text-[#E8336D]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E8336D] rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 ${active ? "fill-[#E8336D]/20" : ""}`} />
              {/* Tooltip */}
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
