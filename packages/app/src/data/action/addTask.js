import random from 'math-random';

const ADD_TASK = 'ADD_TASK';

export default function addTask(text) {
  return {
    type: ADD_TASK,
    payload: {
      id: `t-${ random().toString(36).substr(2, 5) }`,
      text
    }
  };
}

export { ADD_TASK }
