import chai from 'chai';
import sinon from 'sinon';
import { sessionStorage, localStorage } from 'utils/storage';


// Chai setup
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.should();
sinon.useFakeXMLHttpRequest();

// Globals
global.enzyme = require('enzyme');
global.XHROrig = global.XMLHttpRequest;
global.window.XMLHttpRequest = global.XMLHttpRequest;
global.expect = chai.expect;
global.sinon = sinon;


/**
 * Run all tests with wrapping by `describe` for supporting
 * directory tree structure of tests.
 * @param  {Context} req
 */
const loadTests = () => {
  const trie = {};
  const req = require.context('../tests', true, /\.test.js$/);

  const insertToTrie = (val, node) => {
    if (val.length > 0) {
      if (!node[val[0]]) {
        node[val[0]] = {};
      }
      insertToTrie(val.slice(1), node[val[0]]);
    }
  };

  const traversalTrie = (node, path = '') => {
    const keys = Object.keys(node);
    if (keys.length > 0) {
      keys.forEach(k => {
        const nextPath = `${path}/${k}`;
        if (!Object.keys(node[k]).length) {
          req(`.${nextPath}`);
        } else {
          describe(`/${k}`, () => {
            traversalTrie(node[k], nextPath);
          });
        }
      });
    }
  };

  req.keys().forEach(x => insertToTrie(x.split('/'), trie));
  traversalTrie(trie['.'] || {});
}

// Moved to affect unit tests only, since in test-node.entry
// this afterEach call causes e2e to timeout.
afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

/**
 * Format css-modules class names for Enzyme
 * @param  {string} style Styles to format
 * @return {string}       Formatted styles
 */
global.formatStyles = (...styles) => styles
  .map(style => `.${style.replace(/[ ,]+/g, '.')}`)
  .join('');

loadTests();
