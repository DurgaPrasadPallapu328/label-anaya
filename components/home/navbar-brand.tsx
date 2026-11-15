"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, type Ref } from "react";
import "./navbar-brand.css";

// Keep the 30-second cadence across client-side header remounts.
let nextRevealAt = 0;

export function NavbarBrand() {
  const brand = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = brand.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout>;
    const scheduleReveal = () => {
      if (Date.now() >= nextRevealAt) {
        element.removeAttribute("data-reveal");
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          // Reset only this wordmark's completed CSS animations.
          void element.offsetWidth;
          element.setAttribute("data-reveal", "true");
        }
        nextRevealAt = Date.now() + 30_000;
      }
      timer = setTimeout(scheduleReveal, Math.max(0, nextRevealAt - Date.now()));
    };
    scheduleReveal();
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link href="/" className="brand flex items-center" aria-label="Label Anaya — Home">
      <BrandMark brandRef={brand} />
    </Link>
  );
}

/** The same artwork and reveal are shared by the navbar and loading screens. */
export function BrandMark({ brandRef, animated = false, compactReveal = false,
  imageSizes = "(min-width: 1024px) 50px, (min-width: 640px) 41px, 34px",
}: {
  brandRef?: Ref<HTMLSpanElement>;
  animated?: boolean;
  compactReveal?: boolean;
  imageSizes?: string;
}) {
  const goldId = useId();

  return (
      <span ref={brandRef} data-navbar-brand="" data-reveal={animated ? "true" : undefined}
        data-compact-reveal={compactReveal ? "" : undefined} aria-hidden="true" style={{
        position: "relative", display: "inline-flex", alignItems: "center", gap: 0, paddingLeft: 3, boxSizing: "border-box",
        width: "var(--anaya-brand-width, 105px)", height: "var(--anaya-brand-height, 42px)",
        maxWidth: "100%", flexShrink: 0, overflow: "hidden", isolation: "isolate",
      }}>
        <span className="anaya-navbar-monogram" style={{
          display: "block", flexShrink: 0,
          width: "calc(var(--anaya-logo-height, 35px) * 1221 / 1288)",
          height: "var(--anaya-logo-height, 35px)",
        }}>
          <span className="anaya-navbar-artwork">
            <Image src="/images/anaya-golden-monogram.png" alt="" width={1221} height={1288}
              sizes={imageSizes}
              style={{ display: "block", width: "100%", height: "100%", maxWidth: "100%", objectFit: "contain" }} />
          </span>
        </span>
        <span className="anaya-navbar-word">
          {Array.from("naya", (letter, index) => (
            <span key={index} className="anaya-navbar-letter" style={{ animationDelay: compactReveal
              ? `${0.16 + index * 0.07}s, ${0.65 + index * 0.08}s`
              : `${1.2 + index * 0.2}s, ${2.15 + index * 0.12}s` }}>{letter}</span>
          ))}
        </span>
        <svg className="anaya-navbar-ribbon" width="100%" height="100%" viewBox="0 0 105 42"
          preserveAspectRatio="xMinYMid meet" fill="none" aria-hidden="true" focusable="false"
          style={{ position: "absolute", inset: 0, maxWidth: "100%", maxHeight: "100%", overflow: "hidden", pointerEvents: "none" }}>
          <defs>
            <linearGradient id={goldId} x1="3" y1="5" x2="35" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#99702f" /><stop offset=".28" stopColor="#e5c687" />
              <stop offset=".48" stopColor="#fff2cb" /><stop offset=".65" stopColor="#c49a51" />
              <stop offset="1" stopColor="#f3dca8" />
            </linearGradient>
          </defs>
          <path className="anaya-navbar-silk" pathLength="100"
            d="M 2 31 C 8 31 9 19 14 10 C 23 -1 36 8 34 22 C 32 37 13 42 7 30 C 1 18 12 6 23 12 C 29 15 30 22 26 27"
            stroke={`url(#${goldId})`} strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className="anaya-navbar-glint" />
        <span className="anaya-navbar-sparkle anaya-navbar-sparkle-one" />
        <span className="anaya-navbar-sparkle anaya-navbar-sparkle-two" />
        <span className="anaya-navbar-sparkle anaya-navbar-sparkle-three" />
      </span>
  );
}
