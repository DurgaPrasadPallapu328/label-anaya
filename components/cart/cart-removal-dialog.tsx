"use client";

import { useEffect, useId, useRef } from "react";
import type { CartLine } from "@/lib/cart/domain";

interface CartRemovalDialogProps {
  item: CartLine | null;
  onConfirm: (id: string) => void;
  onDismiss: () => void;
}

export function CartRemovalDialog({ item, onConfirm, onDismiss }: CartRemovalDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const remove = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (item && !panel.open) {
      panel.showModal();
      cancel.current?.focus({ preventScroll: true });
    } else if (!item && panel.open) {
      panel.close("cancel");
    }
  }, [item]);

  return (
    <dialog
      ref={dialog}
      className="cart-removal-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close("cancel");
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        if (event.shiftKey && document.activeElement === cancel.current) {
          event.preventDefault();
          remove.current?.focus();
        } else if (!event.shiftKey && document.activeElement === remove.current) {
          event.preventDefault();
          cancel.current?.focus();
        }
      }}
    >
      <div className="cart-removal-content">
        <h2 id={titleId}>Remove from cart?</h2>
        <p id={descriptionId}>Are you sure you want to remove <strong>{item?.product.name}</strong> from your cart?</p>
        <div className="cart-removal-actions">
          <button ref={cancel} type="button" className="cart-removal-cancel" onClick={() => dialog.current?.close("cancel")}>Cancel</button>
          <button
            ref={remove}
            type="button"
            className="cart-removal-confirm"
            disabled={!item}
            onClick={() => {
              if (!item) return;
              dialog.current?.close("remove");
              onConfirm(item.id);
            }}
          >Remove</button>
        </div>
      </div>
    </dialog>
  );
}
