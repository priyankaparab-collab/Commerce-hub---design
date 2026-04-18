"use client";

import { Checkbox } from "@cimpress-ui/react";
import type { SavedAddress, CheckoutState } from "@/lib/types";

interface ShippingBillingStepProps {
  addresses: SavedAddress[];
  checkoutState: CheckoutState;
  onChange: (partial: Partial<CheckoutState>) => void;
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: SavedAddress;
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
        alignItems: "flex-start",
      }}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") onSelect(); }}
    >
      {/* Radio indicator */}
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
        border: `2px solid ${selected ? "var(--cim-fg-accent, #0e7490)" : "var(--cim-border-base, #dadcdd)"}`,
        background: selected ? "var(--cim-fg-accent, #0e7490)" : "white",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {selected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
      </div>

      {/* Address content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{address.label}</span>
          {address.isDefault && (
            <span style={{
              fontSize: "0.6875rem", fontWeight: 600, padding: "1px 6px",
              borderRadius: "10px", background: "var(--cim-bg-subtle)",
              color: "var(--cim-fg-subtle)", border: "1px solid var(--cim-border-base)",
            }}>
              Default
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)", marginBottom: "2px" }}>{address.name}</div>
        {address.lines.map((line, i) => (
          <div key={i} style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>{line}</div>
        ))}
        <div style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", marginTop: "4px" }}>{address.phone}</div>
      </div>
    </div>
  );
}

export function ShippingBillingStep({ addresses, checkoutState, onChange }: ShippingBillingStepProps) {
  const effectiveBillingId = checkoutState.billingSameAsShipping
    ? checkoutState.shippingAddressId
    : checkoutState.billingAddressId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Shipping address */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 4px" }}>
            Shipping address
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", margin: 0 }}>
            Select where the order should be shipped
          </p>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          role="radiogroup"
          aria-label="Shipping address"
        >
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              selected={checkoutState.shippingAddressId === addr.id}
              onSelect={() => onChange({ shippingAddressId: addr.id })}
            />
          ))}
        </div>
      </div>

      {/* Billing address */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 4px" }}>
            Billing address
          </h3>
        </div>

        <Checkbox
          isSelected={checkoutState.billingSameAsShipping}
          onChange={(checked) => onChange({ billingSameAsShipping: checked })}
        >
          Same as shipping address
        </Checkbox>

        {!checkoutState.billingSameAsShipping && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            role="radiogroup"
            aria-label="Billing address"
          >
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                selected={effectiveBillingId === addr.id}
                onSelect={() => onChange({ billingAddressId: addr.id })}
              />
            ))}
          </div>
        )}

        {checkoutState.billingSameAsShipping && checkoutState.shippingAddressId && (
          <div style={{ padding: "10px 14px", background: "var(--cim-bg-subtle)", borderRadius: "4px", fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>
            Billing to: {addresses.find((a) => a.id === checkoutState.shippingAddressId)?.name} —{" "}
            {addresses.find((a) => a.id === checkoutState.shippingAddressId)?.lines[0]}
          </div>
        )}
      </div>
    </div>
  );
}
