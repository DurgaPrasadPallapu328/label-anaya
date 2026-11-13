"use client";

import { useEffect, useRef } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import "./whatsapp-contact.css";

export function WhatsAppContact() {
  const socialGroup = useRef<HTMLDivElement>(null);
  const href = getWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

  useEffect(() => {
    const group = socialGroup.current;
    if (!group) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let next: "whatsapp" | "instagram" = href ? "whatsapp" : "instagram";
    let active = false;
    let hovered = false;
    let paused = true;
    let remaining = 15000;
    let deadline = 0;

    const schedule = () => {
      if (paused || timer !== undefined) return;
      deadline = performance.now() + remaining;
      timer = setTimeout(() => {
        timer = undefined;
        if (active) {
          group.removeAttribute("data-mascot");
          next = next === "whatsapp" ? "instagram" : href ? "whatsapp" : "instagram";
          active = false;
          remaining = 15000;
        } else {
          group.setAttribute("data-mascot", next);
          active = true;
          remaining = 3000;
        }
        schedule();
      }, remaining);
    };
    const clearTimer = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };
    const sync = () => {
      const shouldPause = document.hidden || motion.matches || hovered
        || group.contains(document.activeElement)
        || Boolean(document.querySelector('dialog[open], [data-label-anaya-loader="fullscreen"]'));
      if (shouldPause === paused) return;
      if (shouldPause) {
        remaining = Math.max(0, deadline - performance.now());
        clearTimer();
      }
      paused = shouldPause;
      group.setAttribute("data-animation-paused", String(paused));
      schedule();
    };
    const reset = () => {
      clearTimer();
      if (active) next = next === "whatsapp" ? "instagram" : href ? "whatsapp" : "instagram";
      active = false;
      group.removeAttribute("data-mascot");
      remaining = 15000;
      schedule();
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = true; sync(); } };
    const leave = () => { hovered = false; sync(); };
    const blur = (event: FocusEvent) => { if (!group.contains(event.relatedTarget as Node | null)) queueMicrotask(sync); };
    const motionChange = () => { reset(); sync(); };
    // Observe overlay mounting/opening without changing modal or drawer components.
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "data-label-anaya-loader"] });
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", motionChange);
    group.addEventListener("pointerenter", enter);
    group.addEventListener("pointerleave", leave);
    group.addEventListener("focusin", sync);
    group.addEventListener("focusout", blur);
    group.addEventListener("click", reset);
    sync();
    return () => {
      clearTimer();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", motionChange);
      group.removeEventListener("pointerenter", enter);
      group.removeEventListener("pointerleave", leave);
      group.removeEventListener("focusin", sync);
      group.removeEventListener("focusout", blur);
      group.removeEventListener("click", reset);
    };
  }, [href]);

  return (
    <>
      <div className="whatsapp-contact-space" aria-hidden="true" />
      <div ref={socialGroup} className="floating-social-contact">
      <a className="floating-social-button instagram-contact" href="https://www.instagram.com/styledbyanaya._/" target="_blank" rel="noopener noreferrer" aria-label="Follow Styled by Anaya on Instagram" title="Follow us">
        <span className="social-mascot social-heart" aria-hidden="true"><HeartMascot /></span>
        <span className="social-greeting" aria-hidden="true">Follow us! {"\uD83D\uDC96"}</span>
        <svg className="social-original-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      {href && <a className="floating-social-button whatsapp-contact" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Label Anaya on WhatsApp" title="Chat with us">
        <span className="social-mascot social-robot" aria-hidden="true"><RobotMascot /></span>
        <span className="social-greeting" aria-hidden="true">Hi! {"\uD83D\uDC4B"} Need help?</span>
        <svg className="social-original-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12.04 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.96 11.96 0 0 0 5.84 1.49h.01c6.59 0 11.96-5.37 11.96-11.97 0-3.2-1.24-6.2-3.48-8.42ZM12.04 21.85a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.67.96.98-3.58-.24-.37a9.89 9.89 0 0 1-1.51-5.3c0-5.48 4.45-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.88 9.88 0 0 1 2.91 7.04c0 5.48-4.46 9.87-10.04 9.87Zm5.45-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>}
      </div>
    </>
  );
}

function RobotMascot() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 10V6" stroke="#fcf5ed" strokeWidth="2" /><circle cx="20" cy="5" r="2" fill="#fcf5ed" /><rect x="7" y="11" width="25" height="22" rx="8" fill="#fcf5ed" /><rect x="10" y="15" width="19" height="12" rx="5" fill="#d8f5df" /><circle cx="15" cy="20" r="2" fill="#285840" /><circle cx="24" cy="20" r="2" fill="#285840" /><path d="M16 28q4 4 8 0" stroke="#285840" strokeWidth="1.5" strokeLinecap="round" /><g className="social-wave"><path d="M32 24l4-7m0 0v-4m0 4 3-3" stroke="#fcf5ed" strokeWidth="2.5" strokeLinecap="round" /></g></svg>;
}
function HeartMascot() {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><g className="social-cheer"><path d="M20 33 7 21C-3 10 11 2 20 12 29 2 43 10 33 21Z" fill="#ffe4f1" /><circle cx="15" cy="19" r="1.8" fill="#6b2637" /><circle cx="25" cy="19" r="1.8" fill="#6b2637" /><path d="M16 25q4 4 8 0" stroke="#6b2637" strokeWidth="1.5" strokeLinecap="round" /></g><path d="m33 4 1 3 3 1-3 1-1 3-1-3-3-1 3-1ZM5 27l1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" fill="#fff5cc" /></svg>;
}
