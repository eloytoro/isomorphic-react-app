import _ from 'lodash';


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
