import { css } from 'glamor';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import Checkbox from './Checkbox';

import addTask from './data/action/addTask';
import deleteTask from './data/action/deleteTask';
import editTaskText from './data/action/editTaskText';
import markTaskAsCompleted from './data/action/markTaskAsCompleted';
import markTaskAsIncompleted from './data/action/markTaskAsIncompleted';

const ROOT_CSS = css({
  alignItems: 'center',
  display: 'flex',
  fontSize: 32,
  height: 60,

  '& > .text': {
    backgroundColor: 'Transparent',
    border: 0,
    flex: 1,
    fontFamily: '\'Segoe Script\', serif',
    fontSize: 32,
    outline: 0,
    overflow: 'hidden',
    margin: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    '&.completed': {
      textDecoration: 'line-through'
    },

    '&:placeholder-shown': {
      color: 'Black',
      opacity: .4
    }
  },

  '& > button.delete': {
    backgroundColor: 'transparent',
    border: 0,
    fontSize: 24,
    height: '100%',
    marginLeft: 20,
    outline: 0,
    textAlign: 'left',

    '&:disabled': {
      display: 'none',
    },

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

  const handleTextChange = useCallback(({ target: { value } }) => {
    if (!task) {
      dispatch(addTask(taskId, value));
    } else if (value) {
      dispatch(editTaskText(taskId, value));
    } else {
      dispatch(deleteTask(taskId));
    }
  }, [dispatch, task, taskId]);

  const { completed = false } = task || {};

  return (
    <div className={ROOT_CSS}>
      <Checkbox
        checked={completed}
        disabled={!task}
        onChange={handleCompletedChange}
      />
      <input
        className={classNames('text', { completed })}
        onChange={handleTextChange}
        placeholder="Type your task"
        type="text"
        value={ task ? task.text : '' }
      />
      <button
        className="delete"
        disabled={!task}
        onClick={handleDeleteClick}
        type="button"
      >
        <Icon iconName="Delete" />
      </button>
    </div>
  );
}
