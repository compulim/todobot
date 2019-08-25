import { fork } from 'redux-saga/effects';

import dispatchIncomingReduxActionActivity from './saga/dispatchIncomingReduxActionActivity';

export default function* saga() {
  yield fork(dispatchIncomingReduxActionActivity);
}
