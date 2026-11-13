"use client";

import Image from "next/image";
import { products } from "@/lib/products";
import { formatCartMoney } from "@/lib/cart/domain";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { categories } from "@/lib/categories";

export function SearchDialog() {
  const instanceId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsPane = useRef<HTMLDivElement>(null);
  const resultLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = query.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  const matches = (name: string) => name.toLocaleLowerCase().replace(/[^a-z0-9]/g, "").includes(normalizedQuery);
  const categoryResults = categories.filter((category) => matches(category.name)).map((category) => ({
    key: "category-" + category.id, name: category.name, href: "/shop/" + category.slug, group: "Categories", image: null as string | null, price: null as number | null,
  }));
  const productResults = products.filter((product) => matches(product.name)).map((product) => ({
    key: "product-" + product.id, name: product.name, href: "/products/" + product.slug, group: "Products", image: product.image || "/images/product-placeholder.svg", price: product.price,
  }));
  const results = [...new Map([...categoryResults, ...productResults].map((result) => [result.key, result])).values()];


  useEffect(() => {
    if (!open) return;

    const panel = dialog.current;
    const viewport = window.visualViewport;
    const updateViewport = () => {
      panel?.style.setProperty("--search-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
      panel?.style.setProperty("--search-viewport-top", `${viewport?.offsetTop ?? 0}px`);
    };

    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      panel?.style.removeProperty("--search-viewport-height");
      panel?.style.removeProperty("--search-viewport-top");
    };
  }, [open]);

  function highlightResult(index: number) {
    setActiveIndex(index);
    const pane = resultsPane.current;
    const option = resultLinks.current[index];
    if (!pane || !option) return;

    // Scroll only the results pane; scrolling an ancestor could move the input.
    const paneBounds = pane.getBoundingClientRect();
    const optionBounds = option.getBoundingClientRect();
    if (optionBounds.top < paneBounds.top) {
      pane.scrollTop += optionBounds.top - paneBounds.top;
    } else if (optionBounds.bottom > paneBounds.bottom) {
      pane.scrollTop += optionBounds.bottom - paneBounds.bottom;
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || results.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex = event.key === "ArrowDown"
        ? (activeIndex + 1) % results.length
        : (activeIndex < 0 ? results.length - 1 : (activeIndex - 1 + results.length) % results.length);
      highlightResult(nextIndex);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      resultLinks.current[activeIndex]?.click();
    }
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="icon-button"
        aria-label="Search products and categories"
        aria-haspopup="dialog"
        aria-controls={`${instanceId}-collection-search-dialog`}
        aria-expanded={open}
        onClick={() => {
          setQuery("");
          setActiveIndex(-1);
          dialog.current?.showModal();
          setOpen(true);
          input.current?.focus({ preventScroll: true });
          if (resultsPane.current) resultsPane.current.scrollTop = 0;
        }}
      >
        <Icon name="search" />
      </button>
      <dialog
        ref={dialog}
        id={`${instanceId}-collection-search-dialog`}
        aria-labelledby={`${instanceId}-search-title`}
        className="search-dialog rounded-xl bg-cream"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onKeyDown={(event) => {
          // Search inputs can consume Escape to clear their value first.
          if (event.key === "Escape" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            dialog.current?.close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="search-content">
          <header className="search-header">
            <div className="search-heading flex items-center justify-between gap-3">
              <h2 id={`${instanceId}-search-title`} className="text-2xl sm:text-3xl">Find your collection</h2>
              <button
                type="button"
                className="icon-button shrink-0"
                aria-label="Close search"
                onClick={() => dialog.current?.close()}
              >
                <Icon name="close" />
              </button>
            </div>
            <label htmlFor={`${instanceId}-collection-search`} className="mb-2 block text-lg">
              Search products &amp; categories
            </label>
            <input
              ref={input}
              id={`${instanceId}-collection-search`}
              type="search"
              role="combobox"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(-1);
                if (resultsPane.current) resultsPane.current.scrollTop = 0;
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Try Kurtis or Dresses"
              className="search-input w-full rounded-md border border-olive/50 bg-white/50 px-4"
              autoComplete="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={results.length > 0}
              aria-controls={`${instanceId}-search-results`}
              aria-describedby={`${instanceId}-search-help`}
              aria-activedescendant={activeIndex >= 0 ? `${instanceId}-result-${activeIndex}` : undefined}
            />
            <p id={`${instanceId}-search-help`} className="search-help text-muted">
              Use the arrow keys to explore suggestions and Enter to select.
            </p>
          </header>
          <div ref={resultsPane} className="search-results-pane">
            <p className="search-status text-sm text-muted" role="status" aria-live="polite" aria-atomic="true">
              {normalizedQuery
                ? `${results.length} matching results`
                : "Explore products and categories"}
            </p>
            <div id={`${instanceId}-search-results`} role="listbox" aria-label="Matching products and categories" className="flex flex-col gap-4">
              {["Categories", "Products"].map((group) => (
                results.some((result) => result.group === group) && <div key={group} role="group" aria-labelledby={`${instanceId}-${group}`}>
                  <h3 id={`${instanceId}-${group}`} className="mb-2 text-lg font-bold text-olive">{group}</h3>
                  {results.map((result, index) => result.group === group && (
                    <Link key={result.key} ref={(element) => { resultLinks.current[index] = element; }} id={`${instanceId}-result-${index}`} href={result.href} role="option" aria-selected={activeIndex === index} tabIndex={-1} className="search-option dropdown-link flex items-center gap-3" onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => dialog.current?.close()}>
                      {result.image && <SearchThumbnail src={result.image} name={result.name} />}
                      <span className="min-w-0 flex-1 break-words">{result.name}{result.price !== null && <span className="mt-1 block text-base font-bold text-olive">{formatCartMoney(result.price * 100)}</span>}</span>
                      <Icon name="arrow" className="size-5 shrink-0" />
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {results.length === 0 && <p className="search-empty text-lg">No matching products found. Try another name or category.</p>}
          </div>
        </div>
      </dialog>
    </>
  );
}

function SearchThumbnail({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  return <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-md bg-peach"><Image src={failed ? "/images/product-placeholder.svg" : src} alt={name} fill sizes="48px" className="object-contain" onError={() => setFailed(true)} /></span>;
}
