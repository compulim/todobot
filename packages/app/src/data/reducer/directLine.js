import { SET_DIRECT_LINE } from '../action/setDirectLine';

export default function directLine(state = null, { payload, type }) {
  if (type === SET_DIRECT_LINE) {
    state = payload.directLine;
  }

  return state;
}
