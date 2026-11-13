import { createRequire } from "node:module";
const loadProject = createRequire(import.meta.url);
const { test } = loadProject('node:test');
const assert = loadProject('node:assert/strict');
const fs = loadProject('node:fs');
const path = loadProject('node:path');
const Module = loadProject('node:module');
const ts = loadProject('typescript');
const React = loadProject('react');
const { renderToStaticMarkup } = loadProject('react-dom/server');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.resolve(name.slice(2)) : name, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  loadProject.extensions[extension] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, file);
}
const { products } = loadProject('../lib/products.ts');
const { preparePurchase } = loadProject('../lib/product-purchase.ts');
const { addCartItem, getCartItemCount } = loadProject('../lib/cart/domain.ts');
const { buildCheckoutRequest } = loadProject('../lib/cart/checkout.ts');
const { ProductImageGallery } = loadProject('../components/shop/product-image-gallery.tsx');

test('product-specific sizes and integer quantity validation include known stock limits', () => {
  const product = products[0];
  for (const size of ['', 'XXL', 'XL']) assert.throws(() => preparePurchase(product, size, 1));
  for (const quantity of [0, -1, 1.5, NaN, 100]) assert.throws(() => preparePurchase(product, 'M', quantity));
  assert.equal(preparePurchase(product, 'M', 2).unitPriceMinor, product.price * 100);
  assert.equal(preparePurchase(product, 'M', 2).availability.status, 'unknown');
  const limited = { ...product, sizes: [{ size: 'M', enabled: true, maxQuantity: 2 }, { size: 'S', enabled: false }] };
  assert.throws(() => preparePurchase(limited, 'M', 3));
  assert.throws(() => preparePurchase(limited, 'S', 1));
  assert.equal(preparePurchase({ ...product, sizes: undefined }, '', 1).size, null);
});

test('existing cart merges exact sizes while isolated checkout never changes the bag', () => {
  const product = products[0];
  const medium = preparePurchase(product, 'M', 2);
  let cart = addCartItem([], medium, 2);
  cart = addCartItem(cart, medium, 3);
  cart = addCartItem(cart, preparePurchase(product, 'S', 1), 1);
  assert.equal(cart.length, 2);
  assert.equal(getCartItemCount(cart), 6);
  const before = JSON.stringify(cart);
  const selection = preparePurchase(products[1], 'L', 4);
  const request = buildCheckoutRequest([{ id: 'buy-now', product: selection, quantity: 4 }]);
  assert.deepEqual(request.lines, [{ productId: products[1].id, variantId: products[1].id + ':L', quantity: 4 }]);
  assert.equal(JSON.stringify(cart), before);
  assert.ok(!JSON.stringify(request).includes('unitPriceMinor'));
});

test('all 40 products supply five distinct, labelled sample assets and varying demo sizes', () => {
  assert.equal(products.length, 40);
  assert.notDeepEqual(products[0].sizes, products[1].sizes);
  for (const product of products) {
    assert.equal(product.images.length, 5);
    assert.equal(new Set(product.images.map(image => image.src)).size, 5);
    for (const image of product.images) {
      assert.ok(fs.existsSync(path.join('public', image.src)));
      assert.ok(image.label.includes('Sample'));
      assert.ok(image.alt.includes(product.name));
    }
  }
});

test('gallery renders empty, legacy single, and multiple images with unique accessible targets', () => {
  assert.ok(renderToStaticMarkup(React.createElement(ProductImageGallery, { images: [] })).includes('Product image unavailable'));
  const single = renderToStaticMarkup(React.createElement(ProductImageGallery, { images: [{ id: 'main', src: products[0].image, alt: products[0].name, label: 'Main' }] }));
  assert.equal((single.match(/aria-pressed=/g) || []).length, 1);
  assert.ok(!single.includes('>Next</button>'));
  const html = renderToStaticMarkup(React.createElement('div', null,
    React.createElement(ProductImageGallery, { images: products[0].images }),
    React.createElement(ProductImageGallery, { images: products[1].images })));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 2);
  for (const match of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) assert.ok(ids.includes(match[1]));
});
