/**
 * This file is highly inspired by mocha-loader. It is
 * an entry point for tests bundle used to run tests
 * in a browser.
 *
 * Main benifit of this approach – hot reloadable tests
 * and running (watching) only needed tests.
 */

// Init mocha environment in the browser
require('!style!css!mocha/mocha.css');
require('!script!mocha/mocha.js');
require('source-map-support/browser-source-map-support');

window.sourceMapSupport.install();

if (window.initMochaPhantomJS) {
  window.initMochaPhantomJS();
}

window.mocha.setup('bdd');
window.mocha.ui('bdd');

// Require all tests
require('./tests');

const onFinish = () => {};

const onReady = () => {
  if (typeof window !== "undefined" && window.mochaPhantomJS) {
    window.mochaPhantomJS.run(onFinish);
  } else {
    window.mocha.run(onFinish);
  }
};

if (document.readyState === 'complete') {
  onReady();
} else {
  window.addEventListener('load', onReady);
}

// Make tests hot-reloadable
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => {
    window.mocha.suite.suites.length = 0;
    var stats = document.getElementById('mocha-stats');
    var report = document.getElementById('mocha-report');
    stats && stats.parentNode.removeChild(stats);
    report && report.parentNode.removeChild(report);
  });
}
