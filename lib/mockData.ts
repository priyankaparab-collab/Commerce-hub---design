import type { OrderSummary, OrderEvent, LineItem } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString().replace("GMT", "GMT+0530 (India Standard Time)");
}

// ─── Events for each line item ────────────────────────────────────────────────
// Events are listed most-recent-first (as they would appear in the UI)

// Item 1 — VP_8wz3dj32/1 Easels (CANCELLED)
// Lifecycle: Order confirmed → Released → Sent to MCP → MCP accepted →
//            Cancel requested → Fulfillment cancelled → Cancel succeeded
const EASEL_EVENTS: OrderEvent[] = [
  {
    id: "easel-evt-7",
    eventType: "line_item.cancel_request_succeeded",
    name: "Line item cancel request succeeded",
    timestamp: fmt("2024-10-21T06:53:11Z"),
    isoTimestamp: "2024-10-21T06:53:11Z",
    iconStatus: "error",
    category: "key_event",
    details: {
      subType: "CancelSuccess",
      description:
        "A line item cancellation request has succeeded. Cancellation successes are aggregated and batched by order number for cleaner emails. Includes eventProperty cancellationType, which describes how the cancellation originated.",
      source: "ORCA – Order Cancellation Async Service (Event Listener) by tanishq.bhatia@cimpress.com",
      metadata: {
        cancellationType: "CustomerRequested",
        refundAmount: "USD 22.50",
        refundStatus: "Initiated",
      },
    },
  },
  {
    id: "easel-evt-6",
    eventType: "line_item.fulfillment_cancelled",
    name: "Line item fulfillment cancelled",
    timestamp: fmt("2024-10-21T06:52:39Z"),
    isoTimestamp: "2024-10-21T06:52:39Z",
    iconStatus: "success",
    category: "warning",
    details: {
      subType: "FulfillmentCancelled",
      description:
        "MCP has relayed a cancellation message from the fulfiller. The item was successfully de-queued from the production pipeline before manufacturing began.",
      source: "MCP – Merchant Commerce Platform (Fulfilment Relay Service)",
      metadata: {
        fulfillerReference: "MCP-EAS-2024-100234",
      },
    },
  },
  {
    id: "easel-evt-5",
    eventType: "line_item.cancel_requested",
    name: "Line item cancel requested",
    timestamp: fmt("2024-10-21T06:48:05Z"),
    isoTimestamp: "2024-10-21T06:48:05Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "CancelRequested",
      description:
        "A cancellation request was received for this line item. The request has been forwarded to the fulfilment platform for processing. A confirmation email has been sent to the customer.",
      source: "Commerce Hub – Customer Service Portal",
    },
  },
  {
    id: "easel-evt-4",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2024-10-21T06:44:53Z"),
    isoTimestamp: "2024-10-21T06:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for scheduling. No action required.",
      source: "MCP – Merchant Commerce Platform",
      metadata: {
        mcpOrderId: "MCP-EAS-2024-100234",
        fulfillerCode: "VPC-IN-001",
      },
    },
  },
  {
    id: "easel-evt-3",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2024-10-21T06:38:44Z"),
    isoTimestamp: "2024-10-21T06:38:44Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "SentToMCP",
      description:
        "The merchant order has been finalised and injected into the Platform Order system (MCP) for fulfilment execution. This represents the contractual handoff from order management to fulfilment.",
      source: "Order Management Service – Release Pipeline",
      metadata: {
        releaseVersion: "CCv2-2024.10",
        fulfillerAssigned: "Vistaprint Production Centre – Baar, CH",
      },
    },
  },
  {
    id: "easel-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2024-10-21T03:52:15Z"),
    isoTimestamp: "2024-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account. This document covers all taxable line items in the order.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2024-VP-889432",
        taxJurisdiction: "US-NY",
      },
    },
  },
  {
    id: "easel-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2024-10-21T03:44:22Z"),
    isoTimestamp: "2024-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete and the order is ready for release into fulfilment. An order confirmation email has been dispatched to the customer.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2024-10-VP-112244",
        channel: "Web – vistaprint.com",
      },
    },
  },
];

