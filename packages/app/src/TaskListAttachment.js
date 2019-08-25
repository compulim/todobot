import { css } from 'glamor';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import markTaskAsCompleted from './data/action/markTaskAsCompleted';
import markTaskAsIncompleted from './data/action/markTaskAsIncompleted';

const ROOT_CSS = css({
  backgroundColor: '#EFE',
  fontFamily: ['Calibri', 'Helvetica Neue', 'Arial', 'sans-serif'].map(name => `'${ name }'`).join(', '),
  padding: 10,
  position: 'relative',

  '& > ul': {
    listStyleType: 'none',
    padding: 0,

    '& > li > label > input': {
      marginRight: '.7em'
    }
  },

  '& > footer': {
    color: '#999',
    fontSize: '75%',
    marginTop: '.5em'
  },

  '& > div.badge': {
    backgroundColor: '#393',
    borderRadius: '0 0 0 4px',
    color: 'White',
    fontSize: '60%',
    padding: '2px 5px',
    position: 'absolute',
    right: 0,
    top: 0
  }
});

const ITEM_CSS = css({
  '& > span.completed': {
    textDecoration: 'line-through'
  }
});

const TaskListItem = ({ taskId }) => {
  const task = useSelector(({ tasks }) => tasks.find(({ id }) => id === taskId));
  const dispatch = useDispatch();
  const handleChange = useCallback(() => {
    if (task.completed) {
      dispatch(markTaskAsIncompleted(task.id));
    } else {
      dispatch(markTaskAsCompleted(task.id));
    }
  }, [dispatch, task]);

  if (!task) { return false; }

  const { completed, text } = task;

  return (
    <label className={ ITEM_CSS }>
      <input
        checked={ completed || false }
        onChange={ handleChange }
        type="checkbox"
      />
      <span className={ classNames({ completed }) }>
        { text }
      </span>
    </label>
  );
}

const TaskListAttachment = () => {
  const tasks = useSelector(({ tasks }) => tasks);

  return (
    <div className={ ROOT_CSS }>
      <ul>
        { tasks.map(({ id }) =>
          <li key={ id }>
            <TaskListItem taskId={ id } />
          </li>
        ) }
      </ul>
      <footer>(You can tick the checkbox to complete tasks.)</footer>
      <div className="badge">LIVE</div>
    </div>
  );
};

export default TaskListAttachment
