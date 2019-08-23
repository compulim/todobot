import { css } from 'glamor';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import Checkbox from './Checkbox';

import deleteTask from './data/action/deleteTask';
import markTaskAsCompleted from './data/action/markTaskAsCompleted';
import markTaskAsIncompleted from './data/action/markTaskAsIncompleted';

const ROOT_CSS = css({
  alignItems: 'center',
  display: 'flex',
  fontSize: 32,
  height: 60,

  '& > .text': {
    flex: 1,
    fontFamily: '\'Segoe Script\', serif',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    '&.completed': {
      textDecoration: 'line-through'
    }
  },

  '& > button.delete': {
    backgroundColor: 'transparent',
    border: 0,
    fontSize: 24,
    height: '100%',
    outline: 0,
    textAlign: 'left',
    width: 380,

    '&:hover': {
      color: 'Red'
    },

    '&:not(:hover)': {
      opacity: .1
    }
  }
});

export default function Task({
  taskId
}) {
  const task = useSelector(({ tasks }) => tasks.find(({ id }) => id === taskId));
  const dispatch = useDispatch();

  const handleCompletedChange = useCallback(checked => {
    dispatch(checked ? markTaskAsCompleted(taskId) : markTaskAsIncompleted(taskId));
  }, [dispatch, taskId]);

  const handleDeleteClick = useCallback(() => {
    dispatch(deleteTask(taskId));
  }, [dispatch, taskId]);

  const { completed } = task;

  return !!task && (
    <div className={ROOT_CSS}>
      <Checkbox
        checked={task.completed}
        onChange={handleCompletedChange}
      />
      {/* <code>{ task.id }</code>: { task.text } */}
      <span className={classNames('text', { completed })}>{ task.text }</span>
      <button
        className="delete"
        onClick={handleDeleteClick}
        type="button"
      >
        <Icon iconName="Delete" />
      </button>
    </div>
  );
}
