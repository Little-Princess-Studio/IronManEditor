import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import workspaceMode from '@renderer/store/reducers/workspace';
import workfileMode from '@renderer/store/reducers/workfile';

const useExplorerMenuCommand = () => {
  const { path } = useSelector((state: RootState) => state.workfile);
  const currentWorkfilePath = useRef(path);
  currentWorkfilePath.current = path;

  useEffect(() => {
    window.electron.ipcRenderer.on('explorer-menu-command', (type, path: string, isDir: boolean) => {
      switch (type) {
        case 'trash': {
          workspaceMode.trashItem(path, isDir);
          // TODO: update workfile
          break;
        }
        default:
          break;
      }
    });
  }, []);
};

export default useExplorerMenuCommand;
