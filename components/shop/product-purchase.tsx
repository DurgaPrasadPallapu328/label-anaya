"use client";

import { useId, useState, type FormEvent } from "react";
import { openCartDrawer } from "@/lib/cart/drawer";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { preparePurchase } from "@/lib/product-purchase";
import { cartActions, useCart } from "@/lib/cart/store";
import { MAX_CART_LINES, MAX_CART_QUANTITY, getProductKey, getCartQuantityLimit } from "@/lib/cart/domain";
import { buildCheckoutRequest } from "@/lib/cart/checkout";

export function ProductPurchase({ product }: { product: Product }) {
  const id = useId();
  const router = useRouter();
  const cart = useCart();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const limit = Math.min(MAX_CART_QUANTITY, product.sizes?.find((option) => option.size === size)?.maxQuantity ?? MAX_CART_QUANTITY);

  function purchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const selected = preparePurchase(product, size, Number(quantity));
      if ((event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "buy-now") {
        const lines = [{ id: getProductKey(selected), product: selected, quantity: Number(quantity) }];
        buildCheckoutRequest(lines);
        sessionStorage.setItem("label-anaya:buy-now:demo", JSON.stringify(lines));
        router.push(sessionStorage.getItem("label-anaya:session:demo") === "demo" ? "/checkout" : "/login?returnTo=checkout");
      } else {
        const existing = cart.items.find((line) => getProductKey(line.product) === getProductKey(selected));
        if (!existing && cart.items.length >= MAX_CART_LINES) throw new Error("Your shopping bag is full.");
        if ((existing?.quantity ?? 0) + Number(quantity) > getCartQuantityLimit(selected)) throw new Error("This quantity would exceed the limit for this size in your bag.");
        cartActions.addItem(selected, Number(quantity));
        setNotice("Added to your shopping bag.");
        openCartDrawer((event.nativeEvent as SubmitEvent).submitter);
      }
    } catch (cause) { setError(cause instanceof Error && cause.name !== "SecurityError" && cause.name !== "QuotaExceededError" ? cause.message : "Unable to save your selection. Enable browser storage and try again."); }
  }

  return <form onSubmit={purchase} noValidate className="mt-8 space-y-6" aria-describedby={`${id}-status`}>
    {!!product.sizes?.length && <fieldset><legend className="mb-3 text-lg">Size</legend><div className="flex flex-wrap gap-3">{product.sizes.map((option) => <label key={option.size} className={`flex min-h-12 min-w-12 items-center justify-center rounded-md border px-3 ${size === option.size ? "border-olive bg-olive text-white" : "border-olive/40"} ${!option.enabled || option.maxQuantity === 0 ? "opacity-40" : "cursor-pointer"}`}><input type="radio" name="size" value={option.size} checked={size === option.size} disabled={!option.enabled || option.maxQuantity === 0} onChange={() => setSize(option.size)} className="mr-2 accent-olive" />{option.size}</label>)}</div></fieldset>}
    <div><label htmlFor={`${id}-quantity`} className="mb-2 block text-lg">Quantity</label><div className="inline-flex items-center rounded-md border border-olive/40"><button type="button" aria-label="Decrease quantity" disabled={Number(quantity) <= 1 || !Number.isFinite(Number(quantity))} onClick={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))} className="min-h-12 min-w-12 text-xl disabled:opacity-40">−</button><input id={`${id}-quantity`} name="quantity" type="number" min="1" max={limit} step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="min-h-12 w-16 bg-cream text-center text-lg" /><button type="button" aria-label="Increase quantity" disabled={Number(quantity) >= limit || !Number.isFinite(Number(quantity))} onClick={() => setQuantity(String(Math.min(limit, Math.max(1, Number(quantity) + 1))))} className="min-h-12 min-w-12 text-xl disabled:opacity-40">+</button></div></div>
    <div className="grid grid-cols-2 gap-3"><button type="submit" value="cart" className="min-h-12 whitespace-nowrap rounded-md bg-olive px-2 py-3 text-white hover:bg-olive-dark">Add to Cart</button><button type="submit" value="buy-now" className="min-h-12 whitespace-nowrap rounded-md bg-[#6a4738] px-2 py-3 text-white hover:bg-[#523629]">Buy Now</button></div>
    <div id={`${id}-status`}><p role="alert" className="text-red-800">{error}</p><p role="status" className="text-olive">{notice}</p>{!cart.persistent && <p role="status" className="text-muted">Your bag is available for this visit only because browser storage is unavailable.</p>}</div>
    <p className="text-sm text-muted">Demo shopping only. No real stock reservation, orders, or payments.</p>
  </form>;
}
