import type { OrderSummary, OrderEvent, LineItem } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toUTCString().replace("GMT", "GMT+0530 (India Standard Time)");
}

// ─── Events for each line item ────────────────────────────────────────────────
// Events are listed most-recent-first (as they would appear in the UI)

// Item 1 — Zoom® Grid 15 TSA-Friendly Computer Backpack (INITIAL)
// Lifecycle: Order confirmed → Tax document issued
const PACK_EVENTS: OrderEvent[] = [
  {
    id: "pack-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2025-10-21T03:52:15Z"),
    isoTimestamp: "2025-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account. This document covers all taxable line items in the order.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2025-VP-889432",
        taxJurisdiction: "US-NY",
      },
    },
  },
  {
    id: "pack-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2025-10-21T03:44:22Z"),
    isoTimestamp: "2025-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete and the order is ready for release into fulfilment. An order confirmation email has been dispatched to the customer.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2025-10-VP-112244",
        channel: "Web – vistaprint.com",
      },
    },
  },
];

// Item 2 — Personalized Note Cards (DELAYED)
// Lifecycle: Order confirmed → Tax document issued → Sent to MCP → MCP accepted → Shipment delayed
const CARD_EVENTS: OrderEvent[] = [
  {
    id: "card-evt-5",
    eventType: "line_item.shipment_delayed",
    name: "Shipment delayed",
    timestamp: fmt("2025-11-10T08:00:00Z"),
    isoTimestamp: "2025-11-10T08:00:00Z",
    iconStatus: "error",
    category: "warning",
    details: {
      subType: "ShipmentDelayed",
      description:
        "A delay has been reported for one of the shipments. The carrier has flagged a logistics disruption. Estimated delivery has been updated.",
      source: "MCP – Shipment Notification Service",
    },
  },
  {
    id: "card-evt-4",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2025-10-22T08:44:53Z"),
    isoTimestamp: "2025-10-22T08:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for scheduling. No action required.",
      source: "MCP – Merchant Commerce Platform",
    },
  },
  {
    id: "card-evt-3",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2025-10-22T08:38:44Z"),
    isoTimestamp: "2025-10-22T08:38:44Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "SentToMCP",
      description:
        "The merchant order has been finalised and injected into the Platform Order system (MCP) for fulfilment execution.",
      source: "Order Management Service – Release Pipeline",
    },
  },
  {
    id: "card-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2025-10-21T03:52:15Z"),
    isoTimestamp: "2025-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2025-VP-889432",
        taxJurisdiction: "US-NY",
      },
    },
  },
  {
    id: "card-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2025-10-21T03:44:22Z"),
    isoTimestamp: "2025-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete and the order is ready for release into fulfilment.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2025-10-VP-112244",
        channel: "Web – vistaprint.com",
      },
    },
  },
];

// Item 3 — Glossy Ceramic Campfire Mug – Set of 36 (SHIPPED)
// Lifecycle: Order confirmed → Tax document issued → Sent to MCP → MCP accepted →
//            In production → Production complete → Shipped
const MUG_EVENTS: OrderEvent[] = [
  {
    id: "mug-evt-7",
    eventType: "line_item.shipped",
    name: "Line item shipped",
    timestamp: fmt("2025-11-25T05:45:00Z"),
    isoTimestamp: "2025-11-25T05:45:00Z",
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
        estimatedDelivery: "Wed, 6 Dec 2025",
        shippingMethod: "Economy",
      },
    },
  },
  {
    id: "mug-evt-6",
    eventType: "line_item.production_complete",
    name: "Production completed",
    timestamp: fmt("2025-11-24T04:00:00Z"),
    isoTimestamp: "2025-11-24T04:00:00Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "ProductionComplete",
      description:
        "Manufacturing of this line item has been completed and passed quality inspection. The item is being prepared for dispatch and handover to the carrier.",
      source: "MCP – Production Status Listener",
    },
  },
  {
    id: "mug-evt-5",
    eventType: "line_item.in_production",
    name: "Line item entered production",
    timestamp: fmt("2025-10-23T10:15:00Z"),
    isoTimestamp: "2025-10-23T10:15:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "InProduction",
      description:
        "The line item has entered the production queue at the assigned fulfilment facility. Manufacturing has commenced.",
      source: "MCP – Production Status Listener (Fulfilment Facility Feed)",
    },
  },
  {
    id: "mug-evt-4",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2025-10-22T06:44:53Z"),
    isoTimestamp: "2025-10-22T06:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for production scheduling.",
      source: "MCP – Merchant Commerce Platform",
    },
  },
  {
    id: "mug-evt-3",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2025-10-22T06:38:44Z"),
    isoTimestamp: "2025-10-22T06:38:44Z",
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
    id: "mug-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2025-10-21T03:52:15Z"),
    isoTimestamp: "2025-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2025-VP-889432",
      },
    },
  },
  {
    id: "mug-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2025-10-21T03:44:22Z"),
    isoTimestamp: "2025-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2025-10-VP-112244",
      },
    },
  },
];

