"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { ProductImage } from "@/lib/products";

export function ProductImageGallery({ images }: { images: readonly ProductImage[] }) {
  return <Gallery key={JSON.stringify(images)} images={images} />;
}

function Gallery({ images }: { images: readonly ProductImage[] }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<readonly string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const titleId = useId();
  const mainId = useId();
  const image = images[selected];
  const source = (view: ProductImage) => failed.includes(view.src) ? "/images/product-placeholder.svg" : view.src;
  const markFailed = (src: string) => setFailed((previous) => previous.includes(src) ? previous : [...previous, src]);

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
    <section aria-label="Product image gallery" className="min-w-0">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row">
        <div className="relative order-2 min-w-0 shrink-0 lg:order-1 lg:w-20 lg:self-stretch">
        <div aria-label="Product image views" className="flex min-w-0 gap-3 overflow-x-auto p-1 lg:absolute lg:inset-0 lg:flex-col lg:items-center lg:justify-between lg:overflow-x-hidden lg:overflow-y-auto lg:p-0">
          {images.map((view, index) => <button key={view.id} ref={(element) => { thumbnails.current[index] = element; }} type="button" aria-label={`Show ${view.label}`} aria-pressed={index === selected} aria-controls={mainId} onClick={() => setSelected(index)} onKeyDown={(event) => thumbnailKey(event, index)} className={`relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-peach lg:aspect-[2/3] lg:h-[min(6rem,calc((100%_-_3rem)/5))] lg:w-auto lg:focus-visible:outline-offset-[-2px] ${index === selected ? "border-olive" : "border-transparent hover:border-olive/40"}`}><Image src={source(view)} alt={view.alt} onError={() => markFailed(view.src)} fill sizes="64px" className="object-contain" /></button>)}
        </div>
        </div>
        <button ref={trigger} id={mainId} type="button" aria-label={`Enlarge: ${image.alt}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()} className="relative order-1 aspect-[4/5] w-full min-w-0 overflow-hidden rounded-xl bg-peach lg:order-2 lg:flex-1">
          {images.map((view, index) => <Image key={view.id} src={source(view)} alt={index === selected ? view.alt : ""} aria-hidden={index !== selected} onError={() => markFailed(view.src)} fill sizes="(min-width: 1024px) 45vw, 100vw" className={`object-contain motion-safe:transition-opacity motion-safe:duration-200 ${index === selected ? "opacity-100" : "opacity-0"}`} />)}
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
