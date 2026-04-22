"use client";

import { useState } from "react";
import {
  Checkbox, Button, Disclosure, AlertDialog, AlertDialogBody, AlertDialogActions,
  Select, SelectItem,
} from "@cimpress-ui/react";
import {
  IconTrash,
  IconPencil,
  IconDuplicate,
  IconCheckCircleFill,
  IconInfoCircle,
} from "@cimpress-ui/react/icons";
import type { QuantityPricingTier } from "@/lib/types";
import type { DraftOrderItem } from "@/lib/types";
import { Toast } from "@/components/Toast";

function resolvePricingTier(tiers: QuantityPricingTier[], qty: number): number {
  for (const tier of [...tiers].reverse()) {
    if (qty >= tier.minQty) return tier.unitPrice;
  }
  return tiers[0]?.unitPrice ?? 0;
}

function generateQuantityOptions(min: number, max: number, tiers: QuantityPricingTier[]): number[] {
  const opts = new Set<number>([min, max]);
  tiers.forEach((t) => { opts.add(t.minQty); if (t.maxQty) opts.add(t.maxQty); });
  if (max - min <= 500) {
    const step = Math.ceil((max - min) / 6);
    for (let q = min; q <= max; q += step) opts.add(q);
  }
  return [...opts].filter((q) => q >= min && q <= max).sort((a, b) => a - b);
}

interface OrderItemsListProps {
  items: DraftOrderItem[];
  onEdit: (draftItemId: string) => void;
  onRemove: (draftItemId: string) => void;
  onDuplicate: (draftItemId: string) => void;
  onQuantityChange?: (draftItemId: string, newQty: number) => void;
}

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: "none",
  background: "none",
  borderRadius: "4px",
  cursor: "pointer",
  color: "var(--cim-fg-subtle, #5f6469)",
};

