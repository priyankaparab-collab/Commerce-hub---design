"use client";

import { useEffect } from "react";

/** Patches navigator.clipboard.writeText with an execCommand fallback
 *  so CopyInline works in contexts where the Clipboard API is blocked. */
export function ClipboardPolyfill() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;

    const original = navigator.clipboard.writeText.bind(navigator.clipboard);

    navigator.clipboard.writeText = async (text: string): Promise<void> => {
      try {
        await original(text);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        el.style.cssText =
          "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none;";
        document.body.appendChild(el);
        el.focus();
        el.select();
        el.setSelectionRange(0, text.length);
        try {
          document.execCommand("copy");
        } finally {
          document.body.removeChild(el);
        }
      }
    };
  }, []);

  return null;
}
