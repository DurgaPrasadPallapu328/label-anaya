"use client";

import { useSyncExternalStore } from "react";
import { addCartItem, parseCartLines, updateCartQuantity, type CartLine, type CartProduct } from "./domain";
import { CART_STORAGE_KEY, decodeCartSnapshot, readStoredCart, writeStoredCart } from "./storage";

interface CartState {
  items: readonly CartLine[];
  hydrated: boolean;
  persistent: boolean;
}

const serverState: CartState = { items: [], hydrated: false, persistent: true };
let state = serverState;
const listeners = new Set<() => void>();

function getSnapshot() {
  if (typeof window === "undefined") return serverState;
  if (!state.hydrated) state = { ...readStoredCart(), hydrated: true };
  return state;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  state = { items: decodeCartSnapshot(event.newValue), hydrated: true, persistent: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function save(items: readonly CartLine[]) {
  state = { items, hydrated: true, persistent: writeStoredCart(items) };
  emit();
}

export const cartActions = {
  addItem(product: CartProduct, quantity = 1) {
    const validated = parseCartLines([{ id: "new-item", product, quantity }])[0];
    if (validated) save(addCartItem(getSnapshot().items, validated.product, validated.quantity));
  },
  setQuantity(id: string, quantity: number) {
    save(updateCartQuantity(getSnapshot().items, id, quantity));
  },
  removeItem(id: string) {
    save(getSnapshot().items.filter((item) => item.id !== id));
  },
  /** Integration point for an authoritative cart response from a future API. */
  replaceItems(items: unknown) {
    save(parseCartLines(items));
  },
};

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverState);
}
