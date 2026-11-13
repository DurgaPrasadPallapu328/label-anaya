"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { products } from "@/lib/products";
import { ProductGrid } from "./product-grid";

export function WishlistView() {
  const ids = useWishlist();
  const saved = products.filter((product) => ids.includes(product.id));
  return saved.length ? <><p className="mb-6 text-muted" role="status">{saved.length} saved {saved.length === 1 ? "product" : "products"}. Use a heart to remove a product.</p><ProductGrid products={saved} /></> : <div className="rounded-xl bg-peach px-5 py-16 text-center"><p className="text-2xl text-[#6a2438] sm:text-3xl">Your wishlist is waiting for something beautiful</p><Link href="/shop" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-olive px-6 text-white hover:bg-olive-dark">Explore Collection</Link></div>;
}
