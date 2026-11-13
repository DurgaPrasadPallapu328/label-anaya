"use client";

import { useSyncExternalStore } from "react";
import { products } from "./products";

const storageKey = "label-anaya:wishlist:v1";
const catalog = new Set(products.map((product) => product.id));
const empty: readonly string[] = [];
let ids: readonly string[] = empty;
let hydrated = false;
const listeners = new Set<() => void>();

export function parseWishlist(raw: string | null): readonly string[] {
  try {
    const data: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(data) ? [...new Set(data.filter((id): id is string => typeof id === "string" && catalog.has(id)))] : [];
  } catch { return []; }
}

function snapshot() {
  if (!hydrated && typeof window !== "undefined") {
    try { ids = parseWishlist(window.localStorage.getItem(storageKey)); } catch { ids = empty; }
    hydrated = true;
  }
  return ids;
}
function onStorage(event: StorageEvent) {
  if (event.key !== storageKey && event.key !== null) return;
  ids = parseWishlist(event.newValue);
  hydrated = true;
  listeners.forEach((notify) => notify());
}
function subscribe(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Replace IDs with an authoritative account response when a backend is ready. */
export function replaceWishlist(next: readonly string[]) {
  ids = parseWishlist(JSON.stringify(next));
  hydrated = true;
  try { window.localStorage.setItem(storageKey, JSON.stringify(ids)); } catch { /* Remain usable in this tab when storage is blocked. */ }
  listeners.forEach((notify) => notify());
}

export function toggleWishlist(id: string) {
  if (!catalog.has(id)) return;
  const current = snapshot();
  replaceWishlist(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
}

export function useWishlist() {
  return useSyncExternalStore(subscribe, snapshot, () => empty);
}
