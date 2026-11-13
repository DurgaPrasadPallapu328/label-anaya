import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatCartMoney, getCartItemCount, getCartSubtotal, getCartQuantityLimit, type CartLine } from "@/lib/cart/domain";
import { CartItemCard } from "./cart-item-card";

interface CartViewProps {
  items: readonly CartLine[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string, trigger?: HTMLButtonElement) => void;
  onCheckout?: () => void;
  checkoutPending?: boolean;
  checkoutMessage?: string;
}

export function CartTitle({ count }: { count: number }) {
  return (
    <div className="cart-title-row">
      <h1 id="cart-title" tabIndex={-1}>Your Cart <span>({count} {count === 1 ? "Item" : "Items"})</span></h1>
      <div className="cart-title-rule" aria-hidden="true"><span /><Icon name="leaf" /><span /></div>
    </div>
  );
}

function ContinueShopping({ className = "" }: { className?: string }) {
  return (
    <Link href="/#category-heading" className={`cart-continue ${className}`}>
      <Icon name="arrow" className="rotate-180" /><span>Continue Shopping</span>
    </Link>
  );
}

export function CartView({ items, onQuantityChange, onRemove, onCheckout, checkoutPending = false, checkoutMessage }: CartViewProps) {
  const count = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);
  const checkoutUnavailable = !onCheckout || checkoutPending
    || items.some((item) => item.quantity > getCartQuantityLimit(item.product));

  return (
    <>
      <CartTitle count={count} />
      {items.length === 0 ? (
        <section className="cart-empty" aria-labelledby="empty-cart-title">
          <Icon name="bag" />
          <h2 id="empty-cart-title">Your bag is waiting</h2>
          <p>Explore our collections and find something you love.</p>
          <ContinueShopping />
        </section>
      ) : (
        <div className="cart-layout">
          <ul className="cart-items" aria-label="Items in your cart">
            {items.map((item) => <CartItemCard key={item.id} item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />)}
          </ul>
          <aside className="cart-summary-column" aria-labelledby="cart-summary-title">
            <section className="cart-summary">
              <h2 id="cart-summary-title">Order Summary</h2>
              <dl>
                <div><dt>Subtotal ({count} {count === 1 ? "Item" : "Items"})</dt><dd>{formatCartMoney(subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd className="cart-shipping">At checkout</dd></div>
                <div className="cart-total"><dt>Total</dt><dd>{formatCartMoney(subtotal)}</dd></div>
              </dl>
            </section>
            <div className="cart-checkout">
              <ContinueShopping className="cart-continue-mobile" />
              <button type="button" className="cart-checkout-button"
                aria-disabled={checkoutUnavailable}
                onClick={(event) => {
                  if (checkoutUnavailable) event.preventDefault();
                  else onCheckout?.();
                }} aria-describedby="cart-checkout-note">
                <Icon name="bag" /><span>{checkoutPending ? "Confirming your order…" : "Proceed to Checkout"}</span>
              </button>
              <p id="cart-checkout-note">{checkoutMessage ?? (onCheckout
                ? "Prices, shipping, and availability will be confirmed before payment."
                : "Checkout is coming soon. Prices, shipping, and availability will be confirmed before payment.")}</p>
              <p className="cart-estimate-note">Estimated total excludes shipping.</p>
            </div>
          </aside>
          <ContinueShopping className="cart-continue-desktop" />
        </div>
      )}
    </>
  );
}
