"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, MessageCircle, Wallet, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/discover", icon: Flame, label: "Discover" },
  { href: "/matches", icon: Heart, label: "Matches" },
  { href: "/matches", icon: MessageCircle, label: "Chat" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on auth pages or call pages
  const hiddenRoutes = ["/login", "/register", "/verify-email", "/verify", "/call"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all ${
                isActive
                  ? "text-brand-orange scale-105"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "fill-brand-orange/20" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
