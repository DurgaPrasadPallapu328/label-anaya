"use client";

import { openCartDrawer } from "@/lib/cart/drawer";
import { Icon } from "@/components/ui/icon";
import { getCartItemCount } from "@/lib/cart/domain";
import { useCart } from "@/lib/cart/store";
import { useCartBadge } from "@/lib/cart/badge";

export function CartBagLink() {
  const { items } = useCart();
  const count = useCartBadge(getCartItemCount(items));
  return (
    <button data-cart-flight-target type="button" aria-haspopup="dialog" onClick={(event) => openCartDrawer(event.currentTarget)} className="icon-button relative" aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}>
      <Icon name="bag" />
      <span data-cart-badge className="cart-count absolute flex items-center justify-center bg-olive text-white" aria-hidden="true">
        {count > 99 ? "99+" : count}
      </span>
    </button>
  );
}
