"use client";
import { usePathname } from "next/navigation";

// Pages that should NOT have the desktop sidebar offset
const NO_OFFSET = ["/", "/login", "/register", "/verify-email", "/verify", "/about",
  "/blog", "/careers", "/privacy", "/terms", "/guidelines", "/cookies", "/coming-soon"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noOffset = NO_OFFSET.includes(pathname) || pathname.startsWith("/admin");
  return (
    <div className={noOffset ? "" : "md:pl-[72px]"}>
      {children}
    </div>
  );
}
