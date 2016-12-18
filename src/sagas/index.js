import { fork } from 'redux-saga/effects';
import load from './load';
import counter from './counter';
import routes from './routes';

export default function* render() {
  yield fork(load);
  yield fork(counter);
  yield fork(routes);
}
