# Shopping cart

Route: `/cart`. The responsive layout follows `reference/Cart-mobile.png` and
`reference/Cart-desktop.png`. No product photographs or sample image files are included.

## Product image behavior

`CartProduct.imageUrl?: string | null` is optional. Missing, empty, invalid, or failed
images show the shopping bag icon and **Product Image Coming Soon**. The wrapper has
the same `17 / 20` aspect ratio for both states. Its grid width follows the photo slot
in the approved references (approximately 36% of the card width on mobile and 27%
on desktop, using content-grid ratios of 40:60 and 30:70). Loading, failure, and later
URL changes do not change that slot's size.

The image component accepts its URL through props; it contains no product paths.
HTTP(S) URLs and same-origin paths are accepted. Other protocols, protocol-relative
URLs, and URLs with embedded credentials fall back to the placeholder. `object-fit:
contain` preserves the full product image. A different URL resets a previous error
automatically. Retrying an unchanged failed URL currently requires a reload/remount.

Dynamic images use `next/image` with `unoptimized`, so an unknown future catalog CDN
does not require a wildcard image proxy configuration. Once the catalog's actual
image host is known, configure narrow `images.remotePatterns` and enable optimization.

## Data and presentation boundaries

- `lib/cart/domain.ts`: product/variant IDs, optional image and size, integer prices
  in paise, INR currency, quantity, availability, validation, and pure calculations.
- `lib/cart/storage.ts`: versioned local-storage serialization only.
- `lib/cart/store.ts`: client state, mutations, hydration, and cross-tab updates.
  `cartActions.addItem(product, quantity)` accepts catalog data;
  `cartActions.replaceItems(serverLines)` accepts a validated API cart snapshot.
- `components/cart/cart-view.tsx` and `cart-item-card.tsx`: presentation through props
  and callbacks; no catalog fetching or persistence access.
- `cart-client.tsx`: connects the store to the presentation. The shared header badge
  and mobile menu subscribe to the same cart.

Example backend line shape (values must come from the real catalog):

```ts
interface CartLine {
  id: string; // Preserve the backend's line ID when replacing the cart.
  product: {
    productId: string;
    variantId?: string | null;
    name: string;
    size?: string | null;
    unitPriceMinor: number; // Integer paise, not floating-point rupees.
    currency: "INR";
    imageUrl?: string | null;
    availability?: {
      status: "available" | "unavailable" | "unknown";
      maxQuantity?: number | null;
    };
  };
  quantity: number;
}
```

Local IDs distinguish product, variant, and selected size. Backend line IDs are
preserved by `replaceItems`. Unknown availability never claims confirmed stock.
Known unavailability disables quantity increases; changed stock limits are shown
without silently deleting the item. The local quantity cap is 99 and line cap is 100;
these are UI limits, not inventory guarantees. Invalid persisted records are ignored.
Storage failures leave the cart usable in memory and show a persistence notice.

## Development-only sample

Run `npm run dev`, open `/cart`, and click **Add demo item** in the development panel.
Nothing is added on page load, a query parameter, or a first visit.

- Product ID: `demo-sage-kurti`
- Name: `Sage A-Line Kurti Set`
- Variant ID: `null`; selected size: `S`
- Unit price: `169900` paise (₹1,699)
- Quantity per explicit click: `1`
- Image: `null`; availability: `unknown`

The fixture rejects production use, and the development controls are absent from
production rendering. Development uses `label-anaya:cart:development:v1` storage;
production uses `label-anaya:cart:v1`. A developer's sample therefore does not become
a production cart on the same origin. New visitors start with an empty cart.

## Responsive actions and removal confirmation

Below 1024px the remove button is an icon-only, 44 × 44px olive control with a product-
specific accessible name. At 1024px and wider it shows the same icon and **Remove**
label in one button. A desktop hover/focus tooltip describes the action, appears
after a 250ms mouse hover or immediately on keyboard focus, and is positioned within
the viewport. Escape, blur, pointer departure, scrolling, resizing, or clicking the
control dismisses it. Touch-only devices have no visible tooltip.

The initial click requests removal; it does not mutate storage. A native modal dialog
names the selected product and initially focuses **Cancel**. Cancel, Escape, and the
backdrop dismiss the dialog without changing the cart. Confirming **Remove** calls
the existing store action with the selected line ID, so another variant is retained.
The existing subtotal, estimated total, header badge, persistence, and empty state
update from the new snapshot. Native modal behavior blocks background interaction;
Tab and Shift+Tab wrap between the two buttons. Focus returns to the original control
on cancel, or a remaining control/cart heading when the original item was removed.
If another tab removes the pending line, the dialog closes without deleting a sibling.

