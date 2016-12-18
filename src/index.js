import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'store';
import createSagaMiddleware from 'redux-saga';
import { AppContainer } from 'react-hot-loader';
import Root from 'pages/Root';
import { syncHistoryWithStore } from 'react-router-redux';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import WebFont from 'webfontloader';
import 'styles/index.css';
import 'styles/theme.css';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(window.__PRELOADED_STATE__, sagaMiddleware);

const render = window.RENDER_APP = () => {
  if (mainTask) mainTask.cancel();

  const history = useRouterHistory(createHistory)({
    basename: '/'
  });

  const reduxHistory = syncHistoryWithStore(history, store);

  ReactDOM.render(
    (
      <AppContainer>
        <Root store={store} history={reduxHistory} />
      </AppContainer>
    ),
    document.getElementById('root')
  );
};

let mainTask;

const bootstrap = window.BOOTSTRAP = () => {
  render();
  mainTask = sagaMiddleware.run(require('sagas').default);
}

WebFont.load({
  custom: {
    families: ['BigNoodleTitling']
  }
});

bootstrap();

if (module.hot) {
  module.hot.accept('sagas', bootstrap);
  module.hot.accept('routes', render);
}
