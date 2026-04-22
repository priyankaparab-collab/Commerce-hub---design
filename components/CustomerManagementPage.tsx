"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, SearchField, Text, IconButton,
  Table, TableBody, TableBodyCell, TableBodyRow,
  TableContainer, TableHeader, TableHeaderCell, TableHeaderRow,
} from "@cimpress-ui/react";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import {
  IconAdd,
  IconAddCircle,
  IconMenuMoreVertical,
} from "@cimpress-ui/react/icons";
import { CUSTOMER_DATABASE } from "@/lib/createOrderMockData";
import type { Customer } from "@/lib/createOrderMockData";
import { generateNameVariants } from "@/lib/customerUtils";

// ── Search ─────────────────────────────────────────────────────────────────────
function searchCustomers(name: string, email: string, phone: string, customerId: string): Customer[] {
  const n  = name.trim().toLowerCase();
  const e  = email.trim().toLowerCase();
  const p  = phone.trim();
  const id = customerId.trim().toLowerCase();

  // Name-only search → expand to multiple variants
  if (n && !e && !p && !id) {
    const matched = CUSTOMER_DATABASE.filter(c => c.name.toLowerCase().includes(n));
    if (matched.length > 0) return generateNameVariants(matched[0]);
    return [];
  }

  return CUSTOMER_DATABASE.filter((c) => {
    const nameOk  = !n  || c.name.toLowerCase().includes(n);
    const emailOk = !e  || c.email.toLowerCase().includes(e);
    const phoneOk = !p  || c.phone.includes(p);
    const idOk    = !id || c.id.toLowerCase().includes(id);
    return nameOk && emailOk && phoneOk && idOk;
  });
}

function hasAnyInput(name: string, email: string, phone: string, customerId: string) {
  return name.trim() || email.trim() || phone.trim() || customerId.trim();
}

// ── Component ──────────────────────────────────────────────────────────────────
export function CustomerManagementPage() {
  const router = useRouter();

  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [customerId, setCustomerId] = useState("");
  const [results, setResults]       = useState<Customer[]>([]);
  const [searched, setSearched]     = useState(false);

  function handleSearch() {
    if (!hasAnyInput(name, email, phone, customerId)) return;
    setResults(searchCustomers(name, email, phone, customerId));
    setSearched(true);
  }

  function validateEmail(val: string) {
    if (val && !val.includes("@")) return "Please enter a valid email address";
  }
  function validatePhone(val: string) {
    if (val && /[a-zA-Z]/.test(val)) return "Phone number must contain numbers only";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--cim-bg-subtle, #f8f9fa)" }}>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <AppBreadcrumbs items={[
          { label: "Dashboard", href: "/" },
          { label: "Customer management" },
        ]} />

        {/* Heading row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text as="h1" variant="title-4">Find customer</Text>
          <Button variant="secondary" iconStart={<IconAdd />}>Add new customer</Button>
        </div>

        {/* Search card */}
        <div style={{
          background: "white",
          border: "1px solid var(--cim-border-subtle, #eaebeb)",
          borderRadius: "6px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SearchField aria-label="Customer name" placeholder="Customer name"
              value={name} onChange={setName} onSubmit={handleSearch} onClear={() => setName("")} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SearchField aria-label="Customer email ID" placeholder="Customer email ID"
              value={email} onChange={setEmail} onSubmit={handleSearch} onClear={() => setEmail("")}
              validate={validateEmail} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SearchField aria-label="Customer phone number" placeholder="Customer phone number"
              value={phone} onChange={setPhone} onSubmit={handleSearch} onClear={() => setPhone("")}
              validate={validatePhone} inputMode="tel" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SearchField aria-label="Customer ID" placeholder="Customer ID"
              value={customerId} onChange={setCustomerId} onSubmit={handleSearch} onClear={() => setCustomerId("")} />
          </div>
          <Button variant="primary" onPress={handleSearch}>Search</Button>
        </div>

        {/* Results */}
        {searched && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.length === 0 ? (
              <div style={{
                background: "white", border: "1px solid var(--cim-border-subtle)",
                borderRadius: "6px", padding: "32px 16px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center",
              }}>
                <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--cim-fg-warning, #a15e0c)", margin: 0 }}>No results</p>
                <p style={{ fontSize: "0.875rem", color: "var(--cim-fg-warning, #a15e0c)", margin: 0 }}>
                  There are no customers that match your search. Please check and try again.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontWeight: 600, fontSize: "1rem", color: "var(--cim-fg-base)", margin: 0 }}>
                  {results.length} Search Result{results.length !== 1 ? "s" : ""}
                </p>
                <TableContainer>
                  <Table aria-label="Customer search results">
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHeaderCell columnKey="name">Name</TableHeaderCell>
                        <TableHeaderCell columnKey="email">Email ID</TableHeaderCell>
                        <TableHeaderCell columnKey="id">Customer ID</TableHeaderCell>
                        <TableHeaderCell columnKey="orders" columnContentAlignment="end">Orders</TableHeaderCell>
                        <TableHeaderCell columnKey="actions" columnContentAlignment="end">{""}</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((c) => (
                        <TableBodyRow key={c.id}>
                          <TableBodyCell columnKey="name">{c.name}</TableBodyCell>
                          <TableBodyCell columnKey="email">{c.email}</TableBodyCell>
                          <TableBodyCell columnKey="id">
                            <span style={{ color: "var(--cim-fg-subtle)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                              {c.id}
                            </span>
                          </TableBodyCell>
                          <TableBodyCell columnKey="orders"><div style={{ textAlign: "right" }}>{c.orderCount}</div></TableBodyCell>
                          <TableBodyCell columnKey="actions">
                            <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "flex-end" }}>
                              <IconButton
                                aria-label={`Create order for ${c.name}`}
                                icon={<IconAddCircle />}
                                variant="tertiary"
                                size="medium"
                                onPress={() => router.push(`/customers/${c.id}/create-order`)}
                              />
<IconButton
                                aria-label={`More options for ${c.name}`}
                                icon={<IconMenuMoreVertical />}
                                variant="tertiary"
                                size="medium"
                              />
                            </div>
                          </TableBodyCell>
                        </TableBodyRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
