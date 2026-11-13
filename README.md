This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Shopping Cart — Implementation and User Experience

The cart is available at `/cart`. Run `npm run dev` and use **Add demo item** on the
cart page to preview the development-only Sage A-Line Kurti Set. New carts are empty;
production has no demo controls and does not read development cart storage.

### Responsive controls and action placement

- Below 1024px, the remove control is an olive trash icon with a 44 × 44px touch
  target. The visible **Remove** label is hidden; the accessible name includes the
  product name.
- At 1024px and wider, the same button shows the icon and **Remove** label together.
  Both activate the same removal-confirmation flow.
- Mobile actions follow the summary in this order: **Continue Shopping**, then
  **Proceed to Checkout**. Only one Continue Shopping link is visible and focusable
  at each breakpoint. The shared link component is reused in responsive locations.
- Desktop keeps its two-column layout: Continue Shopping below the product cards
  on the left, with checkout inside the Order Summary panel on the right.
- Continue Shopping links to the existing homepage category section. Checkout
  keeps its coming-soon behavior until the backend is available. It is focusable
  with `aria-disabled="true"`, so keyboard users can read the explanation; clicking
  it or pressing Enter/Space does not start checkout.

### Removing an item

Clicking the remove control opens a small native modal dialog titled **Remove from
cart?**. Its message names the selected product. Nothing is deleted on the first click.

**Cancel**, Escape, or clicking the backdrop closes the dialog without changing the
cart, quantity, totals, badge, or persistence. **Remove** deletes only the selected
cart line/variant through the existing store action, updates the subtotal and badge,
and persists the change. Removing the last item shows the empty-cart state.

The dialog initially focuses Cancel, contains Tab/Shift+Tab focus, blocks background
interaction, and has an accessible title and description. Cancel returns focus to
the original remove control. After deletion, focus moves to a remaining remove
control or the cart heading if the bag is empty.

### Desktop tooltip

On desktop devices with a fine pointer and hover support, hovering the remove button
for 250ms displays **Remove this item from your cart**. Keyboard focus exposes the
same tooltip immediately, and `aria-describedby` supplies its description. Escape,
blur, leaving the hover target, scrolling, resizing, or opening confirmation dismisses
it. Its position is clamped to the viewport and flips below the button near the top
edge. Touch-only devices do not show a visual tooltip.

### Cart data, images, and backend integration

Quantity controls update integer-paise subtotals and the shared header/mobile-menu
badge. Versioned localStorage preserves the bag across reloads and synchronizes tabs;
blocked storage falls back to the current tab with a notice. Availability limits,
empty-state behavior, and persistence validation remain in the data layer.

Product image URLs are optional/nullable. Missing, invalid, or failed images display
the shopping bag icon and **Product Image Coming Soon** in the same reserved image
slot. A new valid URL loads automatically without resizing that slot. No product
image files are bundled with the demo.

Product/variant IDs, prices, image URLs, and availability can come from a future API
without changing the cart presentation. Checkout is disabled until a backend can
verify current prices, shipping, and availability. Locally stored prices and stock
claims must never authorize payment. Shipping is shown as **At checkout**; the current
total excludes shipping. See [the cart integration guide](docs/pages/cart.md) for
data shapes, storage boundaries, and the checkout gateway contract.

### Verification

Available checks:

```bash
npm run test:cart
npm run lint
npx tsc --noEmit
npm run build
```

The cart tests use Node's built-in test runner and TypeScript stripping (Node 22.18+).
For manual verification, add the demo item and check icon-only removal and action
order at 320, 375, and 390px; then check the icon/text button, tooltip, and two-column
placement at 1024px and wider. Cancel must leave the stored snapshot unchanged.
Confirm removal with two variants to verify that only the chosen line is deleted,
then remove the last item to check the empty state and focus fallback. Also check
quantity changes, subtotal/badge updates, reload persistence, and homepage/search.

Verified for these refinements:

