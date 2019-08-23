import { css } from 'glamor';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import addTask from './data/action/addTask';

const ROOT_CSS = css({
  backgroundColor: 'White',
  borderTop: 'solid 1px #CCC',
  display: 'flex',

  '> button': {
    backgroundColor: 'transparent',
    border: 0,
    fontSize: 32,
    padding: '20px 0 20px 20px',

    '&:not(:hover)': {
      opacity: .2
    }
  },

  '> input': {
    border: 0,
    color: 'Navy',
    flex: 1,
    fontFamily: '\'Segoe Script\', serif',
    fontSize: 32,
    outline: 0,
    padding: 20
  }
});

export default function AddTaskBox() {
  const dispatch = useDispatch();
  const [nextTaskText, setNextTaskText] = useState('');
  const handleNextTaskTextChange = useCallback(({ target: { value } }) => setNextTaskText(value), [setNextTaskText]);
  const handleSubmit = useCallback(event => {
    event.preventDefault();

    dispatch(addTask(nextTaskText));
    setNextTaskText('');
  }, [dispatch, nextTaskText, setNextTaskText]);

  return (
    <form
      className={ROOT_CSS}
      onSubmit={handleSubmit}
    >
      <button>
        <Icon iconName="Add" />
      </button>
      <input
        autoFocus={true}
        onChange={handleNextTaskTextChange}
        type="text"
        value={nextTaskText}
      />
    </form>
  );
}
