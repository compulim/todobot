const EDIT_TASK_TEXT = 'EDIT_TASK_TEXT';

export default function editTaskText(id, text) {
  return {
    type: EDIT_TASK_TEXT,
    payload: { id, text }
  };
}

export { EDIT_TASK_TEXT }
