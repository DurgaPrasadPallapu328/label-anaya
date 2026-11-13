import type { Product } from "@/lib/products";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: readonly Product[] }) {
  if (products.length === 0) {
    return <p className="rounded-xl bg-peach px-6 py-16 text-center text-xl text-muted">No products in this collection yet. Please check back soon.</p>;
  }
  return (
    <ul aria-label="Products" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
      {products.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}
    </ul>
  );
}
