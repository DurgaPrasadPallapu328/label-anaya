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

test('partially visible source flies before drawer; unrelated scroll cannot open it early', async () => {
  let cleanup;
  const originalRef = React.useRef, originalEffect = React.useEffect;
  React.useRef = () => ({ current: undefined });
  React.useEffect = effect => { cleanup = effect(); };
  let layers = [], animations = [], opens = 0, reduced = false, hiddenTarget = false, drawer = false;
  let mobileRevealed = false;
  let badgeReleased = false;
  const delays = new Map();
  let delayId = 0;
  globalThis.setTimeout = (callback, duration) => { assert.equal(duration, 1000); delays.set(++delayId, callback); return delayId; };
  globalThis.clearTimeout = id => delays.delete(id);
  const finishDelay = async () => { assert.equal(delays.size, 1); for (const [id, callback] of delays) { delays.delete(id); callback(); } await flush(); };
  const pendingFrames = new Map();
  let frameId = 0;
  globalThis.requestAnimationFrame = callback => { pendingFrames.set(++frameId, callback); return frameId; };
  globalThis.cancelAnimationFrame = id => pendingFrames.delete(id);
  const listeners = new Map();
  class Element {
    constructor(tag = 'div') { this.tag = tag; this.style = {}; this.children = []; this.isConnected = true; }
    setAttribute() {}
    querySelector() { return this === target ? badge : null; }
    querySelectorAll() { return this.innerHTML?.includes("dove-wing") ? [new Element("g"), new Element("g")] : []; }
    append(child) { this.children.push(child); }
    remove() { layers = layers.filter(layer => layer !== this); this.isConnected = false; }
    scrollIntoView() { hiddenTarget = false; mobileRevealed = true; }
    getBoundingClientRect() {
      if (globalThis.innerWidth < 768 && this === source && !mobileRevealed) return { left: 20, top: -900, right: 280, bottom: -1, width: 260, height: 899 };
      const left = globalThis.innerWidth < 768 ? globalThis.innerWidth - 60 : 900;
      return this === target
        ? { left, top: hiddenTarget ? -50 : 10, right: left + 44, bottom: 54, width: 44, height: 44 }
        // Tall source is clipped at both viewport edges: the original guard rejected it.
        : { left: 100, top: -80, right: 400, bottom: 1000, width: 300, height: 1080 };
    }
    animate(frames, options) {
      let finish, reject;
      const finished = new Promise((yes, no) => { finish = yes; reject = no; });
      const animation = { element: this, frames, options, finished, finish, cancel: () => reject(new Error('cancelled')) };
      animations.push(animation);
      return animation;
    }
  }
  const source = new Element('img'), target = new Element('button'), badge = new Element('span');
  Object.assign(source, { complete: true, naturalWidth: 300, naturalHeight: 450, currentSrc: '/selected-back.jpg' });
  globalThis.innerWidth = 1000;
  globalThis.innerHeight = 800;
  globalThis.window = {
    innerWidth: 1000, innerHeight: 800,
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name),
    dispatchEvent: () => { opens++; },
  };
  globalThis.document = {
    activeElement: null,
    querySelectorAll: () => [target],
    querySelector: selector => selector === '.cart-drawer-panel[open]' && drawer ? {} : null,
    createElement: tag => new Element(tag),
    body: { append: element => layers.push(element) },
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.getComputedStyle = () => ({ visibility: 'visible', display: 'block', opacity: '1' });
  globalThis.matchMedia = () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} });
  globalThis.MutationObserver = class { observe() {} disconnect() {} };
  const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
  try {
    const { useCartFlight } = loadProject('../components/cart/use-cart-flight.ts');
    const fly = useCartFlight();
    fly(source, target, true, () => { badgeReleased = true; });
    assert.equal(badgeReleased, false);
    assert.equal(opens, 0);
    assert.equal(layers.length, 1);
    const carrier = layers[0].children[0];
    const bird = carrier.children[0], parcel = carrier.children[1];
    assert.equal(parcel.children[1].src, '/selected-back.jpg');
    assert.ok(bird.innerHTML.includes('dove-wing'));
    const finishStage = async predicate => {
      const stage = animations.filter(animation => !animation.done && predicate(animation));
      assert.ok(stage.length);
      for (const animation of stage) { animation.done = true; animation.finish(); }
      await flush();
    };
    listeners.get('scroll')({ type: 'scroll' });
    assert.equal(opens, 0);
    assert.equal(layers.length, 1);
    // Entrance, parcel pickup, curved shared flight, parcel delivery, bird-only exit.
    await finishStage(animation => animation.element === bird && animation.options.duration === 200);
    assert.equal(opens, 0);
    await finishStage(animation => animation.options.duration === 300);
    const flight = animations.find(animation => animation.element === carrier && animation.options.duration === 900);
    assert.ok(flight);
    assert.equal(flight.frames.length, 31);
    assert.equal(carrier.children[0], bird);
    assert.equal(carrier.children[1], parcel);
    await finishStage(animation => animation === flight);
    assert.equal(badgeReleased, false);
    assert.equal(opens, 0);
    const drop = animations.find(animation => animation.element === parcel && animation.options.duration === 200);
    assert.ok(drop.frames.at(-1).transform.includes('translateY'));
    assert.equal(drop.frames.at(-1).opacity, 0);
    assert.ok(animations.some(animation => animation.element === target));
    await finishStage(animation => animation.options.duration === 200);
    assert.equal(opens, 0);
    assert.equal(badgeReleased, true);
    assert.equal(delays.size, 1);
    assert.ok(animations.some(animation => animation.element === badge && animation.options.duration === 225));
    const exit = animations.find(animation => !animation.done && animation.element === bird);
    assert.ok(exit.frames.at(-1).transform.includes('-100px'));
    await finishStage(animation => animation.options.duration === 200);
    await finishStage(animation => animation.element === badge);
    assert.equal(opens, 0);
    await finishDelay();
    assert.equal(opens, 1);
    assert.equal(layers.length, 0);
    reduced = true;
    fly(source, target);
    assert.equal(opens, 2);
    reduced = false; hiddenTarget = true;
    fly(source, target);
    assert.equal(opens, 3);
    hiddenTarget = false; drawer = true;
    fly(source, target);
    assert.equal(opens, 3);
    drawer = false;
    fly(source, target);
    fly(source, target);
    assert.equal(layers.length, 1);
    cleanup();
    await flush();
    assert.equal(layers.length, 0);
    assert.equal(opens, 3);
    // Mobile: a purchase tap below the gallery leaves both source and header off-screen.
    // Reveal the real target, then wait for animation promises rather than a timeout.
    for (const viewport of [320, 375, 390, 430]) {
      globalThis.innerWidth = viewport;
      window.innerWidth = viewport;
      mobileRevealed = false;
      hiddenTarget = true;
      animations = [];
      const before = opens;
      fly(source, target);
      assert.equal(opens, before);
      assert.equal(layers.length, 0);
      assert.equal(pendingFrames.size, 1);
      for (const [id, callback] of pendingFrames) { pendingFrames.delete(id); callback(0); }
      assert.ok(mobileRevealed);
      assert.equal(layers.length, 1);
      assert.equal(opens, before);
      const mobileCarrier = layers[0].children[0], mobileBird = mobileCarrier.children[0];
      assert.ok(mobileCarrier.style.cssText.includes('width:106px'));
      await finishStage(animation => animation.element === mobileBird && animation.options.duration === 200);
      await finishStage(animation => animation.options.duration === 300);
      await finishStage(animation => animation.options.duration === 900);
      assert.equal(opens, before);
      await finishStage(animation => animation.options.duration === 200);
      assert.equal(opens, before);
      await finishStage(animation => animation.options.duration === 200);
      await finishStage(animation => animation.element === badge);
      assert.equal(opens, before);
      await finishDelay();
      assert.equal(opens, before + 1);
      assert.equal(layers.length, 0);
    }
    // A manual bag opening during the post-drop wait cancels automatic reopening.
    animations = [];
    fly(source, target);
    await finishStage(animation => animation.element.className === 'cart-flight-dove' && animation.options.duration === 200);
    await finishStage(animation => animation.options.duration === 300);
    await finishStage(animation => animation.options.duration === 900);
    await finishStage(animation => animation.options.duration === 200);
    assert.equal(delays.size, 1);
    listeners.get('label-anaya:open-cart')();
    await flush();
    assert.equal(delays.size, 0);
    assert.equal(layers.length, 0);
    assert.equal(opens, 7);
    // Reduced motion must bypass viewport preparation as well as bird motion.
    reduced = true;
    hiddenTarget = true;
    mobileRevealed = false;
    fly(source, target);
    assert.equal(pendingFrames.size, 0);
    assert.equal(opens, 8);
  } finally {
    cleanup?.();
    React.useRef = originalRef;
    React.useEffect = originalEffect;
  }
});
