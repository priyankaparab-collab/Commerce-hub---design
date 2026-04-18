"use client";

import { useEffect } from "react";
import { IconCheckCircle, IconCloseCircleFill, IconCloseBold } from "@cimpress-ui/react/icons";

export type ToastVariant = "success" | "failure";

interface ToastProps {
  variant: ToastVariant;
  message?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function Toast({ variant, message, onDismiss, autoDismissMs = 10000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [onDismiss, autoDismissMs]);

  return (
    <div
      className="fixed top-[72px] left-1/2 -translate-x-1/2 z-[300] flex items-center justify-between gap-3 bg-white border border-[var(--cim-border-base)] rounded-[var(--cim-radius-8)] pl-4 pr-3 py-3 min-w-[360px] max-w-[480px]"
      style={{
        boxShadow:
          "0px 1px 3px rgba(0,0,0,0.08), 0px 3px 8px rgba(0,0,0,0.06), 0px 4px 12px rgba(0,0,0,0.05), 0px 6px 16px rgba(0,0,0,0.04)",
      }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {variant === "success" ? (
          <span className="text-[color:var(--cim-fg-success)] shrink-0 text-lg">
            <IconCheckCircle />
          </span>
        ) : (
          <span className="text-[color:var(--cim-fg-critical)] shrink-0 text-lg">
            <IconCloseCircleFill />
          </span>
        )}
        <p className="text-sm text-[color:var(--cim-fg-base)] leading-5">
          {message ?? (variant === "success"
            ? "Cancellation request created"
            : "Request failed due to an API error. Please try again.")}
        </p>
      </div>
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="flex items-center justify-center w-8 h-8 shrink-0 rounded-[var(--cim-radius-4)] text-[color:var(--cim-fg-subtle)] hover:bg-[var(--cim-bg-hover)] transition-colors"
      >
        <IconCloseBold />
      </button>
    </div>
  );
}
