"use client";

import { useState, useEffect } from "react";
import {
  Button, SearchField, Text, IconButton, Link,
  Card, CardHeader, CardContent,
  Stack, Disclosure, Badge,
} from "@cimpress-ui/react";
import { AppBreadcrumbs } from "./AppBreadcrumbs";
import {
  IconChevronRightBold,
  IconChevronDownBold,
  IconInfoCircle,
} from "@cimpress-ui/react/icons";
import { CUSTOMER_DATABASE, getTotalOrders } from "@/lib/createOrderMockData";
import type { Customer } from "@/lib/createOrderMockData";
import { generateNameVariants } from "@/lib/customerUtils";

// ── Search ─────────────────────────────────────────────────────────────────────

/**
 * Full search pool: every real customer PLUS all their name-search variants.
 * This ensures that variant data (email, ID, phone) returned by a name search
 * remains findable when the user plugs those values into other search fields.
 */
function buildSearchPool(): Customer[] {
  const pool: Customer[] = [];
  const seen = new Set<string>();
  for (const base of CUSTOMER_DATABASE) {
    if (!seen.has(base.id)) { pool.push(base); seen.add(base.id); }
    for (const v of generateNameVariants(base)) {
      if (!seen.has(v.id)) { pool.push(v); seen.add(v.id); }
    }
  }
  return pool;
}

function searchCustomers(
  name: string,
  email: string,
  phone: string,
  customerNumber: string,
  zip: string,
): Customer[] {
  const n  = name.trim().toLowerCase();
  const e  = email.trim().toLowerCase();
  const p  = phone.trim();
  const cn = customerNumber.trim().toLowerCase();
  const z  = zip.trim();

  // Name-only: return all variants of the matched base customer (existing behaviour)
  if (n && !e && !p && !cn && !z) {
    const matched = CUSTOMER_DATABASE.filter(c => c.name.toLowerCase().includes(n));
    if (matched.length > 0) return generateNameVariants(matched[0]);
    return [];
  }

  // All other searches: filter the full pool (real + variants) so that data
  // seen in name-search results is also findable via email / ID / phone / zip.
  return buildSearchPool().filter((c) => {
    const nameOk   = !n  || c.name.toLowerCase().includes(n);
    const emailOk  = !e  || c.email.toLowerCase() === e;
    const phoneOk  = !p  || c.phone === p;
    const numberOk = !cn || c.id.toLowerCase() === cn || c.shopperId.toLowerCase() === cn;
    const zipOk    = !z  || c.addresses.some(a => a.zipcode.includes(z));
    return nameOk && emailOk && phoneOk && numberOk && zipOk;
  });
}

function hasAnyInput(name: string, email: string, phone: string, customerNumber: string, zip: string) {
  return name.trim() || email.trim() || phone.trim() || customerNumber.trim() || zip.trim();
}

// ── Table layout constants ─────────────────────────────────────────────────────
const CUSTOMER_COLS = "repeat(7, 1fr)";

// Per-cell padding
const CELL: React.CSSProperties = { padding: "0 12px", minWidth: 0, overflow: "hidden" };
const CELL_RIGHT: React.CSSProperties = { ...CELL, textAlign: "right" };
const CELL_CENTER: React.CSSProperties = { ...CELL, display: "flex", alignItems: "center", justifyContent: "flex-end" };
const headerCellStyle: React.CSSProperties = {
  padding: "0 12px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const gridBase = (cols: string): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: cols,
  alignItems: "center",
  height: "40px",
});

function customerRowStyle(index: number): React.CSSProperties {
  return {
    ...gridBase(CUSTOMER_COLS),
    borderTop: "1px solid var(--cim-border-base, #dadcdd)",
    background: index % 2 === 0 ? "white" : "var(--cim-bg-subtle, #f8f9fa)",
  };
}


