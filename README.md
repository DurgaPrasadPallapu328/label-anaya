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
Desktop keeps a vertical thumbnail rail beside the image and scrolls that rail only
when the available height requires it; mobile puts a horizontal row below the image.
Failed image requests fall back to the existing product placeholder.

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
and empty/single/multiple-image rendering with unique accessibility IDs. Its Node
static-render harness ignores imported CSS; browser checks verify actual layout.
The existing `npm run test:cart` suite remains unchanged. Current production-build,
TypeScript, ESLint, and browser results are recorded in the refinements section below.

## Shop All, Product Details, and Wishlist UI Refinements

### Shop All and Wishlist

- `/shop` retains a semantic `h1` using `sr-only`; its large visible heading and
  heading margin are removed. The **Home > Shop All** breadcrumb and header navigation
  remain. The breadcrumb-to-grid gap is 20px below 640px and 28px at wider widths.
- Shop All top padding is 16px below 640px and 24px at wider widths. The rule targets
  only the Shop All heading inside the shared shop layout, preserving category-page
  spacing. Product cards, responsive columns, prices, placeholders, and hearts are
  unchanged.
- `/wishlist` retains its **Home > Wishlist** breadcrumb and a hidden semantic
  **Your Wishlist** `h1`. The breadcrumb-to-message and message-to-grid gaps are each
  16px below 640px and 20px at wider widths; top padding is 16px/24px respectively.
- The saved-product message still derives from the existing wishlist store, including
  singular/plural wording. Removal, localStorage persistence, and the existing empty
  state and collection link remain intact.

### Product Details gallery

- The existing route is `/products/[slug]`. At 1024px and wider, thumbnails remain
  on the left, the main image in the center, and product information on the right.
  The outer columns use a 1.4:1 ratio with a 320px information minimum and a 24px gap.
  Gallery and information start at the same height. Main top padding, breadcrumb
  spacing, and purchase-form spacing are reduced.
- The gallery measures its document-position top after layout, which includes the
  actual shared header height, padding, and wrapped breadcrumb. Desktop image height
  is the dynamic viewport height minus that measured top and a 24px bottom allowance.
  CSS uses `100dvh` where supported, with a `100vh` fallback. ResizeObserver, window
  resize, and visual-viewport resize keep the measurement current. Normal page
  scrolling does not change the gallery's height.
- The complete selected image is centered with `object-fit: contain`, preserving its
  aspect ratio without cropping, stretching, automatic zoom, or image-container
  scrolling. Loaded main images are capped at their decoded natural dimensions to
  avoid enlarging small assets. Neutral letterboxing is allowed. The existing
  click-to-enlarge modal remains available.
- The desktop thumbnail column is 72px wide and bounded by the main image height.
  Its 64px by 96px controls stay grouped at the top with 12px gaps. The rail scrolls
  vertically when its content exceeds the available height; the main image never
  scrolls independently. Only supplied views are rendered. Selection highlights,
  reduced-motion-aware fades, arrow/Home/End navigation, and modal focus return remain.
- Below 1024px, including the 768px tablet layout, the image and horizontal thumbnail
  row precede readable product information in normal document flow. The mobile/tablet
  image box keeps its portrait aspect ratio subject to the same viewport height limit.
  This avoids a cramped three-column tablet layout and horizontal page overflow.
- Product data, size availability, pricing, quantity validation, cart integration,
  and isolated demo Buy Now behavior are unchanged.

### Accessibility and SEO

Shop All and Wishlist keep accessible level-one headings without consuming visible
layout space. Breadcrumb labels/current-page semantics, thumbnail button names and
pressed states, focus indicators, and the wishlist live status are preserved. Existing
metadata exports and inherited titles/descriptions are unchanged; no SEO content or
navigation labels were removed.

### Files modified

