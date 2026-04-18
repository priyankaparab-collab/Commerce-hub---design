"use client";

import type { ShippingMethod, CheckoutState } from "@/lib/types";

interface ShippingMethodStepProps {
  methods: ShippingMethod[];
  checkoutState: CheckoutState;
  onChange: (partial: Partial<CheckoutState>) => void;
}

function ShippingMethodCard({
  method,
  selected,
  onSelect,
}: {
  method: ShippingMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${selected ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-border-base, #dadcdd)"}`,
        borderRadius: "6px",
        padding: "14px 16px",
        cursor: "pointer",
        background: selected ? "var(--cim-bg-hover, #eef6fa)" : "white",
        transition: "border-color 0.15s, background 0.15s",
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onSelect(); }}
    >
      {/* Radio indicator */}
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-border-base, #dadcdd)"}`,
        background: selected ? "var(--cim-fg-accent, #0e7490)" : "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
      </div>

      {/* Method info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--cim-fg-base)" }}>
            {method.name}
          </span>
          <span style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>
            via {method.carrier}
          </span>
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", marginTop: "2px" }}>
          Estimated delivery: <span style={{ fontWeight: 500, color: "var(--cim-fg-base)" }}>{method.estimatedDeliveryLabel}</span>
          <span style={{ marginLeft: "6px" }}>({method.estimatedDays} business day{method.estimatedDays !== 1 ? "s" : ""})</span>
        </div>
      </div>

      {/* Price */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{
          fontSize: "1.0625rem", fontWeight: 700,
          color: selected ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-fg-base)",
        }}>
          ${method.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function ShippingMethodStep({ methods, checkoutState, onChange }: ShippingMethodStepProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 4px" }}>
          Shipping method
        </h3>
        <p style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", margin: 0 }}>
          Select a shipping option. Delivery estimates are based on business days from production completion.
        </p>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
        role="radiogroup"
        aria-label="Shipping method"
      >
        {methods.map((method) => (
          <ShippingMethodCard
            key={method.id}
            method={method}
            selected={checkoutState.shippingMethodId === method.id}
            onSelect={() => onChange({ shippingMethodId: method.id })}
          />
        ))}
      </div>

      {checkoutState.shippingMethodId && (
        <div style={{
          padding: "10px 14px",
          background: "var(--cim-bg-hover, #eef6fa)",
          borderRadius: "4px",
          border: "1px solid var(--cim-fg-accent, #0e7490)",
          fontSize: "0.8125rem",
          color: "var(--cim-fg-accent, #0e7490)",
          fontWeight: 500,
        }}>
          {(() => {
            const selected = methods.find((m) => m.id === checkoutState.shippingMethodId);
            return selected ? `${selected.name} shipping selected — arrives by ${selected.estimatedDeliveryLabel}` : "";
          })()}
        </div>
      )}
    </div>
  );
}
