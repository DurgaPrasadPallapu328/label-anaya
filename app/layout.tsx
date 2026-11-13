import { CartDrawer } from "@/components/cart/cart-drawer";
import { WhatsAppContact } from "@/components/ui/whatsapp-contact";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Label Anaya | The Anaya Edit — Collection 01",
  description:
    "Original designs & trend-inspired outfits crafted for you. Discover made-to-order kurtis, co-ord sets, dresses, ethnic wear, and western wear at Label Anaya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}<CartDrawer /><WhatsAppContact /></body>
    </html>
  );
}
