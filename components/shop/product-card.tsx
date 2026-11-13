"use client";

import Image from "next/image";
import Link from "next/link";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/products";
import { ProductPrice } from "./product-price";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const wishlisted = wishlist.includes(product.id);

  return (
    <article className="relative h-full min-w-0 rounded-xl bg-peach p-2 motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 sm:p-3 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="group flex h-full flex-col rounded-lg">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 280px, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 44vw" className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col px-1 pb-2 pt-4 text-center sm:px-2 sm:pb-3">
          <h2 className="line-clamp-2 min-h-[2.75rem] break-words text-sm leading-snug text-foreground group-hover:text-olive sm:min-h-[3.125rem] sm:text-lg">{product.name}</h2>
          <ProductPrice price={product.price} originalPrice={product.originalPrice} demoDiscount={product.demoDiscount} />
        </div>
      </Link>
      <button
        type="button"
        aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${wishlisted ? "from" : "to"} wishlist`}
        aria-pressed={wishlisted}
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-white text-olive shadow-sm hover:bg-cream sm:right-4 sm:top-4"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
      </button>
    </article>
  );
}
