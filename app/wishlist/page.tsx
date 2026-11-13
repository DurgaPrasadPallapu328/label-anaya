import type { Metadata } from "next";
import { Header } from "@/components/home/header";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { WishlistView } from "@/components/shop/wishlist-view";

export const metadata: Metadata = { title: "Wishlist | Label Anaya" };

export default function WishlistPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header currentPage="wishlist" /><main id="main-content" className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12"><Breadcrumbs current="Wishlist" /><h1 className="mb-8 text-4xl text-olive">Your Wishlist</h1><WishlistView /></main></>;
}
