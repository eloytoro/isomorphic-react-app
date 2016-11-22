import { delay } from 'redux-saga';

export default function* load() {
  if (__CLIENT__ && window.__PRELOADED_STATE__) return;
  yield delay(3000);
}
