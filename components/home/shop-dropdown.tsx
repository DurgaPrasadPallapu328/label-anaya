"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { categories } from "@/lib/categories";

export function ShopDropdown() {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div ref={container} className="relative" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } }}>
      <button ref={trigger} type="button" aria-expanded={open} aria-controls="shop-categories" className="shop-trigger flex min-h-11 items-center gap-3" onClick={() => setOpen(!open)} onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
          requestAnimationFrame(() => container.current?.querySelector("a")?.focus());
        }
      }}>Shop All <Icon name="chevron" className="size-5" /></button>
      <div id="shop-categories" hidden={!open} className="shop-dropdown absolute z-30 rounded-lg border border-olive/20 bg-cream p-2">
        <Link href="/shop" className="dropdown-link" onClick={() => setOpen(false)}>Shop All</Link>
        {categories.map((category) => <Link key={category.id} href={`/shop/${category.slug}`} className="dropdown-link" onClick={() => setOpen(false)}>{category.name}</Link>)}
      </div>
    </div>
  );
}
