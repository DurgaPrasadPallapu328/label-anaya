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
- The desktop thumbnail column is 96px wide and bounded by the main image height.
  Its 76px by 114px controls stay grouped at the top with 12px gaps. The rail scrolls
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

### Floating social button visibility

The missing WhatsApp control was caused by absent configuration:
`getWhatsAppUrl` returned `null` when `NEXT_PUBLIC_WHATSAPP_NUMBER` was unset, and
the existing `{href && ...}` guard omitted the WhatsApp anchor from the DOM.
Instagram does not have that configuration guard. No screen-width condition,
offscreen translation, ancestor clipping or stacking error was found.

The owner's approved support number is now configured in the ignored `.env.local`
as international digits, without the display-only leading `+`. The existing number
validator, WhatsApp message, URL construction and Instagram profile are unchanged.

Both controls retain one viewport-level fixed container mounted by the root layout,
with Instagram above WhatsApp, a 12px gap, 16px mobile/24px larger-screen offsets,
safe-area support and z-index 30. Their 48px/52px sizes, colors, hover shadows,
mascots, icon fades and speech bubbles are unchanged. Native dialogs/cart drawers
and full-screen loaders continue to hide both controls and pause the animation.
No positioning, animation, navbar, gallery, cart or checkout source change was needed.

`NEXT_PUBLIC_` values are embedded at build time. Keep the approved number configured
in every development/hosting environment and restart development or rebuild/redeploy
after changing configuration. Changing only the environment of an already-built
production server does not update its client bundle. `.env.local` is intentionally
untracked; deployment must supply the same approved value in its build environment.

Validation: TypeScript, ESLint and the production build passed (56 generated pages).
Production Chrome used actual browser zoom of 90%, 100%, 125% and 150% in an isolated
profile. Both the homepage and product page passed at every zoom and each requested
viewport: 1024 × 768, 1280 × 720, 1366 × 768, 1440 × 900, 1536 × 864, 1920 × 1080,
768 × 1024, 820 × 1180, 1024 × 1366, 320 × 568, 375 × 667, 390 × 844 and 430 × 932
(104 page/viewport/zoom combinations). Both buttons stayed within the visible viewport
and fixed while scrolling, in the correct order, with working hit targets and the
unchanged destinations/message. Navigation to external social services was prevented
only in the QA browser; no messages were sent.

Additional checks passed for touch emulation, Shop All/category/wishlist/cart/login/
checkout pages, native cart/gallery dialogs, a temporary full-screen loader, reduced
motion, actual 15-second mascot scheduling and 3-second animations, speech bubbles,
hover shadows/scaling and focus pause/resume. Add to Cart still persists immediately,
uses the 2000ms bird flight and restores both controls after the drawer closes.
No browser exceptions or console errors occurred. Screenshots and diagnostic scripts
are under ignored `coverage/social-visibility-qa/`.

At 320px with 150% desktop browser zoom (about 213 CSS pixels), the existing header
creates 21px horizontal page overflow; both social controls remain fully visible.
Hiding the social container in QA left that overflow unchanged; temporarily hiding
the header removed it. The navbar was preserved as requested. Physical devices,
notched safe areas, Safari/Firefox and the live WhatsApp account remain manual checks.

## Responsive Layout, Sticky Navigation, Product Gallery and Cart Animation

The existing shared header, gallery, product grid, wishlist and delivery animation
are reused. Changes are local and uncommitted on `Durga_staging`; no dependencies,
catalog data, cart mutation/persistence rules, authentication or checkout flows changed.

### Navigation and announcements

`.site-header` uses CSS `position: sticky; top: 0` with its existing background,
border, shadow and responsive heights. Its z-index of 40 places it above cards and
floating social controls. Dropdowns stay in that stacking context; native search,
navigation and cart dialogs use the browser's top layer. Header ancestors do not
introduce a scrolling container during ordinary browsing. No scroll listener controls
the header, and there is no duplicated header or placeholder gap.

There is currently no announcement bar. An announcement placed as a sibling before
the shared header scrolls away normally; only the navigation sticks at viewport top.
This arrangement was verified using a temporary 48px announcement in the QA browser.
The shared `--site-header-height` token also supplies root scroll padding, leaving
anchor destinations below the navigation. Mobile menus and desktop dropdowns scroll
internally when their contents exceed the available viewport height.

