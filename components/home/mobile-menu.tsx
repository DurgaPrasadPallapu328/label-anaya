"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { categories } from "@/lib/categories";
import { getCartItemCount } from "@/lib/cart/domain";
import { useCart } from "@/lib/cart/store";

export function MobileMenu({ currentPage = "home" }: { currentPage?: "home" | "cart" }) {
  const { items } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className="lg:hidden">
      <button type="button" className="icon-button menu-trigger" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
        <Icon name="menu" />
      </button>
      <dialog ref={dialog} id="mobile-navigation" aria-labelledby="mobile-menu-title" className="mobile-menu bg-cream" onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="menu-content">
          <div className="flex items-center justify-between gap-4 border-b border-olive/20 pb-5">
            <h2 id="mobile-menu-title" className="text-2xl">Label Anaya</h2>
            <button type="button" className="icon-button" aria-label="Close navigation" onClick={() => dialog.current?.close()}><Icon name="close" /></button>
          </div>
          <nav aria-label="Mobile navigation" className="mt-5 flex flex-col" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) dialog.current?.close(); }}>
            <Link href="/" aria-current={currentPage === "home" ? "page" : undefined} className="drawer-link">Home</Link>
            <Link href="/shop" className="drawer-link">Shop All</Link>
            <div className="my-3 border-t border-olive/20" />
            {categories.map((category) => <Link key={category.href} href={category.href} className="drawer-link">{category.name}</Link>)}
            <div className="my-3 border-t border-olive/20" />
            <Link href="/login" className="drawer-link">Your account</Link>
            <Link href="/cart" aria-current={currentPage === "cart" ? "page" : undefined} className="drawer-link">Shopping bag ({getCartItemCount(items)})</Link>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
