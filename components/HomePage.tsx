"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, getTenant, setTenant as saveTenant } from "@/lib/auth";
import { MerchantSelectionCard } from "./MerchantSelectionCard";
import { SearchView } from "./SearchView";
import { AppBreadcrumbs } from "./AppBreadcrumbs";

type AuthState = "loading" | "unauthenticated" | "authenticated";


export function HomePage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [tenant, setTenant] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      setAuthState("unauthenticated");
      router.replace("/login/");
      return;
    }
    setTenant(getTenant());
    setAuthState("authenticated");
  }, [router]);

  function handleTenantSelect(id: string) {
    saveTenant(id);
    setTenant(id);
  }

  if (authState !== "authenticated") {
    return null;
  }

  const breadcrumbItems = selectedCustomerName
    ? [{ label: "Dashboard", href: "/" }, { label: "Orders" }, { label: selectedCustomerName }]
    : [{ label: "Dashboard", href: "/" }, { label: "Orders" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ padding: "24px 2rem 0" }}>
        <AppBreadcrumbs items={breadcrumbItems} />
      </div>

      {!tenant ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <MerchantSelectionCard onSelect={handleTenantSelect} userName="" />
        </div>
      ) : (
        <div style={{ padding: "16px 2rem 2rem" }}>
          <SearchView tenant={tenant} userName="" onCustomerSelect={setSelectedCustomerName} />
        </div>
      )}
    </div>
  );
}
