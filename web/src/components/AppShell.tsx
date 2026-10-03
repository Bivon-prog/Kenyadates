"use client";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className={isAdmin ? "" : "md:pl-[72px]"}>
      {children}
    </div>
  );
}
