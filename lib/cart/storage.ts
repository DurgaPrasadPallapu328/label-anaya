import { parseCartLines, type CartLine } from "./domain";

// A developer's seeded bag must never become a production visitor's bag.
export const CART_STORAGE_KEY = process.env.NODE_ENV === "development"
  ? "label-anaya:cart:development:v1"
  : "label-anaya:cart:v1";

export function decodeCartSnapshot(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const snapshot: unknown = JSON.parse(value);
    if (typeof snapshot !== "object" || snapshot === null || !("version" in snapshot)
      || snapshot.version !== 1 || !("items" in snapshot)) return [];
    return parseCartLines(snapshot.items);
  } catch {
    return [];
  }
}

export function readStoredCart(): { items: CartLine[]; persistent: boolean } {
  try {
    return { items: decodeCartSnapshot(window.localStorage.getItem(CART_STORAGE_KEY)), persistent: true };
  } catch {
    return { items: [], persistent: false };
  }
}

export function writeStoredCart(items: readonly CartLine[]) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items }));
    return true;
  } catch {
    return false;
  }
}
