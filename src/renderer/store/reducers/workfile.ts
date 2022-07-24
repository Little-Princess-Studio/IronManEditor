interface IState {
  /** file path */
  path: string;
  /** file content */
  content: string;
}

const INIT_STATE: IState = {
  path: '',
  content: '',
};

const workfileReducer = (state: IState = INIT_STATE, action: { type: string; payload?: Partial<IState> }) => {
  switch (action.type) {
    case 'update_workfile': {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
};

export const updateWorkFile = (payload: Partial<IState>) => {
  return {
    type: 'update_workfile',
    payload,
  };
};

export default workfileReducer;
