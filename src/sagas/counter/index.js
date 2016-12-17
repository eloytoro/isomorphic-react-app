import { ADD, SUBTRACT } from 'constants/types';
import { takeEvery, delay } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { resolve } from 'utils/redux';


export function* restore(action) {
  yield delay(1000);
  yield call(resolve, action);
}

export default function* watch() {
  yield takeEvery(ADD, restore);
  yield takeEvery(SUBTRACT, restore);
}
