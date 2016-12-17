import { fork } from 'redux-saga/effects';
import load from './load';
import counter from './counter';


export default function* watchers() {
  yield fork(load)
  yield fork(counter);
}
