"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge, Button, Checkbox, SearchField } from "@cimpress-ui/react";
import {
  IconMenuMoreVertical,
  IconInfoCircle,
  IconWarning,
  IconCheckCircle,
  IconChevronRightBold,
} from "@cimpress-ui/react/icons";
import { CancelOrderModal, CancelModalItem, IneligibleModalItem } from "./CancelOrderModal";
import { ReplaceItemModal, ReplaceModalItem, IneligibleReplaceItem } from "./ReplaceItemModal";
import { ReplacementHistoryModal, ReplacementHistoryEntry } from "./ReplacementHistoryModal";
import { Toast } from "./Toast";
import { LINE_ITEMS } from "@/lib/mockData";
import type { LineItem, ShipmentType, ShipmentInfo } from "@/lib/types";

// ─── Replacement helpers ──────────────────────────────────────────────────────

/** Items eligible for replacement (not Shipped or Delivered) */
function isItemReplaceable(item: LineItem): boolean {
  return item.badgeLabel !== "Shipped" && item.badgeLabel !== "Delivered";
}

const SHIPPING_OPTIONS = [
  "(Standard) Arriving: Mon, 2 Feb 2026",
  "(Priority) Arriving: Thu, 29 Jan 2026",
];

/** Per-item replacement config: prior alerts shown in the modal */
const REPLACE_PRIOR_ALERTS: Record<string, Array<{ tone: "warning" | "info"; message: string }>> = {
  "1": [
    {
      tone: "info",
      message: "This item was replaced previously because of item delivered was damaged.",
    },
  ],
};

function buildReplaceModalItem(item: LineItem): ReplaceModalItem {
  return {
    id: item.id,
    name: item.name,
    badgeLabel: item.badgeLabel,
    imageUrl: item.imageUrl ?? "",
    quantity: item.quantity,
    maxQuantity: item.quantity * 2 > 0 ? item.quantity * 2 : 10,
    stock: 250,
    itemTotal: item.itemTotal,
    shippingOptions: SHIPPING_OPTIONS,
    priorAlerts: REPLACE_PRIOR_ALERTS[item.id],
  };
}

function buildIneligibleReplaceItem(item: LineItem): IneligibleReplaceItem {
  const reasons: Record<string, { reason: string; outOfStock?: boolean }> = {
    "3": { reason: "it has been edited causing a blank separation mismatch. Please add the item to the cart and place the order again." },
    "4": { reason: "the item has already been delivered.", outOfStock: false },
  };
  const cfg = reasons[item.id] ?? { reason: "it cannot be replaced at this time." };
  return {
    id: item.id,
    name: item.name,
    badgeLabel: item.badgeLabel,
    imageUrl: item.imageUrl ?? "",
    quantity: item.quantity,
    itemTotal: item.itemTotal,
    ineligibleReason: cfg.reason,
    outOfStock: cfg.outOfStock,
  };
}

function generateReprintId(): string {
  return Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 8)).join("-");
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-GB", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  }).replace(",", "");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isItemCancellable(item: LineItem, cancelledIds: Set<string>): boolean {
  return item.badgeLabel !== "Delivered" && !cancelledIds.has(item.id);
}

// ─── Shipment banner ──────────────────────────────────────────────────────────

const SHIPMENT_CONFIG: Record<ShipmentType, { bg: string; iconColor: string }> = {
  none:    { bg: "bg-[#f8f9fa]",  iconColor: "text-[color:var(--cim-fg-subtle)]" },
  warning: { bg: "bg-[#fef2f2]",  iconColor: "text-[color:var(--cim-fg-critical)]" },
  info:    { bg: "bg-[#eff8fb]",  iconColor: "text-[color:var(--cim-fg-info)]" },
  success: { bg: "bg-[#f0faf4]",  iconColor: "text-[color:var(--cim-fg-success)]" },
};

