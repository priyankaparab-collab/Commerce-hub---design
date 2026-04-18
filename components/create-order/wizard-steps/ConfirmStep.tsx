"use client";

import { Button, CopyInline } from "@cimpress-ui/react";

interface ConfirmStepProps {
  confirmedOrderId: string;
  customerName: string;
  onGoToOrder: () => void;
}

export function ConfirmStep({ confirmedOrderId, customerName, onGoToOrder }: ConfirmStepProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "24px",
      padding: "32px 24px",
      textAlign: "center",
    }}>
      {/* Success icon */}
      <div style={{
        width: "72px", height: "72px", borderRadius: "50%",
        background: "var(--cim-bg-success-subtle, #dcfce7)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="var(--cim-fg-success, #15803d)" opacity="0.15"/>
          <path d="M20 6L9 17l-5-5" stroke="var(--cim-fg-success, #15803d)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Heading */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2 style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--cim-fg-base)", margin: 0 }}>
          Order placed successfully!
        </h2>
        <p style={{ fontSize: "0.9375rem", color: "var(--cim-fg-subtle)", margin: 0 }}>
          The order has been created for <strong>{customerName}</strong>.
          <br />You will receive a confirmation once it enters production.
        </p>
      </div>

      {/* Order ID */}
      <div style={{
        padding: "16px 24px",
        background: "var(--cim-bg-subtle)",
        borderRadius: "8px",
        border: "1px solid var(--cim-border-base)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignItems: "center",
        minWidth: "280px",
      }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--cim-fg-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Order ID
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--cim-fg-base)", fontFamily: "monospace" }}>
            {confirmedOrderId}
          </span>
          <CopyInline variant="body">{confirmedOrderId}</CopyInline>
        </div>
      </div>

      {/* Next steps */}
      <div style={{
        background: "var(--cim-bg-hover, #eef6fa)",
        border: "1px solid var(--cim-border-subtle)",
        borderRadius: "6px",
        padding: "12px 16px",
        textAlign: "left",
        maxWidth: "400px",
        width: "100%",
      }}>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--cim-fg-base)", margin: "0 0 6px" }}>
          What happens next?
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {[
            "Order is sent to the fulfillment system",
            "Production begins within 1 business day",
            "Tracking info will be available once shipped",
          ].map((step) => (
            <li key={step} style={{ fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Go to order button */}
      <Button variant="primary" onPress={onGoToOrder}>
        View order details
      </Button>
    </div>
  );
}
