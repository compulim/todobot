import { call, cancel, fork, select, take, takeEvery } from 'redux-saga/effects';

import { RECEIVE_ACTIVITY } from '../action/receiveActivity';
import { SET_DIRECT_LINE } from '../action/setDirectLine';
import observeOnce from '../../util/observeOnce';

export default function* sendStateAsActivity() {
  let task;

  for (;;) {
    const { payload: { directLine } } = yield take(SET_DIRECT_LINE);

    if (task) {
      yield cancel(task);
    }

    task = yield fork(function* () {
      yield takeEvery(RECEIVE_ACTIVITY, function* ({ payload: { activity: { name, type, value } } }) {
        if (name === 'redux select' && type === 'event') {
          const store = yield select(({ tasks }) => ({ tasks }));

          yield call(observeOnce, directLine.postActivity({
            name: 'redux state',
            type: 'event',
            value: {
              state: value && value.state,
              store
            }
          }));
        }
      });
    });
  }
}
