import { css } from 'glamor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import React from 'react';

import './index.css';
import Task from './Task';

const ROOT_CSS = css({
  listStyleType: 'none',
  margin: 0,
  padding: 0
});

export default function Tasks({
  className
}) {
  const tasks = useSelector(({ tasks }) => tasks);

  return (
    <ul className={ classNames(ROOT_CSS + '', className) }>
      { tasks.map(({ id }) =>
        <li key={id}>
          <Task taskId={ id } />
        </li>)
      }
    </ul>
  );
}
