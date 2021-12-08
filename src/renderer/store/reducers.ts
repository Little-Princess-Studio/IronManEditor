import { combineReducers } from 'redux';
import workspace from './reducers/workspace';

function createReducer(injectedReducers = {}) {
  return combineReducers({
    workspace,
    ...injectedReducers,
  });
}

const rootReducer = createReducer();

export default rootReducer;
