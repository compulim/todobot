const MARK_TASK_AS_COMPLETED = 'MARK_TASK_AS_COMPLETED';

export default function markTaskAsCompleted(id) {
  return {
    type: MARK_TASK_AS_COMPLETED,
    payload: { id }
  };
}

export { MARK_TASK_AS_COMPLETED }
