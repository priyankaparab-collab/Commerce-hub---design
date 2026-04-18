"use client";

import type { ProductCatalogItem } from "@/lib/types";

interface ProductResultsTableProps {
  results: ProductCatalogItem[];
  hasSearched: boolean;
  searchQuery: string;
  onSelect: (product: ProductCatalogItem) => void;
}

const thStyle: React.CSSProperties = {
  padding: "0 12px",
  height: "40px",
  background: "var(--cim-bg-subtle, #f8f9fa)",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--cim-fg-base, #15191d)",
  textAlign: "left",
  borderBottom: "1px solid var(--cim-border-base, #dadcdd)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "0 12px",
  height: "52px",
  fontSize: "0.875rem",
  color: "var(--cim-fg-base, #15191d)",
  borderBottom: "1px solid var(--cim-border-base, #dadcdd)",
  whiteSpace: "nowrap",
};

function WarningCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  );
}

export function ProductResultsTable({ results, hasSearched, searchQuery, onSelect }: ProductResultsTableProps) {
  if (!hasSearched) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "48px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.875rem", color: "var(--cim-fg-muted, #94979b)", margin: 0 }}>
          Search for a product by name or CIM ID to add it to the order
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <span style={{ color: "var(--cim-fg-warning, #a15e0c)", display: "flex" }}>
          <WarningCircleIcon />
        </span>
        <p className="font-semibold" style={{ fontSize: "1rem", color: "var(--cim-fg-warning, #a15e0c)", margin: 0 }}>
          No results
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--cim-fg-warning, #a15e0c)", margin: 0 }}>
          No products found for &quot;{searchQuery}&quot;. Try a different name or CIM ID.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <p className="font-semibold" style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)", margin: 0 }}>
        {results.length} Search Result{results.length !== 1 ? "s" : ""}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--cim-border-subtle, #eaebeb)", borderRadius: "4px", overflow: "hidden" }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: "52px" }}>Image</th>
            <th style={thStyle}>Product name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>CIM ID</th>
          </tr>
        </thead>
        <tbody>
          {results.map((product, i) => (
            <tr
              key={product.id}
              onClick={() => onSelect(product)}
              style={{
                background: i % 2 === 1 ? "var(--cim-bg-subtle, #f8f9fa)" : "white",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cim-bg-hover, #eef6fa)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "var(--cim-bg-subtle, #f8f9fa)" : "white")}
            >
              <td style={{ ...tdStyle, width: "52px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "4px", overflow: "hidden", background: "var(--cim-bg-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      width={36}
                      height={36}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--cim-fg-muted)" strokeWidth="1.5"/>
                      <path d="M3 16l5-5 4 4 3-3 5 4" stroke="var(--cim-fg-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </td>
              <td style={tdStyle}>
                <span style={{ fontWeight: 500 }}>{product.name}</span>
              </td>
              <td style={{ ...tdStyle, color: "var(--cim-fg-subtle)" }}>{product.category}</td>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: "0.8125rem" }}>{product.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
