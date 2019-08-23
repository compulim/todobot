import { combineReducers } from 'redux';

import taskListVisibility from './reducer/taskListVisibility';
import tasks from './reducer/tasks';

export default combineReducers({
  taskListVisibility,
  tasks
});
