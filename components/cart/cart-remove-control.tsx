"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

interface CartRemoveControlProps {
  productName: string;
  onRequestRemoval: (trigger: HTMLButtonElement) => void;
}

export function CartRemoveControl({ productName, onRequestRemoval }: CartRemoveControlProps) {
  const button = useRef<HTMLButtonElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const open = position !== null;

  function clearTimer() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }

  function hideTooltip() {
    clearTimer();
    setPosition(null);
  }

  function showTooltip() {
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    const trigger = button.current?.getBoundingClientRect();
    const hint = tooltip.current?.getBoundingClientRect();
    if (!trigger || !hint) return;
    const width = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const preferredTop = trigger.top - hint.height - 8;
    setPosition({
      left: Math.max(8, Math.min(trigger.right - hint.width, width - hint.width - 8)),
      top: Math.max(8, Math.min(
        preferredTop >= 8 ? preferredTop : trigger.bottom + 8,
        window.innerHeight - hint.height - 8,
      )),
    });
  }

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => setPosition(null);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [open]);

  return (
    <span className="cart-remove-control">
      <button
        ref={button}
        type="button"
        className="cart-remove"
        aria-label={`Remove ${productName} from your cart`}
        aria-describedby={tooltipId}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          clearTimer();
          timer.current = setTimeout(showTooltip, 250);
        }}
        onPointerLeave={hideTooltip}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) showTooltip();
        }}
        onBlur={hideTooltip}
        onKeyDown={(event) => { if (event.key === "Escape") hideTooltip(); }}
        onClick={(event) => {
          hideTooltip();
          onRequestRemoval(event.currentTarget);
        }}
      >
        <Icon name="trash" /><span className="cart-remove-label">Remove</span>
      </button>
      <span
        ref={tooltip}
        id={tooltipId}
        role="tooltip"
        className="cart-remove-tooltip"
        data-open={open}
        style={{ left: position?.left ?? 0, top: position?.top ?? 0 }}
      >
        Remove this item from your cart
      </span>
    </span>
  );
}
