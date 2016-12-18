import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'store';
import createSagaMiddleware from 'redux-saga';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';


const globals = {};

const render = () => {
  const Root = require('pages/Root').default;
  ReactDOM.render(
    (
      <AppContainer>
        <Root store={globals.store} history={globals.history} />
      </AppContainer>
    ),
    document.getElementById('root')
  );
};

const run = () => {
  if (globals.mainTask) globals.mainTask.cancel();
  globals.mainTask = globals.sagaMiddleware.run(require('sagas').default);
  render();
};

export default () => {
  const history = useRouterHistory(createHistory)({
    basename: '/'
  });
  globals.sagaMiddleware = createSagaMiddleware();
  globals.store = createStore(
    window.__PRELOADED_STATE__,
    globals.sagaMiddleware,
    routerMiddleware(globals.history)
  );
  globals.history = syncHistoryWithStore(history, globals.store);
  run();
};

if (module.hot) {
  module.hot.accept('sagas', run);
  module.hot.accept('pages/Root', render);
}
