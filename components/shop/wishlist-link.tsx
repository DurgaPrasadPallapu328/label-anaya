"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";

export function WishlistLink() {
  const ids = useWishlist();
  return <Link href="/wishlist" className="icon-button wishlist-heart" aria-label={`Wishlist, ${ids.length} products`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg></Link>;
}
