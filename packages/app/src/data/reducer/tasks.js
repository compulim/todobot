import updateIn from 'simple-update-in';
import { compareTwoStrings } from 'string-similarity';

import { ADD_TASK } from '../action/addTask';
import { DELETE_TASK } from '../action/deleteTask';
import { EDIT_TASK_TEXT } from '../action/editTaskText';
import { MARK_TASK_AS_COMPLETED } from '../action/markTaskAsCompleted';
import { MARK_TASK_AS_INCOMPLETED } from '../action/markTaskAsIncompleted';

const DEFAULT_STATE = [
  {
    completed: true,
    id: 't-builtin-1',
    text: 'Buy eggs'
  }, {
    id: 't-builtin-2',
    text: 'Buy milk'
  }
];

function taskLike({ text }, pattern) {
  return compareTwoStrings(text, pattern) > .8;
}

function selectTaskByPayload(payload) {
  return payload.id ? task => task.id === payload.id : payload.text ? task => taskLike(task, payload.text) : () => false;
}

export default function tasks(state = DEFAULT_STATE, { payload, type }) {
  if (type === ADD_TASK) {
    state = [...state, {
      done: false,
      id: payload.id,
      text: payload.text
    }];
  } else if (type === DELETE_TASK) {
    state = updateIn(state, [selectTaskByPayload(payload)]);
  } else if (type === EDIT_TASK_TEXT) {
    state = updateIn(state, [({ id }) => id === payload.id, 'text'], () => payload.text);
  } else if (type === MARK_TASK_AS_COMPLETED) {
    state = updateIn(state, [selectTaskByPayload(payload), 'completed'], () => true);
  } else if (type === MARK_TASK_AS_INCOMPLETED) {
    state = updateIn(state, [selectTaskByPayload(payload), 'completed'], () => false);
  }

  return state;
}
