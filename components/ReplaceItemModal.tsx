"use client";

import { useState } from "react";
import { Button, Alert, ModalDialog, ModalDialogBody, ModalDialogActions, Select, SelectItem } from "@cimpress-ui/react";
import { IconTrash } from "@cimpress-ui/react/icons";

export interface ReplaceModalItem {
  id: string;
  name: string;
  badgeLabel: string;
  imageUrl: string;
  quantity: number;
  maxQuantity: number;
  stock: number;
  itemTotal: string;
  shippingOptions: string[];
  priorAlerts?: Array<{ tone: "warning" | "info"; message: string }>;
}

export interface IneligibleReplaceItem {
  id: string;
  name: string;
  badgeLabel: string;
  imageUrl: string;
  quantity: number;
  itemTotal: string;
  ineligibleReason: string;
  outOfStock?: boolean;
}

export const REPLACE_REASONS = [
  "Item delivered was damaged",
  "Item delivered was incorrect",
  "Item quality issue",
  "Received incomplete item",
  "Features desired",
  "Customer preference",
  "Other",
];

interface Props {
  orderId: string;
  items: ReplaceModalItem[];
  ineligibleItems?: IneligibleReplaceItem[];
  totalItemCount: number;
  onClose: () => void;
  onConfirm: (confirmed: Array<{ id: string; quantity: number; shipping: string }>, reason: string) => void;
}