- `npm run test:cart`: all 8 domain/checkout tests passed.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build`: passed.
- Chrome checks at 320, 375, 390, 430, 768, 1024, 1440, and 1920px passed: responsive
  remove labels/44px mobile targets, one visible Continue Shopping link, mobile action
  order, unchanged desktop placement, image placeholders, and no horizontal overflow.
- Dialog checks passed for Cancel/Escape/backdrop without storage mutation, initial
  Cancel focus, Tab/Shift+Tab trapping, blocked background focus, exact-variant removal,
  focus restoration, totals/badge updates, persistence, and the last-item empty state.
- Tooltip checks passed for delayed hover, keyboard focus, Escape/pointer-leave
  dismissal, viewport clamping/top-edge flipping, and hiding during confirmation.
- Quantity, reload persistence, cross-tab pending-line cancellation, Continue Shopping,
  homepage/navigation/search regressions, and production smoke tests passed. Both mobile
  actions were keyboard-reachable; Enter/Space did not activate unavailable checkout.
  Chrome's accessibility tree exposed the dialog title, description, and modal state.

Known limitations: real catalog, authenticated server-cart persistence, shipping,
inventory verification, payment, and checkout remain pending backend integration.
Physical-device touch and assistive-technology checks should complement browser
automation; automated browser checks do not certify screen-reader behavior.

## Product details and demo Buy Now

`app/products/[slug]/page.tsx` resolves URL parameters inside Suspense and composes
breadcrumbs, ProductImageGallery, the existing price formatter, and ProductPurchase.
All 40 catalog products use it; the proxy rejects unknown slugs with HTTP 404.

ProductImageGallery accepts `ProductImage[]` with unique id, src, alt, and label.
The five demo SVG slots are explicitly labelled samples, not garment photographs.
Replace each src with an existing photograph of the same product and update alt/label
for front, back, side, neckline, sleeve/embroidery, fabric, or dupatta details.
Legacy products with only image still work. Images use portrait contain sizing,
reduced-motion-aware fades, keyboard-accessible thumbnails, and a native modal
with previous/next, arrows, Escape, focus containment, and focus restoration.
Desktop shows five thumbnails before scrolling; mobile puts a horizontal row below
the image. Failed image requests fall back to the existing product placeholder.

Optional per-product sizes contain size (S/M/L/XL), enabled, and optional maxQuantity.
Demo products have varying size lists with unknown stock; enabled is demo configuration
not a real availability claim. Quantity has minus/plus controls and an editable input,
validated against known limits and the existing 99-item application cap.

Add to Cart uses existing cartActions, persistence, variant keys, badge subscriptions,
and monetary snapshots in paise. Matching product/size merges; different sizes stay
separate. No login is required. Existing cart removal and normal checkout remain unchanged.

Buy Now validates through preparePurchase and the existing buildCheckoutRequest, storing
only the chosen line in sessionStorage. A missing demo session leads to /login and
explicit credential-free demo sign-in, then /checkout. Demo checkout uses that isolated
selection and never mutates the persisted bag. Completion takes no payment and creates
no order. Authentication and payment services are not connected.

For backend integration, replace dummy catalog queries, obtain authoritative variant/stock
data, and implement CheckoutGateway.createSession with authenticated server validation
of product IDs, variants, quantities, pricing, totals, and redirect destinations. Never
trust local storage prices or the demo session as authentication. Keep dummy checkout
separate from production orders/payments until the catalog and backend are ready.

### Product details verification

Run `node --test tests/product-details.test.mjs` for product-specific size/quantity
validation, existing-cart merging, isolated checkout requests, five valid sample assets,
and empty/single/multiple-image rendering with unique accessibility IDs. The existing
`npm run test:cart` suite remains unchanged. TypeScript and ESLint passed; development
HTTP checks confirmed product/gallery, all five categories, demo routes, cart, and invalid
product HTTP 404. The final production rebuild was blocked by a Windows EPERM lock on a
generated .next file; an earlier build passed before the final image/variant data update.
Browser interaction, focus behavior, responsive overflow, and console checks still require
a browser QA pass.

## WhatsApp customer support

The shared root layout mounts WhatsAppContact once. To enable it, add
NEXT_PUBLIC_WHATSAPP_NUMBER to your untracked .env.local (and hosting environment),
using the actual WhatsApp-enabled business number with country code and digits only:
no +, spaces, hyphens, or leading international 00. Leave it unset until the real
number is confirmed. Restart development after changing it; rebuild/redeploy production.
It is a public contact number and will be visible in the generated link.

Missing or invalid configuration hides the button entirely. Validation accepts 8?15
international digits with a nonzero first digit; it cannot verify WhatsApp account
registration or ownership. Confirm the real destination manually before launch.
The link uses https://wa.me/ with encodeURIComponent for the requested enquiry text;
the customer can edit it and nothing sends automatically. No API or credentials are used.

The control is 48px on mobile and 52px on desktop, with safe-area-aware spacing, a
native ?Chat with us? tooltip, accessible name, keyboard focus, reduced-motion support,
and one local SVG icon. It hides while any native dialog or fullscreen loader is open.
A small bottom spacer lets the final page actions scroll above the fixed button.
Browser checks should confirm visual placement/checkout clearance on target devices
and open the configured business chat without sending a message.
