"use client";

import { useState } from "react";
import { Button, TextField, NumberField, Badge } from "@cimpress-ui/react";
import type { CheckoutState, DraftOrder } from "@/lib/types";
import { MOCK_DISCOUNT_CODES } from "@/lib/createOrderMockData";

interface DiscountStepProps {
  draftOrder: DraftOrder;
  checkoutState: CheckoutState;
  onChange: (partial: Partial<CheckoutState>) => void;
}

export function DiscountStep({ draftOrder, checkoutState, onChange }: DiscountStepProps) {
  const [codeInput, setCodeInput] = useState(checkoutState.discountCode);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [overrideInput, setOverrideInput] = useState<number | undefined>(
    checkoutState.overridePrice ? parseFloat(checkoutState.overridePrice) : undefined
  );

  function handleApplyCode() {
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setCodeError("Please enter a discount code");
      return;
    }
    const percent = MOCK_DISCOUNT_CODES[code];
    if (percent === undefined) {
      setCodeError(`"${code}" is not a valid code. Try: SAVE10, PROMO20, VIP15, NEWCUST25`);
      onChange({ discountCode: "", discountCodeApplied: false, discountPercent: 0 });
      return;
    }
    setCodeError(null);
    onChange({ discountCode: code, discountCodeApplied: true, discountPercent: percent });
  }

  function handleRemoveCode() {
    setCodeInput("");
    setCodeError(null);
    onChange({ discountCode: "", discountCodeApplied: false, discountPercent: 0 });
  }

  function handleOverrideChange(val: number | null) {
    setOverrideInput(val == null || isNaN(val) ? undefined : val);
    onChange({ overridePrice: val == null || isNaN(val) ? "" : String(val.toFixed(2)) });
  }

  const calculatedTotal = draftOrder.subtotal + draftOrder.shippingEstimate + draftOrder.taxEstimate;
  const discountAmount = checkoutState.discountCodeApplied
    ? calculatedTotal * (checkoutState.discountPercent / 100)
    : 0;
  const finalTotal = checkoutState.overridePrice
    ? parseFloat(checkoutState.overridePrice)
    : calculatedTotal - discountAmount;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Discount code section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 4px" }}>
            Discount code
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", margin: 0 }}>
            Apply an order-level discount code. Item-level discounts are applied separately per line item.
          </p>
        </div>

        {checkoutState.discountCodeApplied ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", background: "var(--cim-bg-hover, #eef6fa)",
            border: "1px solid var(--cim-fg-accent, #0e7490)", borderRadius: "6px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="var(--cim-fg-success, #15803d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>
                  {checkoutState.discountCode}
                </span>
                <span style={{ marginLeft: "8px" }}>
                  <Badge tone="success">{checkoutState.discountPercent}% off</Badge>
                </span>
                <div style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", marginTop: "2px" }}>
                  Saves ${discountAmount.toFixed(2)} USD
                </div>
              </div>
            </div>
            <Button variant="tertiary" size="small" onPress={handleRemoveCode}>
              Remove
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Enter code"
                  placeholder="e.g. SAVE10"
                  value={codeInput}
                  onChange={(val) => { setCodeInput(val); setCodeError(null); }}
                />
                {codeError && (
                  <p style={{ fontSize: "0.75rem", color: "var(--cim-fg-critical, #b91c1c)", margin: "4px 0 0" }}>
                    {codeError}
                  </p>
                )}
              </div>
              <Button variant="secondary" onPress={handleApplyCode}>Apply</Button>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-muted)" }}>
              Available codes: SAVE10, PROMO20, VIP15, NEWCUST25
            </span>
          </div>
        )}
      </div>

      {/* Override price section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 4px" }}>
            Override total price
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)", margin: 0 }}>
            Override the calculated total with a custom price. This will replace all other pricing calculations.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <NumberField
            label="Custom total price (USD)"
            placeholder="Leave empty to use calculated price"
            value={overrideInput}
            onChange={handleOverrideChange}
            minValue={0}
            formatOptions={{ style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          />
          {overrideInput !== undefined && (
            <Button
              variant="tertiary"
              size="small"
              onPress={() => {
                setOverrideInput(undefined);
                onChange({ overridePrice: "" });
              }}
            >
              Remove override
            </Button>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div style={{ padding: "16px", background: "var(--cim-bg-subtle)", borderRadius: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)" }}>Price summary</span>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
          <span>Subtotal</span><span>${draftOrder.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
          <span>Shipping</span><span>${draftOrder.shippingEstimate.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
          <span>Tax</span><span>${draftOrder.taxEstimate.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--cim-fg-success, #15803d)" }}>
            <span>Discount ({checkoutState.discountPercent}%)</span><span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        {overrideInput !== undefined && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--cim-fg-warning, #a15e0c)" }}>
            <span>Price overridden</span><span>Custom total applied</span>
          </div>
        )}
        <div style={{ height: "1px", background: "var(--cim-border-base)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 700, color: "var(--cim-fg-base)" }}>
          <span>Total due</span><span>${finalTotal.toFixed(2)} USD</span>
        </div>
      </div>
    </div>
  );
}
