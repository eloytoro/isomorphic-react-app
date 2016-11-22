import _ from 'lodash';
import { defer } from 'utils';


export const createReducer = (initialState, actionHandlers, strict = false) => {
  return (state = initialState, action) => {
    if (action.type in actionHandlers) {
      const newState = actionHandlers[action.type](state, action.payload);
      if (strict) return newState;
      return Object.assign({}, state, newState);
    }

    return state;
  }
}

export const createAction = (actionType, payloadCreator = _.identity) => (...args) => ({
  type: actionType,
  payload: payloadCreator(...args)
});

export const createAsyncAction = (actionType, payloadCreator = _.identity) => (...args) => ({
  type: actionType,
  payload: payloadCreator(...args),
  meta: defer()
});

export const resolve = (action) => _.get(action, 'meta.resolve', _.noop)();
export const reject = (action) => _.get(action, 'meta.reject', _.noop)();
export const asyncMiddleware = () => (next) => (action) => {
  const promise = _.get(action, 'meta.promise');
  const digested = next(action);
  if (!promise) return digested;
  return promise;
};
