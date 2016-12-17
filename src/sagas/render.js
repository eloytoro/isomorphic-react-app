import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import Root from 'pages/Root';
import { call, fork } from 'redux-saga/effects';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import watchers from './watchers';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['BigNoodleTitling']
    }
  });
};

export const renderDOM = (store) => {
  const history = syncHistoryWithStore(browserHistory, store);

  ReactDOM.render(
    (
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>
    ),
    document.getElementById('root')
  );
};

export default function* render(store) {
  yield call(renderDOM, store);
  yield call(loadFonts);

  yield fork(watchers);
}
