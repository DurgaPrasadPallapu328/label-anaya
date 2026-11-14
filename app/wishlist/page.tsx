import type { Metadata } from "next";
import { Header } from "@/components/home/header";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";
import { WishlistView } from "@/components/shop/wishlist-view";

export const metadata: Metadata = { title: "Wishlist | Label Anaya" };

export default function WishlistPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="wishlist" />
      <main id="main-content" className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <h1 className="sr-only">Your Wishlist</h1>
        <Breadcrumbs current="Wishlist" className="mb-4 sm:mb-5" />
        <WishlistView />
      </main>
    </>
  );
}
