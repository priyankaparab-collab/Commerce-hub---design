"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ModalDialog, ModalDialogBody, ModalDialogActions } from "@cimpress-ui/react";
import type {
  DraftOrder,
  CheckoutState,
  CheckoutStep,
  SavedAddress,
  ShippingMethod,
} from "@/lib/types";
import { MOCK_SAVED_ADDRESSES, MOCK_SHIPPING_METHODS } from "@/lib/createOrderMockData";
import { ShippingBillingStep } from "./wizard-steps/ShippingBillingStep";
import { ShippingMethodStep } from "./wizard-steps/ShippingMethodStep";
import { DiscountStep } from "./wizard-steps/DiscountStep";
import { ReviewOrderStep } from "./wizard-steps/ReviewOrderStep";
import { ConfirmStep } from "./wizard-steps/ConfirmStep";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "shipping-billing", label: "Shipping & Billing" },
  { key: "shipping-method", label: "Shipping Method" },
  { key: "discount", label: "Discount & Price" },
  { key: "review", label: "Review Order" },
  { key: "confirm", label: "Confirm" },
];

interface CheckoutWizardModalProps {
  isOpen: boolean;
  draftOrder: DraftOrder;
  onClose: () => void;
  onOrderConfirmed: (orderId: string) => void;
}

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "VP_";
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function StepIndicator({ steps, currentStep }: { steps: typeof STEPS; currentStep: CheckoutStep }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: "0",
    }}>
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isActive = i === currentIndex;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
            {/* Step circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isComplete
                  ? "var(--cim-fg-success, #15803d)"
                  : isActive
                    ? "var(--cim-fg-accent, #0e7490)"
                    : "var(--cim-bg-subtle, #f8f9fa)",
                border: `2px solid ${
                  isComplete
                    ? "var(--cim-fg-success, #15803d)"
                    : isActive
                      ? "var(--cim-fg-accent, #0e7490)"
                      : "var(--cim-border-base, #dadcdd)"
                }`,
                flexShrink: 0,
              }}>
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 700,
                    color: isActive ? "white" : "var(--cim-fg-muted)",
                  }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: "0.6875rem", fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--cim-fg-accent, #0e7490)" : isComplete ? "var(--cim-fg-success, #15803d)" : "var(--cim-fg-muted)",
                whiteSpace: "nowrap",
                textAlign: "center",
                maxWidth: "70px",
              }}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div style={{
                flex: 1,
                height: "2px",
                margin: "0 4px",
                marginBottom: "20px",
                background: i < currentIndex
                  ? "var(--cim-fg-success, #15803d)"
                  : "var(--cim-border-base, #dadcdd)",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CheckoutWizardModal({
  isOpen,
  draftOrder,
  onClose,
  onOrderConfirmed,
}: CheckoutWizardModalProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping-billing");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    shippingAddressId: MOCK_SAVED_ADDRESSES.find((a) => a.isDefault)?.id ?? null,
    billingAddressId: MOCK_SAVED_ADDRESSES.find((a) => a.isDefault)?.id ?? null,
    billingSameAsShipping: true,
    shippingMethodId: null,
    discountCode: "",
    discountCodeApplied: false,
    discountPercent: 0,
    overridePrice: "",
    confirmedOrderId: null,
  });

  function updateCheckoutState(partial: Partial<CheckoutState>) {
    setCheckoutState((prev) => ({ ...prev, ...partial }));
  }

  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
  const isLastBeforeConfirm = currentStep === "review";
  const isConfirm = currentStep === "confirm";

  const shippingAddress: SavedAddress | null =
    MOCK_SAVED_ADDRESSES.find((a) => a.id === checkoutState.shippingAddressId) ?? null;
  const billingAddress: SavedAddress | null = checkoutState.billingSameAsShipping
    ? shippingAddress
    : (MOCK_SAVED_ADDRESSES.find((a) => a.id === checkoutState.billingAddressId) ?? null);
  const shippingMethod: ShippingMethod | null =
    MOCK_SHIPPING_METHODS.find((m) => m.id === checkoutState.shippingMethodId) ?? null;

  function canProceed(): boolean {
    switch (currentStep) {
      case "shipping-billing":
        return Boolean(
          checkoutState.shippingAddressId &&
            (checkoutState.billingSameAsShipping || checkoutState.billingAddressId)
        );
      case "shipping-method":
        return Boolean(checkoutState.shippingMethodId);
      case "discount":
        return true;
      case "review":
        return true;
      default:
        return true;
    }
  }

  function handleContinue() {
    if (isLastBeforeConfirm) {
      // Place the order — generate mock order ID
      const orderId = generateOrderId();
      updateCheckoutState({ confirmedOrderId: orderId });
      setCurrentStep("confirm");
      onOrderConfirmed(orderId);
    } else if (!isConfirm) {
      setCurrentStep(STEPS[currentIndex + 1].key);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      onClose();
    } else {
      setCurrentStep(STEPS[currentIndex - 1].key);
    }
  }

  function handleGoToOrder() {
    if (checkoutState.confirmedOrderId) {
      router.push(`/orders/${checkoutState.confirmedOrderId}`);
    }
    onClose();
  }

  function handleClose() {
    if (!isConfirm) {
      onClose();
    }
  }

  // Compute enriched draftOrder with shipping cost for display
  const enrichedDraftOrder: DraftOrder = {
    ...draftOrder,
    shippingEstimate: shippingMethod?.price ?? 0,
  };

  if (!isOpen) return null;

  return (
    <ModalDialog
      title={isConfirm ? "Order confirmed" : "Place order"}
      size="large"
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open && !isConfirm) onClose(); }}
      isDismissible={!isConfirm}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {/* Modal header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--cim-border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--cim-fg-base)", margin: 0 }}>
              {isConfirm ? "Order confirmed" : "Place order"}
            </h2>
            {!isConfirm && (
              <button
                onClick={handleClose}
                aria-label="Close checkout"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", border: "none", background: "none",
                  cursor: "pointer", borderRadius: "4px", color: "var(--cim-fg-subtle)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Step indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Modal body */}
        <ModalDialogBody>
          <div style={{ padding: "4px 0" }}>
            {currentStep === "shipping-billing" && (
              <ShippingBillingStep
                addresses={MOCK_SAVED_ADDRESSES}
                checkoutState={checkoutState}
                onChange={updateCheckoutState}
              />
            )}
            {currentStep === "shipping-method" && (
              <ShippingMethodStep
                methods={MOCK_SHIPPING_METHODS}
                checkoutState={checkoutState}
                onChange={updateCheckoutState}
              />
            )}
            {currentStep === "discount" && (
              <DiscountStep
                draftOrder={enrichedDraftOrder}
                checkoutState={checkoutState}
                onChange={updateCheckoutState}
              />
            )}
            {currentStep === "review" && (
              <ReviewOrderStep
                draftOrder={enrichedDraftOrder}
                checkoutState={checkoutState}
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                shippingMethod={shippingMethod}
              />
            )}
            {currentStep === "confirm" && checkoutState.confirmedOrderId && (
              <ConfirmStep
                confirmedOrderId={checkoutState.confirmedOrderId}
                customerName={draftOrder.customerName}
                onGoToOrder={handleGoToOrder}
              />
            )}
          </div>
        </ModalDialogBody>

        {/* Modal footer (hidden on confirm step — ConfirmStep has its own button) */}
        {!isConfirm && (
          <ModalDialogActions>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Button variant="secondary" onPress={handleBack}>
                {currentIndex === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="primary"
                onPress={handleContinue}
                isDisabled={!canProceed()}
              >
                {isLastBeforeConfirm ? "Place order" : "Continue"}
              </Button>
            </div>
          </ModalDialogActions>
        )}
      </div>
    </ModalDialog>
  );
}
