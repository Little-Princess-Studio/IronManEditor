import { combineReducers } from 'redux';
import workfile from './reducers/workfile';
import workspaceMode from './reducers/workspace';

function createReducer(injectedReducers = {}) {
  return combineReducers({
    workfile,
    workspace: workspaceMode.reducer,
    ...injectedReducers,
  });
}

export const bindDispatchs = (dispatch) => {
  [workspaceMode].forEach((it) => {
    it.bindDispatch(dispatch);
  });
};

const rootReducer = createReducer();

export default rootReducer;
