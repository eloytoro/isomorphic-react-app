/**
* This file is entry point for tests bundle that could be run
* in node environment.
* It emulates browser environment with `jsdom` and bring supoprt
* of source-map to node.js.
* It also write covergae information  to `build/coverage.json`
*/
import { jsdom } from 'jsdom';


// Emulate browser environment
global.navigator = { userAgent: 'node.js', language: 'en-US' };
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
const exposedProperties = ['window', 'navigator', 'document'];
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// Require all tests
require('./tests');
