import random from 'math-random';

export default function createTaskId() {
  return `t-${ random().toString(36).substr(2, 5) }`;
}
