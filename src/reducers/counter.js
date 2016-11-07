import { ADD, SUBTRACT } from 'constants/types';
import { createReducer } from 'utils/redux';


const initialState = 0;

const reducer = createReducer(initialState, {
  [ADD]: state => state + 1,
  [SUBTRACT]: state => state - 1
}, true);

export default reducer;
