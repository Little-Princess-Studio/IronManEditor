import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateWorkSpace } from '../../store/reducers/workspace';
import './index.less';

const StartPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleCreate = () => {
    dispatch(updateWorkSpace({ fileName: 'New File' }));
    history.replace('/editor');
    window.electron.window.setTitle('New File');
  };

  const handleOpen = async () => {
    const res = await window.electron.dialog.showOpenDialog({
      filters: [{ name: 'Files', extensions: ['json', 'json5'] }],
      properties: ['openFile'],
    });

    if (!res.canceled && res.filePaths.length > 0) {
      const filePath = res.filePaths[0];

      window.electron.ipcRenderer.once('file:read:result', (resp: IpcResponse) => {
        if (resp.success) {
          console.log('file:', resp.data);
          dispatch(updateWorkSpace(resp.data));
          history.replace('/editor');
          window.electron.window.setTitle(resp.data.fileName);
        } else {
          console.warn(resp);
        }
      });

      window.electron.file.readFile(filePath);
    }
  };

  return (
    <div className="full-screen start-page-container flex-center">
      <div className="start-page-section-wrap">
        <div className="start-page-section">
          <h3>启动</h3>
          <div className="start-btn" onClick={handleCreate}>
            新建文件...
          </div>
          <div className="start-btn" onClick={handleOpen}>
            打开文件...
          </div>
        </div>
        <div className="start-page-section">
          <h3>最近</h3>
          {/* TODO: */}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
