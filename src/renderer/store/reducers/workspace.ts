import AbsStateMode from './AbsStateMode';

interface IState {
  workspaceName: string;
  workspaceDir: string;
  fileData: IFileData[];
  isDir: boolean;
  trashList: Pick<IFileData, 'path' | 'isDir'>[];
  renameItem: Pick<IFileData, 'path' | 'isDir'> | null;
}

const INIT_STATE: IState = {
  workspaceName: '',
  workspaceDir: '',
  fileData: [],
  isDir: false,
  trashList: [],
  renameItem: null,
};

class WorkSpaceMode extends AbsStateMode<IState> {
  reducer(state: IState = INIT_STATE, action: { type: string; payload: Partial<IState> }): IState {
    switch (action.type) {
      case 'merge_workspace_state': {
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
      type: 'merge_workspace_state',
      payload,
    });
  }

  trashItem(payload: Pick<IFileData, 'path' | 'isDir'>) {
    this.dispatch({
      type: 'append_trash_item',
      payload,
    });
  }

  renameItem(renameItem: Pick<IFileData, 'path' | 'isDir'> | null) {
    this.dispatch({
      type: 'merge_workspace_state',
      payload: { renameItem },
    });
  }
}

const workspace = new WorkSpaceMode();

export default workspace;
