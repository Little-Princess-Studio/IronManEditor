import { combineReducers } from 'redux';
import workfileMode from './reducers/workfile';
import workspaceMode from './reducers/workspace';

function createReducer(injectedReducers = {}) {
  return combineReducers({
    workfile: workfileMode.reducer,
    workspace: workspaceMode.reducer,
    ...injectedReducers,
  });
}

export const bindDispatchs = (dispatch) => {
  [workfileMode, workspaceMode].forEach((it) => {
    it.bindDispatch(dispatch);
  });
};

const rootReducer = createReducer();

export default rootReducer;
