import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import { call, fork } from 'redux-saga/effects';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
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

  const doRender = () => {
    const Root = require('pages/Root').default;
    ReactDOM.render(
      (
        <AppContainer>
          <Root store={store} history={history} />
        </AppContainer>
      ),
      document.getElementById('root')
    );
  };

  doRender();

  if (module.hot) {
    module.hot.accept('pages/Root', doRender);
  }
};

export default function* render(store) {
  yield call(renderDOM, store);
  yield call(loadFonts);

  yield fork(load)
  yield fork(counter);
}
