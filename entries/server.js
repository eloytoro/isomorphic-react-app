import { Provider } from 'react-redux';
import createStore from 'store';
import React from 'react';
import MobileDetect from 'mobile-detect';
import App from 'components/App';
import fs from 'fs';
import provider from 'hocs/connectScreenSize/provider';
import paths from '../config/paths';
import path from 'path';
import { renderToString } from 'react-dom/server'

const index = fs.readFileSync(path.join(paths.appBuild, 'index.html'), 'utf-8');
const interpolate = (app, state) => index
  .replace(
    /<div id="root"><\/div>/,
    `<div id="root">${app}</div>`
  )
  .replace(
    /<script id="state"><\/script>/,
    `<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(state)}
    </script>`
  );

const appFactory = (store) => (
  <Provider store={store}>
    <App />
  </Provider>
);

const detectUserAgent = (req) => {
  const md = new MobileDetect(req.headers['user-agent']);
  provider.setup({ mobile: md.mobile(), tablet: md.tablet() });
};

export const handleRender = async (req, res) => {
  detectUserAgent(req);
  const store = createStore({ counter: 12 });
  const app = renderToString(appFactory(store));
  const document = interpolate(app, store.getState());
  res.send(document);
};