export function OrderItemsList({ items, onEdit, onRemove, onDuplicate, onQuantityChange }: OrderItemsListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [showDuplicateToast, setShowDuplicateToast] = useState(false);

  if (items.length === 0) return null;

  const removingItem = removingItemId ? items.find((i) => i.draftItemId === removingItemId) : null;

  const allSelected = selectedIds.size === items.length && items.length > 0;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.draftItemId)));
    }
  }

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeSelected() {
    selectedIds.forEach((id) => onRemove(id));
    setSelectedIds(new Set());
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {showDuplicateToast && (
        <Toast
          variant="success"
          message="Item duplicated successfully"
          onDismiss={() => setShowDuplicateToast(false)}
          autoDismissMs={3000}
        />
      )}

      <AlertDialog
        title="Remove item"
        tone="critical"
        isOpen={removingItemId !== null}
        onOpenChange={(open) => { if (!open) setRemovingItemId(null); }}
      >
        <AlertDialogBody>
          {removingItem
            ? `Are you sure you want to remove "${removingItem.product.name}" from the order?`
            : "Are you sure you want to remove this item from the order?"}
        </AlertDialogBody>
        <AlertDialogActions>
          <Button variant="tertiary" onPress={() => setRemovingItemId(null)}>Cancel</Button>
          <Button
            variant="primary"
            tone="critical"
            onPress={() => {
              if (removingItemId) {
                onRemove(removingItemId);
                setSelectedIds((prev) => { const n = new Set(prev); n.delete(removingItemId); return n; });
              }
              setRemovingItemId(null);
            }}
          >
            Remove
          </Button>
        </AlertDialogActions>
      </AlertDialog>
      {/* Selection bar */}
      <div style={{
        background: "var(--cim-bg-subtle, #f8f9fa)",
        borderRadius: "6px",
        padding: "0 16px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
      }}>
        <Checkbox
          isSelected={allSelected}
          isIndeterminate={someSelected}
          onChange={toggleAll}
        >
          {selectedIds.size} out of {items.length} item{items.length !== 1 ? "s" : ""} selected
        </Checkbox>
        <Button
          variant="tertiary"
          tone="critical"
          size="small"
          isDisabled={selectedIds.size === 0}
          onPress={removeSelected}
        >
          Remove all Items
        </Button>
      </div>

      {/* Item cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item) => {
          const taxRate = item.product.taxRate ?? 8;
          const taxAmount = item.lineTotal * (taxRate / 100);
          const stockQty = item.product.stockQuantity;
          const attributes = item.selectedAttributes
            .map((attr) => {
              const productAttr = item.product.attributes.find((a) => a.id === attr.attributeId);
              const option = productAttr?.options.find((o) => o.id === attr.selectedOptionId);
              return option ? `${productAttr?.label}: ${option.label}` : null;
            })
            .filter(Boolean) as string[];

          return (
            <div key={item.draftItemId} style={{
              background: "white",
              border: "1px solid var(--cim-border-base, #dadcdd)",
              borderRadius: "6px",
              overflow: "hidden",
            }}>
              {/* Card body */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
                {/* Header: checkbox + name + action buttons */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                    <Checkbox
                      isSelected={selectedIds.has(item.draftItemId)}
                      onChange={() => toggleItem(item.draftItemId)}
                    />
                    <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--cim-fg-base, #15191d)", whiteSpace: "nowrap" }}>
                      {item.product.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                    <button
                      style={iconBtnStyle}
                      title="Duplicate"
                      aria-label="Duplicate item"
                      onClick={() => { onDuplicate(item.draftItemId); setShowDuplicateToast(true); }}
                    >
                      <IconDuplicate />
                    </button>
                    <button
                      style={iconBtnStyle}
                      title="Edit"
                      aria-label="Edit item"
                      onClick={() => onEdit(item.draftItemId)}
                    >
                      <IconPencil />
                    </button>
                    <button
                      style={{ ...iconBtnStyle, color: "var(--cim-fg-critical, #d10023)" }}
                      title="Remove"
                      aria-label="Remove item"
                      onClick={() => setRemovingItemId(item.draftItemId)}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>

                {/* Body: image + details */}
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  {/* Product image + edit design link */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{
                      width: "187px",
                      height: "187px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      background: "white",
                      border: "1px solid var(--cim-border-subtle, #eaebeb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {item.product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--cim-fg-muted)" strokeWidth="1.5" />
                        </svg>
                      )}
                    </div>
                    <a
                      href="#"
                      style={{ fontSize: "1rem", color: "var(--cim-fg-accent, #007798)", textDecoration: "underline" }}
                      onClick={(e) => { e.preventDefault(); onEdit(item.draftItemId); }}
                    >
                      Edit design
                    </a>
                  </div>

                  {/* Quantity + item total */}
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", minWidth: 0 }}>
                    {/* Left: quantity */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "336px" }}>
                          <Select
                            label="Quantity"
                            selectedKey={String(item.quantity)}
                            onSelectionChange={(val) => onQuantityChange?.(item.draftItemId, Number(val))}
                            isDisabled={!onQuantityChange}
                          >
                            {generateQuantityOptions(item.product.minOrderQty, item.product.maxOrderQty, item.product.pricingTiers).map((q) => {
                              const tierPrice = resolvePricingTier(item.product.pricingTiers, q);
                              const totalForQ = parseFloat((q * tierPrice).toFixed(2));
                              return (
                                <SelectItem key={String(q)} id={String(q)}>
                                  {q} (USD {totalForQ.toFixed(2)}) {tierPrice.toFixed(2)} / unit
                                </SelectItem>
                              );
                            })}
                          </Select>
                        </div>
                        <div style={{ marginTop: "22px", color: "var(--cim-fg-subtle, #5f6469)", display: "flex" }}>
                          <IconInfoCircle />
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-subtle, #5f6469)" }}>
                        Quantity has to be between {item.product.minOrderQty} - {item.product.maxOrderQty}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--cim-fg-success, #15803d)", display: "flex" }}>
                          <IconCheckCircleFill />
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base, #15191d)" }}>
                          In stock{stockQty != null ? ` - ${stockQty}` : ""}
                        </span>
                      </div>
                    </div>

                    {/* Right: item total */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0 }}>
                      <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-muted, #94979b)" }}>
                        Item total
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base, #0b0f13)" }}>
                          Tax USD {taxAmount.toFixed(2)}
                        </span>
                        <span style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--cim-fg-base, #0b0f13)" }}>
                          USD {item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected options disclosure */}
              <div style={{ borderTop: "1px solid var(--cim-border-subtle, #eaebeb)" }}>
                <Disclosure title="Selected options and details" variant="subtle">
                  <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {attributes.length > 0 ? (
                      attributes.map((attr, i) => (
                        <span key={i} style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{attr}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-muted)" }}>No attributes selected</span>
                    )}
                    {item.artworkType !== "none" && item.artworkFileName && (
                      <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>
                        Artwork: {item.artworkFileName}
                      </span>
                    )}
                    {item.itemDiscount > 0 && (
                      <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-success, #15803d)", fontWeight: 500 }}>
                        {item.itemDiscount}% item discount applied
                      </span>
                    )}
                  </div>
                </Disclosure>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
