/** Opens the shared drawer without introducing a second cart store. */
export function openCartDrawer(trigger?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent("label-anaya:open-cart", { detail: trigger ?? document.activeElement }));
}
