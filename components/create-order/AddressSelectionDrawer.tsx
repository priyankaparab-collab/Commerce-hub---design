"use client";

import { useState } from "react";
import { Button, Select, SelectItem, TextField, Checkbox, Text } from "@cimpress-ui/react";
import { IconArrowLeft, IconCloseBold } from "@cimpress-ui/react/icons";
import type { SavedAddress } from "@/lib/types";
import { MOCK_SAVED_ADDRESSES } from "@/lib/createOrderMockData";
import type { Customer } from "@/lib/createOrderMockData";

// ── Store options ──────────────────────────────────────────────────────────────
const STORE_OPTIONS = [
  { id: "NA", label: "NA – North America" },
  { id: "IE", label: "IE – Ireland" },
  { id: "IN", label: "IN – India" },
  { id: "DE", label: "DE – Germany" },
  { id: "AU", label: "AU – Australia" },
];

// ── Address form ───────────────────────────────────────────────────────────────
interface AddressForm {
  firstName: string; lastName: string; company: string;
  streetName: string; additionalStreet: string; city: string;
  country: string; state: string; postalCode: string; phone: string;
  defaultShipping: boolean; defaultBilling: boolean;
}

const EMPTY_FORM: AddressForm = {
  firstName: "", lastName: "", company: "", streetName: "",
  additionalStreet: "", city: "", country: "", state: "",
  postalCode: "", phone: "", defaultShipping: false, defaultBilling: false,
};

// ── Props ──────────────────────────────────────────────────────────────────────
interface AddressSelectionDrawerProps {
  customer: Customer;
  onConfirm: (address: SavedAddress, store: string) => void;
  onCancel: () => void;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
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

// ── Main component ─────────────────────────────────────────────────────────────
export function AddressSelectionDrawer({ customer, onConfirm, onCancel }: AddressSelectionDrawerProps) {
  const defaultAddr = MOCK_SAVED_ADDRESSES.find((a) => a.isDefault) ?? MOCK_SAVED_ADDRESSES[0] ?? null;

  const [view, setView] = useState<"main" | "add-address">("main");
  const [addresses, setAddresses] = useState<SavedAddress[]>(MOCK_SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddr?.id ?? null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>(customer.store ?? "");
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
  const canConfirm = !!selectedAddress && !!selectedStore;

  // ── Add address sub-view ───────────────────────────────────────────────────
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
    setSelectedAddressId(newAddr.id);
    setForm(EMPTY_FORM);
    setView("main");
  }

  if (view === "add-address") {
    const isFormValid = !!(form.firstName && form.lastName && form.streetName && form.city && form.country && form.postalCode && form.phone);
    return (
      <DrawerShell>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
            <button onClick={() => setView("main")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px", color: "var(--cim-fg-base)" }}>
              <IconArrowLeft />
            </button>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--cim-fg-base)" }}>Add New Address</h2>
          </div>
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
              <TextField label="State / Province" value={form.state} onChange={(v) => setForm((f) => ({ ...f, state: v }))} />
            </div>
            <TextField label="Postal Code" isRequired value={form.postalCode} onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))} />
            <TextField label="Phone" isRequired value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px" }}>
              <Checkbox isSelected={form.defaultShipping} onChange={(v) => setForm((f) => ({ ...f, defaultShipping: v }))}>Set as default shipping address</Checkbox>
              <Checkbox isSelected={form.defaultBilling} onChange={(v) => setForm((f) => ({ ...f, defaultBilling: v }))}>Set as default billing address</Checkbox>
            </div>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
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

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <DrawerShell>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, color: "var(--cim-fg-base)" }}>Select Address</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "4px", color: "var(--cim-fg-base)" }}>
            <IconCloseBold />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Store selection */}
          <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Select
              label="Store"
              isRequired
              selectedKey={selectedStore || null}
              onSelectionChange={(key) => setSelectedStore(String(key))}
            >
              {STORE_OPTIONS.map((s) => (
                <SelectItem key={s.id} id={s.id}>{s.label}</SelectItem>
              ))}
            </Select>
          </section>

          {/* Addresses heading + Add New */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text as="h3" variant="title-6">Addresses</Text>
            <Button variant="secondary" size="small" onPress={() => setView("add-address")}>
              Add New Address
            </Button>
          </div>

          {/* Shipping address */}
          <section style={{ border: "1px solid var(--cim-border-subtle,#eaebeb)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text as="h4" variant="body-semibold">Shipping address</Text>
            {selectedAddress ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--cim-fg-base)" }}>{customer.name}</span>
                  {selectedAddress.isDefault && <DefaultBadge />}
                </div>
                {selectedAddress.company && (
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{selectedAddress.company}</span>
                )}
                {selectedAddress.lines.map((line, i) => (
                  <span key={i} style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{line}</span>
                ))}
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-base)" }}>{selectedAddress.phone}</span>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <LinkBtn onClick={() => setView("add-address")}>Edit</LinkBtn>
                  <LinkBtn onClick={() => {
                    // cycle to next available address
                    const idx = addresses.findIndex((a) => a.id === selectedAddressId);
                    const next = addresses[(idx + 1) % addresses.length];
                    setSelectedAddressId(next.id);
                  }}>Change shipping address</LinkBtn>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>No address found for this customer.</span>
                <LinkBtn onClick={() => setView("add-address")}>Add New Address</LinkBtn>
              </div>
            )}
          </section>

          {/* Billing address */}
          <section style={{ border: "1px solid var(--cim-border-subtle,#eaebeb)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Text as="h4" variant="body-semibold">Billing address</Text>
            {billingSameAsShipping && selectedAddress ? (
              <>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>Billing address is same as shipping address</span>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <LinkBtn onClick={() => setView("add-address")}>Edit</LinkBtn>
                  <LinkBtn onClick={() => setBillingSameAsShipping(false)}>Change billing address</LinkBtn>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--cim-fg-subtle)" }}>No billing address set.</span>
                <LinkBtn onClick={() => setView("add-address")}>Add New Address</LinkBtn>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid var(--cim-border-subtle,#eaebeb)", display: "flex", flexDirection: "column" }}>
          <button
            onClick={onCancel}
            style={{ height: "56px", background: "none", border: "none", borderBottom: "1px solid var(--cim-border-subtle,#eaebeb)", cursor: "pointer", fontSize: "1rem", fontWeight: 600, color: "var(--cim-fg-accent,#007798)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => selectedAddress && canConfirm && onConfirm(selectedAddress, selectedStore)}
            disabled={!canConfirm}
            style={{
              height: "56px",
              background: canConfirm ? "var(--cim-fg-accent,#007798)" : "var(--cim-bg-subtle,#f8f9fa)",
              border: "none",
              cursor: canConfirm ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: 600,
              color: canConfirm ? "white" : "var(--cim-fg-muted,#94979b)",
            }}
          >
            Confirm and use this Address
          </button>
        </div>
      </div>
    </DrawerShell>
  );
}

function DrawerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "520px", maxWidth: "100vw",
        background: "white", zIndex: 201,
        display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
      }}>
        {children}
      </div>
    </>
  );
}
