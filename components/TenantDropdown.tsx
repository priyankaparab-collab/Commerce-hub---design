"use client";

import { Button, Menu, MenuItem, MenuRoot, MenuSection } from "@cimpress-ui/react";
import { IconChevronDown } from "@cimpress-ui/react/icons";
import { MERCHANT_GROUPS } from "@/lib/auth";
import type { Key } from "@cimpress-ui/react";

interface TenantDropdownProps {
  activeTenantId: string;
  activeTenantLabel: string;
  onTenantChange: (id: string) => void;
}

export function TenantDropdown({
  activeTenantId,
  activeTenantLabel,
  onTenantChange,
}: TenantDropdownProps) {
  return (
    <MenuRoot>
      <Button
        variant="tertiary"
        iconEnd={<IconChevronDown />}
        aria-label="Switch tenant"
      >
        {activeTenantLabel}
      </Button>

      <Menu
        align="end"
        selectionMode="single"
        selectedKeys={new Set([activeTenantId])}
        onAction={(key: Key) => onTenantChange(String(key))}
      >
        {MERCHANT_GROUPS.map((group) => (
          <MenuSection key={group.label} title={group.label} id={group.label}>
            {group.items.map((item) => (
              <MenuItem key={item.id} id={item.id}>
                {item.label}
              </MenuItem>
            ))}
          </MenuSection>
        ))}
      </Menu>
    </MenuRoot>
  );
}
