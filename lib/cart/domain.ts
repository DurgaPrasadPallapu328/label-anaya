export type AvailabilityStatus = "available" | "unavailable" | "unknown";

/** A display snapshot. The checkout backend must supply authoritative values. */
export interface CartProduct {
  productId: string;
  variantId?: string | null;
  name: string;
  size?: string | null;
  unitPriceMinor: number;
  currency: "INR";
  imageUrl?: string | null;
  availability?: {
    status: AvailabilityStatus;
    maxQuantity?: number | null;
  };
}

export interface CartLine {
  id: string;
  product: CartProduct;
  quantity: number;
}

export const MAX_CART_QUANTITY = 99;
export const MAX_CART_LINES = 100;

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const fractionalMoney = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function formatCartMoney(amountMinor: number) {
  return (amountMinor % 100 === 0 ? money : fractionalMoney).format(amountMinor / 100);
}

export function getProductImageUrl(value?: string | null): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const source = value.trim();
  if (source.length > 4096 || /[\u0000-\u001f\u007f]/.test(source)) return null;
  // Only explicit same-origin paths or web URLs are supported.
  if (source.startsWith("/") && !source.startsWith("//") && !source.includes("\\")) return source;
  try {
    const url = new URL(source);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function getCartQuantityLimit(product: CartProduct) {
  if (product.availability?.status === "unavailable") return 0;
  return Math.min(MAX_CART_QUANTITY, product.availability?.maxQuantity ?? MAX_CART_QUANTITY);
}

export function getCartItemCount(items: readonly CartLine[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartSubtotal(items: readonly CartLine[]) {
  return items.reduce((total, item) => total + item.product.unitPriceMinor * item.quantity, 0);
}

export function getProductKey(product: CartProduct) {
  return JSON.stringify([product.productId, product.variantId ?? null, product.size ?? null]);
}

export function addCartItem(items: readonly CartLine[], product: CartProduct, quantity = 1): CartLine[] {
  if (!Number.isInteger(quantity) || quantity < 1 || getCartQuantityLimit(product) < 1) return [...items];
  const key = getProductKey(product);
  const existing = items.find((item) => getProductKey(item.product) === key);
  if (!existing) {
    if (items.length >= MAX_CART_LINES) return [...items];
    return [...items, { id: key, product, quantity: Math.min(quantity, getCartQuantityLimit(product)) }];
  }
  return items.map((item) => item.id === existing.id
    ? { ...item, product, quantity: Math.min(item.quantity + quantity, getCartQuantityLimit(product)) }
    : item);
}

export function updateCartQuantity(items: readonly CartLine[], id: string, quantity: number): CartLine[] {
  if (!Number.isInteger(quantity) || quantity < 1) return [...items];
  return items.map((item) => item.id === id
    ? { ...item, quantity: Math.max(1, Math.min(quantity, getCartQuantityLimit(item.product))) }
    : item);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 500;
}

/** Validate both persisted snapshots and future API responses at the data boundary. */
export function parseCartLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const products = new Set<string>();
  const items: CartLine[] = [];
  for (const candidate of value.slice(0, MAX_CART_LINES)) {
    if (!isRecord(candidate) || !isText(candidate.id) || !isRecord(candidate.product)) continue;
    const product = candidate.product;
    if (!isText(product.productId) || !isText(product.name) || product.currency !== "INR") continue;
    if (!Number.isSafeInteger(product.unitPriceMinor) || (product.unitPriceMinor as number) < 0
      || (product.unitPriceMinor as number) > 100_000_000) continue;
    if (!Number.isInteger(candidate.quantity) || (candidate.quantity as number) < 1
      || (candidate.quantity as number) > MAX_CART_QUANTITY) continue;
    if (product.variantId != null && !isText(product.variantId)) continue;
    if (product.size != null && !isText(product.size)) continue;
    const availability = product.availability;
    if (availability != null && (!isRecord(availability)
      || !["available", "unavailable", "unknown"].includes(String(availability.status))
      || (availability.maxQuantity != null && (!Number.isInteger(availability.maxQuantity)
        || (availability.maxQuantity as number) < 0)))) continue;

    const normalized: CartProduct = {
      productId: product.productId,
      variantId: (product.variantId as string | null | undefined) ?? null,
      name: product.name,
      size: (product.size as string | null | undefined) ?? null,
      unitPriceMinor: product.unitPriceMinor as number,
      currency: "INR",
      imageUrl: getProductImageUrl(typeof product.imageUrl === "string" ? product.imageUrl : null),
      ...(isRecord(availability) ? { availability: {
        status: availability.status as AvailabilityStatus,
        maxQuantity: (availability.maxQuantity as number | null | undefined) ?? null,
      } } : {}),
    };
    const key = getProductKey(normalized);
    if (seen.has(candidate.id) || products.has(key)) continue;
    seen.add(candidate.id);
    products.add(key);
    items.push({ id: candidate.id, product: normalized, quantity: candidate.quantity as number });
  }
  return items;
}
