// ─── Event & Order Types (CimCommerce CCv2 model) ───────────────────────────

export type EventCategory = "key_event" | "warning" | "update";

export type ItemStatus =
  | "initial"
  | "sent_to_mcp"
  | "in_production"
  | "production_complete"
  | "shipped"
  | "delivered"
  | "cancel_requested"
  | "cancel_succeeded"
  | "cancel_failed"
  | "on_hold"
  | "delayed"
  | "rejected";

export type StepState = "complete" | "error" | "pending";
export type BadgeTone = "base" | "success" | "info" | "warning" | "critical";

// Icon in the timeline: teal check = success, red X = error
export type EventIconStatus = "success" | "error";

export interface EventDetails {
  subType?: string;
  description: string;
  source: string;
  metadata?: Record<string, string>;
}

export interface OrderEvent {
  id: string;
  eventType: string; // e.g. "line_item.cancel_request_succeeded"
  name: string; // Human-readable label
  timestamp: string; // Formatted for display
  isoTimestamp: string; // ISO 8601 for sorting
  iconStatus: EventIconStatus;
  category: EventCategory;
  details?: EventDetails;
}

export interface LineItem {
  id: string;
  lineItemId: string;
  name: string;
  status: ItemStatus;
  badgeLabel: string;
  badgeTone: BadgeTone;
  imageUrl?: string;
  progressSteps: StepState[];
  summaryText: string;
  summaryTimestamp: string;
  events: OrderEvent[]; // chronological descending (most recent first)
}

export interface OrderSummary {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  estimatedDelivery: string;
  lineItems: LineItem[];
}
