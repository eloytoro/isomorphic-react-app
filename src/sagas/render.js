import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { call } from 'redux-saga/effects';
import load from './load';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import routes from 'routes';

export default function* render(store) {
  const history = yield call(syncHistoryWithStore, browserHistory, store);
  yield [
    call(
      ReactDOM.render,
      (
        <Provider store={store}>
          <Router history={history} routes={routes} />
        </Provider>
      ),
      document.getElementById('root')
    ),
    call(load)
  ];
}
