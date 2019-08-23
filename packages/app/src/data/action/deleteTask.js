const DELETE_TASK = 'DELETE_TASK';

export default function deleteTask(id) {
  return {
    type: DELETE_TASK,
    payload: { id }
  };
}

export { DELETE_TASK }
