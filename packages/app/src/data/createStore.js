import { createStore } from 'redux';

import reducer from './reducer';

export default () => {
  return createStore(
    reducer
  );
}
