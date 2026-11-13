import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
const loadProject = createRequire(import.meta.url);
loadProject.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, file);
const { holdCartBadge, useCartBadge } = loadProject('../lib/cart/badge.ts');
test('badge holds presentation only and releases to the latest actual quantity', () => {
  const original = React.useSyncExternalStore;
  React.useSyncExternalStore = (_subscribe, snapshot) => snapshot();
  try {
    const release = holdCartBadge(0);
    assert.equal(useCartBadge(3), 0);
    assert.equal(useCartBadge(7), 0);
    release();
    assert.equal(useCartBadge(7), 7);
    release();
    assert.equal(useCartBadge(8), 8);
    const oldFlight = holdCartBadge(8);
    const newFlight = holdCartBadge(10);
    oldFlight();
    assert.equal(useCartBadge(12), 8);
    newFlight();
    assert.equal(useCartBadge(12), 12);
  } finally { React.useSyncExternalStore = original; }
});
