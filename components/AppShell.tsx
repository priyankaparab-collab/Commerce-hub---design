"use client";

import { usePathname } from "next/navigation";
import { CommerceHubHeader } from "./CommerceHubHeader";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--cim-bg-subtle, #f8f9fa)" }}>
      <CommerceHubHeader />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <SideNav />
        <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
