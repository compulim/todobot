import React from 'react';

import TaskListAttachment from './TaskListAttachment';

export default () => next => card => {
  const { attachment: { contentType } } = card;

  if (contentType === 'x-todobot-tasks') {
    return (
      <TaskListAttachment />
    )
  } else {
    return next(card);
  }
}
