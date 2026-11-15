"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BrandLoader } from "./brand-loader";

export function NavigationBrandLoader() {
  const layer = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const element = layer.current;
    if (!element) return;
    let showTimer: ReturnType<typeof setTimeout>;
    let safetyTimer: ReturnType<typeof setTimeout>;
    const hide = () => {
      clearTimeout(showTimer);
      clearTimeout(safetyTimer);
      element.hidden = true;
    };
    const begin = () => {
      hide();
      // Instant, cached navigation needs no flash of a loading screen.
      showTimer = setTimeout(() => {
        element.hidden = false;
        safetyTimer = setTimeout(hide, 10_000);
      }, 120);
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const destination = new URL(anchor.href);
      if (destination.origin !== location.origin || !["http:", "https:"].includes(destination.protocol)) return;
      if (destination.pathname === location.pathname && destination.search === location.search) return;
      // Observe navigation without changing Link, drawer, or menu behavior.
      begin();
    };
    hide();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", begin);
    return () => {
      hide();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", begin);
    };
  }, [pathname, searchParams]);

  return <div ref={layer} hidden data-navigation-loader=""><BrandLoader /></div>;
}
