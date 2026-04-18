"use client";

import { useState, useEffect } from "react";
import { Button, Select, SelectItem, NumberField, RadioGroup, Radio, FileTrigger, TextField, Badge } from "@cimpress-ui/react";
import type { ProductCatalogItem, DraftOrderItem, DraftOrderItemAttribute, QuantityPricingTier } from "@/lib/types";

interface ItemModificationPanelProps {
  product: ProductCatalogItem;
  initialValues?: DraftOrderItem; // populated when editing an existing item
  onAddToOrder: (item: DraftOrderItem) => void;
  onCancel: () => void;
}

function resolvePricingTier(tiers: QuantityPricingTier[], qty: number): number {
  for (const tier of [...tiers].reverse()) {
    if (qty >= tier.minQty) return tier.unitPrice;
  }
  return tiers[0]?.unitPrice ?? 0;
}

function generateDraftId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function ItemModificationPanel({ product, initialValues, onAddToOrder, onCancel }: ItemModificationPanelProps) {
  // Initialize attributes — default to first option for each attribute
  const defaultAttributes: DraftOrderItemAttribute[] = product.attributes.map((attr) => ({
    attributeId: attr.id,
    selectedOptionId: initialValues
      ? (initialValues.selectedAttributes.find((a) => a.attributeId === attr.id)?.selectedOptionId ?? attr.options[0]?.id ?? "")
      : (attr.options[0]?.id ?? ""),
  }));

  const [selectedAttributes, setSelectedAttributes] = useState<DraftOrderItemAttribute[]>(defaultAttributes);
  const [quantity, setQuantity] = useState<number>(initialValues?.quantity ?? product.minOrderQty);
  const [artworkType, setArtworkType] = useState<"upload" | "url" | "none">(initialValues?.artworkType ?? "none");
  const [artworkUrl, setArtworkUrl] = useState<string>(initialValues?.artworkUrl ?? "");
  const [artworkFileName, setArtworkFileName] = useState<string>(initialValues?.artworkFileName ?? "");
  const [itemDiscount, setItemDiscount] = useState<number>(initialValues?.itemDiscount ?? 0);

  const unitPrice = resolvePricingTier(product.pricingTiers, quantity);
  const lineTotal = parseFloat((unitPrice * quantity * (1 - itemDiscount / 100)).toFixed(2));

  // Find which pricing tier is active
  const activeTier = [...product.pricingTiers].reverse().find((t) => quantity >= t.minQty);

  useEffect(() => {
    // Reset to product defaults when product changes
    setSelectedAttributes(defaultAttributes);
    setQuantity(initialValues?.quantity ?? product.minOrderQty);
    setArtworkType(initialValues?.artworkType ?? "none");
    setArtworkUrl(initialValues?.artworkUrl ?? "");
    setArtworkFileName(initialValues?.artworkFileName ?? "");
    setItemDiscount(initialValues?.itemDiscount ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  function handleAttributeChange(attributeId: string, selectedOptionId: string) {
    setSelectedAttributes((prev) =>
      prev.map((a) => (a.attributeId === attributeId ? { ...a, selectedOptionId } : a))
    );
  }

  function handleFileSelect(files: FileList | null) {
    if (files && files[0]) {
      setArtworkFileName(files[0].name);
      setArtworkUrl("");
    }
  }

  function handleAddToOrder() {
    const item: DraftOrderItem = {
      draftItemId: initialValues?.draftItemId ?? generateDraftId(),
      product,
      selectedAttributes,
      quantity,
      artworkType,
      artworkUrl,
      artworkFileName,
      itemDiscount,
      unitPrice,
      lineTotal,
    };
    onAddToOrder(item);
  }

  const isValid = quantity >= product.minOrderQty && quantity <= product.maxOrderQty;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      padding: "20px",
      border: "1px solid var(--cim-border-subtle, #eaebeb)",
      borderRadius: "6px",
      background: "var(--cim-bg-base, #ffffff)",
    }}>
      {/* Product header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", background: "var(--cim-bg-subtle)", flexShrink: 0 }}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--cim-fg-muted)" strokeWidth="1.5"/>
                <path d="M3 16l5-5 4 4 3-3 5 4" stroke="var(--cim-fg-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>{product.name}</span>
            <Badge tone="base">{product.id}</Badge>
          </div>
          <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>{product.category}</span>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--cim-border-subtle, #eaebeb)" }} />

      {/* Section 1: Attributes */}
      {product.attributes.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>Product Options</span>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {product.attributes.map((attr) => {
              const currentVal = selectedAttributes.find((a) => a.attributeId === attr.id)?.selectedOptionId ?? attr.options[0]?.id ?? "";
              return (
                <div key={attr.id} style={{ minWidth: "160px", flex: 1 }}>
                  <Select
                    label={attr.label}
                    selectedKey={currentVal}
                    onSelectionChange={(val) => handleAttributeChange(attr.id, String(val))}
                  >
                    {attr.options.map((opt) => (
                      <SelectItem key={opt.id} id={opt.id}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Quantity + Pricing Tier */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>Quantity & Pricing</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ width: "140px" }}>
            <NumberField
              label="Quantity"
              value={quantity}
              onChange={(val) => setQuantity(val == null || isNaN(val) ? product.minOrderQty : val)}
              minValue={product.minOrderQty}
              maxValue={product.maxOrderQty}
              step={1}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingTop: "24px" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--cim-fg-base)" }}>
              ${unitPrice.toFixed(2)} <span style={{ fontSize: "0.8125rem", fontWeight: 400, color: "var(--cim-fg-subtle)" }}>per unit</span>
            </span>
            {activeTier && (
              <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-subtle)" }}>
                Tier: {activeTier.minQty}{activeTier.maxQty ? `–${activeTier.maxQty}` : "+"} units @ ${activeTier.unitPrice.toFixed(2)}/unit
              </span>
            )}
          </div>
        </div>

        {/* Pricing tiers display */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
          {product.pricingTiers.map((tier, i) => {
            const isActive = activeTier === tier;
            return (
              <div
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: "4px",
                  border: `1px solid ${isActive ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-border-base, #dadcdd)"}`,
                  background: isActive ? "var(--cim-bg-hover, #eef6fa)" : "transparent",
                  fontSize: "0.75rem",
                  color: isActive ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-fg-subtle)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : "+"} units · ${tier.unitPrice.toFixed(2)}
              </div>
            );
          })}
        </div>

        {!isValid && (
          <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-critical, #b91c1c)" }}>
            Quantity must be between {product.minOrderQty} and {product.maxOrderQty.toLocaleString()}
          </span>
        )}
      </div>

      {/* Section 3: Artwork */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>Artwork</span>
        <RadioGroup
          label="Artwork source"
          value={artworkType}
          onChange={(val) => {
            setArtworkType(val as "upload" | "url" | "none");
            setArtworkUrl("");
            setArtworkFileName("");
          }}
        >
          <Radio value="upload">Upload file</Radio>
          <Radio value="url">Enter URL</Radio>
          <Radio value="none">No artwork</Radio>
        </RadioGroup>

        {artworkType === "upload" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FileTrigger
              onSelect={handleFileSelect}
              acceptedFileTypes={[".pdf", ".ai", ".eps", ".png", ".jpg", ".jpeg", ".tiff"]}
            >
              <Button variant="secondary" size="small">Choose file</Button>
            </FileTrigger>
            {artworkFileName ? (
              <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{artworkFileName}</span>
            ) : (
              <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-muted)" }}>PDF, AI, EPS, PNG, JPG, TIFF accepted</span>
            )}
          </div>
        )}

        {artworkType === "url" && (
          <TextField
            label="Artwork URL"
            placeholder="https://assets.example.com/artwork.pdf"
            value={artworkUrl}
            onChange={setArtworkUrl}
          />
        )}
      </div>

      {/* Section 4: Item Discount */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>Item Discount</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
          <div style={{ width: "140px" }}>
            <NumberField
              label="Discount (%)"
              value={itemDiscount}
              onChange={(val) => setItemDiscount(val == null || isNaN(val) ? 0 : Math.min(100, Math.max(0, val)))}
              minValue={0}
              maxValue={100}
              step={1}
              formatOptions={{ style: "decimal" }}
            />
          </div>
          {itemDiscount > 0 && (
            <div style={{ paddingBottom: "8px" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-success, #15803d)", fontWeight: 500 }}>
                {itemDiscount}% off applied
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--cim-border-subtle, #eaebeb)" }} />

      {/* Line total summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>Line total</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--cim-fg-base)" }}>
            ${lineTotal.toFixed(2)} USD
          </span>
          {itemDiscount > 0 && (
            <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-subtle)", textDecoration: "line-through" }}>
              ${(unitPrice * quantity).toFixed(2)} USD
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="tertiary" onPress={onCancel}>Cancel</Button>
          <Button variant="primary" onPress={handleAddToOrder} isDisabled={!isValid}>
            {initialValues ? "Update item" : "Add to order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
