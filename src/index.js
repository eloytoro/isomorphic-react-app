import createStore from 'store';
import createSagaMiddleware from 'redux-saga';
import 'styles/index.css';
import 'styles/theme.css';


const sagaMiddleware = createSagaMiddleware();
let mainTask;
const store = createStore(window.__PRELOADED_STATE__, sagaMiddleware);

const renderApp = window.RENDER_APP = () => {
  if (mainTask) mainTask.cancel();
  const render = require('sagas/render').default;
  mainTask = sagaMiddleware.run(render, store);
};

if (module.hot) {
  module.hot.accept('sagas/render', renderApp);
}

renderApp();
