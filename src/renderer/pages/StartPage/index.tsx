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

  const handleOpen = async () => {
    const res = await window.electron.dialog.showOpenDialog({
      filters: [{ name: 'Files', extensions: ['json', 'json5'] }],
      properties: ['openFile'],
    });

    if (!res.canceled && res.filePaths.length > 0) {
      const filePath = res.filePaths[0];
      openProject(filePath);
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
