"use client";

import { ModalDialog, ModalDialogBody } from "@cimpress-ui/react";

export interface ReplacementHistoryEntry {
  date: string;
  quantity: number;
  reason: string;
  reprintId: string;
  success: boolean;
}

interface Props {
  itemName: string;
  history: ReplacementHistoryEntry[];
  onClose: () => void;
}

export function ReplacementHistoryModal({ itemName, history, onClose }: Props) {
  const successful = history.filter((e) => e.success);
  const failed = history.filter((e) => !e.success);

  return (
    <ModalDialog
      title="Replacement History"
      size="medium"
      isOpen={true}
      onOpenChange={(open) => { if (!open) onClose(); }}
      isDismissible={true}
    >
      <ModalDialogBody>
        <div className="flex flex-col gap-6">
          {/* Item name subtitle */}
          <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5 -mt-2">{itemName}</p>

          {/* Counts */}
          <div className="flex">
            <div className="flex flex-col gap-1 flex-1 pr-8">
              <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5">Successful Replacement Requests</p>
              <p className="text-2xl font-semibold text-[color:var(--cim-fg-base)] leading-8">{successful.length}</p>
            </div>
            <div className="w-px bg-[var(--cim-border-subtle)] shrink-0" />
            <div className="flex flex-col gap-1 flex-1 pl-8">
              <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5">Failed Replacement Requests</p>
              <p className="text-2xl font-semibold text-[color:var(--cim-fg-base)] leading-8">{failed.length}</p>
            </div>
          </div>

          {/* Table */}
          {history.length > 0 ? (
            <div className="border border-[var(--cim-border-base)] rounded-[var(--cim-radius-6)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--cim-border-base)] bg-[var(--cim-bg-subtle)]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--cim-fg-subtle)] uppercase tracking-wide leading-4">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--cim-fg-subtle)] uppercase tracking-wide leading-4">Quantity</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--cim-fg-subtle)] uppercase tracking-wide leading-4">Reason</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[color:var(--cim-fg-subtle)] uppercase tracking-wide leading-4">Reprint ID To/From</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, idx) => (
                    <tr
                      key={idx}
                      className={`${idx < history.length - 1 ? "border-b border-[var(--cim-border-base)]" : ""} ${!entry.success ? "bg-[#fff5f5]" : ""}`}
                    >
                      <td className="px-4 py-4 text-sm text-[color:var(--cim-fg-base)] leading-5">{entry.date}</td>
                      <td className="px-4 py-4 text-sm text-[color:var(--cim-fg-base)] leading-5">{entry.quantity}</td>
                      <td className="px-4 py-4 text-sm text-[color:var(--cim-fg-base)] leading-5">{entry.reason}</td>
                      <td className="px-4 py-4 text-sm leading-5">
                        {entry.success ? (
                          <span className="text-[color:var(--cim-fg-accent)] hover:underline cursor-pointer">
                            New: {entry.reprintId.slice(0, 24)}
                          </span>
                        ) : (
                          <span className="text-[color:var(--cim-fg-critical)]">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[color:var(--cim-fg-subtle)] leading-5">No replacement history for this item.</p>
          )}
        </div>
      </ModalDialogBody>
    </ModalDialog>
  );
}