### Gallery dimensions and image fitting

At the default 16px root font size, desktop thumbnails increase from **64 × 96px to
76 × 114px**, an **18.75% width increase**, retaining their 2:3 aspect ratio. All
thumbnails share `clamp(4rem, 8vw + 2rem, 4.75rem)` width and 12px gaps. At 1024px and
wider, the vertical rail is 96px wide, including padding and scrollbar clearance,
and is bounded by the main image height. Only the rail scrolls when necessary.
Below 1024px the row remains horizontal: thumbnails scale from 64px on small phones
to 76px on tablets, scrolling inside the rail instead of widening the page.

The main gallery retains `object-fit: contain`, centered positioning, natural-image
size caps and its measured document-top offset. Its height uses `100dvh` with a
`100vh` fallback, minus the actual gallery top and a 1.5rem bottom allowance. It has
no internal image scrolling, cropping or stretching. The desktop information column
keeps its existing flexible ratio and 20rem minimum. Supplied image ordering, selected
borders, keyboard selection, failed-image fallback and the enlarge dialog remain.

### Burgundy bird delivery

The existing SVG silhouette and wing shapes use the bird-specific
`--cart-bird-color: #800020` token, with burgundy shading and feather strokes.
The outfit clone retains its original colors and becomes the existing small parcel
under the bird. Olive website accents and the bag icon retain their existing colors.

`CART_FLIGHT_DURATION = 2000` controls one immediate Web Animations API movement.
Pickup and wing movement happen concurrently; no entrance or pickup stage delays
the flight. The carrier follows a sampled quadratic Bézier curve with smooth
acceleration/deceleration and continuous scaling, reaching the bag at **2000ms**.
Browser completion callbacks can arrive a rendering frame after the timeline ends.
The existing one-second pause before automatically opening the bag starts after
delivery; it is separate from the two-second flight.

Every action measures the actual DOM rectangles again. The launch point is the
visible part of the selected image below the sticky header, or the visible purchase
button when the image is offscreen. The destination is the center of the visible
header bag SVG. A fixed, non-interactive overlay keeps these viewport coordinates
accurate on scrolled pages without scrolling the customer to the header. If scrolling
or resizing moves the bag during flight, a continuous correction uses the remaining
original animation time; it does not restart or extend the 2000ms clock. An unchanged
sticky bag requires no correction animation.

The purchase form updates cart state/localStorage immediately and shows its existing
accessible `role="status"` confirmation. The existing presentation-only badge hold
releases at delivery. Animation callbacks never add products. A new click cancels the
previous visual flight while preserving each real addition. Route changes, manual
bag opening, other dialogs, hidden documents and unmounting clean up animations,
observers, listeners and timers. The overlay is removed at delivery and never captures
pointer events. Reduced motion skips flight and immediately releases the badge and
opens the existing bag. Changing that preference during flight also stops motion.
Unavailable source images, targets or browser animation support use the same fallback.
Product cards currently have no Add to Cart control, so none was added to the grids.

### Responsive sizing strategy

Existing page maximum widths, mobile-first grid column counts, typography and brand
styling remain. Hero and category cards now use minimum heights so wrapping content
can grow. Hero headings/buttons and category labels can wrap. Product grid gaps are
fluid, grid children can shrink within their tracks, cart summary lines can wrap,
and empty-wishlist/cart-loading spacing is bounded by viewport height. The product
heading uses a rem-based fluid clamp. Text containers have no new fixed heights.

| CSS mechanism | Purpose |
| --- | --- |
| `%` and flexible `fr`/`minmax(0, …)` tracks | Parent-relative widths and balanced product/gallery/information columns. |
| `vw` inside bounded `clamp()` | Thumbnail widths, grid gaps and existing responsive header/hero sizing. |
| `vh`, then `dvh` | Viewport-dependent menus, dropdowns, gallery and empty/loading spacing; fallback for older browsers. |
| `rem`, `min()`, `max()` and `clamp()` | Font-relative bounds, safe spacing and fluid typography without unlimited scaling. |
| `aspect-ratio` and `object-fit` | Consistent cards and undistorted gallery images. |
| `px` | Existing touch targets, icons, borders, thumbnail gaps and measured DOM coordinates. |

