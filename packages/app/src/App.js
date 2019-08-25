import { css } from 'glamor';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import React from 'react';

// import AddTaskBox from './AddTaskBox';
import Tasks from './Tasks';
import WebChat from './WebChat';

const ROOT_CSS = css({
  display: 'flex',
  height: '100%',
  justifyContent: 'center',

  '&.task-list-visible': {
    backgroundColor: 'White',
    backgroundImage: 'url(/background.svg)'
  },

  '&:not(.task-list.visible)': {
    backgroundColor: '#F0F0F0'
  }
});

const TASK_LIST_CSS = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  height: '100%'
});

const TASKS_CSS = css({
  flex: 1
});

export default function App() {
  const taskListVisibility = useSelector(({ taskListVisibility }) => taskListVisibility);

  return (
    <div className={ classNames(ROOT_CSS + '', { 'task-list-visible': taskListVisibility }) }>
      {
        !!taskListVisibility &&
          <div className={ TASK_LIST_CSS }>
            <Tasks className={ TASKS_CSS + '' } />
            {/* <AddTaskBox /> */}
          </div>
      }
      <WebChat />
    </div>
  );
}
