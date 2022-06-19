import { createSlice } from '@reduxjs/toolkit';

interface IState {
  fileName: string;
  filePath: string;
  fileData: IFileData[];
  isDir: boolean;
}

const INIT_STATE: IState = {
  fileName: '',
  filePath: '',
  fileData: [],
  isDir: false,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: INIT_STATE,
  reducers: {
    updateWorkSpace: (state: IState, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateWorkSpace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
