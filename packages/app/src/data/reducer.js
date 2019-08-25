import { combineReducers } from 'redux';

import directLine from './reducer/directLine';
import tasks from './reducer/tasks';

export default combineReducers({
  directLine,
  tasks
});
