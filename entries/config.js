/**
 * Dynamic app config, this file isnt part of the bundle, its included in the HTML before
 * the app so it can be used to change app settings, if a proxy serves a different file with
 * a different config it should alter the way the app behaves. Here's a few caveats
 * - If this file changes the app wont hot-reload
 * - Doesnt go through babel
 */
window.APP_CONFIG = {
  title: 'ISOMORPHIC REACT APP'
};
