"use client";

import { useState } from "react";
import { OrderHeader } from "./OrderHeader";
import { OrderStepper } from "./OrderStepper";
import { OrderInfoPanels } from "./OrderInfoPanels";
import { OrderDetailsTabs } from "./OrderDetailsTabs";
import { LINE_ITEMS, hasDelayedItems } from "./LineItemsPanel";
import { AppBreadcrumbs } from "./AppBreadcrumbs";

const BASE_ORDER_STEPS = [
  {
    label: "Order created",
    description: "on Mon 21 Oct 2025 (GMT+0530 India Standard Time)",
    status: "complete" as const,
  },
  {
    label: "Production in progress",
    description: "for 1 items",
    status: "complete" as const,
  },
  {
    label: "Shipment started",
    description: "for 2 items",
    status: (hasDelayedItems ? "warning" : "error") as "warning" | "error",
  },
  {
    label: "Order delivered",
    description: "",
    status: "incomplete" as const,
  },
];

const CANCELLATION_STEP = {
  label: "Order cancellation in progress",
  description: "",
  status: "warning" as const,
};

const SHIPPING_INFO = {
  name: "Tanishq Bhatia",
  addressLines: [
    "70 Washington Square,",
    "South, New York, NY",
    "10012, United States",
  ],
  phone: "+9 12123012033",
  method: "Economy",
};

const BILLING_INFO = {
  name: "Tanishq Bhatia",
  addressLines: [
    "70 Washington Square,",
    "South, New York, NY",
    "10012, United States",
  ],
  phone: "+9 12123012033",
};

const PRICING_INFO = {
  status: "Paid",
  lines: [
    { label: "Price (4 items)", value: "USD 90.00" },
    { label: "Shipping fee (Standard)", value: "USD 10.00" },
    { label: "Taxes", value: "USD 5.00" },
    { label: "Savings", subLabel: "Coupon: SAVEBIG", value: "- USD 5.00", isSavings: true },
  ],
  total: "USD 100.00",
};

interface OrderDetailsPageProps {
  orderId: string;
}

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const [cancelledItemIds, setCancelledItemIds] = useState<Set<string>>(new Set());

  // Stepper only reflects cancellation when ALL eligible (non-Delivered) items are cancelled
  const eligibleItems = LINE_ITEMS.filter((i) => i.badgeLabel !== "Delivered");
  const isCancelled =
    eligibleItems.length > 0 && eligibleItems.every((i) => cancelledItemIds.has(i.id));

  function handleItemsCancelled(ids: string[]) {
    setCancelledItemIds((prev) => new Set([...prev, ...ids]));
  }

  const steps = isCancelled
    ? [...BASE_ORDER_STEPS.slice(0, 3), CANCELLATION_STEP]
    : BASE_ORDER_STEPS;

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 px-6 py-6 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          <AppBreadcrumbs items={[
            { label: "Order", href: "/orders" },
            { label: orderId },
          ]} />

          <OrderHeader
            orderId={orderId}
            customerName="Tanishq Bhatia"
            customerEmail="tanishq.bhatia@cimpress.com"
            customerPhone="+9 12123012033"
            cancelledItemIds={cancelledItemIds}
            onItemsCancelled={handleItemsCancelled}
          />

          <OrderStepper steps={steps} />

          <OrderInfoPanels
            shipping={SHIPPING_INFO}
            billing={BILLING_INFO}
            pricing={PRICING_INFO}
          />

          <OrderDetailsTabs
            defaultTab="events"
            cancelledItemIds={cancelledItemIds}
            onItemsCancelled={handleItemsCancelled}
          />
        </div>
      </main>
    </div>
  );
}
