"use client";

import { UNSTABLE_Stepper, UNSTABLE_StepperItem } from "@cimpress-ui/react";

interface OrderStep {
  label: string;
  description: string;
  status: "complete" | "incomplete" | "error" | "warning" | "in-progress";
}

interface OrderStepperProps {
  steps: OrderStep[];
}

export function OrderStepper({ steps }: OrderStepperProps) {
  const currentStep = steps.findIndex(
    (s) => s.status === "in-progress" || s.status === "error" || s.status === "warning"
  );

  return (
    <div className="w-full border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] bg-[var(--cim-bg-base)] p-4">
      <UNSTABLE_Stepper
        currentStep={currentStep >= 0 ? currentStep : steps.length}
        orientation="horizontal"
      >
        {steps.map((step) => (
          <UNSTABLE_StepperItem
            key={step.label}
            status={step.status}
            description={step.description}
          >
            {step.label}
          </UNSTABLE_StepperItem>
        ))}
      </UNSTABLE_Stepper>
    </div>
  );
}
