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

const workspaceReducer = (state: IState = INIT_STATE, action: { type: string; payload?: Partial<IState> }) => {
  switch (action.type) {
    case 'update_workspace': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

export const updateWorkSpace = (payload: Partial<IState>) => {
  return {
    type: 'update_workspace',
    payload,
  };
};

export default workspaceReducer;
