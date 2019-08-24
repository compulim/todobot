import { put, takeEvery } from 'redux-saga/effects';

import { RECEIVE_ACTIVITY } from '../action/receiveActivity';

export default function* dispatchIncomingReduxActionActivity() {
  yield takeEvery(RECEIVE_ACTIVITY, function* ({ payload: { activity } }) {
    if (activity.type === 'event' && activity.name === 'redux action') {
      yield put(activity.value);
    }
  });
}
