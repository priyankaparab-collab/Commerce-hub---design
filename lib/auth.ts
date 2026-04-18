const AUTH_KEY = "COMMERCE_HUB_AUTH";
const TENANT_KEY = "COMMERCE_HUB_TENANT";

interface AuthData {
  email: string;
  name: string;
  loggedInAt: number;
}

export function getAuth(): { email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data: AuthData = JSON.parse(raw);
    return { email: data.email, name: data.name };
  } catch {
    return null;
  }
}

export function setAuth(email: string, name: string): void {
  if (typeof window === "undefined") return;
  const data: AuthData = { email, name, loggedInAt: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function getTenant(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TENANT_KEY);
}

export function setTenant(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TENANT_KEY, id);
}

export function clearTenant(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TENANT_KEY);
}

export const MERCHANT_GROUPS = [
  {
    label: "Cimpress Open",
    items: [
      { id: "cimpress-open-prod", label: "Cimpress Open - Prod" },
      { id: "cimpress-open-staging", label: "Cimpress Open - Staging" },
    ],
  },
  {
    label: "Vistaprint",
    items: [
      { id: "vp-us-prod", label: "VP-US-Prod" },
      { id: "vp-us-staging", label: "VP-US-Staging" },
      { id: "vp-in-prod", label: "VP-IN-Prod" },
    ],
  },
];

export function getTenantLabel(id: string): string {
  for (const group of MERCHANT_GROUPS) {
    for (const item of group.items) {
      if (item.id === id) return item.label;
    }
  }
  return id;
}