export function ReplaceItemModal({
  orderId,
  items,
  ineligibleItems = [],
  totalItemCount,
  onClose,
  onConfirm,
}: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    () => Object.fromEntries(items.map((i) => [i.id, i.quantity]))
  );
  const [shippings, setShippings] = useState<Record<string, string>>(
    () => Object.fromEntries(items.map((i) => [i.id, i.shippingOptions[0] ?? ""]))
  );
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [concession, setConcession] = useState<"yes" | "no" | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const visibleItems = items.filter((i) => !removedIds.has(i.id));
  const allRemoved = visibleItems.length === 0;

  const hasQtyError = visibleItems.some((i) => {
    const q = quantities[i.id] ?? i.quantity;
    return q < 1 || q > i.maxQuantity;
  });

  const canSubmit = !allRemoved && !hasQtyError && concession !== null && reason !== null && reason !== "";

  function removeItem(id: string) {
    setRemovedIds((prev) => new Set([...prev, id]));
  }

  function handleConfirm() {
    if (!canSubmit) return;
    onConfirm(
      visibleItems.map((i) => ({
        id: i.id,
        quantity: quantities[i.id] ?? i.quantity,
        shipping: shippings[i.id] ?? "",
      })),
      reason!
    );
  }

  return (
    <ModalDialog
      title="Replace selected items"
      size="medium"
      isOpen={true}
      onOpenChange={(open) => { if (!open) onClose(); }}
      isDismissible={true}
    >
      <ModalDialogBody>
        <div className="flex flex-col gap-6">
          {/* Subtitle */}
          <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5 -mt-2">
            {orderId} | {visibleItems.length} out of {totalItemCount} items eligible for replacement
          </p>

          <p className="text-sm text-[color:var(--cim-fg-warning)] leading-5">
            Replacing items does not automatically issue a refund or credit.
          </p>

          {/* Eligible items */}
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
              {visibleItems.length} item{visibleItems.length !== 1 ? "s" : ""} eligible for replacement
            </p>
            {allRemoved ? (
              <Alert tone="warning">
                No items selected for replacement. Please go back and select items again.
              </Alert>
            ) : (
              <div className="border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] overflow-hidden">
                {visibleItems.map((item, idx) => {
                  const qty = quantities[item.id] ?? item.quantity;
                  const qtyInvalid = qty < 1 || qty > item.maxQuantity;
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-3 p-4 ${idx < visibleItems.length - 1 ? "border-b border-[var(--cim-border-base)]" : ""}`}
                    >
                      {/* Name + badge + trash */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[color:var(--cim-fg-base)] leading-5">{item.name}</span>
                          <span className="text-xs text-[color:var(--cim-fg-subtle)] bg-[var(--cim-bg-subtle)] px-2 py-0.5 rounded">{item.badgeLabel}</span>
                        </div>
                        <button
                          aria-label={`Remove ${item.name} from replacement`}
                          onClick={() => removeItem(item.id)}
                          className="flex items-center justify-center w-8 h-8 shrink-0 rounded-[var(--cim-radius-4)] text-[color:var(--cim-fg-subtle)] hover:text-[color:var(--cim-fg-critical)] hover:bg-[var(--cim-bg-hover)] transition-colors"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>

                      {/* Image + original qty + price */}
                      <div className="flex gap-4 items-start">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded shrink-0" />
                        <div className="flex gap-8 text-sm text-[color:var(--cim-fg-base)] leading-5">
                          <span>Original Quantity: {item.quantity}</span>
                          <span>Item Price: {item.itemTotal}</span>
                        </div>
                      </div>

                      {/* Quantity + Shipping */}
                      <div className="flex gap-4 items-start">
                        <div className="flex flex-col gap-1 flex-1">
                          <label className="text-sm text-[color:var(--cim-fg-base)] leading-5">Quantity</label>
                          <input
                            type="number"
                            min={1}
                            max={item.maxQuantity}
                            value={qty}
                            onChange={(e) =>
                              setQuantities((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                            }
                            className={`w-full bg-white border rounded-[var(--cim-radius-4)] px-3 py-2 text-sm leading-5 text-[color:var(--cim-fg-base)] focus:outline-none ${qtyInvalid ? "border-[var(--cim-border-critical)]" : "border-[var(--cim-border-base)] focus:border-[var(--cim-fg-accent)]"}`}
                          />
                          {qtyInvalid ? (
                            <p className="text-xs text-[color:var(--cim-fg-critical)] leading-4">
                              Quantity has to be between 1 - {item.maxQuantity}
                            </p>
                          ) : (
                            <p className="text-xs text-[color:var(--cim-fg-subtle)] leading-4">
                              Quantity has to be between 1 - {item.maxQuantity}
                            </p>
                          )}
                          <p className="text-xs text-[color:var(--cim-fg-success)] leading-4">
                            In stock - {item.stock}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <Select
                            label="Shipping"
                            selectedKey={shippings[item.id] ?? item.shippingOptions[0]}
                            onSelectionChange={(key) =>
                              setShippings((prev) => ({ ...prev, [item.id]: key as string }))
                            }
                          >
                            {item.shippingOptions.map((s) => (
                              <SelectItem key={s} id={s}>{s}</SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>

                      {/* Per-item prior alerts */}
                      {item.priorAlerts?.map((alert, i) => (
                        <Alert key={i} tone={alert.tone}>{alert.message}</Alert>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ineligible items */}
          {ineligibleItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-[color:var(--cim-fg-base)] leading-6">
                {ineligibleItems.length} item{ineligibleItems.length !== 1 ? "s" : ""} ineligible for replacement
              </p>
              <div className="border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] overflow-hidden">
                {ineligibleItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-3 p-4 ${idx < ineligibleItems.length - 1 ? "border-b border-[var(--cim-border-base)]" : ""}`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[color:var(--cim-fg-base)] leading-5">{item.name}</span>
                      <span className="text-xs text-[color:var(--cim-fg-subtle)] bg-[var(--cim-bg-subtle)] px-2 py-0.5 rounded">{item.badgeLabel}</span>
                    </div>
                    <div className="flex gap-4 items-start">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded shrink-0 opacity-50" />
                      <div className="flex gap-8 text-sm text-[color:var(--cim-fg-subtle)] leading-5">
                        <span>Original Quantity: {item.quantity}</span>
                        <span>Item Price: {item.itemTotal}</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-col gap-1 flex-1">
                        <label className="text-sm text-[color:var(--cim-fg-base)] leading-5">Quantity</label>
                        <input
                          type="number"
                          disabled
                          value={item.outOfStock ? "" : item.quantity}
                          placeholder={item.outOfStock ? "Selection" : undefined}
                          className="w-full bg-[var(--cim-bg-subtle)] border border-[var(--cim-border-base)] rounded-[var(--cim-radius-4)] px-3 py-2 text-sm leading-5 text-[color:var(--cim-fg-disabled)] cursor-not-allowed"
                        />
                        {item.outOfStock && (
                          <p className="text-xs text-[color:var(--cim-fg-critical)] leading-4">No stock is available at the moment</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <Select
                          label="Shipping"
                          isDisabled={true}
                          selectedKey={item.outOfStock ? null : "(Standard) Arriving: TBD"}
                          onSelectionChange={() => {}}
                          placeholder={item.outOfStock ? "Select shipping methods" : undefined}
                        >
                          {!item.outOfStock && (
                            <SelectItem id="(Standard) Arriving: TBD">(Standard) Arriving: TBD</SelectItem>
                          )}
                        </Select>
                      </div>
                    </div>
                    {item.outOfStock && (
                      <p className="text-xs text-[color:var(--cim-fg-critical)] leading-4 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 32 32" fill="currentColor">
                          <path fillRule="evenodd" d="M16 3a13 13 0 1 0 0 26A13 13 0 0 0 16 3zM1 16C1 7.716 7.716 1 16 1s15 6.716 15 15-6.716 15-15 15S1 24.284 1 16zm14-5a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zm0 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
                        </svg>
                        Out of stock
                      </p>
                    )}
                    <Alert tone="warning">Cannot be replaced — {item.ineligibleReason}</Alert>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
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
                      name="replace-concession"
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
            <Select
              label="Select a reason for replacement"
              isRequired
              selectedKey={reason}
              onSelectionChange={(key) => setReason(key as string | null)}
              placeholder="Select reason here"
            >
              {REPLACE_REASONS.map((r) => (
                <SelectItem key={r} id={r}>{r}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </ModalDialogBody>

      <ModalDialogActions>
        <Button variant="secondary" onPress={onClose}>Go back</Button>
        <Button
          variant="primary"
          tone="critical"
          isDisabled={!canSubmit}
          onPress={handleConfirm}
        >
          Replace item
        </Button>
      </ModalDialogActions>
    </ModalDialog>
  );
}
