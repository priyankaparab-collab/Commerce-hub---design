"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@cimpress-ui/react";
import { IconLock } from "@cimpress-ui/react/icons";
import { setAuth, clearAuth } from "@/lib/auth";

/** Cimpress double-diamond logo mark */
function CimpressWordmark() {
  return (
    <div className="flex items-center gap-2">
      {/* Red + blue double-chevron diamond */}
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none" aria-hidden="true">
        <path
          d="M9 10L15 4L18 7L13 10L18 13L15 16L9 10Z"
          fill="#E8392D"
        />
        <path
          d="M15 10L21 4L24 7L19 10L24 13L21 16L15 10Z"
          fill="#1E3A5F"
        />
      </svg>
      <span
        className="font-semibold text-[color:var(--cim-fg-base)]"
        style={{ fontSize: "1.05rem", letterSpacing: "0.02em" }}
      >
        cimpress<sup style={{ fontSize: "0.55em", verticalAlign: "super" }}>™</sup>
      </span>
    </div>
  );
}

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"prefilled" | "editable">("prefilled");
  const [email, setEmail] = useState("Jonathan@cimpress.com");
  const [isLoading, setIsLoading] = useState(false);

  function handleSSOLogin() {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setAuth(email, "Jonathan");
      router.replace("/");
    }, 600);
  }

  function handleNotYourAccount() {
    clearAuth();
    setMode("editable");
    setEmail("");
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", background: "#000" }}
    >
      <div
        className="bg-white flex flex-col items-center gap-6 shadow-lg"
        style={{ width: "400px", padding: "2.5rem", borderRadius: "1rem" }}
      >
        {/* Cimpress wordmark */}
        <CimpressWordmark />

        {/* App title */}
        <p
          className="font-semibold text-[color:var(--cim-fg-base)]"
          style={{ fontSize: "1.1rem", marginTop: "-0.75rem" }}
        >
          Commerce hub
        </p>

        {/* Auth area */}
        <div className="w-full flex flex-col gap-3">
          {mode === "prefilled" ? (
            <>
              <p className="text-sm text-[color:var(--cim-fg-subtle)]">
                Last time you logged in with
              </p>
              {/* SSO button styled as an input row */}
              <button
                onClick={handleSSOLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-between px-4 rounded-lg border border-[var(--cim-border-base)] bg-[var(--cim-bg-subtle)] transition-colors"
                style={{
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <span className="text-sm text-[color:var(--cim-fg-subtle)]">
                  {email}
                </span>
                <span className="flex items-center text-[color:var(--cim-fg-subtle)]">
                  <IconLock />
                </span>
              </button>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                autoFocus
              />
              <button
                onClick={handleSSOLogin}
                disabled={isLoading || !email}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors"
                style={{
                  background: "var(--cim-bg-accent)",
                  color: "white",
                  opacity: isLoading || !email ? 0.5 : 1,
                  cursor: isLoading || !email ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Signing in…" : "Continue"}
              </button>
            </>
          )}

          <button
            onClick={handleNotYourAccount}
            className="text-xs text-[color:var(--cim-fg-accent)]"
            style={{ textAlign: "left" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.textDecoration = "none")
            }
          >
            Not your account?
          </button>
        </div>
      </div>
    </div>
  );
}