// Item 2 — Painting Box (IN PRODUCTION — with an artwork hold)
// Lifecycle: Order confirmed → Released → Artwork hold → Hold resolved →
//            Sent to MCP → MCP accepted → In production
const PAINTING_BOX_EVENTS: OrderEvent[] = [
  {
    id: "paint-evt-7",
    eventType: "line_item.in_production",
    name: "Line item entered production",
    timestamp: fmt("2024-10-21T10:15:00Z"),
    isoTimestamp: "2024-10-21T10:15:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "InProduction",
      description:
        "The line item has entered the production queue at the assigned fulfilment facility. Manufacturing has commenced. Estimated production completion in 1–2 business days.",
      source: "MCP – Production Status Listener (Fulfilment Facility Feed)",
      metadata: {
        facilityName: "Vistaprint Production Centre – Windsor, CA",
        estimatedCompletionDate: "Wed, 23 Oct 2024",
        productionJobId: "JOB-2024-PB-445521",
      },
    },
  },
  {
    id: "paint-evt-6",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2024-10-21T08:44:53Z"),
    isoTimestamp: "2024-10-21T08:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for production scheduling.",
      source: "MCP – Merchant Commerce Platform",
      metadata: {
        mcpOrderId: "MCP-PB-2024-100235",
        fulfillerCode: "VPC-CA-002",
      },
    },
  },
  {
    id: "paint-evt-5",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2024-10-21T08:38:44Z"),
    isoTimestamp: "2024-10-21T08:38:44Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "SentToMCP",
      description:
        "The line item has been released and injected into MCP for fulfilment. Artwork hold was cleared and all pre-production checks passed.",
      source: "Order Management Service – Release Pipeline",
    },
  },
  {
    id: "paint-evt-4",
    eventType: "line_item.artwork_hold_released",
    name: "Artwork hold released",
    timestamp: fmt("2024-10-21T08:22:18Z"),
    isoTimestamp: "2024-10-21T08:22:18Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "ArtworkHoldReleased",
      description:
        "The artwork hold placed on this line item has been resolved. The GSO review team approved the artwork after minor colour profile adjustments were applied. The item will now proceed to fulfilment.",
      source: "GSO – Global Studio Operations (Design Review System)",
      metadata: {
        reviewedBy: "GSO Artwork Review Team",
        resolution: "Artwork accepted after ICC profile correction",
        holdDuration: "2h 57m",
      },
    },
  },
  {
    id: "paint-evt-3",
    eventType: "line_item.artwork_hold_placed",
    name: "Artwork hold placed",
    timestamp: fmt("2024-10-21T05:24:31Z"),
    isoTimestamp: "2024-10-21T05:24:31Z",
    iconStatus: "error",
    category: "warning",
    details: {
      subType: "ArtworkHold",
      description:
        "An automated prepress check detected a potential colour profile mismatch in the submitted artwork for this line item. A manual GSO review has been triggered. The item is on hold and will not proceed to fulfilment until the hold is resolved.",
      source: "Prepress Automation – Artwork Validation Service",
      metadata: {
        holdReason: "Colour profile mismatch (RGB detected, CMYK required)",
        autoCheckId: "AVC-2024-10-009982",
        escalatedTo: "GSO Artwork Review Team",
      },
    },
  },
  {
    id: "paint-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2024-10-21T03:52:15Z"),
    isoTimestamp: "2024-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2024-VP-889432",
        taxJurisdiction: "US-NY",
      },
    },
  },
  {
    id: "paint-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2024-10-21T03:44:22Z"),
    isoTimestamp: "2024-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete and the order is ready for release into fulfilment.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2024-10-VP-112244",
        channel: "Web – vistaprint.com",
      },
    },
  },
];

// Item 3 — Classic T-Shirt (SHIPPED)
// Lifecycle: Order confirmed → Released → Sent to MCP → MCP accepted →
//            In production → Production complete → Shipped
const TSHIRT_EVENTS: OrderEvent[] = [
  {
    id: "shirt-evt-7",
    eventType: "line_item.shipped",
    name: "Line item shipped",
    timestamp: fmt("2024-10-22T05:45:00Z"),
    isoTimestamp: "2024-10-22T05:45:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "Shipped",
      description:
        "The line item has been dispatched by the fulfilment facility. A shipment confirmation email with tracking details has been sent to the customer. Physical goods are now with the carrier.",
      source: "MCP – Shipment Notification Service",
      metadata: {
        carrier: "FedEx",
        trackingNumber: "FX829341234US",
        trackingUrl: "https://www.fedex.com/tracking?tracknumbers=FX829341234US",
        estimatedDelivery: "Fri, 25 Oct 2024",
        shippingMethod: "Economy",
      },
    },
  },
  {
    id: "shirt-evt-6",
    eventType: "line_item.production_complete",
    name: "Production completed",
    timestamp: fmt("2024-10-22T04:00:00Z"),
    isoTimestamp: "2024-10-22T04:00:00Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "ProductionComplete",
      description:
        "Manufacturing of this line item has been completed and passed quality inspection. The item is being prepared for dispatch and handover to the carrier.",
      source: "MCP – Production Status Listener",
      metadata: {
        productionJobId: "JOB-2024-TS-445520",
        qualityCheckStatus: "Passed",
      },
    },
  },
  {
    id: "shirt-evt-5",
    eventType: "line_item.in_production",
    name: "Line item entered production",
    timestamp: fmt("2024-10-21T10:15:00Z"),
    isoTimestamp: "2024-10-21T10:15:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "InProduction",
      description:
        "The line item has entered the production queue and manufacturing has commenced at the assigned fulfilment facility.",
      source: "MCP – Production Status Listener (Fulfilment Facility Feed)",
      metadata: {
        facilityName: "Vistaprint Production Centre – Windsor, CA",
        productionJobId: "JOB-2024-TS-445520",
      },
    },
  },
  {
    id: "shirt-evt-4",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2024-10-21T06:44:53Z"),
    isoTimestamp: "2024-10-21T06:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for production scheduling.",
      source: "MCP – Merchant Commerce Platform",
      metadata: {
        mcpOrderId: "MCP-TS-2024-100236",
        fulfillerCode: "VPC-CA-002",
      },
    },
  },
  {
    id: "shirt-evt-3",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2024-10-21T06:38:44Z"),
    isoTimestamp: "2024-10-21T06:38:44Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "SentToMCP",
      description:
        "The merchant order has been finalised and injected into MCP for fulfilment execution.",
      source: "Order Management Service – Release Pipeline",
    },
  },
  {
    id: "shirt-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2024-10-21T03:52:15Z"),
    isoTimestamp: "2024-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2024-VP-889432",
      },
    },
  },
  {
    id: "shirt-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2024-10-21T03:44:22Z"),
    isoTimestamp: "2024-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2024-10-VP-112244",
      },
    },
  },
];

