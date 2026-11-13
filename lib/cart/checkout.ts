import type { CartLine } from "./domain";

export interface CheckoutRequest {
  lines: { productId: string; variantId: string | null; quantity: number }[];
}

/** The future backend must reprice, check inventory, and create the session. */
export interface CheckoutGateway {
  createSession(request: CheckoutRequest): Promise<{ checkoutUrl: string }>;
}

export function buildCheckoutRequest(items: readonly CartLine[]): CheckoutRequest {
  if (items.length === 0) throw new Error("Your cart is empty.");
  if (items.some(({ product, quantity }) => !product.productId.trim()
    || (product.variantId != null && !product.variantId.trim())
    || !Number.isSafeInteger(quantity) || quantity < 1)) {
    throw new Error("Your cart contains an invalid item.");
  }
  return {
    lines: items.map(({ product, quantity }) => ({
      productId: product.productId,
      variantId: product.variantId ?? null,
      quantity,
    })),
  };
}
