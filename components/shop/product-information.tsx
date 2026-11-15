"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import "./product-information.css";

type Topic = "details" | "care" | "fit" | "delivery";

function BenefitIcon({ kind }: { kind: "delivery" | "fit" | "support" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === "delivery" ? <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></> : kind === "fit" ? <><path d="m3 16 13-13 5 5L8 21zM13 6l2 2M10 9l2 2M7 12l2 2M4 15l2 2" /></> : <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-5a3 3 0 0 1-2-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3zM7 8h8M7 12h5" />}</svg>;
}

export function ProductBenefitsStrip({ onOpen, controls }: { onOpen: (topic: Topic) => void; controls: Record<Topic, string> }) {
  const supportUrl = getWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  const support = <><BenefitIcon kind="support" /><span><span className="product-benefit-label">Need Assistance?</span><span className="product-benefit-copy">{supportUrl ? "We're here to help" : "Support details will be updated soon"}</span></span></>;
  return <div className="product-benefits" role="group" aria-label="Shopping information">
    <button type="button" aria-controls={controls.delivery} onClick={() => onOpen("delivery")}><BenefitIcon kind="delivery" /><span><span className="product-benefit-label">Delivery Information</span><span className="product-benefit-copy">View delivery details</span></span></button>
    <button type="button" aria-controls={controls.fit} onClick={() => onOpen("fit")}><BenefitIcon kind="fit" /><span><span className="product-benefit-label">Find Your Fit</span><span className="product-benefit-copy">Explore our size guide</span></span></button>
    {supportUrl ? <a href={supportUrl} target="_blank" rel="noopener noreferrer">{support}</a> : <div className="product-benefit-unavailable">{support}</div>}
  </div>;
}

export function ProductInformationAccordion({ product, categoryName }: { product: Product; categoryName?: string }) {
  const prefix = useId();
  const [expanded, setExpanded] = useState<ReadonlySet<Topic>>(new Set());
  const headings = useRef<Partial<Record<Topic, HTMLButtonElement | null>>>({});
  const controls: Record<Topic, string> = { details: `${prefix}-details`, care: `${prefix}-care`, fit: `${prefix}-fit`, delivery: `${prefix}-delivery` };
  const sizes = product.sizes?.filter(option => option.enabled && option.maxQuantity !== 0).map(option => option.size);
  const items: { key: Topic; title: string; content: ReactNode }[] = [
    { key: "details", title: "Product Details", content: <dl className="product-information-facts"><div><dt>Product</dt><dd>{product.name}</dd></div>{categoryName && <div><dt>Collection</dt><dd>{categoryName}</dd></div>}</dl> },
    { key: "care", title: "Fabric & Care", content: <p>Fabric and care details will be updated soon.</p> },
    { key: "fit", title: "Size & Fit", content: <>{!!sizes?.length && <p>Available sizes: {sizes.join(", ")}.</p>}<p>Verified measurements and fit details will be updated soon.</p></> },
    { key: "delivery", title: "Delivery Information", content: <p>Delivery details will be confirmed during checkout.</p> },
  ];
  function open(topic: Topic) {
    setExpanded(previous => new Set([...previous, topic]));
    requestAnimationFrame(() => {
      const heading = headings.current[topic];
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    });
  }
  return <div className="product-supplement">
    <ProductBenefitsStrip onOpen={open} controls={controls} />
    <section className="product-information" aria-labelledby={`${prefix}-heading`}>
      <h2 id={`${prefix}-heading`} className="product-section-heading">Product Information</h2>
      <div className="product-information-items">{items.map(item => {
        const isOpen = expanded.has(item.key);
        return <div key={item.key} className="product-information-item">
          <h3><button ref={element => { headings.current[item.key] = element; }} id={`${controls[item.key]}-trigger`} type="button" aria-expanded={isOpen} aria-controls={controls[item.key]} onClick={() => setExpanded(previous => { const next = new Set(previous); if (next.has(item.key)) next.delete(item.key); else next.add(item.key); return next; })}>{item.title}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></button></h3>
          <div id={controls[item.key]} role="region" aria-labelledby={`${controls[item.key]}-trigger`} aria-hidden={!isOpen} inert={!isOpen} className="product-information-panel" data-open={isOpen}><div><div className="product-information-content">{item.content}</div></div></div>
        </div>;
      })}</div>
    </section>
  </div>;
}