// ─── Derived counts (computed from event categories) ──────────────────────────

function countByCategory(events: OrderEvent[], category: "warning" | "key_event") {
  return events.filter((e) => e.category === category).length;
}

// ─── Line Items ───────────────────────────────────────────────────────────────

export const LINE_ITEMS: LineItem[] = [
  {
    id: "item-1",
    lineItemId: "154811849422",
    name: "VP_8wz3dj32/1 Easels",
    status: "cancel_succeeded",
    badgeLabel: "Cancelled",
    badgeTone: "critical",
    imageUrl:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop",
    // Steps: Confirmed ✓ | Released ✓ | Sent to MCP ✓ | In Production ✗ (cancelled) | 4× pending
    progressSteps: ["complete", "complete", "complete", "error", "pending", "pending", "pending", "pending"],
    summaryText: "Line item cancel request succeeded",
    summaryTimestamp: fmt("2024-10-21T06:53:11Z"),
    events: EASEL_EVENTS,
  },
  {
    id: "item-2",
    lineItemId: "154811849423",
    name: "Painting Box",
    status: "in_production",
    badgeLabel: "In Production",
    badgeTone: "info",
    imageUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
    // Steps: Confirmed ✓ | Released ✓ | Sent to MCP ✓ | In Production ✓ | 4× pending
    progressSteps: ["complete", "complete", "complete", "complete", "pending", "pending", "pending", "pending"],
    summaryText: "Line item entered production — estimated completion Wed, 23 Oct 2024",
    summaryTimestamp: fmt("2024-10-21T10:15:00Z"),
    events: PAINTING_BOX_EVENTS,
  },
  {
    id: "item-3",
    lineItemId: "154811849424",
    name: "Classic T-Shirt",
    status: "shipped",
    badgeLabel: "Shipped",
    badgeTone: "warning",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    // Steps: Confirmed ✓ | Released ✓ | Sent to MCP ✓ | In Production ✓ | Complete ✓ | Shipped ✓ | 2× pending
    progressSteps: ["complete", "complete", "complete", "complete", "complete", "complete", "pending", "pending"],
    summaryText: "Item shipped via FedEx — tracking FX829341234US",
    summaryTimestamp: fmt("2024-10-22T05:45:00Z"),
    events: TSHIRT_EVENTS,
  },
];

// ─── Order ────────────────────────────────────────────────────────────────────

export const MOCK_ORDER: OrderSummary = {
  orderId: "VP_8WZ3DJ32",
  customerName: "Tanishq Bhatia",
  customerEmail: "tanishq.bhatia@cimpress.com",
  customerPhone: "+9 12123012033",
  estimatedDelivery: "Fri, 25 Oct 2024 – Tue, 29 Oct 2024",
  lineItems: LINE_ITEMS,
};

// ─── Aggregated stats (for the panel header) ──────────────────────────────────

export const ORDER_STATS = {
  totalItems: LINE_ITEMS.length,
  warningCount: LINE_ITEMS.reduce((sum, item) => sum + countByCategory(item.events, "warning"), 0),
  keyEventCount: LINE_ITEMS.reduce((sum, item) => sum + countByCategory(item.events, "key_event"), 0),
};
