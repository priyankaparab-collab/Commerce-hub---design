"use client";

import { useState } from "react";
import { Button, ModalDialog, ModalDialogBody, ModalDialogActions, Select, SelectItem } from "@cimpress-ui/react";

const STORE_OPTIONS = [
  { id: "NA", label: "NA – North America" },
  { id: "IE", label: "IE – Ireland" },
  { id: "IN", label: "IN – India" },
  { id: "DE", label: "DE – Germany" },
  { id: "AU", label: "AU – Australia" },
];

interface StoreSelectionModalProps {
  initialStore?: string;
  onConfirm: (store: string) => void;
  onCancel: () => void;
}

export function StoreSelectionModal({ initialStore = "", onConfirm, onCancel }: StoreSelectionModalProps) {
  const [selectedStore, setSelectedStore] = useState<string>(initialStore);

  return (
    <ModalDialog
      title="Select store to place order"
      size="small"
      isOpen
      onOpenChange={(open) => { if (!open) onCancel(); }}
      isDismissible={false}
    >
      <ModalDialogBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--cim-fg-subtle, #5f6469)" }}>
            Select the store you want to place this order for.
          </p>
          <Select
            label="Store"
            isRequired
            selectedKey={selectedStore || null}
            onSelectionChange={(key) => setSelectedStore(String(key))}
            placeholder="Select a store"
          >
            {STORE_OPTIONS.map((s) => (
              <SelectItem key={s.id} id={s.id}>{s.label}</SelectItem>
            ))}
          </Select>
        </div>
      </ModalDialogBody>

      <ModalDialogActions>
        <Button variant="secondary" onPress={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          isDisabled={!selectedStore}
          onPress={() => selectedStore && onConfirm(selectedStore)}
        >
          Confirm
        </Button>
      </ModalDialogActions>
    </ModalDialog>
  );
}
