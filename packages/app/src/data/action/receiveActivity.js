const RECEIVE_ACTIVITY = 'RECEIVE_ACTIVITY';

export default function receiveActivity(activity) {
  return {
    type: RECEIVE_ACTIVITY,
    payload: { activity }
  };
}

export { RECEIVE_ACTIVITY }
