import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@renderer/store/configureStore';
import workspaceMode from '@renderer/store/reducers/workspace';
import workfileMode from '@renderer/store/reducers/workfile';

const useExplorerMenuCommand = () => {
  const workfilePath = useSelector((state: RootState) => state.workfile.path);
  const workfilePathRef = useRef(workfilePath);
  workfilePathRef.current = workfilePath;

  useEffect(() => {
    window.electron.ipcRenderer.on('explorer-menu-command', (type, path: string, isDir: boolean) => {
      switch (type) {
        case 'trash': {
          workspaceMode.trashItem({ path, isDir });

          const workfilePath = workfilePathRef.current;
          if (workfilePath && ((workfilePath === path && !isDir) || (workfilePath.includes(path) && isDir))) {
            workfileMode.resetWorkfile();
          }
          break;
        }
        case 'rename': {
          workspaceMode.renameItem({ path, isDir });
          break;
        }
        case 'create-file': {
          // TODO:
          break;
        }
        case 'create-folder': {
          // TODO:
          break;
        }
        default:
          break;
      }
    });
  }, []);
};

export default useExplorerMenuCommand;
