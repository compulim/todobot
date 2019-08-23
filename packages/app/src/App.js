import { css } from 'glamor';
import { useSelector } from 'react-redux';
import React from 'react';

import AddTaskBox from './AddTaskBox';
import Tasks from './Tasks';
import WebChat from './WebChat';

const ROOT_CSS = css({
  backgroundImage: 'url(/background.svg)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const TASKS_CSS = css({
  flex: 1
});

export default function App() {
  const taskListVisibility = useSelector(({ taskListVisibility }) => taskListVisibility);

  return (
    <React.Fragment>
      {
        !!taskListVisibility &&
          <div className={ ROOT_CSS }>
            <Tasks className={ TASKS_CSS + '' } />
            <AddTaskBox />
          </div>
      }
      <WebChat />
    </React.Fragment>
  );
}
