import { createReducer } from 'utils/redux';

const initialState = {
  lang: 'en-us'
}

const reducer = createReducer(initialState, {});

export default reducer;
