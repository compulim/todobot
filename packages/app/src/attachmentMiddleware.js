import React from 'react';

import TaskListAttachment from './TaskListAttachment';

export default () => next => card => {
  const { attachment: { contentType } } = card;

  switch (contentType) {
    case 'x-todobot-tasks':
      return <TaskListAttachment />;

    default:
      return next(card);
  }
}
