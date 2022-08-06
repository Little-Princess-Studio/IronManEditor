import AbsStateMode from './AbsStateMode';

interface IState {
  workspaceName: string;
  workspaceDir: string;
  fileData: IFileData[];
  isDir: boolean;
  trashList: { path: string; isDir: boolean }[];
}

const INIT_STATE: IState = {
  workspaceName: '',
  workspaceDir: '',
  fileData: [],
  isDir: false,
  trashList: [],
};

class WorkSpaceMode extends AbsStateMode<IState> {
  reducer(state: IState = INIT_STATE, action: { type: string; payload: Partial<IState> }): IState {
    switch (action.type) {
      case 'update_workspace': {
        return { ...state, ...action.payload };
      }
      case 'append_trash_item': {
        return { ...state, trashList: [...state.trashList, action.payload as any] };
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

  trashItem(path: string, isDir: boolean) {
    this.dispatch({
      type: 'append_trash_item',
      payload: {
        path,
        isDir,
      },
    });
  }
}

const workspace = new WorkSpaceMode();

export default workspace;
