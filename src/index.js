import createStore from 'store';
import createSagaMiddleware from 'redux-saga';
import render from 'sagas/render';
import 'styles/index.css';
import 'styles/theme.css';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(window.__PRELOADED_STATE__, sagaMiddleware);

sagaMiddleware.run(render, store);
