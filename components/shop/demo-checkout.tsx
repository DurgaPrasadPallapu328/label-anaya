"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { parseCartLines, formatCartMoney, getCartSubtotal } from "@/lib/cart/domain";
import { buildCheckoutRequest } from "@/lib/cart/checkout";

function subscribe(notify: () => void) {
  window.addEventListener("label-anaya-demo", notify);
  return () => window.removeEventListener("label-anaya-demo", notify);
}
function snapshot() {
  try { return JSON.stringify([sessionStorage.getItem("label-anaya:session:demo"), sessionStorage.getItem("label-anaya:buy-now:demo")]); }
  catch { return '[null,null]'; }
}

export function DemoCheckout({ login = false }: { login?: boolean }) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, snapshot, () => '[null,null]');
  const [session, intent] = JSON.parse(raw) as [string | null, string | null];
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  let lines: ReturnType<typeof parseCartLines> = [];
  try { lines = parseCartLines(JSON.parse(intent ?? "[]")); } catch { /* Invalid demo selections are discarded. */ }

  return <><h1 className="text-3xl text-olive">{login ? "Demo sign-in" : "Demo checkout"}</h1><p className="my-5 text-muted">Test mode only. No real authentication, orders, stock reservation, or payments.</p>{login ? <><p className="mb-5">Continue with a temporary demo session. No credentials are collected.</p><button type="button" className="min-h-12 rounded-md bg-olive px-6 text-white" onClick={() => {
    try { sessionStorage.setItem("label-anaya:session:demo", "demo"); window.dispatchEvent(new Event("label-anaya-demo")); router.push(lines.length ? "/checkout" : "/shop"); }
    catch { setError("Enable browser storage to continue the demo."); }
  }}>Continue in demo mode</button></> : session !== "demo" ? <Link href="/login?returnTo=checkout" className="inline-flex min-h-12 items-center rounded bg-olive px-5 text-white">Sign in to demo checkout</Link> : complete ? <p role="status">Demo complete. No order was placed or payment taken. Your cart is unchanged.</p> : lines.length === 0 ? <p>No Buy Now selection. <Link href="/shop" className="underline">Choose a product</Link>.</p> : <><ul className="space-y-4">{lines.map((line) => <li key={line.id} className="rounded-xl bg-peach p-5"><h2 className="text-xl">{line.product.name}</h2><p>Size: {line.product.size ?? "One size"} · Quantity: {line.quantity}</p><p>{formatCartMoney(line.product.unitPriceMinor * line.quantity)}</p></li>)}</ul><p className="my-6 text-2xl text-olive">Total: {formatCartMoney(getCartSubtotal(lines))}</p><button type="button" className="min-h-12 rounded-md bg-olive px-6 text-white" onClick={() => {
    try { buildCheckoutRequest(lines); sessionStorage.removeItem("label-anaya:buy-now:demo"); setComplete(true); window.dispatchEvent(new Event("label-anaya-demo")); }
    catch { setError("Unable to complete the demo. Please choose the product again."); }
  }}>Complete demo — no payment</button></>}<p role="alert" className="mt-4 text-red-800">{error}</p></>;
}
