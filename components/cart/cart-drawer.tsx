"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cartActions, useCart } from "@/lib/cart/store";
import { formatCartMoney, getCartItemCount, getCartQuantityLimit, getCartSubtotal } from "@/lib/cart/domain";
import { Icon } from "@/components/ui/icon";
import { CartProductImage } from "./cart-product-image";
import { CartRemovalDialog } from "./cart-removal-dialog";
import "./cart-drawer.css";

const styles = {
  "drawer": "cart-drawer-panel",
  "content": "cart-drawer-content",
  "header": "cart-drawer-header",
  "products": "cart-drawer-products",
  "item": "cart-drawer-item",
  "details": "cart-drawer-details",
  "size": "cart-drawer-size",
  "note": "cart-drawer-note",
  "price": "cart-drawer-price",
  "actions": "cart-drawer-actions",
  "quantity": "cart-drawer-quantity",
  "footer": "cart-drawer-footer",
  "total": "cart-drawer-total",
  "primary": "cart-drawer-primary",
  "empty": "cart-drawer-empty"
};

export function CartDrawer() {
  const { items, hydrated, persistent } = useCart();
  const panel = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const productList = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const removeTrigger = useRef<HTMLButtonElement | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const titleId = useId();
  const count = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);

  useEffect(() => {
    const open = (event: Event) => {
      const target = (event as CustomEvent<unknown>).detail;
      if (panel.current?.open) return;
      opener.current = target instanceof HTMLElement ? target : null;
      panel.current?.showModal();
      if (productList.current) productList.current.scrollTop = 0;
      closeButton.current?.focus({ preventScroll: true });
    };
    window.addEventListener("label-anaya:open-cart", open);
    return () => window.removeEventListener("label-anaya:open-cart", open);
  }, []);

  function dismissRemoval() {
    setPendingRemoval(null);
    requestAnimationFrame(() => {
      (removeTrigger.current?.isConnected ? removeTrigger.current : closeButton.current)?.focus({ preventScroll: true });
      removeTrigger.current = null;
    });
  }

  return <>
    <dialog ref={panel} className={styles.drawer} aria-labelledby={titleId} onClick={(event) => { if (event.target === event.currentTarget) panel.current?.close(); }} onClose={() => {
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      opener.current = null;
    }}>
      <div className={styles.content}>
        <header className={styles.header}><h2 id={titleId}>Your Bag <span>({count} {count === 1 ? "Item" : "Items"})</span></h2><button ref={closeButton} type="button" className="icon-button" aria-label="Close shopping bag" onClick={() => panel.current?.close()}><Icon name="close" /></button></header>
        <div ref={productList} className={styles.products}>
          {!hydrated ? <p role="status">Loading your bag…</p> : !items.length ? <div className={styles.empty}><Icon name="bag" /><h3>Your bag is empty</h3><p>Explore our collection and find something you love.</p><Link href="/#category-heading" className={styles.primary} onClick={() => panel.current?.close()}>Continue Shopping</Link></div> : <ul aria-label="Items in your bag">{items.map((item) => {
            const limit = getCartQuantityLimit(item.product);
            return <li key={item.id} className={styles.item}>
              <CartProductImage imageUrl={item.product.imageUrl} name={item.product.name} />
              <div className={styles.details}><h3>{item.product.name}</h3>{item.product.size && <p className={styles.size}>Size: {item.product.size}</p>}<p className={styles.price}>{formatCartMoney(item.product.unitPriceMinor)}</p>
                {limit === 0 ? <p className={styles.size}>Currently unavailable</p> : item.quantity > limit && <p className={styles.size}>Please reduce quantity to {limit}.</p>}
                <div className={styles.actions}><div className={styles.quantity} role="group" aria-label={`Quantity for ${item.product.name}, size ${item.product.size ?? "one size"}`}><button type="button" disabled={item.quantity <= 1 || limit === 0} aria-label={`Decrease quantity for ${item.product.name}`} onClick={() => cartActions.setQuantity(item.id, item.quantity - 1)}><Icon name="minus" /></button><output aria-label={`Current quantity for ${item.product.name}`}>{item.quantity}</output><button type="button" disabled={item.quantity >= limit} aria-label={`Increase quantity for ${item.product.name}`} onClick={() => cartActions.setQuantity(item.id, item.quantity + 1)}><Icon name="plus" /></button></div><button type="button" className="icon-button" aria-label={`Remove ${item.product.name}, size ${item.product.size ?? "one size"}`} onClick={(event) => { removeTrigger.current = event.currentTarget; setPendingRemoval(item.id); }}><Icon name="trash" /></button></div>
              </div>
            </li>;
          })}</ul>}
          {!persistent && <p role="status" className={styles.note}>Your bag is available in this tab. Reloading may clear it.</p>}
        </div>
        {!!items.length && <footer className={styles.footer} aria-labelledby={`${titleId}-summary`}>
          <h3 id={`${titleId}-summary`} className="cart-drawer-summary-heading">Order Summary</h3>
          <dl className="cart-drawer-summary-lines">
            <div><dt>Subtotal ({count} {count === 1 ? "Item" : "Items"})</dt><dd>{formatCartMoney(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd className={styles.note}>At checkout</dd></div>
            <div className={styles.total}><dt>Estimated Total</dt><dd><strong>{formatCartMoney(subtotal)}</strong></dd></div>
          </dl>
          <button type="button" disabled className={styles.primary} aria-describedby={`${titleId}-checkout`}><Icon name="bag" />Proceed to Checkout</button>
          <p id={`${titleId}-checkout`} className={styles.note}>Checkout is coming soon. Prices, shipping, and availability will be confirmed before payment.</p>
        </footer>}
      </div>
    </dialog>
    <CartRemovalDialog item={items.find((item) => item.id === pendingRemoval) ?? null} onConfirm={cartActions.removeItem} onDismiss={dismissRemoval} />
  </>;
}