Mobile action order after Order Summary is **Continue Shopping**, then **Proceed to
Checkout**. Desktop keeps Continue Shopping below the left product column and checkout
inside the right summary panel. The existing link component is reused in responsively
exclusive locations; only one link is visible and focusable per viewport. The checkout
coming-soon state and Continue Shopping destination are unchanged. The unavailable
checkout button uses `aria-disabled` and guards activation instead of leaving the
keyboard Tab order. Both mobile actions are reachable, and the checkout description
explains why payment is unavailable.

`cart-client.tsx` owns the pending line and focus restoration. The presentation passes
a removal request and trigger to the controller. `cart-removal-dialog.tsx` is native-
dialog UI, and `cart-remove-control.tsx` handles responsive labeling and the desktop
tooltip. These components do not read storage or implement another removal action.
See [the root README](../../README.md#shopping-cart--implementation-and-user-experience)
for the user experience overview and verification steps.

## Checkout and backend integration

Checkout is deliberately unavailable until a backend exists. No fake payment, order,
inventory verification, or successful checkout is implemented. Local prices and
availability are display snapshots and are never payment authority. Shipping is
shown as **At checkout**, rather than claiming a free-shipping policy; the displayed
total is a subtotal estimate that excludes shipping.

`lib/cart/checkout.ts` defines the future `CheckoutGateway` and `buildCheckoutRequest`.
The request contains only product IDs, variant IDs, and quantities. It does not send
locally stored prices, totals, stock claims, or image URLs as authoritative values.

To integrate the backend without changing the visual components:

1. Map the catalog/cart response into `CartLine` and update the store through
   `replaceItems`. Replace the browser persistence adapter with authenticated API
   reads and mutations when server carts become available.
2. Implement `CheckoutGateway.createSession` in the client integration layer against
   a real server endpoint. Keep credentials and payment secrets on the server.
3. On the server, authenticate/resolve the cart owner, validate product/variant IDs
   and quantities, read current prices and stock from the catalog, calculate shipping
   and applicable adjustments, and reserve/recheck stock atomically as required.
4. Return the authoritative quote or a conflict requiring the shopper to review
   changed prices/availability. Create a payment session only from validated server
   totals, then supply `CartView.onCheckout`, `checkoutPending`, and `checkoutMessage`
   through the cart controller. No visual redesign is required.
5. Revalidate again when completing the order/payment. Never trust browser storage,
   displayed totals, client availability, or a previously quoted price as payment
   authority. Avoid duplicate orders with server-side idempotency.

## Validation

Run `npm run test:cart`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
The pure tests use Node's built-in test runner and TypeScript stripping (Node 22.18+
or a newer release); no testing dependency is required. Browser checks should cover
empty and explicitly seeded carts, quantity/removal, reload and cross-tab persistence,
unavailable stock, failed/changed/missing images, production demo exclusion, and
320–1920px layouts. Physical-device testing remains separate from browser emulation.

Verified for this implementation: eight domain/checkout tests; lint, TypeScript,
and a production build; browser layouts at 320, 375, 390, 430, 768, 1024, 1440,
1672, and 1920px; null and failed images; URL replacement without resizing the slot;
quantity/totals/removal; reload and real cross-tab updates; corrupt/blocked storage;
and production empty-cart/development-control exclusion. The successful image-load
probe reused an existing brand asset temporarily in the isolated browser; no product
image file was generated, downloaded, or added.

Refinement verification: the same 8 domain tests, lint, TypeScript, and production
build passed. Chrome checks at 320, 375, 390, 430, 768, 1024, 1440, and 1920px verified
the mobile icon-only 44px control, desktop icon/text, one visible Continue Shopping
link, mobile action order, preserved desktop placement, and no horizontal overflow.
Cancel/Escape/backdrop left persisted snapshots unchanged; Tab/Shift+Tab trapping,
background inertness, selected-variant removal, totals/badge/persistence updates,
empty-state focus, and cross-tab pending-line cancellation passed. Tooltip hover
delay, keyboard focus, Escape/pointer-leave dismissal, top-edge flipping, and viewport
clamping passed. Production smoke checks at 375/1440px verified the dialog's accessible
name/description/modal state, confirmation, focus restoration, and keyboard-focusable
but non-activating checkout. Homepage, navigation, and search regressions also passed.
Real-device touch and VoiceOver/TalkBack testing remain manual follow-up checks.
