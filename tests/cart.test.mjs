import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addCartItem, updateCartQuantity, parseCartLines, getCartSubtotal,
  getCartItemCount, getProductImageUrl, getCartQuantityLimit, formatCartMoney,
} from '../lib/cart/domain.ts';
import { buildCheckoutRequest } from '../lib/cart/checkout.ts';
import { getDemoCartProduct } from '../lib/cart/dev-fixture.ts';

const product = {
  productId: 'demo-sage-kurti', variantId: null, name: 'Sage A-Line Kurti Set',
  size: 'S', unitPriceMinor: 169900, currency: 'INR', imageUrl: null,
  availability: { status: 'unknown' },
};
const line = { id: 'line-1', product, quantity: 1 };

test('starts empty and adds only explicit products, preserving minor-unit totals', () => {
  const empty = [];
  assert.equal(getCartSubtotal(empty), 0);
  const items = addCartItem(empty, product);
  assert.equal(empty.length, 0);
  assert.equal(getCartSubtotal(items), 169900);
  assert.equal(getCartItemCount(items), 1);
  assert.equal(formatCartMoney(169900), '₹1,699');
  assert.equal(formatCartMoney(169950), '₹1,699.50');
});

test('merges the same variant and size while preserving different selections', () => {
  const items = addCartItem([line], product, 2);
  assert.equal(items.length, 1);
  assert.equal(items[0].id, 'line-1');
  assert.equal(items[0].quantity, 3);
  const sizes = addCartItem(items, { ...product, size: 'M' });
  const variants = addCartItem(sizes, { ...product, variantId: 'catalog-variant' });
  assert.equal(variants.length, 3);
  assert.equal(getCartItemCount(variants), 5);
});

test('availability caps additions and quantity changes without modifying the old snapshot', () => {
  const limited = { ...product, availability: { status: 'available', maxQuantity: 2 } };
  assert.equal(addCartItem([], limited, 5)[0].quantity, 2);
  const items = [{ ...line, product: limited }];
  assert.equal(updateCartQuantity(items, 'line-1', 8)[0].quantity, 2);
  assert.equal(items[0].quantity, 1);
  assert.equal(getCartQuantityLimit({ ...product, availability: { status: 'unavailable' } }), 0);
  assert.deepEqual(addCartItem([], { ...product, availability: { status: 'unavailable' } }), []);
  assert.deepEqual(updateCartQuantity(items, 'line-1', 0), items);
  assert.deepEqual(updateCartQuantity(items, 'line-1', NaN), items);
});

test('accepts backend IDs and optional or nullable images without needing a photograph', () => {
  for (const imageUrl of [null, undefined, '', 'invalid image', 'javascript:alert(1)']) {
    const items = parseCartLines([{ ...line, product: { ...product, imageUrl } }]);
    assert.equal(items.length, 1);
    assert.equal(items[0].product.imageUrl, null);
  }
  const items = parseCartLines([{ ...line, id: 'server-line-id', product: {
    ...product, productId: 'actual-product-id', variantId: 'actual-variant-id',
    imageUrl: 'https://catalog.example.test/product.webp',
  } }]);
  assert.equal(items[0].id, 'server-line-id');
  assert.equal(items[0].product.variantId, 'actual-variant-id');
  assert.equal(items[0].product.imageUrl, 'https://catalog.example.test/product.webp');
});

test('rejects malformed, non-INR, negative-price and invalid-quantity snapshots', () => {
  const invalid = [null, {}, { ...line, quantity: 0 }, { ...line, quantity: 100 },
    { ...line, quantity: 1.5 }, { ...line, product: { ...product, currency: 'USD' } },
    { ...line, product: { ...product, unitPriceMinor: -1 } },
    { ...line, product: { ...product, unitPriceMinor: 1699.5 } },
    { ...line, product: { ...product, variantId: {} } },
    { ...line, product: { ...product, availability: { status: 'available', maxQuantity: -1 } } },
  ];
  assert.deepEqual(parseCartLines(invalid), []);
  assert.equal(parseCartLines([line, line]).length, 1);
  assert.deepEqual(parseCartLines('invalid'), []);
});

test('rejects unsafe image sources and permits explicit web URLs and root-relative paths', () => {
  for (const source of [null, undefined, '', '//example.test/image.png', 'data:image/png;base64,AA',
    'javascript:alert(1)', '/\\example.test/image.png', '/\n/example.test/image.png',
    'https://user:secret@example.test/image.png']) {
    assert.equal(getProductImageUrl(source), null);
  }
  assert.equal(getProductImageUrl('/catalog/image.webp'), '/catalog/image.webp');
  assert.equal(getProductImageUrl('https://cdn.example.test/image.webp'), 'https://cdn.example.test/image.webp');
});

test('checkout sends identity and quantity only, never locally stored prices or stock claims', () => {
  const request = buildCheckoutRequest([line]);
  assert.deepEqual(request, { lines: [{ productId: 'demo-sage-kurti', variantId: null, quantity: 1 }] });
  const tampered = { ...line, product: { ...product, unitPriceMinor: 1,
    availability: { status: 'available', maxQuantity: 99999 } } };
  assert.deepEqual(buildCheckoutRequest([tampered]), request);
  assert.throws(() => buildCheckoutRequest([]), /empty/);
  assert.throws(() => buildCheckoutRequest([{ ...line, quantity: -1 }]), /invalid/);
  assert.throws(() => buildCheckoutRequest([{ ...line, quantity: Infinity }]), /invalid/);
});

test('the demo fixture cannot be requested in production', () => {
  const original = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try { assert.throws(() => getDemoCartProduct(), /development-only/); }
  finally {
    if (original === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = original;
  }
});
