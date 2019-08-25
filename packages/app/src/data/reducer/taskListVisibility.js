import { SHOW_TASK_LIST } from '../action/showTaskList';

const DEFAULT_STATE = false;

export default function (state = DEFAULT_STATE, { type }) {
  if (type === SHOW_TASK_LIST) {
    state = true;
  }

  return state;
}
