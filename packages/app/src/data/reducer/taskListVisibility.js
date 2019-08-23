import { SHOW_TASK_LIST } from '../action/showTaskList';

export default function (state = false, { type }) {
  if (type === SHOW_TASK_LIST) {
    state = true;
  }

  return state;
}