// ── Address cards ─────────────────────────────────────────────────────────────
function AddressRows({ customer }: { customer: Customer }) {
  const isOrg = customer.type === "org";

  return (
    <div style={{
      background: "white",
      borderTop: "1px solid var(--cim-border-base, #dadcdd)",
      borderBottom: "1px solid var(--cim-border-subtle, #eaebeb)",
      padding: "16px",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {customer.addresses.map((addr, idx) => (
          <div key={addr.id} style={{
            background: "white",
            border: "1px solid var(--cim-border-base, #dadcdd)",
            borderRadius: "var(--cim-radius-6, 6px)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            flexShrink: 0,
            width: "241px",
          }}>
            {/* Address label + lines */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Text as="span" variant="small-semibold" tone="subtle">Address {idx + 1}</Text>
              <div>
                <Text as="p" variant="medium">{addr.address},</Text>
                <Text as="p" variant="medium">{addr.city}, {addr.state} {addr.zipcode},</Text>
                <Text as="p" variant="medium">{addr.country}</Text>
              </div>
            </div>

            {/* Order count */}
            {addr.orderCount > 0 ? (
              <Text as="p" variant="medium">
                <strong>{addr.orderCount}</strong>{" Previous orders"}
              </Text>
            ) : (
              <Text as="p" variant="medium" tone="muted">No previous orders</Text>
            )}

            {/* Divider + Create order link — child customers only */}
            {!isOrg && (
              <>
                <div style={{ height: "1px", background: "var(--cim-border-base, #dadcdd)", margin: "0 -16px" }} />
                <Link href={`/customers/${customer.id}/create-order?country=${encodeURIComponent(addr.country)}`}>Create order</Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Results table ──────────────────────────────────────────────────────────────
function ResultsTable({ results }: { results: Customer[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => results.length === 1 ? new Set([results[0].id]) : new Set()
  );

  // Re-sync whenever results change (e.g. a second search without unmounting)
  useEffect(() => {
    setExpandedIds(results.length === 1 ? new Set([results[0].id]) : new Set());
  }, [results]);

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div style={{
      border: "1px solid var(--cim-border-subtle, #eaebeb)",
      borderRadius: "var(--cim-radius-4, 4px)",
      overflow: "hidden",
    }}>
      {/* Customer table header */}
      <div style={{
        ...gridBase(CUSTOMER_COLS),
        background: "var(--cim-bg-subtle, #f8f9fa)",
        borderBottom: "1px solid var(--cim-border-base, #dadcdd)",
      }}>
        <div style={headerCellStyle}><Text as="span" variant="medium-semibold">Name</Text></div>
        <div style={headerCellStyle}><Text as="span" variant="medium-semibold">Email ID</Text></div>
        <div style={headerCellStyle}><Text as="span" variant="medium-semibold">Customer ID</Text></div>
        <div style={headerCellStyle}><Text as="span" variant="medium-semibold">Phone</Text></div>
        <div style={headerCellStyle}><Text as="span" variant="medium-semibold">Customer type</Text></div>
        <div style={{ ...headerCellStyle, textAlign: "right" }}><Text as="span" variant="medium-semibold">Total orders</Text></div>
        <div />
      </div>

      {/* Customer rows */}
      {results.map((c, rowIdx) => {
        const isExpanded = expandedIds.has(c.id);
        const total = getTotalOrders(c);
        return (
          <div key={c.id}>
            {/* Customer row */}
            <div style={customerRowStyle(rowIdx)}>
              <div style={CELL}>
                <Text as="span" variant="medium"><Link href={`/customers/${c.id}`}>{c.name}</Link></Text>
              </div>
              <div style={CELL}>
                <Text as="span" variant="medium">{c.email}</Text>
              </div>
              <div style={CELL}>
                <Text as="span" variant="medium" UNSAFE_style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{c.id}</Text>
              </div>
              <div style={CELL}>
                <Text as="span" variant="medium" UNSAFE_style={{ whiteSpace: "nowrap" }}>{c.phone}</Text>
              </div>
              <div style={CELL}>
                <Badge tone={c.type === "org" ? "warning" : "info"}>
                  {c.type === "org" ? "Org" : "Child"}
                </Badge>
              </div>
              <div style={CELL_RIGHT}>
                <Text as="span" variant="medium" tone={total === 0 ? "muted" : "base"}>{total}</Text>
              </div>
              <div style={CELL_CENTER}>
                <IconButton
                  aria-label={isExpanded ? `Collapse ${c.name}` : `Expand ${c.name}`}
                  icon={isExpanded ? <IconChevronDownBold /> : <IconChevronRightBold />}
                  variant="tertiary"
                  size="medium"
                  onPress={() => toggleExpand(c.id)}
                />
              </div>
            </div>

            {/* Expanded address rows */}
            {isExpanded && <AddressRows customer={c} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────────
export function CustomerManagementPage() {
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [phone, setPhone]                   = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [zip, setZip]                       = useState("");
  const [results, setResults]               = useState<Customer[]>([]);
  const [searched, setSearched]             = useState(false);

  function handleSearch() {
    if (!hasAnyInput(name, email, phone, customerNumber, zip)) return;
    setResults(searchCustomers(name, email, phone, customerNumber, zip));
    setSearched(true);
  }

  function handleClear() {
    setName(""); setEmail(""); setPhone("");
    setCustomerNumber(""); setZip("");
    setResults([]); setSearched(false);
  }

  function validateEmail(val: string) {
    if (val && !val.includes("@")) return "Please enter a valid email address";
  }
  function validatePhone(val: string) {
    if (val && /[a-zA-Z]/.test(val)) return "Phone number must contain numbers only";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "var(--cim-bg-subtle, #f8f9fa)" }}>
      <Stack gap={24} UNSAFE_style={{ padding: "24px" }}>
        <AppBreadcrumbs items={[
          { label: "Dashboard", href: "/" },
          { label: "Customer search" },
        ]} />

        {/* Search card */}
        <Card>
          <CardHeader title="Find Customer" />
          <CardContent>
            <Stack gap={16}>

              {/* Primary fields */}
              <Stack gap={16} direction="horizontal" align="start">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchField
                    aria-label="Customer name" placeholder="Customer name"
                    value={name} onChange={setName} onSubmit={handleSearch} onClear={() => setName("")}
                  />
                </div>
                <Stack gap={8} direction="horizontal" align="center" UNSAFE_style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SearchField
                      aria-label="Customer number/ID" placeholder="Customer number/ID"
                      value={customerNumber} onChange={setCustomerNumber} onSubmit={handleSearch} onClear={() => setCustomerNumber("")}
                    />
                  </div>
                  <span style={{ color: "var(--cim-fg-subtle, #5f6469)", flexShrink: 0 }}>
                    <IconInfoCircle />
                  </span>
                </Stack>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchField
                    aria-label="Email ID" placeholder="Email ID"
                    value={email} onChange={setEmail} onSubmit={handleSearch} onClear={() => setEmail("")}
                    validate={validateEmail}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchField
                    aria-label="Phone number" placeholder="Phone number"
                    value={phone} onChange={setPhone} onSubmit={handleSearch} onClear={() => setPhone("")}
                    validate={validatePhone} inputMode="tel"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchField
                    aria-label="Zip code" placeholder="Zip code"
                    value={zip} onChange={setZip} onSubmit={handleSearch} onClear={() => setZip("")}
                  />
                </div>
              </Stack>

              {/* More fields disclosure */}
              <Disclosure title="More search fields" variant="subtle">
                <Stack gap={16} direction="horizontal" align="start" UNSAFE_style={{ paddingTop: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SearchField aria-label="City" placeholder="City" onSubmit={handleSearch} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <SearchField aria-label="Country" placeholder="Country" onSubmit={handleSearch} />
                  </div>
                  <div style={{ flex: 3 }} />
                </Stack>
              </Disclosure>

              {/* Actions */}
              <Stack gap={16} direction="horizontal" justify="end">
                <Button variant="tertiary" onPress={handleClear}>Clear</Button>
                <Button variant="primary" onPress={handleSearch}>Search</Button>
              </Stack>

            </Stack>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          results.length === 0 ? (
            <Card>
              <CardContent>
                <Stack gap={8} align="center" UNSAFE_style={{ padding: "16px", textAlign: "center" }}>
                  <Text as="p" variant="body-semibold" tone="warning">No results</Text>
                  <Text as="p" variant="body" tone="warning">
                    There are no customers that match your search. Please check and try again.
                  </Text>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Stack gap={12}>
              <Text as="p" variant="body-semibold">
                {results.length} search result{results.length !== 1 ? "s" : ""} found
              </Text>
              <ResultsTable results={results} />
            </Stack>
          )
        )}
      </Stack>
    </div>
  );
}
