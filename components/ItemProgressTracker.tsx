"use client";

import { IconCheckBold, IconCloseBold } from "@cimpress-ui/react/icons";

type StepState = "complete" | "error" | "pending";

interface ItemProgressTrackerProps {
  steps: StepState[];
}

export function ItemProgressTracker({ steps }: ItemProgressTrackerProps) {
  return (
    <div className="flex items-center gap-[4px] w-full max-w-[453px]">
      {steps.map((state, i) => (
        <div key={i} className="flex items-center flex-1 gap-[4px]">
          {/* Step indicator */}
          <div className="flex-shrink-0">
            {state === "complete" && (
              <div className="w-[21px] h-[21px] rounded-full bg-[var(--cim-bg-accent)] flex items-center justify-center text-white">
                <IconCheckBold />
              </div>
            )}
            {state === "error" && (
              <div className="w-[21px] h-[21px] rounded-full bg-[var(--cim-bg-critical)] flex items-center justify-center text-white">
                <IconCloseBold />
              </div>
            )}
            {state === "pending" && (
              <div className="w-[21px] h-[21px] rounded-full border-2 border-[var(--cim-border-base-hover)] bg-white" />
            )}
          </div>
          {/* Track line between steps */}
          {i < steps.length - 1 && (
            <div className="flex-1 h-[4px] rounded-[4px] min-w-[8px]">
              <div
                className={`h-full rounded-[4px] ${
                  state === "complete"
                    ? "bg-[var(--cim-fg-accent)]"
                    : "bg-[var(--cim-border-base-hover)]"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
