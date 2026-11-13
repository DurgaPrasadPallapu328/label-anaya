"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { categories } from "@/lib/categories";

export function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsPane = useRef<HTMLDivElement>(null);
  const resultLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = query.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  const results = categories.filter((category) =>
    category.name.toLocaleLowerCase().replace(/[^a-z0-9]/g, "").includes(normalizedQuery),
  );

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
        aria-label="Search collections"
        aria-haspopup="dialog"
        aria-controls="collection-search-dialog"
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
        id="collection-search-dialog"
        aria-labelledby="search-title"
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
              <h2 id="search-title" className="text-2xl sm:text-3xl">Find your collection</h2>
              <button
                type="button"
                className="icon-button shrink-0"
                aria-label="Close search"
                onClick={() => dialog.current?.close()}
              >
                <Icon name="close" />
              </button>
            </div>
            <label htmlFor="collection-search" className="mb-2 block text-lg">
              Search by category
            </label>
            <input
              ref={input}
              id="collection-search"
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
              aria-controls="search-results"
              aria-describedby="search-help"
              aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            />
            <p id="search-help" className="search-help text-muted">
              Category search only. Product search coming soon.
            </p>
          </header>
          <div ref={resultsPane} className="search-results-pane">
            <p className="search-status text-sm text-muted" role="status" aria-live="polite" aria-atomic="true">
              {normalizedQuery
                ? `${results.length} matching ${results.length === 1 ? "category" : "categories"}`
                : "Explore our five categories"}
            </p>
            <ul id="search-results" role="listbox" aria-label="Matching categories" className="flex flex-col gap-1">
              {results.map((category, index) => (
                <li key={category.href} role="presentation">
                  <Link
                    ref={(element) => { resultLinks.current[index] = element; }}
                    id={`search-result-${index}`}
                    href={category.href}
                    role="option"
                    aria-selected={activeIndex === index}
                    tabIndex={-1}
                    className="search-option dropdown-link flex items-center justify-between"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => dialog.current?.close()}
                  >
                    {category.name} <Icon name="arrow" className="size-5" />
                  </Link>
                </li>
              ))}
            </ul>
            {results.length === 0 && (
              <p className="search-empty text-lg">No categories found. Try “Kurtis”, “Dresses”, or “Wear”.</p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
