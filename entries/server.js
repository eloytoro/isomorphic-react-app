import createStore from 'store';
import React from 'react';
import MobileDetect from 'mobile-detect';
import fs from 'fs';
import provider from 'hocs/connectScreenSize/provider';
import paths from '../config/paths';
import path from 'path';
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import load from 'sagas/load';
import routes from 'routes';

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

const detectUserAgent = (req) => {
  const md = new MobileDetect(req.headers['user-agent']);
  provider.setup({ mobile: md.mobile(), tablet: md.tablet() });
};

const sendError = (res, error) => {
  console.error(error);
  res.status(500).send(error.message);
};

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

export const handleRender = (req, res) => {
  if (!req.accepts('text/html')) return;
  detectUserAgent(req);
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore({ counter: 12 }, sagaMiddleware);
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      sendError(res, error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      sagaMiddleware.run(load).done
        .then(() => {
          const app = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );
          const document = interpolate(app, store.getState());
          res.send(document);
        })
        .catch((error) => sendError(res, error));
    } else {
      // NOTE: this might never happen
      res.status(404).send('Not Found');
    }
  });
};

process.on('unhandledRejection', (reason, promise) => {
  console.log(promise);
  console.log('Reason', reason);
});
