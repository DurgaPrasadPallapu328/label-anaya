"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import { doveArtwork } from "@/lib/cart/dove";
import { openCartDrawer } from "@/lib/cart/drawer";

let cancelActive: (() => void) | undefined;

function visible(element: HTMLElement, fullyVisible = false) {
  const r = element.getBoundingClientRect(), style = getComputedStyle(element);
  const intersects = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  return r.width > 0 && r.height > 0 && intersects
    && (!fullyVisible || (r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth))
    && style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
}

/** Visual feedback only: this hook never mutates cart data. */
export function useCartFlight() {
  const pathname = usePathname();
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancel.current?.(), [pathname]);

  return function fly(source: HTMLImageElement | null, trigger: HTMLElement | null, revealMobile = true, releaseBadge: () => void = () => {}): void {
    cancelActive?.();
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-flight-target]"));
    const target = candidates.find((element) => visible(element, true));
    const drawerOpen = () => Boolean(document.querySelector(".cart-drawer-panel[open]"));
    const revealBadge = () => flushSync(releaseBadge);
    const open = () => { revealBadge(); if (!drawerOpen()) openCartDrawer(trigger); };
    if (drawerOpen()) { revealBadge(); return; }
    // Mobile purchase controls are below the gallery and the non-sticky header.
    // Reveal the REAL cart target rather than silently skipping or inventing one.
    // Re-measure after a paint; this is geometry preparation, not an animation delay.
    if (revealMobile && innerWidth < 768 && source?.complete && source.naturalWidth
      && (!target || !visible(source)) && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const renderedTarget = candidates.find((element) => {
        const bounds = element.getBoundingClientRect(), style = getComputedStyle(element);
        return bounds.width > 0 && bounds.height > 0 && style.display !== "none"
          && style.visibility !== "hidden" && style.opacity !== "0";
      });
      if (renderedTarget && typeof renderedTarget.scrollIntoView === "function") {
        const pendingFrame = requestAnimationFrame(() => {
          window.removeEventListener("label-anaya:open-cart", cancelReveal);
          if (cancelActive === cancelReveal) cancelActive = undefined;
          fly(source, trigger, false, releaseBadge);
        });
        const cancelReveal = () => {
          cancelAnimationFrame(pendingFrame);
          window.removeEventListener("label-anaya:open-cart", cancelReveal);
          revealBadge();
          if (cancelActive === cancelReveal) cancelActive = undefined;
        };
        cancel.current = cancelReveal;
        cancelActive = cancelReveal;
        window.addEventListener("label-anaya:open-cart", cancelReveal);
        try {
          // Center alignment clamps this near-top header to scrollY=0. Aligning
          // its fractional top edge directly can leave it at -0.5px on phones.
          renderedTarget.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
        } catch { cancelReveal(); open(); }
        return;
      }
    }
    if (!source || !target || !source.complete || !source.naturalWidth || !visible(source)
      || matchMedia("(prefers-reduced-motion: reduce)").matches || !target.animate) { open(); return; }

    const animations: Animation[] = [];
    const layer = document.createElement("div");
    let stopped = false;
    let drawerTimer: ReturnType<typeof setTimeout> | undefined;
    let resolveDelay: (() => void) | undefined;
    let destination: { x: number; y: number } | undefined;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      if (drawerTimer !== undefined) clearTimeout(drawerTimer);
      resolveDelay?.();
      revealBadge();
      animations.forEach((animation) => animation.cancel());
      layer.remove();
      window.removeEventListener("scroll", interrupt, true);
      window.removeEventListener("resize", interrupt);
      document.removeEventListener("visibilitychange", interrupt);
      motion.removeEventListener("change", interrupt);
      window.removeEventListener("label-anaya:open-cart", cleanup);
      observer.disconnect();
      if (cancelActive === cleanup) cancelActive = undefined;
    };
    const interrupt = (event: Event) => {
      // Scroll anchoring or an unrelated scrolling container must not skip flight.
      // Once lifted, the clone is independent of its source; only the target matters.
      if (event.type === "scroll" && destination && visible(target, true)) {
        const bounds = target.getBoundingClientRect();
        if (Math.abs(bounds.left + bounds.width / 2 - destination.x) < 1
          && Math.abs(bounds.top + bounds.height / 2 - destination.y) < 1) return;
      }
      cleanup();
      if (!document.querySelector("dialog[open]")) open();
    };
    const observer = new MutationObserver(() => {
      if (!source.isConnected || !target.isConnected || document.querySelector("dialog[open]")) cleanup();
    });
    cancel.current = cleanup;
    cancelActive = cleanup;

    try {
      const from = source.getBoundingClientRect(), to = target.getBoundingClientRect();
      let width = Math.min(innerWidth < 640 ? 52 : 72, from.width);
      const ratio = source.naturalHeight / source.naturalWidth;
      width = Math.min(width, innerHeight * .3 / ratio);
      const height = width * ratio;
      // Lift from the visible portion, even when a tall gallery extends off-screen.
      const start = {
        x: (Math.max(0, from.left) + Math.min(innerWidth, from.right)) / 2,
        y: (Math.max(0, from.top) + Math.min(innerHeight, from.bottom)) / 2,
      };
      const end = { x: to.left + to.width / 2, y: to.top + to.height / 2 };
      destination = end;
      const birdWidth = innerWidth < 640 ? 106 : 136;
      const birdHeight = birdWidth * .7;
      const parcelWidth = 34, parcelHeight = 40;
      const anchor = { x: birdWidth * .55, y: birdHeight * .8 + parcelHeight / 2 };
      const arrivalScale = Math.min(.42, Math.max(.12, (end.y - 14) / anchor.y));
      const delivery = { x: end.x, y: end.y - 6 };
      const lift = Math.max(anchor.y + 8, start.y - 20);
      const control = { x: start.x + (end.x - start.x) * .3, y: Math.max(16, Math.min(lift, delivery.y) - 100) };
      const point = (p: number) => ({ x: (1 - p) ** 2 * start.x + 2 * (1 - p) * p * control.x + p ** 2 * delivery.x, y: (1 - p) ** 2 * lift + 2 * (1 - p) * p * control.y + p ** 2 * delivery.y });
      const transform = (x: number, y: number, scale: number) => `translate(${x - anchor.x * scale}px,${y - anchor.y * scale}px) scale(${scale})`;
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = "position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden;contain:strict";
      const carrier = document.createElement("div");
      carrier.className = "cart-flight-carrier";
      carrier.style.cssText = `position:absolute;left:0;top:0;width:${birdWidth}px;height:${birdHeight + parcelHeight}px;transform-origin:0 0;transform:${transform(start.x, start.y, 1)};pointer-events:none;will-change:transform`;
      const bird = document.createElement("div");
      bird.className = "cart-flight-dove";
      bird.innerHTML = doveArtwork;
      bird.style.cssText = `position:absolute;inset:0 auto auto 0;width:${birdWidth}px;height:${birdHeight}px;opacity:0;filter:drop-shadow(0 2px 3px #76634355) drop-shadow(0 0 5px #fff8dc66);pointer-events:none`;
      const parcel = document.createElement("div");
      parcel.className = "cart-flight-parcel";
      parcel.style.cssText = `position:absolute;left:${anchor.x - parcelWidth / 2}px;top:${anchor.y - parcelHeight / 2}px;width:${parcelWidth}px;height:${parcelHeight}px;border-radius:4px;background:transparent;pointer-events:none;transform-origin:center`;
      const handle = document.createElement("span");
      handle.style.cssText = "position:absolute;left:10px;top:-7px;width:14px;height:10px;border:1.5px solid #c5a15d;border-bottom:0;border-radius:8px 8px 0 0;opacity:0;pointer-events:none";
      const image = document.createElement("img");
      image.src = source.currentSrc || source.src;
      image.alt = "";
      image.style.cssText = `position:absolute;left:50%;top:50%;width:${width}px;height:${height}px;object-fit:contain;transform:translate(-50%,-50%);border-radius:3px;box-shadow:0 0 8px #c5a15d44;pointer-events:none`;
      parcel.append(handle);
      parcel.append(image);
      carrier.append(bird);
      carrier.append(parcel);
      layer.append(carrier);
      document.body.append(layer);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
      window.addEventListener("scroll", interrupt, true);
      window.addEventListener("resize", interrupt);
      document.addEventListener("visibilitychange", interrupt);
      motion.addEventListener("change", interrupt);
      window.addEventListener("label-anaya:open-cart", cleanup);

      const run = (element: HTMLElement | SVGElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
        const animation = element.animate(frames, { fill: "forwards", ...options });
        animations.push(animation);
        void animation.finished.catch(() => {});
        return animation.finished;
      };
      void (async () => {
        try {
          const wings = bird.querySelectorAll<SVGElement>(".dove-wing");
          wings.forEach((wing, index) => {
            void run(wing, [{ transform: "rotate(0deg) scaleY(1)" }, { transform: `rotate(${index ? -9 : 7}deg) scaleY(.82)`, offset: .5 }, { transform: "rotate(0deg) scaleY(1)" }], { duration: 700, iterations: 3, easing: "ease-in-out" }).catch(() => {});
          });
          // Entrance (200ms): bird appears above the unchanged product clone.
          await run(bird, [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 200, easing: "ease-out" });
          if (stopped) return;
          const thumbnailScale = Math.min((parcelWidth - 10) / width, (parcelHeight - 12) / height);
          // Pickup (300ms): the thumbnail becomes a burgundy parcel at the feet.
          await Promise.all([
            run(image, [{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(-50%,-50%) scale(${thumbnailScale})` }], { duration: 300, easing: "ease-in-out" }),
            run(parcel, [{ backgroundColor: "transparent", boxShadow: "inset 0 0 0 0 transparent" }, { backgroundColor: "#6b2637", boxShadow: "inset 0 0 0 1px #c5a15d99" }], { duration: 300 }),
            run(handle, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }),
            run(carrier, [{ transform: transform(start.x, start.y, 1) }, { transform: transform(start.x, lift, 1) }], { duration: 300, easing: "ease-in-out" }),
          ]);
          if (stopped) return;
          const frames: Keyframe[] = [];
          for (let i = 0; i <= 30; i++) {
            const t = i / 30, p = t * t * (3 - 2 * t), at = point(p);
            frames.push({ transform: transform(at.x, at.y, 1 - (1 - arrivalScale) * p), offset: t });
          }
          const count = innerWidth < 640 ? 5 : 7;
          for (let i = 0; i < count; i++) {
            const progress = (i + 1) / (count + 1), at = point(progress * progress * (3 - 2 * progress));
            const spark = document.createElement("i");
            spark.style.cssText = `position:absolute;left:${at.x}px;top:${at.y}px;width:3px;height:3px;border-radius:50%;background:#c5a15d;opacity:0;pointer-events:none`;
            layer.append(spark);
            void run(spark, [{ opacity: .45, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(6px)" }], { delay: progress * 900, duration: 220, easing: "ease-out" }).catch(() => {});
          }
          // Bird and parcel are children of the same carrier throughout flight.
          await run(carrier, frames, { duration: 900, easing: "linear" });
          if (stopped) return;
          // The parcel's finished promise is the authoritative delivery event.
          const drop = run(parcel, [{ transform: "translateY(0) scale(1)", opacity: 1 }, { transform: `translateY(${6 / arrivalScale}px) scale(.1)`, opacity: 0 }], { duration: 200, easing: "ease-in" });
          const cartBounce = run(target, [{ transform: "scale(1)", boxShadow: "0 0 0 transparent" }, { transform: "scale(1.12)", boxShadow: "0 0 12px #c5a15d66", offset: .5 }, { transform: "scale(1)", boxShadow: "0 0 0 transparent" }], { duration: 200, easing: "ease-in-out" });
          await drop;
          if (stopped) return;
          // Start the one-second clock at parcel completion, before rendering feedback.
          const afterDrop = new Promise<void>((resolve) => {
            resolveDelay = resolve;
            drawerTimer = setTimeout(() => { drawerTimer = undefined; resolve(); }, 1000);
          });
          revealBadge();
          const badge = target.querySelector<HTMLElement>("[data-cart-badge]");
          const badgePop = badge ? run(badge, [{ transform: "scale(1)", boxShadow: "0 0 0 transparent" }, { transform: "scale(1.25)", boxShadow: "0 0 9px #c5a15d55", offset: .5 }, { transform: "scale(1)", boxShadow: "0 0 0 transparent" }], { duration: 225, easing: "ease-out" }) : Promise.resolve();
          const notice = document.createElement("span");
          notice.textContent = "Added to Bag \u2713";
          notice.style.cssText = `position:absolute;right:16px;top:${Math.min(innerHeight - 48, to.bottom + 10)}px;padding:8px 12px;border-radius:8px;background:#fffaf5;color:#454f20;font-family:inherit;box-shadow:0 2px 10px #24130918;pointer-events:none`;
          layer.append(notice);
          // Exit (200ms): dove rises independently after the parcel is gone.
          await Promise.all([
            afterDrop, cartBounce, badgePop,
            run(bird, [{ transform: "translate(0,0)", opacity: 1 }, { transform: "translate(18px,-100px)", opacity: 0 }], { duration: 200, easing: "ease-in" }),
            run(notice, [{ opacity: 0 }, { opacity: 1, offset: .25 }, { opacity: 0 }], { duration: 200 }),
          ]);
          if (!stopped) { cleanup(); open(); }
        } catch { if (!stopped) { cleanup(); open(); } }
      })();
    } catch { cleanup(); open(); }
  };
}
