import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import { Provider } from 'react-redux';
import { call, fork } from 'redux-saga/effects';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { match, browserHistory } from 'react-router';
import routes from 'routes';
import load from './load';
import counter from './counter';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['BigNoodleTitling']
    }
  });
};

export const renderDOM = (store) => {
  const history = syncHistoryWithStore(browserHistory, store);
  const { pathname, search } = window.location;
  match({ routes, location: `${pathname}${search}` }, () => {
    ReactDOM.render(
      (
        <Provider store={store}>
          <Router history={history} routes={routes} />
        </Provider>
      ),
      document.getElementById('root')
    );
  });
};

export default function* render(store) {
  yield call(renderDOM, store);
  yield call(loadFonts);

  yield fork(load)
  yield fork(counter);
}
