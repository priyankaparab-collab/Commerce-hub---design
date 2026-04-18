"use client";

import type { DraftOrder, CheckoutState, SavedAddress, ShippingMethod } from "@/lib/types";

interface ReviewOrderStepProps {
  draftOrder: DraftOrder;
  checkoutState: CheckoutState;
  shippingAddress: SavedAddress | null;
  billingAddress: SavedAddress | null;
  shippingMethod: ShippingMethod | null;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: "0.8125rem", fontWeight: 600, color: "var(--cim-fg-subtle)",
      textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px",
    }}>
      {children}
    </h3>
  );
}

function AddressBlock({ label, address }: { label: string; address: SavedAddress | null }) {
  if (!address) return null;
  return (
    <div>
      <SectionTitle>{label}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>{address.name}</span>
        {address.lines.map((line, i) => (
          <span key={i} style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>{line}</span>
        ))}
        <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>{address.phone}</span>
      </div>
    </div>
  );
}

export function ReviewOrderStep({
  draftOrder,
  checkoutState,
  shippingAddress,
  billingAddress,
  shippingMethod,
}: ReviewOrderStepProps) {
  const calculatedSubtotal = draftOrder.subtotal;
  const shippingCost = shippingMethod?.price ?? 0;
  const tax = draftOrder.taxEstimate;
  const discountAmount = checkoutState.discountCodeApplied
    ? (calculatedSubtotal + shippingCost + tax) * (checkoutState.discountPercent / 100)
    : 0;
  const finalTotal = checkoutState.overridePrice
    ? parseFloat(checkoutState.overridePrice)
    : calculatedSubtotal + shippingCost + tax - discountAmount;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Order items */}
      <div>
        <SectionTitle>Order items ({draftOrder.items.length})</SectionTitle>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--cim-border-subtle)", borderRadius: "4px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "var(--cim-bg-subtle)" }}>
              {["Product", "Options", "Qty", "Unit", "Total"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", fontSize: "0.75rem", fontWeight: 600, color: "var(--cim-fg-subtle)", textAlign: h === "Product" || h === "Options" ? "left" : "right", borderBottom: "1px solid var(--cim-border-base)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draftOrder.items.map((item, i) => (
              <tr key={item.draftItemId} style={{ background: i % 2 === 1 ? "var(--cim-bg-subtle)" : "white" }}>
                <td style={{ padding: "10px 12px", fontSize: "0.875rem", fontWeight: 500, color: "var(--cim-fg-base)", borderBottom: "1px solid var(--cim-border-base)" }}>
                  {item.product.name}
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", borderBottom: "1px solid var(--cim-border-base)" }}>
                  {item.selectedAttributes.map((attr) => {
                    const productAttr = item.product.attributes.find((a) => a.id === attr.attributeId);
                    return productAttr?.options.find((o) => o.id === attr.selectedOptionId)?.label;
                  }).filter(Boolean).join(" · ")}
                  {item.itemDiscount > 0 && (
                    <span style={{ display: "block", color: "var(--cim-fg-success, #15803d)", fontWeight: 500 }}>
                      {item.itemDiscount}% item discount
                    </span>
                  )}
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.875rem", textAlign: "right", color: "var(--cim-fg-base)", borderBottom: "1px solid var(--cim-border-base)" }}>
                  {item.quantity.toLocaleString()}
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.875rem", textAlign: "right", color: "var(--cim-fg-subtle)", borderBottom: "1px solid var(--cim-border-base)" }}>
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.875rem", fontWeight: 600, textAlign: "right", color: "var(--cim-fg-base)", borderBottom: "1px solid var(--cim-border-base)" }}>
                  ${item.lineTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Addresses + shipping method (2-column) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        <AddressBlock label="Ship to" address={shippingAddress} />
        <AddressBlock label="Bill to" address={billingAddress} />
        <div>
          <SectionTitle>Shipping method</SectionTitle>
          {shippingMethod ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>
                {shippingMethod.name} via {shippingMethod.carrier}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
                Estimated: {shippingMethod.estimatedDeliveryLabel}
              </span>
              <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
                ${shippingMethod.price.toFixed(2)} USD
              </span>
            </div>
          ) : (
            <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-muted)" }}>—</span>
          )}
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ background: "var(--cim-bg-subtle)", borderRadius: "6px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <SectionTitle>Pricing</SectionTitle>
        {[
          { label: `Subtotal (${draftOrder.items.length} item${draftOrder.items.length !== 1 ? "s" : ""})`, value: `$${calculatedSubtotal.toFixed(2)}` },
          { label: "Shipping", value: `$${shippingCost.toFixed(2)}` },
          { label: "Tax (estimated)", value: `$${tax.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--cim-fg-subtle)" }}>{label}</span>
            <span style={{ color: "var(--cim-fg-base)" }}>{value}</span>
          </div>
        ))}
        {discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--cim-fg-success, #15803d)" }}>
              Discount ({checkoutState.discountCode} · {checkoutState.discountPercent}%)
            </span>
            <span style={{ color: "var(--cim-fg-success, #15803d)" }}>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        {checkoutState.overridePrice && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--cim-fg-warning, #a15e0c)" }}>Price override</span>
            <span style={{ color: "var(--cim-fg-warning, #a15e0c)" }}>Applied</span>
          </div>
        )}
        <div style={{ height: "1px", background: "var(--cim-border-base)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.0625rem", fontWeight: 700 }}>
          <span style={{ color: "var(--cim-fg-base)" }}>Total due</span>
          <span style={{ color: "var(--cim-fg-base)" }}>${finalTotal.toFixed(2)} USD</span>
        </div>
      </div>
    </div>
  );
}
