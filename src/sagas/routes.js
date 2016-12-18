import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';
import { ROUTE_ENTER } from 'utils/routes';
import { resolve } from 'utils/redux';


export function* onEnter(action) {
  // switch (action.location.pathname)
  yield call(resolve, action);
}

export default function* routes() {
  yield takeEvery(ROUTE_ENTER, onEnter);
}
