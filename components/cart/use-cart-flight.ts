"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { doveArtwork } from "@/lib/cart/dove";
import { openCartDrawer } from "@/lib/cart/drawer";

export const CART_FLIGHT_DURATION = 2000;
let cancelActive: (() => void) | undefined;

function visible(element: HTMLElement, fullyVisible = false, top = 0) {
  const r = element.getBoundingClientRect(), style = getComputedStyle(element);
  return r.width > 0 && r.height > 0 && r.bottom > top && r.right > 0
    && r.top < innerHeight && r.left < innerWidth
    && (!fullyVisible || (r.top >= top && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth))
    && style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
}

/** Decorative delivery only. Cart state and the accessible status update in ProductPurchase. */
export function useCartFlight() {
  const pathname = usePathname();
  const cancel = useRef<(() => void) | undefined>(undefined);
  useEffect(() => () => cancel.current?.(), [pathname]);

  return function fly(source: HTMLImageElement | null, trigger: HTMLElement | null, releaseBadge: () => void = () => {}): void {
    cancelActive?.();
    const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-flight-target]"))
      .find((element) => visible(element, true));
    const drawerOpen = () => Boolean(document.querySelector(".cart-drawer-panel[open]"));
    let badgeReleased = false;
    const revealBadge = () => { if (!badgeReleased) { badgeReleased = true; releaseBadge(); } };
    const open = () => { revealBadge(); if (!drawerOpen()) openCartDrawer(trigger); };
    if (drawerOpen()) { revealBadge(); return; }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    // A mobile purchase button can be visible while the selected image is above the viewport.
    // Use that real button as the launch point, without scrolling the customer's page.
    const origin = source && visible(source, false, headerBottom) ? source
      : trigger && visible(trigger, false, headerBottom) ? trigger : null;
    if (!source?.complete || !source.naturalWidth || !target || !origin || motion.matches || !target.animate) {
      open(); return;
    }

    const animations: Animation[] = [];
    const layer = document.createElement("div");
    let stopped = false, delivered = false;
    let drawerTimer: ReturnType<typeof setTimeout> | undefined;
    let trackingMotion: Animation | undefined;
    let flight: Animation;
    const tracking = document.createElement("div");
    // The SVG center is the visual destination, independent of badge or touch-target size.
    const targetBounds = () => (target.querySelector("svg") ?? target).getBoundingClientRect();
    const to = targetBounds();
    const end = { x: to.left + to.width / 2, y: to.top + to.height / 2 };
    let lastEnd = end;
    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      if (drawerTimer !== undefined) clearTimeout(drawerTimer);
      revealBadge();
      animations.forEach((animation) => animation.cancel());
      layer.remove();
      window.removeEventListener("scroll", retarget, true);
      window.removeEventListener("resize", retarget);
      window.visualViewport?.removeEventListener("resize", retarget);
      document.removeEventListener("visibilitychange", onHidden);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("label-anaya:open-cart", cleanup);
      observer.disconnect();
      if (cancelActive === cleanup) cancelActive = undefined;
      if (cancel.current === cleanup) cancel.current = undefined;
    };
    const run = (element: HTMLElement | SVGElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, { fill: "forwards", ...options });
      animations.push(animation);
      void animation.finished.catch(() => {});
      return animation;
    };
    const retarget = () => {
      if (stopped || delivered) return;
      if (!target.isConnected || !visible(target, true)) { cleanup(); return; }
      const bounds = targetBounds();
      const next = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      if (Math.abs(next.x - lastEnd.x) < .1 && Math.abs(next.y - lastEnd.y) < .1) return;
      const elapsed = typeof flight.currentTime === "number" ? flight.currentTime : 0;
      const remaining = Math.max(0, CART_FLIGHT_DURATION - elapsed);
      const current = getComputedStyle(tracking).transform;
      trackingMotion?.cancel();
      // Correct only the endpoint drift, continuously from the current position, on the
      // original flight clock. Unchanged sticky targets require no animation/layout work.
      trackingMotion = run(tracking, [{ transform: current === "none" ? "translate(0,0)" : current },
        { transform: `translate(${next.x - end.x}px,${next.y - end.y}px)` }],
      { duration: remaining, easing: "ease-in-out" });
      if (typeof flight.startTime === "number") trackingMotion.startTime = flight.startTime + elapsed;
      lastEnd = next;
    };
    const onHidden = () => { if (document.hidden) cleanup(); };
    const onMotionChange = () => { if (motion.matches) { cleanup(); open(); } };
    const observer = new MutationObserver(() => {
      if (!target.isConnected || document.querySelector("dialog[open]")) cleanup();
    });
    cancel.current = cleanup;
    cancelActive = cleanup;

    try {
      const from = origin.getBoundingClientRect();
      const ratio = source.naturalHeight / source.naturalWidth;
      const width = Math.min(innerWidth < 640 ? 52 : 72, from.width, innerHeight * .3 / ratio);
      const height = width * ratio;
      const start = {
        x: (Math.max(0, from.left) + Math.min(innerWidth, from.right)) / 2,
        y: (Math.max(headerBottom, from.top) + Math.min(innerHeight, from.bottom)) / 2,
      };
      const birdWidth = innerWidth < 640 ? 106 : 136, birdHeight = birdWidth * .7;
      const parcelWidth = 34, parcelHeight = 40;
      const anchor = { x: birdWidth * .55, y: birdHeight * .8 + parcelHeight / 2 };
      const arrivalScale = Math.min(.42, Math.max(.12, (end.y - 4) / anchor.y));
      const control = { x: start.x + (end.x - start.x) * .3,
        y: Math.max(anchor.y * arrivalScale + 4, Math.min(start.y, end.y) - 100) };
      const transform = (x: number, y: number, scale: number) => `translate(${x - anchor.x * scale}px,${y - anchor.y * scale}px) scale(${scale})`;
      const frames: Keyframe[] = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60, p = t * t * (3 - 2 * t);
        const x = (1 - p) ** 2 * start.x + 2 * (1 - p) * p * control.x + p ** 2 * end.x;
        const y = (1 - p) ** 2 * start.y + 2 * (1 - p) * p * control.y + p ** 2 * end.y;
        frames.push({ transform: transform(x, y, 1 - (1 - arrivalScale) * p), offset: t });
      }
      layer.className = "cart-flight-layer";
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText = "position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden;contain:strict";
      tracking.style.cssText = "position:absolute;inset:0;pointer-events:none";
      const carrier = document.createElement("div");
      carrier.className = "cart-flight-carrier";
      carrier.style.cssText = `position:absolute;left:0;top:0;width:${birdWidth}px;height:${birdHeight + parcelHeight}px;transform-origin:0 0;transform:${transform(start.x, start.y, 1)};pointer-events:none;will-change:transform`;
      const bird = document.createElement("div");
      bird.className = "cart-flight-dove";
      bird.innerHTML = doveArtwork;
      bird.style.cssText = `position:absolute;inset:0 auto auto 0;width:${birdWidth}px;height:${birdHeight}px;color:var(--cart-bird-color,#800020);filter:drop-shadow(0 2px 3px #57001644);pointer-events:none`;
      const parcel = document.createElement("div");
      parcel.className = "cart-flight-parcel";
      parcel.style.cssText = `position:absolute;left:${anchor.x - parcelWidth / 2}px;top:${anchor.y - parcelHeight / 2}px;width:${parcelWidth}px;height:${parcelHeight}px;border-radius:4px;pointer-events:none;transform-origin:center`;
      const handle = document.createElement("span");
      handle.style.cssText = "position:absolute;left:10px;top:-7px;width:14px;height:10px;border:1.5px solid #c5a15d;border-bottom:0;border-radius:8px 8px 0 0;opacity:0;pointer-events:none";
      const image = document.createElement("img");
      image.src = source.currentSrc || source.src;
      image.alt = "";
      image.style.cssText = `position:absolute;left:50%;top:50%;width:${width}px;height:${height}px;object-fit:contain;transform:translate(-50%,-50%);border-radius:3px;pointer-events:none`;
      parcel.append(handle, image);
      carrier.append(bird, parcel);
      tracking.append(carrier);
      layer.append(tracking);
      document.body.append(layer);

      // One immediate 2000ms movement: pickup and wing motion run alongside it.
      flight = run(carrier, frames, { duration: CART_FLIGHT_DURATION, easing: "linear" });
      const thumbnailScale = Math.min((parcelWidth - 10) / width, (parcelHeight - 12) / height);
      run(image, [{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(-50%,-50%) scale(${thumbnailScale})` }], { duration: 300, easing: "ease-in-out" });
      run(parcel, [{ backgroundColor: "transparent" }, { backgroundColor: "#6b2637" }], { duration: 300 });
      run(handle, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      bird.querySelectorAll<SVGElement>(".dove-wing").forEach((wing, index) => {
        run(wing, [{ transform: "rotate(0deg) scaleY(1)" }, { transform: `rotate(${index ? -9 : 7}deg) scaleY(.82)`, offset: .5 }, { transform: "rotate(0deg) scaleY(1)" }], { duration: 500, iterations: 4, easing: "ease-in-out" });
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
      window.addEventListener("scroll", retarget, true);
      window.addEventListener("resize", retarget);
      window.visualViewport?.addEventListener("resize", retarget);
      document.addEventListener("visibilitychange", onHidden);
      motion.addEventListener("change", onMotionChange);
      window.addEventListener("label-anaya:open-cart", cleanup);

      void flight.finished.then(() => {
        if (stopped) return;
        delivered = true;
        layer.remove();
        revealBadge();
        const badge = target.querySelector<HTMLElement>("[data-cart-badge]");
        run(target, [{ transform: "scale(1)" }, { transform: "scale(1.12)", offset: .5 }, { transform: "scale(1)" }], { duration: 200, easing: "ease-in-out" });
        if (badge) run(badge, [{ transform: "scale(1)" }, { transform: "scale(1.25)", offset: .5 }, { transform: "scale(1)" }], { duration: 225, easing: "ease-out" });
        // Retain the existing post-delivery pause before showing the shared bag.
        drawerTimer = setTimeout(() => { cleanup(); if (!document.querySelector("dialog[open]")) open(); }, 1000);
      }).catch(() => { if (!stopped) { cleanup(); open(); } });
    } catch { cleanup(); open(); }
  };
}