Phones keep the hamburger, logo and four action icons, two product columns and a
horizontal gallery rail. Tablets retain horizontal thumbnails and readable information
below the image. From 1024px, laptops/desktops use the established three-part product
layout and desktop navigation. Wide monitors retain existing maximum content widths.

### Files modified

- `app/globals.css`: sticky header/token, anchor clearance and shared responsive styles.
- `components/home/header.tsx`: removes the conflicting relative-position utility.
- `components/shop/product-image-gallery.css` and `.tsx`: fluid wider thumbnails and bounded rail.
- `app/products/[slug]/page.tsx`: fluid product-heading class.
- `components/shop/product-grid.tsx` and `wishlist-view.tsx`: shared responsive sizing hooks.
- `components/cart/use-cart-flight.ts`: immediate two-second curved flight and lifecycle cleanup.
- `lib/cart/dove.ts`: recolored existing bird artwork.
- `components/shop/product-purchase.tsx`: updated visual-hook invocation only.
- `tests/cart-flight.test.mjs`: timing, geometry, retargeting, cancellation and reduced-motion regression checks.
- `README.md` and `docs/pages/cart.md`: behavior, validation and limitations.

### Testing performed and results

- `npm.cmd run lint`: passed.
- `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `npm.cmd run build`: passed; all 56 pages generated.
- `node --experimental-strip-types --test tests/*.test.mjs`: all 14 tests passed.
  Node emits its existing module-type warning when stripping the domain TypeScript;
  this does not fail the tests or require a package-module change.
- Production headless Chrome, controlled through its DevTools Protocol without new
  dependencies: all nine required viewports passed the checks below.

| Viewports tested | Result |
| --- | --- |
| 320 × 700, 375 × 812, 390 × 844, 430 × 932 | Passed |
| 768 × 1024, 820 × 1180 | Passed |
| 1366 × 768, 1440 × 900, 1920 × 1080 | Passed |

At every viewport, homepage, Shop All, Kurtis, product details, populated wishlist,
cart, checkout and login had no horizontal page overflow and retained one sticky
header during downward/upward scrolling. Desktop dropdown/mobile navigation, search
results, all five thumbnail selections, arrow/Home keys, enlarge/Escape/focus return,
contain fitting and rail alignment passed. Each Add to Cart persisted immediately,
launched from the expected image/button without a page jump, used the selected image
and burgundy bird, and reached the actual bag center with less than 0.01px measured
error. The flight timeline was exactly 2000ms; observed completion callbacks arrived
after 2006–2040ms including frame scheduling. Reduced motion, a temporary announcement
above the header, and independent rail scrolling at 1366 × 550 also passed.

Additional production Chrome checks passed for a bag destination moving 40px during
flight (correction and flight ended at the same timeline time), two rapid additions
with one active visual flight, manual bag opening without later automatic reopening,
and route-change cleanup. Cart quantity changes, reload persistence, removal
cancel/confirmation, wishlist removal/persistence and mobile/desktop Buy Now → demo
sign-in → checkout preserved their existing behavior. Checks at intermediate 640px
and 1024px widths, anchor clearance, non-overlapping header controls and doubled root
font sizing passed. No page exceptions or console errors occurred in these scenarios.

Temporary QA scripts, results and screenshots are under ignored
`coverage/responsive-cart-qa/`; they are not application assets.

### Known limitations and manual verification

The catalog still uses labelled sample SVG views, rather than real garment photographs.
Contain geometry is verified, but neckline-to-hem content and photograph quality need
real catalog assets. Physical phones/tablets, Safari/Firefox, browser chrome/rotation,
screen readers and a browser without `dvh` support remain manual checks. Browser
emulation and doubled root-font checks do not substitute for physical-device text
zoom and accessibility testing. Checkout/authentication retain the existing demo and
coming-soon behavior. No live announcement or product-card Add to Cart control exists
to test beyond the temporary announcement scenario and existing purchase form.
