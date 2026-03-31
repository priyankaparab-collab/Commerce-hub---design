"use client";

import { useState } from "react";
import { Button } from "@cimpress-ui/react";
import { IconCloseBold } from "@cimpress-ui/react/icons";

const CANCEL_REASONS = [
  "Customer requested cancellation",
  "Duplicate order",
  "Item out of stock",
  "Incorrect item ordered",
  "Shipping address issue",
  "Payment issue",
  "Other",
];

interface CancelOrderModalProps {
  orderId: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelOrderModal({ orderId, onClose, onConfirm }: CancelOrderModalProps) {
  const [concession, setConcession] = useState<"yes" | "no" | null>(null);
  const [reason, setReason] = useState("");

  const canSubmit = concession !== null && reason !== "";

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dialog */}
      <div
        className="bg-white rounded-[var(--cim-radius-8)] w-full max-w-[864px] flex flex-col overflow-hidden"
        style={{
          boxShadow:
            "0px 2px 8px rgba(0,0,0,0.12), 0px 8px 16px rgba(0,0,0,0.11), 0px 16px 24px rgba(0,0,0,0.10), 0px 16px 32px rgba(0,0,0,0.09), 0px 24px 48px rgba(0,0,0,0.08)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
      >
        {/* Header */}
        <div className="flex items-center gap-4 justify-between px-6 pt-6 pb-4 border-b border-[var(--cim-border-subtle)]">
          <div className="flex flex-col gap-2">
            <p id="cancel-modal-title" className="text-lg font-semibold text-[color:var(--cim-fg-base)] leading-6">
              Cancel order
            </p>
            <p className="text-sm text-[color:var(--cim-fg-base)] leading-5">{orderId}</p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--cim-radius-4)] text-[color:var(--cim-fg-base)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconCloseBold />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-8 p-6">
          {/* Confirmation text */}
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
              Are you sure you want to cancel the entire order?
            </p>
            <p className="text-sm text-[color:var(--cim-fg-warning)] leading-5">
              Cancelling the order does not automatically issue a refund or credit.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Concession radio */}
            <div className="flex items-center gap-10">
              <p className="text-base text-[color:var(--cim-fg-base)] leading-6 whitespace-nowrap">
                Is this a concession?{" "}
                <span className="text-[color:var(--cim-fg-critical)]">*</span>
              </p>
              <div className="flex items-center gap-4">
                {(["yes", "no"] as const).map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-2 cursor-pointer text-base text-[color:var(--cim-fg-base)] leading-6 select-none"
                  >
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        concession === val
                          ? "border-[var(--cim-fg-accent)] border-[5px]"
                          : "border-[var(--cim-fg-base)] bg-white"
                      }`}
                    />
                    <input
                      type="radio"
                      name="concession"
                      value={val}
                      checked={concession === val}
                      onChange={() => setConcession(val)}
                      className="sr-only"
                    />
                    {val === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </div>

            {/* Reason select */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 text-sm text-[color:var(--cim-fg-base)] leading-4">
                Select a reason for cancellation
                <span className="text-[color:var(--cim-fg-critical)]">*</span>
              </label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full appearance-none bg-white border border-[var(--cim-border-base)] rounded-[var(--cim-radius-4)] px-3 py-2.5 text-base leading-6 text-[color:var(--cim-fg-base)] focus:outline-none focus:border-[var(--cim-fg-accent)] pr-10"
                  style={{ color: reason ? "var(--cim-fg-base)" : "var(--cim-fg-subtle)" }}
                >
                  <option value="" disabled>Select reason here</option>
                  {CANCEL_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--cim-fg-subtle)]">
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 10.293a1 1 0 0 1 1.414 0L16 19.586l9.293-9.293a1 1 0 1 1 1.414 1.414l-10 10a1 1 0 0 1-1.414 0l-10-10a1 1 0 0 1 0-1.414z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-3 border-t border-[var(--cim-border-subtle)]">
          <Button variant="secondary" onPress={onClose}>Go back</Button>
          <Button
            variant="primary"
            tone="critical"
            isDisabled={!canSubmit}
            onPress={() => { if (canSubmit) onConfirm(); }}
          >
            Cancel order
          </Button>
        </div>
      </div>
    </div>
  );
}
