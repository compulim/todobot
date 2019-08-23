const MARK_TASK_AS_INCOMPLETED = 'MARK_TASK_AS_INCOMPLETED';

export default function markTaskAsIncompleted(id) {
  return {
    type: MARK_TASK_AS_INCOMPLETED,
    payload: { id }
  };
}

export { MARK_TASK_AS_INCOMPLETED }
