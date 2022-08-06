import AbsStateMode from './AbsStateMode';

interface IState {
  workspaceName: string;
  workspaceDir: string;
  fileData: IFileData[];
  isDir: boolean;
}

const INIT_STATE: IState = {
  workspaceName: '',
  workspaceDir: '',
  fileData: [],
  isDir: false,
};

class WorkSpaceMode extends AbsStateMode<IState> {
  reducer(state: IState = INIT_STATE, action: { type: string; payload: Partial<IState> }): IState {
    switch (action.type) {
      case 'update_workspace': {
        return { ...state, ...action.payload };
      }
      default:
        return state;
    }
  }

  updateWorkSpace(payload: Partial<IState>) {
    this.dispatch({
      type: 'update_workspace',
      payload,
    });
  }
}

const workspace = new WorkSpaceMode();

export default workspace;
