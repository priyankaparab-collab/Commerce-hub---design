"use client";

import { useState, useRef, useEffect } from "react";
import { Button, SearchField, Text } from "@cimpress-ui/react";
import { AppBreadcrumbs } from "@/components/AppBreadcrumbs";
import { IconArrowLeft } from "@cimpress-ui/react/icons";
import type { ProductCatalogItem, DraftOrderItem } from "@/lib/types";
import { MOCK_PRODUCT_CATALOG } from "@/lib/createOrderMockData";
import { ItemConfigurationCard, type ItemConfigurationCardHandle } from "./ItemConfigurationCard";
import type { Customer } from "@/lib/createOrderMockData";

interface AddNewItemViewProps {
  customer: Customer;
  onAddComplete: (item: DraftOrderItem) => void;
  onCancel: () => void;
  pendingItemTotal: number;
}

function searchProducts(query: string): ProductCatalogItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_PRODUCT_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

function NotesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const actionBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  border: "1px solid var(--cim-border-base, #dadcdd)",
  background: "white",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "0.875rem",
  color: "var(--cim-fg-base, #15191d)",
  fontWeight: 500,
};

export function AddNewItemView({ customer, onAddComplete, onCancel }: AddNewItemViewProps) {
  const [query, setQuery] = useState("");
  const [dropdownResults, setDropdownResults] = useState<ProductCatalogItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(null);
  const [itemTotal, setItemTotal] = useState(0);
  const [isValid, setIsValid] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<ItemConfigurationCardHandle>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleQueryChange(val: string) {
    setQuery(val);
    if (!val.trim()) {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }
    const results = searchProducts(val);
    setDropdownResults(results.slice(0, 6));
    setShowDropdown(results.length > 0);
  }

  function handleProductSelect(product: ProductCatalogItem) {
    setSelectedProduct(product);
    setQuery(product.name);
    setShowDropdown(false);
    setItemTotal(0);
    setIsValid(false);
  }

  function handleClearSearch() {
    setQuery("");
    setDropdownResults([]);
    setShowDropdown(false);
    setSelectedProduct(null);
    setItemTotal(0);
    setIsValid(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--cim-bg-subtle, #f8f9fa)" }}>
      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "96px" }}>
        <AppBreadcrumbs items={[
          { label: "Dashboard", href: "/" },
          { label: "Customer management", href: "/customers" },
          { label: customer.name, href: "/customers/" + customer.id },
          { label: "Create order", href: "/customers/" + customer.id + "/create-order" },
          { label: "Add new item" },
        ]} />

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={onCancel}
              aria-label="Back"
              style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "2px", color: "var(--cim-fg-base)", borderRadius: "4px", flexShrink: 0 }}
            >
              <IconArrowLeft />
            </button>
            <Text as="h1" variant="title-4">Add new item</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button style={actionBtnStyle} aria-label="Add notes">
              <NotesIcon />
              Add notes
            </button>
            <button style={actionBtnStyle} aria-label="Share this item">
              <ShareIcon />
              Share this item
            </button>
          </div>
        </div>

        {/* Search input with dropdown */}
        <div style={{ position: "relative", width: "100%", maxWidth: "870px", margin: "0 auto" }} ref={inputWrapperRef}>
          <SearchField
            aria-label="Search for product"
            placeholder="Search for product"
            value={query}
            onChange={handleQueryChange}
            onClear={handleClearSearch}
            onSubmit={() => {
              if (dropdownResults.length > 0) handleProductSelect(dropdownResults[0]);
            }}
          />

          {/* Dropdown results */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid var(--cim-border-base, #dadcdd)",
                borderRadius: "6px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                zIndex: 100,
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {dropdownResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: "1px solid var(--cim-border-subtle, #eaebeb)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cim-bg-hover, #eef6fa)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--cim-bg-subtle, #f8f9fa)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "0.625rem", color: "var(--cim-fg-muted)" }}>IMG</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 500, color: "var(--cim-fg-base)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {product.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--cim-fg-subtle)", marginTop: "2px" }}>
                      {product.category}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", flexShrink: 0, fontFamily: "monospace" }}>
                    {product.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item configuration card */}
        {selectedProduct && (
          <div style={{ width: "100%", maxWidth: "870px", margin: "0 auto" }}>
            <ItemConfigurationCard
              ref={cardRef}
              product={selectedProduct}
              onAddToOrder={onAddComplete}
              onLineTotalChange={setItemTotal}
              onValidityChange={setIsValid}
            />
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid var(--cim-border-subtle, #eaebeb)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "870px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: itemTotal > 0 ? "var(--cim-fg-base, #15191d)" : "var(--cim-fg-muted, #94979b)", whiteSpace: "nowrap" }}>
              Item total {itemTotal.toFixed(2)} USD
            </span>
            <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.875rem", color: "var(--cim-fg-muted, #94979b)", textAlign: "left", textDecoration: "underline" }}>
              View details
            </button>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="secondary" onPress={onCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isDisabled={!selectedProduct || !isValid}
              onPress={() => cardRef.current?.submit()}
            >
              Add item to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