function ShipmentIcon({ type, className }: { type: ShipmentType; className: string }) {
  if (type === "warning") return <span className={className}><IconWarning /></span>;
  if (type === "success") return <span className={className}><IconCheckCircle /></span>;
  return <span className={className}><IconInfoCircle /></span>;
}

function ShipmentBanner({ shipment }: { shipment: ShipmentInfo }) {
  const { bg, iconColor } = SHIPMENT_CONFIG[shipment.type];
  return (
    <div className={`${bg} flex gap-4 h-[115px] items-center overflow-clip p-2 rounded-lg shrink-0 w-full`}>
      <div className="flex-1 min-w-0">
        <div className="flex gap-3 items-start p-1">
          <ShipmentIcon type={shipment.type} className={`shrink-0 mt-0.5 ${iconColor}`} />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="font-semibold text-base leading-6 text-[color:var(--cim-fg-base)]">
              {shipment.title}
            </p>
            <p className="text-sm leading-5 text-[color:var(--cim-fg-base)]">
              {shipment.subtitle}
            </p>
            {shipment.showViewDetails && (
              <button className="flex items-center gap-0.5 text-sm text-[color:var(--cim-fg-accent)] hover:underline w-fit mt-0.5">
                View Details <IconChevronRightBold />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Item action menu ─────────────────────────────────────────────────────────

const ITEM_MENU_ACTIONS = ["Refund Item", "Credit Item", "Replace Item", "Edit Document"];

function ItemActionMenu({
  canCancel,
  onCancelItem,
  onReplaceItem,
}: {
  canCancel: boolean;
  onCancelItem: () => void;
  onReplaceItem: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-label="Item actions"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-6 h-6 rounded text-[color:var(--cim-fg-subtle)] hover:text-[color:var(--cim-fg-base)] hover:bg-[var(--cim-bg-hover)] transition-colors"
        style={{ minWidth: 24, minHeight: 24 }}
      >
        <span style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconMenuMoreVertical />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] py-1 w-44 shadow-lg">
          {ITEM_MENU_ACTIONS.map((label) => (
            <button
              key={label}
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-[color:var(--cim-fg-base)] hover:bg-[var(--cim-bg-hover)] transition-colors"
              onClick={() => {
                setOpen(false);
                if (label === "Replace Item") onReplaceItem();
              }}
            >
              {label}
            </button>
          ))}
          <div className="h-px bg-[var(--cim-border-subtle)] mx-3 my-1" />
          <button
            type="button"
            disabled={!canCancel}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              canCancel
                ? "text-[color:var(--cim-fg-critical)] hover:bg-[var(--cim-bg-hover)] cursor-pointer"
                : "text-[color:var(--cim-fg-disabled)] cursor-not-allowed"
            }`}
            onClick={() => {
              if (canCancel) {
                setOpen(false);
                onCancelItem();
              }
            }}
          >
            Cancel Item
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Line item card ───────────────────────────────────────────────────────────

function LineItemCard({
  item,
  isSelected,
  onSelect,
  isCancelled,
  onCancelItem,
  onReplaceItem,
  replacementCount,
  onViewReplacement,
}: {
  item: LineItem;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  isCancelled: boolean;
  onCancelItem: () => void;
  onReplaceItem: () => void;
  replacementCount: number;
  onViewReplacement: () => void;
}) {
  const canCancel = isItemCancellable(item, isCancelled ? new Set([item.id]) : new Set());

  return (
    <div
      className="bg-white border border-[#dadcdd] flex flex-col items-start rounded-lg shrink-0 w-[325px] relative"
      style={{ boxShadow: "0px 1px 1px 0px rgba(0,0,0,0.08), 0px 1px 3px 0px rgba(0,0,0,0.04)" }}
    >
      {/* Card header: checkbox + name/badge + kebab */}
      <div className="flex gap-3 items-start p-4 w-full min-h-[116px]">
        <div className="flex gap-2 items-center shrink-0 pt-1">
          <Checkbox isSelected={isSelected} onChange={onSelect} aria-label={`Select ${item.name}`} />
        </div>
        <div className="flex flex-1 flex-col gap-2 items-start min-w-0 self-stretch">
          <p className="font-semibold leading-6 text-base text-[color:var(--cim-fg-base)] w-full h-12 line-clamp-2 overflow-hidden">
            {item.name}
          </p>
          {isCancelled ? (
            <Badge size="large" tone="warning">Cancellation requested</Badge>
          ) : (
            <Badge size="large" tone={item.badgeTone}>{item.badgeLabel}</Badge>
          )}
        </div>
        <ItemActionMenu canCancel={canCancel} onCancelItem={onCancelItem} onReplaceItem={onReplaceItem} />
      </div>

      {/* Product image */}
      <div className="h-[200px] w-full overflow-clip shrink-0">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#dadcdd] shrink-0" />

      {/* Details + pricing + footer */}
      <div className="flex flex-1 flex-col items-start justify-between p-4 w-full gap-4">
        <div className="flex flex-col gap-4 items-start w-full">

          {/* Detail rows */}
          <div className="flex flex-col gap-3 items-start w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">Total item quantity</span>
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">{item.quantity}</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">Fulfiller</span>
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">{item.fulfiller}</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">{item.dateLabel}</span>
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">{item.dateValue}</span>
            </div>
          </div>

          {/* Item Total */}
          <div className="flex flex-col gap-2 items-start w-full">
            <div className="h-px w-full bg-[#dadcdd]" />
            <div className="flex items-end justify-between w-full">
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">Item Total</span>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-[color:var(--cim-fg-base)] leading-4">{item.tax}</span>
                <div className="flex gap-2 items-center">
                  {item.originalTotal && (
                    <span className="text-base text-[color:var(--cim-fg-subtle)] line-through leading-6">
                      {item.originalTotal}
                    </span>
                  )}
                  <span className="font-semibold text-base text-[color:var(--cim-fg-base)] leading-6">
                    {item.itemTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment banner */}
          <ShipmentBanner shipment={item.shipment} />

          {/* Re-Care Actions */}
          {replacementCount > 0 && (
            <div className="flex flex-col gap-2 items-start w-full">
              <span className="text-base text-[color:var(--cim-fg-base)] leading-6">Re-Care Actions</span>
              <button
                onClick={onViewReplacement}
                className="text-base text-[color:var(--cim-fg-accent)] underline decoration-[1.5px] leading-6 hover:opacity-80"
              >
                Total Replacement {replacementCount} time{replacementCount !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>

        {/* Attributes and IDs footer */}
        <div className="flex flex-col gap-4 items-start w-full">
          <div className="h-px w-full bg-[#dadcdd]" />
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-[color:var(--cim-fg-base)] leading-6">Attributes and IDs</span>
            <span className="text-[color:var(--cim-fg-subtle)]"><IconChevronRightBold /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-exported so OrderDetailsPage / OrderHeader can access item data
export type { LineItem, ShipmentType, ShipmentInfo };
export { LINE_ITEMS };
export const allLineItemsDelivered = LINE_ITEMS.every((i) => i.badgeLabel === "Delivered");
export const hasDelayedItems = LINE_ITEMS.some((i) => i.badgeLabel === "Delayed");

// ─── Main panel ───────────────────────────────────────────────────────────────

export function LineItemsPanel({
  cancelledItemIds = new Set<string>(),
  onItemsCancelled,
}: {
  cancelledItemIds?: Set<string>;
  onItemsCancelled?: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalItems, setModalItems] = useState<CancelModalItem[]>([]);
  const [modalIneligibleItems, setModalIneligibleItems] = useState<IneligibleModalItem[]>([]);
  const [toast, setToast] = useState<{ variant: "success" | "failure"; message: string } | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  // Replacement state — item "1" seeded with 2 prior successful replacements
  const [replaceHistory, setReplaceHistory] = useState<Record<string, ReplacementHistoryEntry[]>>({
    "1": [
      { date: "Mon 15 Sep 2025 (GMT+0530 IST)", quantity: 1, reason: "Item quality issue", reprintId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", success: true },
      { date: "Mon 11 Aug 2025 (GMT+0530 IST)", quantity: 1, reason: "Item delivered was damaged", reprintId: "c6b92c77-71a3-4a12-962d-1234567890ab", success: true },
    ],
  });
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replaceModalItems, setReplaceModalItems] = useState<ReplaceModalItem[]>([]);
  const [replaceModalIneligible, setReplaceModalIneligible] = useState<IneligibleReplaceItem[]>([]);
  const [historyItemId, setHistoryItemId] = useState<string | null>(null);

  const filteredItems = LINE_ITEMS.filter(
    (item) =>
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.includes(search)
  );

  const allSelected = filteredItems.length > 0 && filteredItems.every((i) => selectedIds.has(i.id));
  const someSelected = filteredItems.some((i) => selectedIds.has(i.id)) && !allSelected;
  const selectedCount = LINE_ITEMS.filter((i) => selectedIds.has(i.id)).length;
  const hasSelection = selectedCount > 0;

  // Bulk cancel is enabled only if at least one selected item is actually cancellable
  const canBulkCancel =
    hasSelection &&
    LINE_ITEMS.filter((i) => selectedIds.has(i.id)).some((i) =>
      isItemCancellable(i, cancelledItemIds)
    );

  function handleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(filteredItems.map((i) => i.id)) : new Set());
  }

  function handleSelectItem(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  /** Open the cancel modal for specific item IDs (splits into eligible + ineligible). */
  function openCancelModal(itemIds: string[]) {
    const selected = LINE_ITEMS.filter((i) => itemIds.includes(i.id));
    const eligible = selected.filter((i) => isItemCancellable(i, cancelledItemIds));
    const ineligible = selected.filter((i) => !isItemCancellable(i, cancelledItemIds));

    if (eligible.length === 0 && ineligible.length === 0) return;

    const toModalItem = (i: LineItem): CancelModalItem => ({
      id: i.id,
      name: i.name,
      badgeLabel: i.badgeLabel,
      imageUrl: i.imageUrl ?? "",
      quantity: i.quantity,
      itemTotal: i.itemTotal,
    });

    setModalItems(eligible.map(toModalItem));
    setModalIneligibleItems(
      ineligible.map((i) => ({
        ...toModalItem(i),
        ineligibleReason:
          cancelledItemIds.has(i.id)
            ? "This item cannot be cancelled because it has already been cancelled."
            : "This item cannot be cancelled because it has already been delivered.",
      }))
    );
    setShowModal(true);
  }

  async function handleCancelConfirm(confirmedIds: string[]) {
    const ids = confirmedIds;
    setShowModal(false);
    await new Promise((r) => setTimeout(r, 600));
    const success = Math.random() < 0.8;
    if (success) {
      onItemsCancelled?.(ids); // parent updates cancelledItemIds
      setSelectedIds(new Set());
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

  function openReplaceModal(itemIds: string[]) {
    const selected = LINE_ITEMS.filter((i) => itemIds.includes(i.id));
    const eligible = selected.filter(isItemReplaceable);
    const ineligible = selected.filter((i) => !isItemReplaceable(i));
    setReplaceModalItems(eligible.map(buildReplaceModalItem));
    setReplaceModalIneligible(ineligible.map(buildIneligibleReplaceItem));
    setShowReplaceModal(true);
  }

  async function handleReplaceConfirm(
    confirmed: Array<{ id: string; quantity: number; shipping: string }>,
    reason: string
  ) {
    setShowReplaceModal(false);
    await new Promise((r) => setTimeout(r, 600));
    const success = Math.random() < 0.9;
    const dateStr = formatDate(new Date());
    const newEntries: ReplacementHistoryEntry[] = confirmed.map((c) => ({
      date: dateStr,
      quantity: c.quantity,
      reason,
      reprintId: success ? generateReprintId() : "",
      success,
    }));
    setReplaceHistory((prev) => {
      const next = { ...prev };
      confirmed.forEach((c, idx) => {
        next[c.id] = [...(next[c.id] ?? []), newEntries[idx]];
      });
      return next;
    });
    const count = confirmed.length;
    setToast({
      variant: success ? "success" : "failure",
      message: success
        ? `Replacement request created for ${count} item${count !== 1 ? "s" : ""}`
        : "Replacement request failed due to an API error. Please try again.",
    });
  }

  return (
    <div className="flex flex-col gap-4 pt-6">
      {/* Summary */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-base leading-6 text-[color:var(--cim-fg-base)]">
          4/4 total items showing
        </p>
        <p className="text-base leading-6 text-[color:var(--cim-fg-base)]">
          Estimated delivery date is Fri, 11 Nov 2025 - Tue, 16 Dec 2025
        </p>
      </div>

      {/* Search */}
      <SearchField
        aria-label="Search line items"
        placeholder="Search by item ID, item name, Tracking ID"
        value={search}
        onChange={setSearch}
      />

      {/* Selection toolbar */}
      <div className="bg-[#f8f9fa] flex h-12 items-center justify-between overflow-clip px-4 py-2 rounded-[var(--cim-radius-6)] w-full">
        <Checkbox
          isSelected={allSelected}
          isIndeterminate={someSelected}
          onChange={handleSelectAll}
        >
          {selectedCount} out of {LINE_ITEMS.length} items selected
        </Checkbox>
        <div className="flex gap-4 items-center">
          <Button variant="tertiary" size="small" isDisabled={!hasSelection}>Refund</Button>
          <Button variant="tertiary" size="small" isDisabled={!hasSelection}>Credit</Button>
          <Button variant="tertiary" size="small" isDisabled={!hasSelection} onPress={() => openReplaceModal([...selectedIds])}>Replace</Button>
          <Button variant="tertiary" size="small" isDisabled={!hasSelection}>Add to Cart</Button>
          <Button
            tone="critical"
            variant="tertiary"
            size="small"
            isDisabled={!canBulkCancel}
            onPress={() => openCancelModal([...selectedIds])}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap gap-4">
        {filteredItems.map((item) => {
          const history = replaceHistory[item.id] ?? [];
          const successCount = history.filter((e) => e.success).length;
          return (
            <LineItemCard
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onSelect={(checked) => handleSelectItem(item.id, checked)}
              isCancelled={cancelledItemIds.has(item.id)}
              onCancelItem={() => openCancelModal([item.id])}
              onReplaceItem={() => openReplaceModal([item.id])}
              replacementCount={successCount}
              onViewReplacement={() => setHistoryItemId(item.id)}
            />
          );
        })}
      </div>

      {/* Cancel modal */}
      {showModal && (
        <CancelOrderModal
          orderId="VP_8WZ3DJ32"
          items={modalItems}
          ineligibleItems={modalIneligibleItems}
          totalItemCount={LINE_ITEMS.length}
          onClose={() => setShowModal(false)}
          onConfirm={handleCancelConfirm}
        />
      )}

      {/* Replace modal */}
      {showReplaceModal && (
        <ReplaceItemModal
          orderId="VP_8WZ3DJ32"
          items={replaceModalItems}
          ineligibleItems={replaceModalIneligible}
          totalItemCount={LINE_ITEMS.length}
          onClose={() => setShowReplaceModal(false)}
          onConfirm={handleReplaceConfirm}
        />
      )}

      {/* Replacement history modal */}
      {historyItemId && (() => {
        const item = LINE_ITEMS.find((i) => i.id === historyItemId)!;
        return (
          <ReplacementHistoryModal
            itemName={item.name}
            history={replaceHistory[historyItemId] ?? []}
            onClose={() => setHistoryItemId(null)}
          />
        );
      })()}

      {/* Toast notification */}
      {toast && <Toast variant={toast.variant} message={toast.message} onDismiss={dismissToast} />}
    </div>
  );
}
