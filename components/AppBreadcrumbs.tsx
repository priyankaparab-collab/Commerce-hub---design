"use client";

import Link from "next/link";
import { IconChevronRight } from "@cimpress-ui/react/icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function AppBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: "32px" }}>
      {items.map((item, index) => (
        <span key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {index > 0 && (
            <span style={{ color: "var(--cim-fg-subtle)", display: "flex", alignItems: "center" }}>
              <IconChevronRight />
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              style={{
                fontSize: "1rem",
                lineHeight: "1.5rem",
                color: "var(--cim-fg-accent, #007798)",
                textDecoration: "underline",
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                fontSize: "1rem",
                lineHeight: "1.5rem",
                color: "var(--cim-fg-base, #15191d)",
                textDecoration: "underline",
              }}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
