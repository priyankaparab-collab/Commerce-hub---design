"use client";

import { useState, useCallback, useRef } from "react";
import { Button, CopyInline, Tooltip } from "@cimpress-ui/react";
import { IconMenuMoreVertical } from "@cimpress-ui/react/icons";
import { CancelOrderModal, CancelModalItem, IneligibleModalItem } from "./CancelOrderModal";
import { Toast } from "./Toast";
import { LINE_ITEMS } from "./LineItemsPanel";

interface OrderHeaderProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cancelledItemIds: Set<string>;
  onItemsCancelled: (ids: string[]) => void;
}

function isCancellable(item: { badgeLabel: string; id: string }, cancelledIds: Set<string>) {
  return item.badgeLabel !== "Delivered" && !cancelledIds.has(item.id);
}

export function OrderHeader({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  cancelledItemIds,
  onItemsCancelled,
}: OrderHeaderProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState<{ variant: "success" | "failure"; message: string } | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const cancelSpanRef = useRef<HTMLSpanElement>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const eligibleItems = LINE_ITEMS.filter((i) => isCancellable(i, cancelledItemIds));
  const ineligibleItems = LINE_ITEMS.filter((i) => !isCancellable(i, cancelledItemIds));
  const cancelDisabled = eligibleItems.length === 0;

  const allDelivered = LINE_ITEMS.every((i) => i.badgeLabel === "Delivered");
  const tooltipLabel = allDelivered
    ? "This order cannot be cancelled because all items have been delivered."
    : "This order cannot be cancelled because all eligible items have already been cancelled.";

  const toModalItem = (i: typeof LINE_ITEMS[0]): CancelModalItem => ({
    id: i.id,
    name: i.name,
    badgeLabel: i.badgeLabel,
    imageUrl: i.imageUrl ?? "",
    quantity: i.quantity,
    itemTotal: i.itemTotal,
  });

  async function handleConfirm(confirmedIds: string[]) {
    const ids = confirmedIds;
    setShowCancelModal(false);
    await new Promise((r) => setTimeout(r, 600));
    const success = Math.random() < 0.8;
    if (success) {
      onItemsCancelled(ids);
      const count = ids.length;
      setToast({
        variant: "success",
        message: `Cancellation request created for ${count} item${count !== 1 ? "s" : ""}`,
      });
    } else {
      setToast({
        variant: "failure",
        message: "Request failed due to an API error. Please try again.",
      });
    }
  }

  return (
    <>
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-1">
          <h1>
            <CopyInline variant="title-3">{orderId}</CopyInline>
          </h1>
          <div className="flex items-center gap-4 text-sm text-[color:var(--cim-fg-subtle)]">
            <span>{customerName}</span>
            <span>{customerEmail}</span>
            <span>{customerPhone}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip
            label={tooltipLabel}
            isDisabled={!cancelDisabled}
            isOpen={cancelDisabled && tooltipOpen}
            onOpenChange={setTooltipOpen}
            placement="bottom"
            triggerRef={cancelSpanRef}
          >
            <span
              ref={cancelSpanRef}
              className="inline-block"
              tabIndex={cancelDisabled ? 0 : -1}
              style={cancelDisabled ? { cursor: "not-allowed" } : undefined}
              onMouseEnter={() => { if (cancelDisabled) setTooltipOpen(true); }}
              onMouseLeave={() => setTooltipOpen(false)}
              onFocus={() => { if (cancelDisabled) setTooltipOpen(true); }}
              onBlur={() => setTooltipOpen(false)}
            >
              <Button
                variant="secondary"
                tone="critical"
                isDisabled={cancelDisabled}
                onPress={() => setShowCancelModal(true)}
                UNSAFE_style={cancelDisabled ? { pointerEvents: "none" } : undefined}
              >
                Cancel
              </Button>
            </span>
          </Tooltip>
          <button
            aria-label="More options"
            className="flex items-center justify-center w-9 h-9 rounded border border-[var(--cim-border-base)] text-[color:var(--cim-fg-subtle)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconMenuMoreVertical />
          </button>
        </div>
      </div>

      {showCancelModal && (
        <CancelOrderModal
          orderId={orderId}
          items={eligibleItems.map(toModalItem)}
          ineligibleItems={ineligibleItems.map((i) => ({
            ...toModalItem(i),
            ineligibleReason: cancelledItemIds.has(i.id)
              ? "This item cannot be cancelled because it has already been cancelled."
              : "This item cannot be cancelled because it has already been delivered.",
          }))}
          totalItemCount={LINE_ITEMS.length}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      {toast && (
        <Toast variant={toast.variant} message={toast.message} onDismiss={dismissToast} />
      )}
    </>
  );
}
