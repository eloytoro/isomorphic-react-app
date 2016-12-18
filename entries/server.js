import createStore from 'store';
import React from 'react';
import MobileDetect from 'mobile-detect';
import fs from 'fs';
import provider from 'hocs/connectScreenSize/provider';
import paths from '../config/paths';
import path from 'path';
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router';
import Root from 'pages/Root';
import createSagaMiddleware from 'redux-saga';
import load from 'sagas/load';
import { connectRoutes } from 'utils/routes';
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
  return { isMobile: md.mobile(), isTablet: md.tablet() };
};

const setupConfig = () => {
  global.APP_CONFIG = { title: 'FUCK' };
};

const sendError = (res, error) => {
  res.status(500).send(error.message);
};

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)
global.System = { import: d => Promise.resolve(require(d)) }

export const handleRender = (req, res) => {
  if (!req.accepts('text/html')) return;
  setupConfig(req);
  const { isMobile, isTablet } = detectUserAgent(req);
  provider.setup({ mobile: isMobile, tablet: isTablet });
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore({ counter: 12 }, sagaMiddleware);
  match({
    routes: connectRoutes(routes, store),
    location: req.url
  }, async (error, redirectLocation, renderProps) => {
    if (error) {
      sendError(res, error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      try {
        if (!isMobile && !isTablet) {
          await sagaMiddleware.run(load).done;
        }

        const app = renderToString(
          <Root store={store}>
            <RouterContext {...renderProps} />
          </Root>
        );

        const document = interpolate(app, store.getState());
        res.send(document);
      } catch (error) {
        sendError(res, error);
      }
    } else {
      // NOTE: this might never happen
      res.status(404).send('Not Found');
    }
  });
};
