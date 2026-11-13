"use client";

import { getDemoCartProduct } from "@/lib/cart/dev-fixture";
import { cartActions, useCart } from "@/lib/cart/store";

export function DevCartControls() {
  const { hydrated } = useCart();
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <section className="cart-dev-controls" aria-label="Development cart testing">
      <p>Development preview · adds one test item to your bag</p>
      <button type="button" disabled={!hydrated} onClick={() => cartActions.addItem(getDemoCartProduct(), 1)}>Add demo item</button>
    </section>
  );
}
