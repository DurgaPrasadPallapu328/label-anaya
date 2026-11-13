import type { Product } from "./products";
import { MAX_CART_QUANTITY, type CartProduct } from "./cart/domain";

export function preparePurchase(product: Product, size: string, quantity: number): CartProduct {
  const options = product.sizes ?? [];
  const option = options.find((option) => option.size === size && option.enabled);
  if (options.length && !option) throw new Error("Please choose an available size.");
  const limit = Math.min(MAX_CART_QUANTITY, option?.maxQuantity ?? MAX_CART_QUANTITY);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > limit) throw new Error(`Choose a whole-number quantity from 1 to ${limit}.`);
  return {
    productId: product.id,
    variantId: options.length ? `${product.id}:${size}` : null,
    name: product.name,
    size: options.length ? size : null,
    unitPriceMinor: product.price * 100,
    currency: "INR",
    imageUrl: product.images?.[0]?.src ?? product.image,
    availability: { status: "unknown", ...(option?.maxQuantity !== undefined ? { maxQuantity: option.maxQuantity } : {}) },
  };
}
