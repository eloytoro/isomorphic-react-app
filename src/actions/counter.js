import { ADD, SUBTRACT } from 'constants/types';
import { createAsyncAction } from 'utils/redux';


export const add = createAsyncAction(ADD);
export const subtract = createAsyncAction(SUBTRACT);
