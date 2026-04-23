"use client";

import { useState } from "react";
import { Button, ModalDialog, ModalDialogBody, ModalDialogActions } from "@cimpress-ui/react";

export interface PreviousArtwork {
  id: string;
  orderId: string;
  uploadDate: string;
  thumbnailUrl: string;
  fileName: string;
}

export const MOCK_PREVIOUS_ARTWORKS: PreviousArtwork[] = [
  {
    id: "art-1",
    orderId: "VP_LPHSW5Q",
    uploadDate: "12 Jan 2025",
    thumbnailUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=100&h=100&fit=crop",
    fileName: "logo_design_v3.pdf",
  },
  {
    id: "art-2",
    orderId: "VP_KJH23NM",
    uploadDate: "3 Nov 2024",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop",
    fileName: "business_card_artwork.ai",
  },
  {
    id: "art-3",
    orderId: "VP_QAZ11WS",
    uploadDate: "28 Sep 2024",
    thumbnailUrl: "https://images.unsplash.com/photo-1569017388730-020b5f80a004?w=100&h=100&fit=crop",
    fileName: "promo_flyer_final.pdf",
  },
  {
    id: "art-4",
    orderId: "VP_8WZ3DJ32",
    uploadDate: "5 Aug 2024",
    thumbnailUrl: "https://images.unsplash.com/photo-1612838320302-4b3b3996765b?w=100&h=100&fit=crop",
    fileName: "banner_artwork.eps",
  },
  {
    id: "art-5",
    orderId: "VP_QRX89PT",
    uploadDate: "19 Jun 2024",
    thumbnailUrl: "https://images.unsplash.com/photo-1574181612567-7e21f4cf2d6c?w=100&h=100&fit=crop",
    fileName: "label_sticker_v2.eps",
  },
  {
    id: "art-6",
    orderId: "VP_MNL45KJ",
    uploadDate: "2 Apr 2024",
    thumbnailUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
    fileName: "tshirt_print_artwork.png",
  },
];

interface PreviousArtworkModalProps {
  onConfirm: (artwork: PreviousArtwork) => void;
  onCancel: () => void;
}

export function PreviousArtworkModal({ onConfirm, onCancel }: PreviousArtworkModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = MOCK_PREVIOUS_ARTWORKS.find((a) => a.id === selectedId) ?? null;

  return (
    <ModalDialog
      title="Select previous artwork"
      size="medium"
      isOpen
      onOpenChange={(open) => { if (!open) onCancel(); }}
      isDismissible
    >
      <ModalDialogBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--cim-fg-subtle, #5f6469)" }}>
            Select one artwork from a previous order to use for this item.
          </p>

          {/* Thumbnail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
            {MOCK_PREVIOUS_ARTWORKS.map((artwork) => {
              const isSelected = artwork.id === selectedId;
              return (
                <button
                  key={artwork.id}
                  onClick={() => setSelectedId(artwork.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "background 0.1s",
                    background: isSelected ? "var(--cim-bg-info-subtle, #e8f4f8)" : "transparent",
                  } as React.CSSProperties}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    border: isSelected
                      ? "2.5px solid var(--cim-fg-accent, #007798)"
                      : "2px solid var(--cim-border-base, #dadcdd)",
                    flexShrink: 0,
                    position: "relative",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artwork.thumbnailUrl}
                      alt={artwork.fileName}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {isSelected && (
                      <div style={{
                        position: "absolute", top: "4px", right: "4px",
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "var(--cim-fg-accent, #007798)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", width: "100%" }}>
                    <span style={{
                      fontSize: "0.75rem", fontFamily: "monospace",
                      color: "var(--cim-fg-subtle, #5f6469)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px",
                    }}>
                      {artwork.orderId}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--cim-fg-muted, #94979b)" }}>
                      {artwork.uploadDate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected file name */}
          {selected && (
            <div style={{
              padding: "8px 12px",
              background: "var(--cim-bg-subtle, #f8f9fa)",
              borderRadius: "4px",
              fontSize: "0.875rem",
              color: "var(--cim-fg-base, #15191d)",
            }}>
              Selected: <span style={{ fontWeight: 600 }}>{selected.fileName}</span>
            </div>
          )}
        </div>
      </ModalDialogBody>

      <ModalDialogActions>
        <Button variant="secondary" onPress={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          isDisabled={!selected}
          onPress={() => selected && onConfirm(selected)}
        >
          Use this artwork
        </Button>
      </ModalDialogActions>
    </ModalDialog>
  );
}
