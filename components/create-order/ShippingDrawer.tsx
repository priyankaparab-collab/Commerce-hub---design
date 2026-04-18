"use client";

import { useState } from "react";
import { Button, TextField, Checkbox } from "@cimpress-ui/react";
import { IconArrowLeft, IconCloseBold } from "@cimpress-ui/react/icons";
import type { SavedAddress, ShippingMethod, DraftOrderItem } from "@/lib/types";
import { MOCK_SAVED_ADDRESSES, MOCK_SHIPPING_METHODS } from "@/lib/createOrderMockData";

type DrawerView = "main" | "add-address" | "select-shipping";
type AddressTarget = "shipping" | "billing";

interface AddressForm {
  firstName: string;
  lastName: string;
  company: string;
  streetName: string;
  additionalStreet: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
  defaultShipping: boolean;
  defaultBilling: boolean;
}

const EMPTY_FORM: AddressForm = {
  firstName: "", lastName: "", company: "", streetName: "",
  additionalStreet: "", city: "", country: "", state: "",
  postalCode: "", phone: "", defaultShipping: false, defaultBilling: false,
};

interface ShippingDrawerProps {
  isOpen: boolean;
  items: DraftOrderItem[];
  onClose: () => void;
  onReviewToCheckout: () => void;
}

function TruckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M2 10h18v14H2zM20 13h6l4 5v6h-10V13z" stroke="var(--cim-fg-muted,#94979b)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="8" cy="24" r="2" stroke="var(--cim-fg-muted,#94979b)" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="2" stroke="var(--cim-fg-muted,#94979b)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--cim-fg-base,#15191d)", margin: 0 }}>
      {children}
    </h3>
  );
}

function LinkBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.875rem", color: "var(--cim-fg-accent,#007798)", textDecoration: "underline" }}
    >
      {children}
    </button>
  );
}

function DefaultBadge() {
  return (
    <span style={{
      fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px",
      borderRadius: "10px", background: "var(--cim-bg-subtle,#f8f9fa)",
      color: "var(--cim-fg-base,#15191d)", border: "1px solid var(--cim-border-base,#dadcdd)",
    }}>
      Default
    </span>
  );
}

