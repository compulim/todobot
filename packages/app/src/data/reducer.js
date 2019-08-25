import { combineReducers } from 'redux';

import directLine from './reducer/directLine';
import taskListVisibility from './reducer/taskListVisibility';
import tasks from './reducer/tasks';

export default combineReducers({
  directLine,
  taskListVisibility,
  tasks
});
