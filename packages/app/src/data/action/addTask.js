import createTaskId from '../../util/createTaskId';

const ADD_TASK = 'ADD_TASK';

export default function addTask(id = createTaskId(), text) {
  return {
    type: ADD_TASK,
    payload: { id, text }
  };
}

export { ADD_TASK }
