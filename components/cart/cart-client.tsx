"use client";

import { cartActions, useCart } from "@/lib/cart/store";
import { useRef, useState } from "react";
import { CartView } from "./cart-view";
import { CartRemovalDialog } from "./cart-removal-dialog";

export function CartClient() {
  const { items, hydrated, persistent } = useCart();
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const removalTrigger = useRef<HTMLButtonElement | null>(null);

  function dismissRemoval() {
    setPendingRemoval(null);
    requestAnimationFrame(() => {
      const target = removalTrigger.current?.isConnected
        ? removalTrigger.current
        : document.querySelector<HTMLElement>(".cart-remove") ?? document.getElementById("cart-title");
      target?.focus({ preventScroll: true });
      removalTrigger.current = null;
    });
  }
  if (!hydrated) return <p className="cart-loading" role="status">Loading your cart…</p>;

  return (
    <>
      {!persistent && <p className="cart-storage-note" role="status">Your bag is available in this tab. Reloading may clear it.</p>}
      <CartView
        items={items}
        onQuantityChange={cartActions.setQuantity}
        onRemove={(id, trigger) => {
          removalTrigger.current = trigger ?? null;
          setPendingRemoval(id);
        }}
      />
      <CartRemovalDialog
        item={items.find((item) => item.id === pendingRemoval) ?? null}
        onConfirm={cartActions.removeItem}
        onDismiss={dismissRemoval}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {items.reduce((count, item) => count + item.quantity, 0)} items in your cart.
      </p>
    </>
  );
}
