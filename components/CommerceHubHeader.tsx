"use client";

import { AppHeader } from "@cimpress-ui/react";
import {
  IconBell,
  IconSettingsCog,
  IconKeyboard,
  IconChevronDown,
} from "@cimpress-ui/react/icons";

export function CommerceHubHeader() {
  return (
    <AppHeader
      title="Commerce Hub"
      titleLink={{ href: "/" }}
      tools={
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="flex items-center justify-center w-8 h-8 rounded text-[color:var(--cim-fg-subtle)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconBell />
          </button>
          <button
            aria-label="Settings"
            className="flex items-center justify-center w-8 h-8 rounded text-[color:var(--cim-fg-subtle)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconSettingsCog />
          </button>
          <button
            aria-label="Keyboard shortcuts"
            className="flex items-center justify-center w-8 h-8 rounded text-[color:var(--cim-fg-subtle)] hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            <IconKeyboard />
          </button>

          <button
            aria-label="Switch tenant"
            className="flex items-center gap-1 px-2 h-8 rounded text-[color:var(--cim-fg-accent)] font-semibold text-sm hover:bg-[var(--cim-bg-hover)] transition-colors"
          >
            Vistaprint
            <IconChevronDown />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[color:var(--cim-fg-base)]">
              Mayank Sen
            </span>
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--cim-bg-accent)] text-white text-xs font-semibold"
              aria-label="User: Mayank Sen"
            >
              MS
            </div>
          </div>
        </div>
      }
    />
  );
}
