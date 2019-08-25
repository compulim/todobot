import { css } from 'glamor';
import React from 'react';

// import AddTaskBox from './AddTaskBox';
import Tasks from './Tasks';
import WebChat from './WebChat';

const ROOT_CSS = css({
  backgroundColor: 'White',
  backgroundImage: 'url(/background.svg)',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',

  '> .task-list': {
    flex: 1,
    height: '100%',
    overflow: 'hidden'
  },

  '@media (max-width: 480px)': {
    backgroundColor: '#F0F0F0',
    backgroundImage: 'none',

    '& > .task-list': {
      display: 'none'
    }
  }
});

const TASKS_CSS = css({
  flex: 1
});

export default function App() {
  return (
    <div className={ROOT_CSS}>
      <div className="task-list">
        <Tasks className={ TASKS_CSS + '' } />
        {/* <AddTaskBox /> */}
      </div>
      <WebChat />
    </div>
  );
}
