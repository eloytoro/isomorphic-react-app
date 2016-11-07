import { ADD, SUBTRACT } from 'constants/types';
import { createAction } from 'utils/redux';


export const add = createAction(ADD);
export const subtract = createAction(SUBTRACT);
