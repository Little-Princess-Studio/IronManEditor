import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateWorkSpace } from '@renderer/store/reducers/workspace';
import settings from '@renderer/helpers/settings';
import './index.less';

const StartPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const projects = settings.recentProjects.slice(0, 5);

  const handleCreate = () => {
    dispatch(updateWorkSpace({ fileName: 'New File' }));
    history.replace('/editor');
    window.electron.window.setTitle('New File');
  };

  const openProject = (filePath: string) => {
    window.electron.ipcRenderer.once('file:read:result', (resp: IpcResponse) => {
      if (resp.success) {
        console.log('file:', resp.data);
        dispatch(updateWorkSpace(resp.data));
        history.replace('/editor');
        window.electron.file.watchFile(filePath);
        window.electron.window.setTitle(resp.data.fileName);

        settings.registerProject({ name: resp.data.fileName, path: filePath });
      } else {
        console.warn(resp);
      }
    });

    window.electron.file.readFile(filePath);
  };

  const openProjectFolder = (folderPath: string) => {
    window.electron.ipcRenderer.once('folder:read:result', (resp: IpcResponse) => {
      if (resp.success) {
        console.log('folder:', resp.data);
        dispatch(updateWorkSpace(resp.data));
        history.replace('/editor');
        // TODO:
        window.electron.window.setTitle(`${resp.data.fileName} - ${folderPath}`);

        settings.registerProject({ name: resp.data.fileName, path: folderPath, isDir: true });
      } else {
        console.warn(resp);
      }
    });

    window.electron.file.readFolder(folderPath);
  };

  const handleOpen = async () => {
    const res = await window.electron.dialog.showOpenDialog({
      title: '打开文件',
      filters: [{ name: 'Files', extensions: ['json', 'json5'] }],
      properties: ['openFile'],
    });

    if (!res.canceled && res.filePaths.length > 0) {
      const filePath = res.filePaths[0];
      openProject(filePath);
    }
  };

  const handleOpenFolder = async () => {
    const res = await window.electron.dialog.showOpenDialog({
      title: '打开文件夹',
      properties: ['openFile', 'openDirectory'],
    });

    if (!res.canceled && res.filePaths.length > 0) {
      openProjectFolder(res.filePaths[0]);
    }
  };

  return (
    <div className="full-screen start-page-container flex-center">
      <div className="start-page-section-wrap">
        <div className="start-page-section">
          <h3>启动</h3>
          <div className="start-btn ellipsis" onClick={handleCreate}>
            新建文件...
          </div>
          <div className="start-btn ellipsis" onClick={handleOpen}>
            打开文件...
          </div>
          <div className="start-btn ellipsis" onClick={handleOpenFolder}>
            打开文件夹...
          </div>
        </div>
        <div className="start-page-section">
          <h3>最近</h3>
          {projects.map((it) => (
            <div className="recent-project-item ellipsis" key={it.path}>
              <button type="button" className="recent-project-name" title={it.path} onClick={() => openProject(it.path)}>
                {it.name}
              </button>
              <span className="recent-project-path" title={it.path}>
                {it.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
