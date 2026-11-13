import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/home/announcement-bar";
import { Header } from "@/components/home/header";
import { Icon } from "@/components/ui/icon";
import { CartClient } from "@/components/cart/cart-client";
import { DevCartControls } from "@/components/cart/dev-cart-controls";

export const metadata: Metadata = { title: "Your Cart | Label Anaya" };

export default function CartPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <AnnouncementBar />
      <Header currentPage="cart" />
      <main id="main-content" className="cart-page">
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><Icon name="chevron" className="-rotate-90" /><span aria-current="page">Your Cart</span>
        </nav>
        <CartClient />
        {process.env.NODE_ENV === "development" && <DevCartControls />}
      </main>
    </>
  );
}