export function ShippingDrawer({ isOpen, items, onClose, onReviewToCheckout }: ShippingDrawerProps) {
  const [view, setView] = useState<DrawerView>("main");
  const [addressTarget, setAddressTarget] = useState<AddressTarget>("shipping");
  const [addresses, setAddresses] = useState<SavedAddress[]>(MOCK_SAVED_ADDRESSES);
  const [shippingAddressId, setShippingAddressId] = useState<string | null>(null);
  const [billingAddressId, setBillingAddressId] = useState<string | null>(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(null);
  const [pendingMethodId, setPendingMethodId] = useState<string | null>(null);
  const [expandedMethodId, setExpandedMethodId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  if (!isOpen) return null;

  const shippingAddress = addresses.find((a) => a.id === shippingAddressId) ?? null;
  const billingAddress = billingSameAsShipping ? shippingAddress : addresses.find((a) => a.id === billingAddressId) ?? null;
  const selectedMethod = MOCK_SHIPPING_METHODS.find((m) => m.id === shippingMethodId) ?? null;
  const canReview = !!shippingAddressId && !!shippingMethodId;

  function handleAddAddress() {
    if (!form.firstName || !form.lastName || !form.streetName || !form.city || !form.country || !form.postalCode || !form.phone) return;
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: form.defaultShipping ? "Default" : "New",
      name: `${form.firstName} ${form.lastName}`,
      company: form.company || undefined,
      lines: [
        form.streetName,
        form.additionalStreet || undefined,
        `${form.city}, ${form.state}`,
        `${form.postalCode}, ${form.country}`,
      ].filter(Boolean) as string[],
      phone: form.phone,
      isDefault: form.defaultShipping,
    };
    const updated = form.defaultShipping
      ? addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : [...addresses, newAddr];
    setAddresses(updated);
    if (addressTarget === "shipping" || form.defaultShipping) {
      setShippingAddressId(newAddr.id);
      if (form.defaultBilling || billingSameAsShipping) setBillingAddressId(newAddr.id);
    } else {
      setBillingAddressId(newAddr.id);
    }
    setForm(EMPTY_FORM);
    setView("main");
  }

  function openAddAddress(target: AddressTarget) {
    setAddressTarget(target);
    setForm(EMPTY_FORM);
    setView("add-address");
  }

  function handleConfirmShipping() {
    if (pendingMethodId) setShippingMethodId(pendingMethodId);
    setView("main");
  }

  // ── Add Address view ───────────────────────────────────────────────────────
  if (view === "add-address") {
    const isFormValid = !!(form.firstName && form.lastName && form.streetName && form.city && form.country && form.postalCode && form.phone);
    return (
      <DrawerShell>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <button onClick={() => setView("main")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px", color: "var(--cim-fg-base)" }}>
              <IconArrowLeft />
            </button>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--cim-fg-base)" }}>Add New Address</h2>
          </div>

          {/* Form */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <TextField label="First Name" isRequired value={form.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
              <TextField label="Last Name" isRequired value={form.lastName} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
            </div>
            <TextField label="Company (Required for business address)" value={form.company} onChange={(v) => setForm((f) => ({ ...f, company: v }))} />
            <TextField label="Street Name" isRequired value={form.streetName} onChange={(v) => setForm((f) => ({ ...f, streetName: v }))} />
            <TextField label="Additional Street Info" value={form.additionalStreet} onChange={(v) => setForm((f) => ({ ...f, additionalStreet: v }))} />
            <TextField label="City / Town" isRequired value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <TextField label="Country" isRequired value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} />
              <TextField label="State / Province" isRequired value={form.state} onChange={(v) => setForm((f) => ({ ...f, state: v }))} />
            </div>
            <TextField label="Postal Code" isRequired value={form.postalCode} onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))} />
            <TextField label="Phone" isRequired value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}>
              <Checkbox isSelected={form.defaultShipping} onChange={(v) => setForm((f) => ({ ...f, defaultShipping: v }))}>
                Set as default shipping address
              </Checkbox>
              <Checkbox isSelected={form.defaultBilling} onChange={(v) => setForm((f) => ({ ...f, defaultBilling: v }))}>
                Set as default billing address
              </Checkbox>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: "0", borderTop: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <button onClick={() => setView("main")} style={{ flex: 1, height: "56px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-accent,#007798)" }}>
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              disabled={!isFormValid}
              style={{ flex: 1, height: "56px", background: "none", border: "none", cursor: isFormValid ? "pointer" : "not-allowed", fontSize: "1rem", fontWeight: 600, color: isFormValid ? "var(--cim-fg-accent,#007798)" : "var(--cim-fg-muted,#94979b)", borderLeft: "1px solid var(--cim-border-subtle,#eaebeb)" }}
            >
              Confirm
            </button>
          </div>
        </div>
      </DrawerShell>
    );
  }

  // ── Select Shipping Speed view ─────────────────────────────────────────────
  if (view === "select-shipping") {
    return (
      <DrawerShell>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <button onClick={() => setView("main")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px", color: "var(--cim-fg-base)" }}>
              <IconArrowLeft />
            </button>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--cim-fg-base)" }}>Select Shipping Speed</h2>
          </div>

          {/* Method list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {MOCK_SHIPPING_METHODS.map((method) => {
              const isSelected = (pendingMethodId ?? shippingMethodId) === method.id;
              const isExpanded = expandedMethodId === method.id || isSelected;
              return (
                <div
                  key={method.id}
                  onClick={() => { setPendingMethodId(method.id); setExpandedMethodId(method.id); }}
                  style={{
                    border: `1.5px solid ${isSelected ? "var(--cim-fg-accent,#007798)" : "var(--cim-border-base,#dadcdd)"}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px" }}>
                    {/* Radio */}
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                      border: `2px solid ${isSelected ? "var(--cim-fg-accent,#007798)" : "var(--cim-border-base,#dadcdd)"}`,
                      background: isSelected ? "var(--cim-fg-accent,#007798)" : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isSelected && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
                    </div>
                    {/* Name */}
                    <span style={{ flex: 1, fontWeight: 600, fontSize: "1rem", color: "var(--cim-fg-base)" }}>{method.name}</span>
                    {/* Price */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {method.price === 0 ? (
                        <span style={{ fontSize: "0.875rem" }}>
                          <span style={{ color: "var(--cim-fg-critical,#d10023)", textDecoration: "line-through", marginRight: "6px" }}>
                            {method.originalPrice?.toFixed(2)} USD
                          </span>
                          <span style={{ fontWeight: 700, color: "var(--cim-fg-base)" }}>0.00 Free</span>
                        </span>
                      ) : (
                        <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--cim-fg-base)" }}>
                          {method.price.toFixed(2)} USD*
                        </span>
                      )}
                    </div>
                    {/* Expand toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedMethodId(isExpanded ? null : method.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cim-fg-subtle)", padding: "2px", display: "flex" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d={isExpanded ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid var(--cim-border-subtle,#eaebeb)", padding: "12px 16px 14px 46px", background: "var(--cim-bg-subtle,#f8f9fa)" }}>
                      <p style={{ margin: "0 0 6px", fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>
                        Estimated arrival by {method.estimatedDeliveryLabel}
                      </p>
                      {items.map((item) => (
                        <p key={item.draftItemId} style={{ margin: 0, fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>
                          {item.product.name} : {method.estimatedDeliveryLabel}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <p style={{ fontSize: "0.75rem", color: "var(--cim-fg-muted,#94979b)", margin: "4px 0 0" }}>*Taxes excluded</p>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", gap: "0", borderTop: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <button onClick={() => setView("main")} style={{ flex: 1, height: "56px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-accent,#007798)" }}>
              Back
            </button>
            <button
              onClick={handleConfirmShipping}
              disabled={!pendingMethodId && !shippingMethodId}
              style={{ flex: 1, height: "56px", background: (pendingMethodId ?? shippingMethodId) ? "var(--cim-fg-accent,#007798)" : "var(--cim-bg-subtle,#f8f9fa)", border: "none", cursor: (pendingMethodId ?? shippingMethodId) ? "pointer" : "not-allowed", fontSize: "1rem", fontWeight: 600, color: (pendingMethodId ?? shippingMethodId) ? "white" : "var(--cim-fg-muted,#94979b)" }}
            >
              Confirm shipping speed
            </button>
          </div>
        </div>
      </DrawerShell>
    );
  }

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <DrawerShell>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "0 0 2px", color: "var(--cim-fg-base)" }}>Address &amp; Shipping Method</h2>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>Shipping address changes can impact shipping speed</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button variant="secondary" size="small" onPress={() => openAddAddress("shipping")}>
              Add New Address
            </Button>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px", color: "var(--cim-fg-base)" }}>
              <IconCloseBold />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Shipping address */}
          <section style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <SectionTitle>Shipping address</SectionTitle>
            {shippingAddress ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--cim-fg-base)" }}>{shippingAddress.name}</span>
                  {shippingAddress.isDefault && <DefaultBadge />}
                </div>
                {shippingAddress.company && (
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{shippingAddress.company}</span>
                )}
                {shippingAddress.lines.map((line, i) => (
                  <span key={i} style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{line}</span>
                ))}
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{shippingAddress.phone}</span>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <LinkBtn onClick={() => openAddAddress("shipping")}>Edit</LinkBtn>
                  <LinkBtn onClick={() => openAddAddress("shipping")}>Change shipping address</LinkBtn>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>This customer seems to have no address</span>
                <LinkBtn onClick={() => openAddAddress("shipping")}>Add New Address</LinkBtn>
              </div>
            )}
          </section>

          {/* Shipping method */}
          <section style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <SectionTitle>Shipping method</SectionTitle>
            {!shippingAddressId ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "var(--cim-bg-subtle,#f8f9fa)", borderRadius: "6px" }}>
                <TruckIcon />
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>Shipping speed can be selected after a shipping address has been entered</span>
              </div>
            ) : selectedMethod ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "6px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--cim-fg-base)" }}>{selectedMethod.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--cim-fg-base)" }}>
                      USD {selectedMethod.price === 0 ? "0.00" : selectedMethod.price.toFixed(2)}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--cim-fg-subtle)" }}>Taxes excluded</div>
                  </div>
                </div>
                <p style={{ margin: "4px 0 2px", fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>
                  Estimated arrival by {selectedMethod.estimatedDeliveryLabel}
                </p>
                {items.map((item) => (
                  <p key={item.draftItemId} style={{ margin: 0, fontSize: "0.8125rem", color: "var(--cim-fg-subtle)" }}>
                    {item.product.name}: {selectedMethod.estimatedDeliveryLabel}
                  </p>
                ))}
                <LinkBtn onClick={() => { setPendingMethodId(shippingMethodId); setView("select-shipping"); }}>
                  Change shipping method
                </LinkBtn>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "var(--cim-bg-subtle,#f8f9fa)", borderRadius: "6px" }}>
                  <TruckIcon />
                  <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>No Shipping method selected</span>
                </div>
                <LinkBtn onClick={() => { setPendingMethodId(null); setView("select-shipping"); }}>Select shipping method</LinkBtn>
              </div>
            )}
          </section>

          {/* Billing address */}
          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <SectionTitle>Billing address</SectionTitle>
            {billingAddress ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>Billing address is same as shipping address</span>
                <div style={{ display: "flex", gap: "16px", marginTop: "2px" }}>
                  <LinkBtn onClick={() => openAddAddress("billing")}>Edit</LinkBtn>
                  <LinkBtn onClick={() => openAddAddress("billing")}>Change billing address</LinkBtn>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>This customer seems to have no address</span>
                <LinkBtn onClick={() => openAddAddress("billing")}>Add New Address</LinkBtn>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--cim-border-subtle,#eaebeb)", display: "flex", flexDirection: "column", gap: "0" }}>
          <button
            style={{ height: "56px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-accent,#007798)", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}
          >
            Confirm and Save Changes
          </button>
          <button
            onClick={canReview ? onReviewToCheckout : undefined}
            disabled={!canReview}
            style={{
              height: "56px",
              background: canReview ? "var(--cim-fg-accent,#007798)" : "var(--cim-bg-subtle,#f8f9fa)",
              border: "none",
              cursor: canReview ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: 600,
              color: canReview ? "white" : "var(--cim-fg-muted,#94979b)",
            }}
          >
            Review to checkout
          </button>
        </div>
      </div>
    </DrawerShell>
  );
}

function DrawerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "520px",
        maxWidth: "100vw",
        background: "white",
        zIndex: 201,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
      }}>
        {children}
      </div>
    </>
  );
}
