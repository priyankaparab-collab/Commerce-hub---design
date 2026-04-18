"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectSection,
  Button,
} from "@cimpress-ui/react";
import { MERCHANT_GROUPS } from "@/lib/auth";
import type { Key } from "@cimpress-ui/react";

interface MerchantSelectionCardProps {
  onSelect: (tenantId: string) => void;
  userName?: string;
}

/** Cimpress logo — same mark used in the AppHeader */
function CimpressLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.0019 11.5603L20.9782 10.5358L14.7487 4.3063C14.7487 4.3063 14.0579 3.6163 13.3672 4.3063L12.3412 5.33305C12.3412 5.33305 11.6504 6.02305 12.3412 6.7138L17.8784 12.251L12.3464 17.7823C12.3464 17.7823 11.6557 18.4731 12.3464 19.1638L13.3724 20.1898C13.3724 20.1898 14.0624 20.8798 14.7532 20.1898L22.0019 12.941C22.0019 12.941 22.6927 12.2511 22.0019 11.5603Z" fill="#3A414C" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.07214 11.5592C9.07214 11.5592 8.38139 12.25 9.07214 12.94L10.9591 14.827C10.9591 14.827 11.6499 15.5177 12.3399 14.827L14.2246 12.9422C14.2246 12.9422 14.9154 12.2515 14.2246 11.5607L12.3384 9.67449C12.3384 9.67449 11.6476 8.98374 10.9569 9.67449L9.07214 11.5592Z" fill="#F0563A" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.342 15.1547L5.4305 12.2432L8.327 9.34667C8.327 9.34667 9.01775 8.65592 8.327 7.96517L7.301 6.93917C7.301 6.93917 6.61025 6.24917 5.92025 6.93917L1.307 11.5524C1.307 11.5524 0.61625 12.2432 1.307 12.9339L2.333 13.9599C2.333 13.9599 2.33525 13.9614 2.33825 13.9652L5.93525 17.5614C5.93525 17.5614 6.62525 18.2522 7.316 17.5614L8.342 16.5354C8.342 16.5354 9.03275 15.8454 8.342 15.1547Z" fill="#3A414C" />
    </svg>
  );
}

export function MerchantSelectionCard({ onSelect, userName = "there" }: MerchantSelectionCardProps) {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--cim-border-subtle, #eaebeb)",
        borderRadius: "6px",
        boxShadow: "0px 1px 2px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06), 0px 4px 8px rgba(0,0,0,0.04)",
        padding: "1rem",
        width: "528px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <CimpressLogo size={32} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h1
              className="font-semibold text-[color:var(--cim-fg-base)]"
              style={{ fontSize: "1.125rem", lineHeight: "1.5rem", margin: 0 }}
            >
              Hey, {userName}!
            </h1>
            <p
              className="text-[color:var(--cim-fg-base)]"
              style={{ fontSize: "1rem", lineHeight: "1.5rem", margin: 0 }}
            >
              It seems you have access to multiple merchants. Let&apos;s get started
              by choosing a default merchant, you can always switch to another
              merchant from the tenant selector in the header
            </p>
          </div>

          <Select
            label="Select merchant"
            selectedKey={selectedMerchantId}
            onSelectionChange={(key: Key | null) =>
              setSelectedMerchantId(key as string | null)
            }
            placeholder="Selection"
          >
            {MERCHANT_GROUPS.map((group) => (
              <SelectSection key={group.label} title={group.label}>
                {group.items.map((item) => (
                  <SelectItem key={item.id} id={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectSection>
            ))}
          </Select>
        </div>
      </div>

      <Button
        variant="primary"
        isDisabled={!selectedMerchantId}
        onPress={() => {
          if (selectedMerchantId) onSelect(selectedMerchantId);
        }}
        fullWidth
      >
        Select default key account
      </Button>
    </div>
  );
}