| File | Change |
| --- | --- |
| `app/shop/page.tsx` | Hidden Shop All heading and compact breadcrumb spacing. |
| `app/shop/layout.tsx` | Class hook for Shop All-only padding. |
| `app/globals.css` | Route-scoped Shop All top-padding rules. |
| `app/wishlist/page.tsx` | Hidden heading and reduced page/breadcrumb spacing. |
| `components/shop/breadcrumbs.tsx` | Optional spacing class; existing default preserved. |
| `components/shop/wishlist-view.tsx` | Reduced live-message-to-grid spacing. |
| `app/products/[slug]/page.tsx` | Reduced spacing and balanced desktop columns. |
| `components/shop/product-image-gallery.tsx` | Measured gallery offset, bounded thumbnails, native-image size caps. |
| `components/shop/product-image-gallery.css` | Component-prefixed viewport/responsive gallery rules (new). |
| `components/shop/product-purchase.tsx` | Reduced form spacing only. |
| `tests/product-details.test.mjs` | CSS import support in the existing static-render test harness. |
| `README.md` | Current behavior, validation, file list, and limitations. |

The only existing `docs/` page covers the cart; its integration contract did not change.

### Validation and actual results

- `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed; all 56 pages generated successfully.
- `node --test tests/product-details.test.mjs`: 4/4 passed.
- `npm.cmd run test:cart`: 8/8 passed.
- `node --test tests/cart-flight.test.mjs tests/cart-badge.test.mjs`: 2/2 passed.
- Production pages were exercised in installed headless Chrome through the Chrome
  DevTools Protocol, without adding dependencies. All three routes passed at every
  requested viewport below. Gaps are measured from element bounds; desktop image
  bottoms stayed at least 24px above the viewport bottom, allowing for rounding.

| Viewport | Shop breadcrumb/grid gap | Wishlist gaps (each) | Main image box height | Result |
| --- | --- | --- | --- | --- |
| 320 x 700 | 20px | 16px | 360px | Passed |
| 375 x 812 | 20px | 16px | 429px | Passed |
| 390 x 844 | 20px | 16px | 448px | Passed |
| 768 x 1024 | 28px | 20px | 828px | Passed |
| 1366 x 768 | 28px | 20px | 589px | Passed |
| 1440 x 900 | 28px | 20px | 717px | Passed |
| 1920 x 1080 | 28px | 20px | 867px | Passed |

Browser checks confirmed hidden headings with an accessible Shop All heading, retained
breadcrumbs, actual spacing, unchanged responsive card counts, dynamic wishlist
2-to-1-to-empty updates and reload persistence, no horizontal page overflow, centered
contain sizing, native-size caps, all five thumbnail selections, keyboard selection,
modal opening/Escape/focus return, and desktop information alignment. Additional checks
passed at 1366 x 550 for independent thumbnail scrolling and stable main-image height
during page scrolling; wrapped breadcrumbs also triggered correct height recalculation.
Synthetic tall, wide, and small assets passed containment/size checks. Failed-image
fallback and subsequent thumbnail selection passed. Size/quantity, Add to Cart, and the
Buy Now redirect/isolated selection passed at mobile and desktop widths without changing
the bag during Buy Now. The category page retained its 48px top padding and 32px breadcrumb
margin. No runtime exceptions or `console.error` calls occurred during these checks.

The existing CSS loader interprets CSS Module output as plain CSS, so the gallery uses
component-prefixed plain CSS, matching the existing cart components. A successful build
alone did not detect the missing module class references; production browser checks
identified it and verified the plain-CSS implementation. An intermediate rebuild also
encountered a locked QA browser profile inside `.next`; moving temporary QA artifacts
outside the build directory allowed the final build to pass. Local browser artifacts
are kept under ignored `coverage/ui-refinements-qa/`.

### Known limitations

The catalog currently contains 600 x 750 sample SVGs and existing placeholders, with
no real garment photographs. Container geometry, object-fit behavior, and synthetic
aspect ratios were verified; checking complete real dresses, their image quality, and
product-specific views remains pending real catalog assets. Physical-device browser
chrome/rotation, Safari/Firefox, and screen-reader testing remain manual follow-ups.
The `vh` fallback was inspected in CSS but not exercised in an older browser without
`dvh` support. Catalog, authentication, and checkout remain existing demo integrations.

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
