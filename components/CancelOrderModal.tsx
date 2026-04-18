"use client";

import { useState } from "react";
import { Button, Alert } from "@cimpress-ui/react";
import { IconCloseBold, IconTrash } from "@cimpress-ui/react/icons";

export interface CancelModalItem {
  id: string;
  name: string;
  badgeLabel: string;
  imageUrl: string;
  quantity: number;
  itemTotal: string; // e.g. "10.00 USD"
}

export interface IneligibleModalItem extends CancelModalItem {
  ineligibleReason: string;
}

const CANCEL_REASONS = [
  "Customer requested cancellation",
  "Duplicate order",
  "Item out of stock",
  "Incorrect item ordered",
  "Shipping address issue",
  "Payment issue",
  "Other",
];

function parseValue(val: string): number {
  const match = val.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

interface CancelOrderModalProps {
  orderId: string;
  items: CancelModalItem[];               // eligible items to cancel
  ineligibleItems?: IneligibleModalItem[]; // selected items that can't be cancelled
  totalItemCount: number;                 // total items in the order (for subtitle)
  onClose: () => void;
  onConfirm: (confirmedIds: string[]) => void;
}

export function CancelOrderModal({
  orderId,
  items,
  ineligibleItems = [],
  totalItemCount,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [concession, setConcession] = useState<"yes" | "no" | null>(null);
  const [reason, setReason] = useState("");
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const visibleItems = items.filter((i) => !removedIds.has(i.id));
  const allRemoved = visibleItems.length === 0;
  const canSubmit = !allRemoved && concession !== null && reason !== "";
  const total = visibleItems.reduce((sum, i) => sum + parseValue(i.itemTotal), 0);

  function removeItem(id: string) {
    setRemovedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[var(--cim-radius-8)] w-full max-w-[864px] flex flex-col overflow-hidden max-h-[90vh]"
        style={{
          boxShadow:
            "0px 2px 8px rgba(0,0,0,0.12), 0px 8px 16px rgba(0,0,0,0.11), 0px 16px 24px rgba(0,0,0,0.10), 0px 16px 32px rgba(0,0,0,0.09), 0px 24px 48px rgba(0,0,0,0.08)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
      >
        {/* Header */}
        <div className="flex items-center gap-4 justify-between px-6 pt-6 pb-4 border-b border-[var(--cim-border-subtle)] shrink-0">
          <div className="flex flex-col gap-1">
            <p id="cancel-modal-title" className="text-lg font-semibold text-[color:var(--cim-fg-base)] leading-6">
              Cancel order
            </p>
            <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5">
              {orderId} | {items.length} out of {totalItemCount} items eligible for cancellation
            </p>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-[var(--cim-radius-4)] text-[color:var(--cim-fg-base)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconCloseBold />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-6 p-6 overflow-y-auto flex-1">

          {/* Warning text */}
          <p className="text-sm text-[color:var(--cim-fg-warning)] leading-5">
            Cancelling items does not automatically issue a refund or credit.
          </p>

          {/* Eligible items */}
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
              {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""} eligible for cancellation
            </p>
            {allRemoved ? (
              <Alert tone="warning">
                No items selected for cancellation. Please go back and select items again.
              </Alert>
            ) : (
              <div className="border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] overflow-hidden">
                {visibleItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 p-4 ${idx < visibleItems.length - 1 ? "border-b border-[var(--cim-border-base)]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[color:var(--cim-fg-base)] leading-5">{item.name}</span>
                        <span className="text-xs text-[color:var(--cim-fg-subtle)] bg-[var(--cim-bg-subtle)] px-2 py-0.5 rounded">{item.badgeLabel}</span>
                      </div>
                      <button
                        aria-label={`Remove ${item.name} from cancellation`}
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center w-8 h-8 shrink-0 rounded-[var(--cim-radius-4)] text-[color:var(--cim-fg-subtle)] hover:text-[color:var(--cim-fg-critical)] hover:bg-[var(--cim-bg-hover)] transition-colors"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded shrink-0"
                      />
                      <div className="flex gap-8 text-sm text-[color:var(--cim-fg-base)] leading-5">
                        <span>Quantity: {item.quantity}</span>
                        <span>Item Price: {item.itemTotal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ineligible items */}
          {ineligibleItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
                {ineligibleItems.length} item{ineligibleItems.length !== 1 ? "s" : ""} ineligible for cancellation
              </p>
              <div className="border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] overflow-hidden">
                {ineligibleItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 p-4 ${idx < ineligibleItems.length - 1 ? "border-b border-[var(--cim-border-base)]" : ""}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[color:var(--cim-fg-base)] leading-5">{item.name}</span>
                        <span className="text-xs text-[color:var(--cim-fg-subtle)] bg-[var(--cim-bg-subtle)] px-2 py-0.5 rounded">{item.badgeLabel}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded shrink-0"
                      />
                      <div className="flex gap-8 text-sm text-[color:var(--cim-fg-base)] leading-5">
                        <span>Quantity: {item.quantity}</span>
                        <span>Item Price: {item.itemTotal}</span>
                      </div>
                    </div>
                    {/* Ineligibility reason */}
                    <Alert tone="warning">{item.ineligibleReason}</Alert>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--cim-border-subtle)] shrink-0">
          <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
            Total Cancellation Value{" "}
            <span className="ml-4 font-normal">USD {total.toFixed(2)}</span>
          </p>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onPress={onClose}>Go back</Button>
            <Button
              variant="primary"
              tone="critical"
              isDisabled={!canSubmit}
              onPress={() => { if (canSubmit) onConfirm(visibleItems.map((i) => i.id)); }}
            >
              Cancel order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
