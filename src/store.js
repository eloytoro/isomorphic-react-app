import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import camelize from 'camelize';


const reqReducer = require.context('./reducers/', false, /\.js$/);

const appReducers = reqReducer.keys().reduce((reducers, x) => {
  const reducerName = camelize(x.substr(x.lastIndexOf('/') + 1, x.length - 5));
  return {
    ...reducers,
    [reducerName]: reqReducer(x).default
  };
}, {});

const mainReducer = combineReducers({
  ...appReducers
});

const middlewares = [];

export default (initialState = window.__PRELOADED_STATE__) => {
  return createStore(
    mainReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(...middlewares)
    )
  );
};
