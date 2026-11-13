import type { Metadata } from "next";
import { Header } from "@/components/home/header";
import { CartClient } from "@/components/cart/cart-client";
import { DevCartControls } from "@/components/cart/dev-cart-controls";

export const metadata: Metadata = { title: "Your Cart | Label Anaya" };

export default function CartPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage="cart" />
      <main id="main-content" className="cart-page">
        <CartClient />
        {process.env.NODE_ENV === "development" && <DevCartControls />}
      </main>
    </>
  );
}
