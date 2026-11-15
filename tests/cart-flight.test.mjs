import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';

const loadProject = createRequire(import.meta.url);
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.resolve(name.slice(2)) : name, ...args);
};
loadProject.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, file);
const originalLoad = Module._load;
Module._load = function(name, ...args) {
  if (name === 'next/navigation') return { usePathname: () => '/products/test' };
  return originalLoad.call(this, name, ...args);
};

test('immediate two-second curved delivery, dynamic target, mobile trigger, cancellation and reduced motion', async () => {
  let cleanup;
  const originalRef = React.useRef, originalEffect = React.useEffect;
  React.useRef = () => ({ current: undefined });
  React.useEffect = effect => { cleanup = effect(); };
  let layers = [], animations = [], opens = 0, reduced = false, drawer = false, offscreenSource = false;
  let shiftX = 0, shiftY = 0, released = 0;
  const delays = new Map(), listeners = new Map(), motionListeners = new Map();
  let delayId = 0;
  const originalTimeout = globalThis.setTimeout, originalClearTimeout = globalThis.clearTimeout;
  globalThis.setTimeout = (callback, duration) => { assert.equal(duration, 1000); delays.set(++delayId, callback); return delayId; };
  globalThis.clearTimeout = id => delays.delete(id);
  const bounds = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height });
  class Element {
    constructor(tag = 'div') { this.tag = tag; this.style = {}; this.children = []; this.isConnected = true; }
    setAttribute() {}
    querySelector(selector) { return this === target ? (selector === 'svg' ? icon : badge) : null; }
    querySelectorAll() { return this.innerHTML?.includes('dove-wing') ? [new Element('g'), new Element('g')] : []; }
    append(...children) { this.children.push(...children); }
    remove() { layers = layers.filter(layer => layer !== this); this.isConnected = false; }
    getBoundingClientRect() {
      const left = innerWidth - 80 + shiftX;
      if (this === target) return bounds(left, 10 + shiftY, 44, 44);
      if (this === icon) return bounds(left + 10, 20 + shiftY, 24, 24);
      if (this === trigger) return bounds(16, innerHeight - 80, 130, 48);
      if (this === header) return bounds(0, 0, innerWidth, 64);
      return offscreenSource ? bounds(16, -950, 260, 750) : bounds(16, -80, 260, 1080);
    }
    animate(frames, options) {
      let finish, reject;
      const finished = new Promise((yes, no) => { finish = yes; reject = no; });
      const animation = { element: this, frames, options, finished, finish, currentTime: 0, startTime: 50,
        cancel: () => { animation.cancelled = true; reject(new Error('cancelled')); } };
      animations.push(animation);
      return animation;
    }
  }
  const source = new Element('img'), target = new Element('button'), icon = new Element('svg');
  const trigger = new Element('button'), badge = new Element('span'), header = new Element('header');
  Object.assign(source, { complete: true, naturalWidth: 300, naturalHeight: 450, currentSrc: '/selected-back.jpg' });
  globalThis.innerWidth = 1000; globalThis.innerHeight = 800;
  globalThis.window = {
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name), dispatchEvent: () => { opens++; },
  };
  globalThis.document = {
    activeElement: null, hidden: false, querySelectorAll: () => [target],
    querySelector: selector => selector === '.site-header' ? header : selector.includes('dialog') || selector.includes('cart-drawer') ? (drawer ? {} : null) : null,
    createElement: tag => new Element(tag), body: { append: element => layers.push(element) },
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.getComputedStyle = () => ({ visibility: 'visible', display: 'block', opacity: '1', transform: 'none' });
  globalThis.matchMedia = () => ({ get matches() { return reduced; },
    addEventListener: (name, handler) => motionListeners.set(name, handler),
    removeEventListener: name => motionListeners.delete(name) });
  globalThis.MutationObserver = class { observe() {} disconnect() {} };
  const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
  const carrier = () => layers[0].children[0].children[0];
  const movement = () => animations.find(a => a.element.className === 'cart-flight-carrier' && !a.cancelled);
  const position = transform => transform.match(/translate\(([-\d.]+)px,([-\d.]+)px\) scale\(([-\d.]+)\)/).slice(1).map(Number);
  try {
    const { useCartFlight, CART_FLIGHT_DURATION } = loadProject('../components/cart/use-cart-flight.ts');
    assert.equal(CART_FLIGHT_DURATION, 2000);
    const fly = useCartFlight();
    fly(source, trigger, () => released++);
    assert.equal(opens, 0); assert.equal(released, 0); assert.equal(layers.length, 1);
    assert.equal(animations[0], movement(), 'movement starts without waiting for pickup');
    const bird = carrier().children[0], parcel = carrier().children[1];
    assert.equal(parcel.children[1].src, '/selected-back.jpg');
    assert.match(bird.innerHTML, /anaya-dove-burgundy/);
    assert.match(bird.style.cssText, /#800020/);
    assert.match(layers[0].style.cssText, /pointer-events:none/);
    const flight = movement();
    assert.equal(flight.options.duration, 2000); assert.equal(flight.options.delay, undefined);
    const [x, y, scale] = position(flight.frames.at(-1).transform);
    const to = icon.getBoundingClientRect();
    assert.ok(Math.abs(x + 136 * .55 * scale - (to.left + to.width / 2)) < .01);
    assert.ok(Math.abs(y + (136 * .7 * .8 + 20) * scale - (to.top + to.height / 2)) < .01);
    const first = position(flight.frames[0].transform), middle = position(flight.frames[30].transform);
    assert.ok(middle[1] < (first[1] + y) / 2, 'flight bows upward');
    const count = animations.length;
    listeners.get('scroll')(); assert.equal(animations.length, count, 'stable sticky cart needs no correction');
    flight.currentTime = 1000; shiftX = -20; shiftY = 8;
    listeners.get('resize')();
    assert.equal(animations.at(-1).options.duration, 1000, 'retargeting uses the remaining original clock');
    assert.equal(animations.at(-1).startTime, 1050, 'endpoint correction ends on the original timeline');
    assert.equal(animations.at(-1).frames[0].transform, 'translate(0,0)');
    assert.equal(animations.at(-1).frames.at(-1).transform, 'translate(-20px,8px)');
    flight.finish(); await flush();
    assert.equal(released, 1); assert.equal(layers.length, 0); assert.equal(opens, 0); assert.equal(delays.size, 1);
    for (const [id, callback] of delays) { delays.delete(id); callback(); }
    await flush(); assert.equal(opens, 1); assert.equal(listeners.size, 0);

    // Mobile launches from the visible purchase control, carrying the selected offscreen image.
    shiftX = 0; shiftY = 0; offscreenSource = true;
    for (const width of [320, 375, 390, 430, 768, 820]) {
      innerWidth = width; animations = [];
      fly(source, trigger);
      assert.equal(layers.length, 1); assert.equal(movement().options.duration, 2000);
      const [tx, ty] = position(movement().frames[0].transform);
      const birdWidth = width < 640 ? 106 : 136;
      assert.ok(Math.abs(tx + birdWidth * .55 - 81) < .01);
      assert.ok(Math.abs(ty + (birdWidth * .7 * .8 + 20) - (innerHeight - 56)) < .01);
      cleanup(); await flush(); assert.equal(layers.length, 0);
    }
    animations = [];
    fly(source, trigger); const older = movement();
    fly(source, trigger);
    assert.ok(older.cancelled); assert.equal(layers.length, 1);
    listeners.get('label-anaya:open-cart')(); await flush();
    assert.equal(layers.length, 0); assert.equal(delays.size, 0);

    fly(source, trigger); reduced = true;
    motionListeners.get('change')(); await flush();
    assert.equal(layers.length, 0); assert.equal(opens, 2);
    animations = [];
    fly(source, trigger); assert.equal(animations.length, 0); assert.equal(opens, 3);
    reduced = false; drawer = true;
    fly(source, trigger); assert.equal(opens, 3); assert.equal(layers.length, 0);
  } finally {
    cleanup?.(); React.useRef = originalRef; React.useEffect = originalEffect;
    globalThis.setTimeout = originalTimeout; globalThis.clearTimeout = originalClearTimeout;
  }
});
