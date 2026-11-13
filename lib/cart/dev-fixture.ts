import type { CartProduct } from "./domain";

export function getDemoCartProduct(): CartProduct {
  if (process.env.NODE_ENV !== "development") throw new Error("The cart fixture is development-only.");
  return {
    productId: "demo-sage-kurti",
    variantId: null,
    name: "Sage A-Line Kurti Set",
    size: "S",
    unitPriceMinor: 169_900,
    currency: "INR",
    imageUrl: null,
    availability: { status: "unknown" },
  };
}
