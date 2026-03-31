"use client";

import { useState } from "react";
import { IconCopy, IconCheckCircleFill } from "@cimpress-ui/react/icons";

interface CopyButtonProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

function execCommandCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
  document.body.appendChild(el);
  el.focus();
  el.select();
  el.setSelectionRange(0, text.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { /* ignore */ }
  document.body.removeChild(el);
  return ok;
}

export function CopyButton({ value, children, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let success = false;
    try {
      await navigator.clipboard.writeText(value);
      success = true;
    } catch {
      success = execCommandCopy(value);
    }
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 cursor-pointer text-[color:var(--cim-fg-base)] hover:text-[color:var(--cim-fg-accent)] transition-colors group ${className}`}
      aria-label={`Copy ${value}`}
    >
      <span className="border-b border-dotted border-[color:var(--cim-border-base-hover)] group-hover:border-[color:var(--cim-fg-accent)]">
        {children ?? value}
      </span>
      <span className={`flex-shrink-0 transition-colors ${copied ? "text-[color:var(--cim-fg-success)]" : "text-[color:var(--cim-fg-subtle)] group-hover:text-[color:var(--cim-fg-accent)]"}`}>
        {copied ? <IconCheckCircleFill /> : <IconCopy />}
      </span>
    </button>
  );
}
