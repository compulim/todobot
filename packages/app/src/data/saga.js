import { fork } from 'redux-saga/effects';

import dispatchIncomingReduxActionActivity from './saga/dispatchIncomingReduxActionActivity';
import sendStateAsActivity from './saga/sendStateAsActivity';

export default function* saga() {
  yield fork(dispatchIncomingReduxActionActivity);
  yield fork(sendStateAsActivity);
}
