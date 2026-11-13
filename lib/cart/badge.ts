"use client";

import { useSyncExternalStore } from "react";

// Presentation only. Actual quantities always come from the existing cart store.
let heldCount: number | null = null;
let owner: symbol | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function holdCartBadge(previousCount: number): () => void {
  const token = Symbol("cart-delivery");
  owner = token;
  heldCount ??= previousCount;
  emit();
  return () => {
    // A cancelled older flight cannot release a newer addition's hold.
    if (owner !== token) return;
    owner = undefined;
    heldCount = null;
    emit();
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useCartBadge(actualCount: number) {
  const held = useSyncExternalStore(subscribe, () => heldCount, () => null);
  return held ?? actualCount;
}
