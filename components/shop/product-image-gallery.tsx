"use client";

import Image from "next/image";
import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ProductImage } from "@/lib/products";
import "./product-image-gallery.css";

export function ProductImageGallery({ images }: { images: readonly ProductImage[] }) {
  return <Gallery key={JSON.stringify(images)} images={images} />;
}

function Gallery({ images }: { images: readonly ProductImage[] }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<readonly string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const gallery = useRef<HTMLElement>(null);
  const titleId = useId();
  const mainId = useId();
  const image = images[selected];
  const source = (view: ProductImage) => failed.includes(view.src) ? "/images/product-placeholder.svg" : view.src;
  const markFailed = (src: string) => setFailed((previous) => previous.includes(src) ? previous : [...previous, src]);

  useLayoutEffect(() => {
    const element = gallery.current;
    if (!element) return;
    // Document coordinates keep the gallery steady while the page scrolls.
    // Measuring includes the real header, padding, and wrapped breadcrumb height.
    const update = () => element.style.setProperty("--gallery-top", `${Math.ceil(element.getBoundingClientRect().top + window.scrollY)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    const header = document.querySelector(".site-header");
    const breadcrumb = element.closest("main")?.querySelector('[aria-label="Breadcrumb"]');
    if (header) observer.observe(header);
    if (breadcrumb) observer.observe(breadcrumb);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  if (!image) return <p className="flex aspect-[4/5] items-center justify-center rounded-xl bg-peach text-muted">Product image unavailable</p>;

  function move(direction: number) {
    setSelected((current) => (current + direction + images.length) % images.length);
  }

  function thumbnailKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % images.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index - 1 + images.length) % images.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = images.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    thumbnails.current[next]?.focus({ preventScroll: true });
    thumbnails.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <section ref={gallery} aria-label="Product image gallery" className="product-gallery">
      <div className="product-gallery-layout">
        <div className="product-gallery-thumbnail-column">
        <div aria-label="Product image views" className="product-gallery-thumbnails">
          {images.map((view, index) => <button key={view.id} ref={(element) => { thumbnails.current[index] = element; }} type="button" aria-label={`Show ${view.label}`} aria-pressed={index === selected} aria-controls={mainId} onClick={() => setSelected(index)} onKeyDown={(event) => thumbnailKey(event, index)} className={`relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-peach lg:focus-visible:outline-offset-[-2px] ${index === selected ? "border-olive" : "border-transparent hover:border-olive/40"}`}><Image src={source(view)} alt={view.alt} onError={() => markFailed(view.src)} fill sizes="64px" className="object-contain" /></button>)}
        </div>
        </div>
        <button ref={trigger} id={mainId} type="button" aria-label={`Enlarge: ${image.alt}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()} className="product-gallery-main overflow-hidden rounded-xl bg-peach">
          {images.map((view, index) => <Image key={view.id} src={source(view)} alt={index === selected ? view.alt : ""} data-cart-flight-source={index === selected ? "true" : undefined} aria-hidden={index !== selected} onError={() => markFailed(view.src)} onLoad={({ currentTarget }) => { currentTarget.style.maxWidth = `${currentTarget.naturalWidth}px`; currentTarget.style.maxHeight = `${currentTarget.naturalHeight}px`; }} fill sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw" className={`product-gallery-image motion-safe:transition-opacity motion-safe:duration-200 ${index === selected ? "opacity-100" : "opacity-0"}`} />)}
        </button>
      </div>
      <dialog ref={dialog} aria-labelledby={titleId} className="fixed inset-0 m-auto h-[92dvh] max-h-[92dvh] w-[96vw] max-w-5xl rounded-xl bg-cream" onClose={() => trigger.current?.focus({ preventScroll: true })} onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="flex h-full flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3"><h2 id={titleId} className="text-xl text-olive">{image.label}</h2><button autoFocus type="button" className="min-h-11 rounded px-4 text-olive hover:bg-peach" onClick={() => dialog.current?.close()}>Close</button></div>
          <div className="relative my-4 min-h-0 flex-1"><Image src={source(image)} alt={image.alt} onError={() => markFailed(image.src)} fill sizes="(min-width: 1024px) 960px, 96vw" className="object-contain" /></div>
          {images.length > 1 && <div className="flex items-center justify-between gap-3 text-olive"><button type="button" className="min-h-11 rounded px-4 hover:bg-peach" onClick={() => move(-1)}>Previous</button><p aria-live="polite">{selected + 1} / {images.length}</p><button type="button" className="min-h-11 rounded px-4 hover:bg-peach" onClick={() => move(1)}>Next</button></div>}
        </div>
      </dialog>
    </section>
  );
}
