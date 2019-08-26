import { css } from 'glamor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';

import createTaskId from './util/createTaskId';
import Task from './Task';

const ROOT_CSS = css({
  listStyleType: 'none',
  margin: 0,
  padding: 0
});

export default function Tasks({
  className
}) {
  const [newTaskId, setNewTaskId] = useState(createTaskId());
  const tasks = useSelector(({ tasks }) => tasks);

  useEffect(() => {
    tasks.find(({ id }) => id === newTaskId) && setNewTaskId(createTaskId());

    return () => {};
  }, [newTaskId, tasks]);

  const tasksWithNewTask = useMemo(() => [
    ...tasks.filter(({ id }) => id !== newTaskId),
    { id: newTaskId }
  ], [newTaskId, tasks]);

  return (
    <ul className={ classNames(ROOT_CSS + '', className) }>
      { tasksWithNewTask.map(({ id }) =>
        <li key={id}>
          <Task taskId={ id } />
        </li>)
      }
    </ul>
  );
}
