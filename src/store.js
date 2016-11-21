import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerReducer } from 'react-router-redux';
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
  routing: routerReducer,
  ...appReducers
});


export default (initialState, sagaMiddleware) => {
  const middlewares = [sagaMiddleware];

  return createStore(
    mainReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(...middlewares)
    )
  );
};