// Item 4 — VistaPrint® Large Zip Cotton Tote Bag (DELIVERED)
// Lifecycle: Order confirmed → Tax document issued → Sent to MCP → MCP accepted →
//            In production → Production complete → Shipped → Delivered
const BAG_EVENTS: OrderEvent[] = [
  {
    id: "bag-evt-8",
    eventType: "line_item.delivered",
    name: "Line item delivered",
    timestamp: fmt("2025-11-11T14:00:00Z"),
    isoTimestamp: "2025-11-11T14:00:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "Delivered",
      description:
        "The line item has been successfully delivered to the customer's address. Delivery confirmed by carrier.",
      source: "MCP – Delivery Confirmation Service",
    },
  },
  {
    id: "bag-evt-7",
    eventType: "line_item.shipped",
    name: "Line item shipped",
    timestamp: fmt("2025-11-08T05:45:00Z"),
    isoTimestamp: "2025-11-08T05:45:00Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "Shipped",
      description:
        "The line item has been dispatched by the fulfilment facility. A shipment confirmation email with tracking details has been sent to the customer.",
      source: "MCP – Shipment Notification Service",
    },
  },
  {
    id: "bag-evt-6",
    eventType: "line_item.production_complete",
    name: "Production completed",
    timestamp: fmt("2025-11-07T04:00:00Z"),
    isoTimestamp: "2025-11-07T04:00:00Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "ProductionComplete",
      description:
        "Manufacturing of this line item has been completed and passed quality inspection.",
      source: "MCP – Production Status Listener",
    },
  },
  {
    id: "bag-evt-5",
    eventType: "line_item.in_production",
    name: "Line item entered production",
    timestamp: fmt("2025-10-24T10:15:00Z"),
    isoTimestamp: "2025-10-24T10:15:00Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "InProduction",
      description:
        "The line item has entered the production queue at the assigned fulfilment facility. Manufacturing has commenced.",
      source: "MCP – Production Status Listener (Fulfilment Facility Feed)",
    },
  },
  {
    id: "bag-evt-4",
    eventType: "line_item.fulfillment_platform_accepted",
    name: "Fulfilment platform accepted",
    timestamp: fmt("2025-10-23T06:44:53Z"),
    isoTimestamp: "2025-10-23T06:44:53Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "PlatformAccepted",
      description:
        "The fulfilment platform (MCP) has accepted the line item and acknowledged it for production scheduling.",
      source: "MCP – Merchant Commerce Platform",
    },
  },
  {
    id: "bag-evt-3",
    eventType: "line_item.sent_to_mcp",
    name: "Line item sent to fulfilment platform",
    timestamp: fmt("2025-10-23T06:38:44Z"),
    isoTimestamp: "2025-10-23T06:38:44Z",
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
    id: "bag-evt-2",
    eventType: "order.tax_document_issued",
    name: "Tax document issued",
    timestamp: fmt("2025-10-21T03:52:15Z"),
    isoTimestamp: "2025-10-21T03:52:15Z",
    iconStatus: "success",
    category: "update",
    details: {
      subType: "InvoiceIssued",
      description:
        "A tax document (invoice) has been issued for this order and is now available in the customer's account.",
      source: "Tax & Finance Service – Document Generation",
      metadata: {
        documentType: "Invoice",
        documentId: "INV-2025-VP-889432",
      },
    },
  },
  {
    id: "bag-evt-1",
    eventType: "order.confirmed",
    name: "Order confirmed",
    timestamp: fmt("2025-10-21T03:44:22Z"),
    isoTimestamp: "2025-10-21T03:44:22Z",
    iconStatus: "success",
    category: "key_event",
    details: {
      subType: "OrderCreated",
      description:
        "A new merchant order has been created and confirmed. Payment authorisation is complete.",
      source: "Order Management Service – Order Creation",
      metadata: {
        paymentMethod: "Credit Card (Visa)",
        paymentReference: "PAY-2025-10-VP-112244",
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
    id: "1",
    lineItemId: "154811849422",
    name: "Zoom® Grid 15 TSA-Friendly Computer Backpack",
    status: "initial",
    badgeLabel: "Initial",
    badgeTone: "base",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    progressSteps: ["complete", "complete", "complete", "complete", "error", "pending", "pending", "pending"],
    summaryText: "Order confirmed",
    summaryTimestamp: fmt("2025-10-21T03:44:22Z"),
    events: PACK_EVENTS,
    quantity: 5,
    fulfiller: "In house",
    dateLabel: "Expected date",
    dateValue: "NA",
    tax: "inc tax 1.00 USD",
    itemTotal: "10.00 USD",
    shipment: {
      type: "none",
      title: "No shipment info",
      subtitle: "Item is not in production yet",
    },
    recare: "Total Replacement 2 time",
  },
  {
    id: "2",
    lineItemId: "154811849423",
    name: "Personalized Note Cards",
    status: "delayed",
    badgeLabel: "Delayed",
    badgeTone: "critical",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    progressSteps: ["complete", "complete", "complete", "complete", "error", "pending", "pending", "pending"],
    summaryText: "Shipment delayed — logistics disruption reported by carrier",
    summaryTimestamp: fmt("2025-11-10T08:00:00Z"),
    events: CARD_EVENTS,
    quantity: 4,
    fulfiller: "In house",
    dateLabel: "Expected date",
    dateValue: "Sat, 15 Nov 2025",
    tax: "inc tax 1.00 USD",
    itemTotal: "10.00 USD",
    shipment: {
      type: "warning",
      title: "2/2 shipments in progress",
      subtitle: "Delay in 1/2 shipments",
      showViewDetails: true,
    },
  },
  {
    id: "3",
    lineItemId: "154811849424",
    name: "Glossy Ceramic Campfire Mug – Set of 36",
    status: "shipped",
    badgeLabel: "Shipped",
    badgeTone: "info",
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop",
    progressSteps: ["complete", "complete", "complete", "complete", "complete", "complete", "pending", "pending"],
    summaryText: "Item shipped via FedEx — tracking FX829341234US",
    summaryTimestamp: fmt("2025-11-25T05:45:00Z"),
    events: MUG_EVENTS,
    quantity: 2,
    fulfiller: "In house",
    dateLabel: "Expected date",
    dateValue: "Wed, 6 Dec 2025",
    tax: "inc tax 2.00 USD",
    itemTotal: "50.00 USD",
    shipment: {
      type: "info",
      title: "2/2 shipments in progress",
      subtitle: "Expected delivery: Wed, 6 Dec 2025",
      showViewDetails: true,
    },
  },
  {
    id: "4",
    lineItemId: "154811849425",
    name: "VistaPrint® Large Zip Cotton Tote Bag",
    status: "delivered",
    badgeLabel: "Delivered",
    badgeTone: "success",
    imageUrl: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=300&fit=crop",
    progressSteps: ["complete", "complete", "complete", "complete", "complete", "complete", "complete", "pending"],
    summaryText: "Item delivered — Fri, 11 Nov 2025",
    summaryTimestamp: fmt("2025-11-11T14:00:00Z"),
    events: BAG_EVENTS,
    quantity: 1,
    fulfiller: "In house",
    dateLabel: "Delivered on",
    dateValue: "Fri, 11 Nov 2025",
    tax: "inc tax 1.00 USD",
    itemTotal: "20.00 USD",
    originalTotal: "25.00 USD",
    shipment: {
      type: "success",
      title: "1/1 shipments delivered",
      subtitle: "Delivered on: Fri, 11 Nov 2025",
      showViewDetails: true,
    },
  },
];

// ─── Order ────────────────────────────────────────────────────────────────────

export const MOCK_ORDER: OrderSummary = {
  orderId: "VP_8WZ3DJ32",
  customerName: "Tanishq Bhatia",
  customerEmail: "tanishq.bhatia@cimpress.com",
  customerPhone: "+9 12123012033",
  estimatedDelivery: "Fri, 11 Nov 2025 – Tue, 16 Dec 2025",
  lineItems: LINE_ITEMS,
};

// ─── Aggregated stats (for the panel header) ──────────────────────────────────

export const ORDER_STATS = {
  totalItems: LINE_ITEMS.length,
  warningCount: LINE_ITEMS.reduce((sum, item) => sum + countByCategory(item.events, "warning"), 0),
  keyEventCount: LINE_ITEMS.reduce((sum, item) => sum + countByCategory(item.events, "key_event"), 0),
};
