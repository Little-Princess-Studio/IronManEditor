import { combineReducers } from 'redux';
import workfile from './reducers/workfile';
import workspace from './reducers/workspace';

function createReducer(injectedReducers = {}) {
  return combineReducers({
    workfile,
    workspace,
    ...injectedReducers,
  });
}

const rootReducer = createReducer();

export default rootReducer;
