"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { getCartItemCount } from "@/lib/cart/domain";
import { useCart } from "@/lib/cart/store";

export function CartBagLink() {
  const { items } = useCart();
  const count = getCartItemCount(items);
  return (
    <Link href="/cart" className="icon-button relative" aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}>
      <Icon name="bag" />
      <span className="cart-count absolute flex items-center justify-center bg-olive text-white" aria-hidden="true">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}
